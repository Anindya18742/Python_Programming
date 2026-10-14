export interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  outputPreview?: string;
  explanation: string;
  keyPoints?: string[];
}

export interface LessonSection {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  concepts: {
    title: string;
    description: string;
    syntaxBox?: string;
    examples: CodeExample[];
    commonGotchas?: string[];
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: 'lists' | 'tuples' | 'comparison' | 'slicing';
}

export interface VariableState {
  name: string;
  type: 'list' | 'tuple' | 'int' | 'str' | 'float' | 'bool' | 'dict' | 'unknown';
  value: string;
  length?: number;
  memoryId?: string;
  isMutable: boolean;
}
