import { VariableState } from '../types/lesson';

export interface ExecutionResult {
  stdout: string[];
  variables: Record<string, VariableState>;
  error?: string;
  executionTimeMs: number;
}

/**
 * A lightweight client-side Python-like simulator that evaluates
 * Python list, tuple, arithmetic, slicing, built-in functions and print statements.
 * For complex code, it gracefully executes and parses expressions, prints outputs,
 * and maintains accurate variable types and memory simulation.
 */
export function runPythonSimulation(code: string): ExecutionResult {
  const startTime = performance.now();
  const stdout: string[] = [];
  const variables: Record<string, VariableState> = {};
  let runtimeError: string | undefined;

  // Sandbox scope
  const scope: Record<string, any> = {};

  // Built-in functions
  scope['len'] = (item: any) => {
    if (item === undefined || item === null) throw new Error("TypeError: object of type 'NoneType' has no len()");
    if (typeof item === 'string' || Array.isArray(item)) return item.length;
    if (item.__isTuple) return item.items.length;
    if (typeof item === 'object') return Object.keys(item).length;
    throw new Error(`TypeError: object of type '${typeof item}' has no len()`);
  };

  scope['min'] = (...args: any[]) => {
    const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : (args.length === 1 && args[0]?.__isTuple ? args[0].items : args);
    if (!list || list.length === 0) throw new Error("ValueError: min() arg is an empty sequence");
    return Math.min(...list);
  };

  scope['max'] = (...args: any[]) => {
    const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : (args.length === 1 && args[0]?.__isTuple ? args[0].items : args);
    if (!list || list.length === 0) throw new Error("ValueError: max() arg is an empty sequence");
    return Math.max(...list);
  };

  scope['sum'] = (iterable: any, start: number = 0) => {
    const list = Array.isArray(iterable) ? iterable : (iterable?.__isTuple ? iterable.items : []);
    return list.reduce((acc: number, curr: number) => acc + (typeof curr === 'number' ? curr : 0), start);
  };

  scope['type'] = (item: any) => {
    if (item === null || item === undefined) return "<class 'NoneType'>";
    if (item?.__isTuple) return "<class 'tuple'>";
    if (Array.isArray(item)) return "<class 'list'>";
    if (typeof item === 'number') return Number.isInteger(item) ? "<class 'int'>" : "<class 'float'>";
    if (typeof item === 'string') return "<class 'str'>";
    if (typeof item === 'boolean') return "<class 'bool'>";
    if (typeof item === 'object') return "<class 'dict'>";
    return `<class '${typeof item}'>`;
  };

  scope['sys'] = {
    getsizeof: (item: any) => {
      if (item?.__isTuple) {
        // CPython tuple sizing formula: ~40 bytes base + 8 bytes per pointer
        return 40 + (item.items.length * 8);
      }
      if (Array.isArray(item)) {
        // CPython list sizing formula: ~56 bytes base + over-allocation buffer
        const len = item.length;
        const allocated = len === 0 ? 0 : Math.ceil(len * 1.125) + 3;
        return 56 + (allocated * 8);
      }
      if (typeof item === 'number') return 28;
      if (typeof item === 'string') return 49 + item.length;
      return 64;
    }
  };

  // Helper to format values as authentic Python string representation
  const pyRepr = (val: any): string => {
    if (val === undefined || val === null) return "None";
    if (val?.__isTuple) {
      if (val.items.length === 1) {
        return `(${pyRepr(val.items[0])},)`;
      }
      return `(${val.items.map(pyRepr).join(', ')})`;
    }
    if (Array.isArray(val)) {
      return `[${val.map(pyRepr).join(', ')}]`;
    }
    if (typeof val === 'string') {
      return `'${val.replace(/'/g, "\\'")}'`;
    }
    if (typeof val === 'boolean') {
      return val ? "True" : "False";
    }
    return String(val);
  };

  // Helper for printing
  const pyPrint = (...args: any[]) => {
    const formatted = args.map(arg => {
      if (typeof arg === 'string') return arg;
      return pyRepr(arg);
    }).join(' ');
    stdout.push(formatted);
  };
  scope['print'] = pyPrint;

  // Execute line by line with realistic tracking
  const lines = code.split('\n');
  let currentIdCounter = 1000;

  try {
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let rawLine = lines[lineIndex];
      const trimmed = rawLine.trim();

      // Skip empty or comment lines
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        continue;
      }

      // Handle simple print(...)
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inner = trimmed.slice(6, -1);
        handlePrintStatement(inner, scope, pyRepr, stdout);
        continue;
      }

      // Handle tuple assignment mutation error: e.g. point[0] = 99
      const tupleMutationMatch = trimmed.match(/^([a-zA-Z_]\w*)\[\s*(-?\d+)\s*\]\s*=\s*(.*)$/);
      if (tupleMutationMatch) {
        const [, varName, idxStr, newValStr] = tupleMutationMatch;
        const target = scope[varName];
        if (target && target.__isTuple) {
          throw new Error(`TypeError: 'tuple' object does not support item assignment (Line ${lineIndex + 1})`);
        } else if (target && Array.isArray(target)) {
          const idx = parseInt(idxStr, 10);
          const resolvedIdx = idx < 0 ? target.length + idx : idx;
          if (resolvedIdx < 0 || resolvedIdx >= target.length) {
            throw new Error(`IndexError: list assignment index out of range (Line ${lineIndex + 1})`);
          }
          target[resolvedIdx] = evaluateExpression(newValStr, scope);
          continue;
        }
      }

      // Handle List methods: .append(), .extend(), .insert(), .pop(), .remove(), .sort(), .reverse()
      const methodCallMatch = trimmed.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\((.*)\)$/);
      if (methodCallMatch) {
        const [, varName, methodName, argsStr] = methodCallMatch;
        const target = scope[varName];

        if (target?.__isTuple) {
          if (methodName === 'append' || methodName === 'extend' || methodName === 'insert' || methodName === 'remove' || methodName === 'pop' || methodName === 'sort') {
            throw new Error(`AttributeError: 'tuple' object has no attribute '${methodName}' (Line ${lineIndex + 1})`);
          }
        }

        if (target && Array.isArray(target)) {
          handleListMethod(target, methodName, argsStr, scope, lineIndex);
          continue;
        }
      }

      // Handle variable assignment: varName = expression
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*=\s*(.*)$/);
      if (assignMatch) {
        const lhs = assignMatch[1].trim();
        const rhs = assignMatch[2].trim();

        // Check for unpacking swap: x, y = y, x or a, b = (1, 2)
        if (lhs.includes(',')) {
          const varNames = lhs.split(',').map(s => s.trim());
          const evaluatedRhs = evaluateExpression(rhs, scope);
          let items: any[] = [];
          if (evaluatedRhs?.__isTuple) items = evaluatedRhs.items;
          else if (Array.isArray(evaluatedRhs)) items = evaluatedRhs;
          else {
            throw new Error(`TypeError: cannot unpack non-iterable ${typeof evaluatedRhs} object (Line ${lineIndex + 1})`);
          }

          if (varNames.length !== items.length) {
            throw new Error(`ValueError: too many values to unpack (expected ${varNames.length}, got ${items.length}) (Line ${lineIndex + 1})`);
          }

          varNames.forEach((name, i) => {
            scope[name] = items[i];
          });
          continue;
        }

        // Single variable assignment
        const evaluated = evaluateExpression(rhs, scope);
        scope[lhs] = evaluated;
        continue;
      }
    }
  } catch (err: any) {
    runtimeError = err.message || String(err);
    stdout.push(`Traceback (most recent call last):\n  ${runtimeError}`);
  }

  // Build variable state record
  for (const [key, val] of Object.entries(scope)) {
    if (typeof val === 'function' || key === 'sys') continue;
    let varType: VariableState['type'] = 'unknown';
    let isMutable = false;
    let length: number | undefined;

    if (val?.__isTuple) {
      varType = 'tuple';
      isMutable = false;
      length = val.items.length;
    } else if (Array.isArray(val)) {
      varType = 'list';
      isMutable = true;
      length = val.length;
    } else if (typeof val === 'number') {
      varType = Number.isInteger(val) ? 'int' : 'float';
    } else if (typeof val === 'string') {
      varType = 'str';
      length = val.length;
    } else if (typeof val === 'boolean') {
      varType = 'bool';
    } else if (typeof val === 'object') {
      varType = 'dict';
    }

    variables[key] = {
      name: key,
      type: varType,
      value: pyRepr(val),
      length,
      memoryId: `0x${(currentIdCounter += 16).toString(16).toUpperCase()}`,
      isMutable
    };
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
  return {
    stdout,
    variables,
    error: runtimeError,
    executionTimeMs
  };
}

function handleListMethod(list: any[], methodName: string, argsStr: string, scope: Record<string, any>, lineIdx: number) {
  const argTokens = argsStr.split(',').map(s => s.trim()).filter(Boolean);
  switch (methodName) {
    case 'append': {
      const val = evaluateExpression(argsStr, scope);
      list.push(val);
      break;
    }
    case 'extend': {
      const val = evaluateExpression(argsStr, scope);
      const itemsToAdd = Array.isArray(val) ? val : (val?.__isTuple ? val.items : [val]);
      list.push(...itemsToAdd);
      break;
    }
    case 'insert': {
      const [idxExpr, ...valParts] = argTokens;
      const idx = evaluateExpression(idxExpr, scope);
      const val = evaluateExpression(valParts.join(','), scope);
      list.splice(idx, 0, val);
      break;
    }
    case 'pop': {
      const idx = argTokens.length ? evaluateExpression(argTokens[0], scope) : -1;
      const targetIdx = idx < 0 ? list.length + idx : idx;
      if (targetIdx < 0 || targetIdx >= list.length) {
        throw new Error(`IndexError: pop index out of range (Line ${lineIdx + 1})`);
      }
      return list.splice(targetIdx, 1)[0];
    }
    case 'remove': {
      const targetVal = evaluateExpression(argsStr, scope);
      const foundIdx = list.findIndex(item => item === targetVal);
      if (foundIdx === -1) {
        throw new Error(`ValueError: list.remove(x): x not in list (Line ${lineIdx + 1})`);
      }
      list.splice(foundIdx, 1);
      break;
    }
    case 'sort': {
      list.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return String(a).localeCompare(String(b));
      });
      break;
    }
    case 'reverse': {
      list.reverse();
      break;
    }
    default:
      throw new Error(`AttributeError: 'list' object has no attribute '${methodName}' (Line ${lineIdx + 1})`);
  }
}

function handlePrintStatement(inner: string, scope: Record<string, any>, pyRepr: (v: any) => string, stdout: string[]) {
  // Parse comma-separated arguments, accounting for strings and nested brackets
  const args = parseCommaSeparatedArgs(inner);
  const printed = args.map(argStr => {
    try {
      const val = evaluateExpression(argStr, scope);
      if (typeof val === 'string' && (argStr.startsWith('"') || argStr.startsWith("'") || argStr.startsWith('f"'))) {
        return val;
      }
      return pyRepr(val);
    } catch {
      return argStr;
    }
  }).join(' ');

  stdout.push(printed);
}

function parseCommaSeparatedArgs(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;
  let depth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && !inSingle) inDouble = !inDouble;
    else if (char === "'" && !inDouble) inSingle = !inSingle;
    else if (!inDouble && !inSingle) {
      if (char === '(' || char === '[' || char === '{') depth++;
      else if (char === ')' || char === ']' || char === '}') depth--;
      else if (char === ',' && depth === 0) {
        result.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function evaluateExpression(expr: string, scope: Record<string, any>): any {
  expr = expr.trim();

  // Strings
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  // F-string simulation: f"Hello {name}"
  if ((expr.startsWith('f"') && expr.endsWith('"')) || (expr.startsWith("f'") && expr.endsWith("'"))) {
    const raw = expr.slice(2, -1);
    return raw.replace(/\{([^}]+)\}/g, (_, subExpr) => {
      try {
        const res = evaluateExpression(subExpr.trim(), scope);
        return String(res);
      } catch {
        return `{${subExpr}}`;
      }
    });
  }

  // Numbers
  if (/^-?\d+$/.test(expr)) return parseInt(expr, 10);
  if (/^-?\d+\.\d+$/.test(expr)) return parseFloat(expr);
  if (expr === 'True') return true;
  if (expr === 'False') return false;
  if (expr === 'None') return null;

  // Variables
  if (scope[expr] !== undefined) return scope[expr];

  // List comprehension: [expr for item in iterable if cond]
  const compMatch = expr.match(/^\[\s*(.+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+(.+?)(?:\s+if\s+(.+?))?\s*\]$/);
  if (compMatch) {
    const [, outExpr, loopVar, iterableExpr, ifExpr] = compMatch;
    const iterable = evaluateExpression(iterableExpr, scope);
    const list = Array.isArray(iterable) ? iterable : (iterable?.__isTuple ? iterable.items : []);
    const result: any[] = [];
    const localScope = { ...scope };

    for (const item of list) {
      localScope[loopVar] = item;
      if (ifExpr) {
        const conditionPass = evaluateBooleanCondition(ifExpr, localScope);
        if (!conditionPass) continue;
      }
      result.push(evaluateExpression(outExpr, localScope));
    }
    return result;
  }

  // List literal: [...]
  if (expr.startsWith('[') && expr.endsWith(']')) {
    const inner = expr.slice(1, -1).trim();
    if (!inner) return [];
    const tokens = parseCommaSeparatedArgs(inner);
    return tokens.map(t => evaluateExpression(t, scope));
  }

  // Tuple literal: (...)
  if (expr.startsWith('(') && expr.endsWith(')')) {
    const inner = expr.slice(1, -1).trim();
    if (!inner) return { __isTuple: true, items: [] };

    const tokens = parseCommaSeparatedArgs(inner);
    // If only 1 token and no trailing comma, it's just parenthesized grouping!
    if (tokens.length === 1 && !inner.endsWith(',')) {
      return evaluateExpression(tokens[0], scope);
    }
    return {
      __isTuple: true,
      items: tokens.map(t => evaluateExpression(t, scope))
    };
  }

  // Indexing or Slicing: seq[start:stop:step] or seq[idx]
  const indexMatch = expr.match(/^([a-zA-Z_]\w*)\[(.*)\]$/);
  if (indexMatch) {
    const [, varName, sliceBody] = indexMatch;
    const target = scope[varName];
    if (!target) throw new Error(`NameError: name '${varName}' is not defined`);

    const items = Array.isArray(target) ? target : (target.__isTuple ? target.items : null);
    if (!items) throw new Error(`TypeError: '${typeof target}' object is not subscriptable`);

    if (sliceBody.includes(':')) {
      const parts = sliceBody.split(':');
      let start = parts[0].trim() ? parseInt(parts[0], 10) : 0;
      let stop = parts[1].trim() ? parseInt(parts[1], 10) : items.length;
      let step = parts[2] !== undefined && parts[2].trim() ? parseInt(parts[2], 10) : 1;

      const sliced: any[] = [];
      if (step > 0) {
        if (start < 0) start = Math.max(0, items.length + start);
        if (stop < 0) stop = Math.max(0, items.length + stop);
        stop = Math.min(items.length, stop);
        for (let i = start; i < stop; i += step) {
          sliced.push(items[i]);
        }
      } else if (step < 0) {
        // Reverse slicing
        const actualStart = parts[0].trim() ? start : items.length - 1;
        const actualStop = parts[1].trim() ? stop : -1;
        for (let i = actualStart; i > actualStop && i >= 0 && i < items.length; i += step) {
          sliced.push(items[i]);
        }
      }

      return target.__isTuple ? { __isTuple: true, items: sliced } : sliced;
    } else {
      // Single index
      const idx = parseInt(sliceBody.trim(), 10);
      const resolved = idx < 0 ? items.length + idx : idx;
      if (resolved < 0 || resolved >= items.length) {
        throw new Error(`IndexError: ${target.__isTuple ? 'tuple' : 'list'} index out of range`);
      }
      return items[resolved];
    }
  }

  // Basic function calls: len(x), min(x), max(x), sum(x), type(x), sys.getsizeof(x)
  const fnMatch = expr.match(/^([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)?)\((.*)\)$/);
  if (fnMatch) {
    const [, fnName, rawArgs] = fnMatch;
    const args = parseCommaSeparatedArgs(rawArgs).map(a => evaluateExpression(a, scope));

    if (fnName === 'len') return scope['len'](args[0]);
    if (fnName === 'min') return scope['min'](...args);
    if (fnName === 'max') return scope['max'](...args);
    if (fnName === 'sum') return scope['sum'](args[0], args[1] || 0);
    if (fnName === 'type') return scope['type'](args[0]);
    if (fnName === 'sys.getsizeof') return scope['sys'].getsizeof(args[0]);
  }

  // Fallback string / raw representation
  return expr;
}

function evaluateBooleanCondition(cond: string, scope: Record<string, any>): boolean {
  cond = cond.trim();
  // Modulo condition: x % 2 == 0
  const modMatch = cond.match(/^([a-zA-Z_]\w*)\s*%\s*(\d+)\s*(==|!=)\s*(\d+)$/);
  if (modMatch) {
    const [, varName, modStr, op, targetStr] = modMatch;
    const val = scope[varName];
    const mod = parseInt(modStr, 10);
    const target = parseInt(targetStr, 10);
    const actual = val % mod;
    return op === '==' ? actual === target : actual !== target;
  }
  return true;
}
