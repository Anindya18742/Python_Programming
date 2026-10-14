import { LessonSection, QuizQuestion } from '../types/lesson';

export const LESSON_META = {
  courseTitle: "Python Mastery Series: Lists & Tuples",
  courseCode: "PY-102",
  totalDurationMinutes: 90,
  level: "Beginner to Intermediate",
  pythonVersion: "Python 3.10+",
  prerequisites: [
    "Basic Python syntax",
    "Variables and primitive data types (int, float, str, bool)",
    "Basic print() statements"
  ],
  targetAudience: "Students, software engineers, and data analysts mastering fundamental Python data structures",
  summary: "A comprehensive pedagogical lesson plan exploring Python sequences, contrasting mutable Lists with immutable Tuples through foundational syntax, memory models, and production real-world case studies (Shopping Carts, Student Gradebooks, GPS Coordinates, and RGB Color Palettes)."
};

export interface RealWorldExample {
  id: string;
  category: 'list' | 'tuple';
  title: string;
  subtitle: string;
  domain: string;
  whyChosen: string;
  whyAlternativeFails: string;
  pythonCode: string;
  expectedOutput: string;
  interactiveActions: {
    label: string;
    description: string;
    codeSnippet: string;
  }[];
}

export const REAL_WORLD_EXAMPLES: RealWorldExample[] = [
  {
    id: "case-shopping-cart",
    category: "list",
    title: "E-Commerce Shopping Cart",
    subtitle: "Dynamic customer basket requiring real-time item addition, removal, and quantity adjustments",
    domain: "E-Commerce & Retail Systems",
    whyChosen: "Shopping carts are inherently dynamic and mutable. Throughout a shopping session, a user continuously adds items, adjusts quantities, removes items, or empties the cart. A list allows in-place modifications using .append(), .remove(), and .pop() in O(1) amortized time without re-allocating the entire container.",
    whyAlternativeFails: "If a tuple were used, every single user action (adding a pair of socks, deleting a coffee mug) would require constructing a brand-new tuple in memory and copying over every existing pointer. This introduces massive memory churn, slows down request lifecycles, and makes concurrent cart mutations clunky.",
    pythonCode: `# ==========================================
# REAL-WORLD CASE 1: E-COMMERCE SHOPPING CART
# Data Structure: LIST (Mutable, Dynamic)
# ==========================================

cart = ["Mechanical Keyboard", "USB-C Cable", "Ergonomic Mousepad"]
print("Initial Cart:", cart)

# 1. Customer adds a new item: O(1) amortized
cart.append("Noise Cancelling Headphones")
print("After adding headphones:", cart)

# 2. Customer removes an item: in-place removal
cart.remove("USB-C Cable")
print("After removing USB-C cable:", cart)

# 3. Customer removes the most recently added item (undo/checkout buffer)
last_added = cart.pop()
print(f"Customer saved '{last_added}' for later.")
print("Active checkout items:", cart)

# 4. Sorting items alphabetically for receipt generation
cart.sort()
print("Receipt sorted order:", cart)`,
    expectedOutput: `Initial Cart: ['Mechanical Keyboard', 'USB-C Cable', 'Ergonomic Mousepad']
After adding headphones: ['Mechanical Keyboard', 'USB-C Cable', 'Ergonomic Mousepad', 'Noise Cancelling Headphones']
After removing USB-C cable: ['Mechanical Keyboard', 'Ergonomic Mousepad', 'Noise Cancelling Headphones']
Customer saved 'Noise Cancelling Headphones' for later.
Active checkout items: ['Mechanical Keyboard', 'Ergonomic Mousepad']
Receipt sorted order: ['Ergonomic Mousepad', 'Mechanical Keyboard']`,
    interactiveActions: [
      {
        label: "Add Item (.append)",
        description: "Simulate user clicking 'Add to Cart'",
        codeSnippet: `cart.append("4K Monitor")\nprint("Updated cart:", cart)`
      },
      {
        label: "Drop Last (.pop)",
        description: "Simulate 1-click cart item undo",
        codeSnippet: `removed = cart.pop()\nprint(f"Removed '{removed}', Remaining: {cart}")`
      },
      {
        label: "Sort Receipt (.sort)",
        description: "Alphabetize items in-place for printable invoice",
        codeSnippet: `cart.sort()\nprint("Sorted cart:", cart)`
      }
    ]
  },
  {
    id: "case-student-grades",
    category: "list",
    title: "Student Gradebook & Analytics",
    subtitle: "Semester-long academic evaluation tracker supporting additions, drops, and statistical aggregations",
    domain: "Academic & EdTech Information Systems",
    whyChosen: "A student's grades accumulate progressively over weeks as homework, midterms, and lab assignments are completed. Lists provide native support for numerical methods: sum(grades), min(grades), max(grades), len(grades), as well as in-place operations like dropping the lowest test score (grades.remove(min(grades))).",
    whyAlternativeFails: "An academic semester is an ongoing, sequential workflow. A tuple cannot append new exam scores as they are graded. Moreover, dropping the lowest quiz score would require awkward slicing and tuple concatenation, losing the simplicity and expressiveness of grades.remove(min(grades)).",
    pythonCode: `# ==============================================
# REAL-WORLD CASE 2: STUDENT GRADEBOOK ANALYTICS
# Data Structure: LIST (Mutable, Homogeneous)
# ==============================================

# Scores from Quiz 1, Quiz 2, Midterm, and Assignment 1
grades = [88.5, 92.0, 74.5, 96.0, 85.0]
print("Semester grades to date:", grades)

# 1. New Final Exam score is graded and appended
grades.append(94.0)
print("After Final Exam entered:", grades)

# 2. Academic Policy: Drop the lowest score before computing GPA
lowest_score = min(grades)
grades.remove(lowest_score)
print(f"Dropped lowest grade ({lowest_score}):", grades)

# 3. Calculate final average & status
semester_average = sum(grades) / len(grades)
print(f"Final Adjusted Average: {semester_average:.2f}%")

# 4. List comprehension to identify honors-level scores (>= 90%)
honors_scores = [score for score in grades if score >= 90.0]
print("Honors-level submissions (>= 90%):", honors_scores)`,
    expectedOutput: `Semester grades to date: [88.5, 92.0, 74.5, 96.0, 85.0]
After Final Exam entered: [88.5, 92.0, 74.5, 96.0, 85.0, 94.0]
Dropped lowest grade (74.5): [88.5, 92.0, 96.0, 85.0, 94.0]
Final Adjusted Average: 91.50%
Honors-level submissions (>= 90%): [92.0, 96.0, 94.0]`,
    interactiveActions: [
      {
        label: "Curve Grades (+5 pts)",
        description: "Apply a 5-point curve to every grade via list comprehension",
        codeSnippet: `curved = [min(100.0, g + 5.0) for g in grades]\nprint("Curved grades:", curved)`
      },
      {
        label: "Drop Lowest Grade",
        description: "Drop minimum score using grades.remove(min(grades))",
        codeSnippet: `grades.remove(min(grades))\nprint("After dropping lowest:", grades)`
      },
      {
        label: "Compute Median",
        description: "Sort grades and find center score",
        codeSnippet: `grades.sort()\nmid = len(grades) // 2\nmedian = grades[mid]\nprint(f"Sorted: {grades}, Median: {median}")`
      }
    ]
  },
  {
    id: "case-geo-coordinates",
    category: "tuple",
    title: "Geographical Coordinates & Waypoints",
    subtitle: "Invariant geospatial reference points (latitude, longitude, elevation) requiring strict data integrity",
    domain: "GIS, GPS Navigation & Spatial Mapping",
    whyChosen: "A geographical point on Earth (e.g. Mount Everest summit, an airport runway threshold) has fixed, invariant spatial coordinates. Mutating latitude or longitude in place would silently corrupt physical reality. Tuples guarantee immutability: accidental modifications like coord[0] = 0 immediately raise a TypeError. Furthermore, because tuples are hashable, they can serve as dictionary keys for geospatial lookup tables and geofencing caches.",
    whyAlternativeFails: "Using a list for GPS coordinates invites catastrophic data corruption. A rogue function could reassign a latitude, shifting a flight path by hundreds of miles without raising an error. Additionally, lists cannot be dictionary keys (unhashable type: 'list'), making it impossible to index spatial databases by coordinate tuples: spatial_cache[(lat, lon)].",
    pythonCode: `# ========================================================
# REAL-WORLD CASE 3: GEOGRAPHICAL COORDINATES & WAYPOINTS
# Data Structure: TUPLE (Immutable, Hashable Record)
# ========================================================

# Landmark: Golden Gate Bridge (Latitude, Longitude, Altitude in meters)
golden_gate = (37.8199, -122.4783, 67.1)
tokyo_tower = (35.6586, 139.7454, 332.9)
mount_everest = (27.9881, 86.9250, 8848.86)

# 1. Unpacking spatial components cleanly into variables
lat, lon, alt = golden_gate
print(f"Golden Gate -> Lat: {lat}° N, Lon: {lon}° W, Elevation: {alt}m")

# 2. Immutability guarantee: coordinates cannot be tampered with!
try:
    golden_gate[0] = 0.0  # Attempting to alter latitude
except TypeError as error:
    print("Security Invariant Preserved:", error)

# 3. Hashability: Using coordinate tuples as Dictionary Keys
landmarks_by_coord = {
    (37.8199, -122.4783): "Golden Gate Bridge, SF",
    (35.6586, 139.7454): "Tokyo Tower, Japan",
    (27.9881, 86.9250): "Mount Everest Summit, Nepal"
}

query_point = (35.6586, 139.7454)
print(f"Spatial lookup at {query_point}:", landmarks_by_coord[query_point])`,
    expectedOutput: `Golden Gate -> Lat: 37.8199° N, Lon: -122.4783° W, Elevation: 67.1m
Security Invariant Preserved: 'tuple' object does not support item assignment
Spatial lookup at (35.6586, 139.7454): Tokyo Tower, Japan`,
    interactiveActions: [
      {
        label: "Attempt Mutation",
        description: "Trigger Python's TypeError guard on invariant GPS tuples",
        codeSnippet: `try:\n    mount_everest[0] = 0.0\nexcept TypeError as e:\n    print("Caught invariant error:", e)`
      },
      {
        label: "Spatial Hash Lookup",
        description: "Lookup landmark from dictionary using tuple key",
        codeSnippet: `target = (27.9881, 86.9250)\nprint("Located landmark:", landmarks_by_coord.get(target, "Unknown"))`
      },
      {
        label: "Calculate Euclidean Distance",
        description: "Extract coordinate components and compute distance",
        codeSnippet: `p1, p2 = golden_gate[:2], tokyo_tower[:2]\nd_lat = p2[0] - p1[0]\nd_lon = p2[1] - p1[1]\nprint(f"Approx delta -> dLat: {d_lat:.2f}, dLon: {d_lon:.2f}")`
      }
    ]
  },
  {
    id: "case-rgb-colors",
    category: "tuple",
    title: "RGB & RGBA Color Values",
    subtitle: "Deterministic color channel definitions (Red, Green, Blue, Alpha) in UI systems and computer graphics",
    domain: "Computer Graphics, UI Themes & Image Processing",
    whyChosen: "In digital imaging and CSS rendering, a color specification like CRIMSON (220, 20, 60) is an exact, atomic, immutable definition. If an element changes color, the system should assign a DIFFERENT color object, rather than mutating the red channel of CRIMSON globally. Tuples provide lightweight 3-element / 4-element containers that consume minimal memory and can be safely referenced across thousands of UI components without risk of side-effects.",
    whyAlternativeFails: "If colors were represented as lists, modifying RED[0] = 50 in one component would mutate that shared color everywhere it is referenced throughout the application! Furthermore, colors could not be used as keys in color frequency histograms or palette dictionaries (e.g. color_histogram[(255, 255, 255)]).",
    pythonCode: `# ===============================================
# REAL-WORLD CASE 4: RGB / RGBA COLOR SYSTEM
# Data Structure: TUPLE (Immutable, Atomic Value)
# ===============================================

# Standard Design System Color Palette (R, G, B)
COLOR_WHITE   = (255, 255, 255)
COLOR_NAVY    = (15, 23, 42)
COLOR_CRIMSON = (220, 20, 60)
COLOR_EMERALD = (16, 185, 129)
COLOR_SKY     = (14, 165, 233)

# 1. Unpacking channels for luminance calculation
r, g, b = COLOR_EMERALD
# Standard relative luminance formula (ITU-R BT.709)
luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
print(f"Emerald RGB: ({r}, {g}, {b}) | Perceived Luminance: {luminance:.1f}")

# 2. Color Frequency Histogram (Tuples as Dictionary Keys)
palette_counts = {
    COLOR_NAVY: 1420,
    COLOR_WHITE: 980,
    COLOR_SKY: 450,
    COLOR_EMERALD: 120
}

# Finding the most frequent theme color:
dominant_color = max(palette_counts, key=palette_counts.get)
print("Dominant theme color RGB:", dominant_color)
print("Occurrences in UI layout:", palette_counts[dominant_color])

# 3. Converting RGB Tuple to CSS Hex String
hex_code = f"#{r:02X}{g:02X}{b:02X}"
print(f"Emerald in CSS Hex format: {hex_code}")`,
    expectedOutput: `Emerald RGB: (16, 185, 129) | Perceived Luminance: 144.9
Dominant theme color RGB: (15, 23, 42)
Occurrences in UI layout: 1420
Emerald in CSS Hex format: #10B981`,
    interactiveActions: [
      {
        label: "Compute Invert Color",
        description: "Generate negative/complement color tuple",
        codeSnippet: `inverted = tuple(255 - c for c in COLOR_CRIMSON)\nprint("Inverted Crimson:", inverted)`
      },
      {
        label: "Add Alpha Channel",
        description: "Create RGBA 4-element tuple from RGB",
        codeSnippet: `rgba = COLOR_SKY + (0.85,)\nprint("RGBA Tuple (Sky with 85% opacity):", rgba)`
      },
      {
        label: "Brightness Test",
        description: "Determine if text should be light or dark",
        codeSnippet: `is_dark = (0.299*r + 0.587*g + 0.114*b) < 128\nprint("Should use white text?", is_dark)`
      }
    ]
  }
];

export const LESSON_SECTIONS: LessonSection[] = [
  {
    id: "module-1",
    title: "01. Foundations of Python Sequences",
    subtitle: "Understanding ordered collections, zero-based indexing, and the mutability divide",
    estimatedMinutes: 15,
    learningObjectives: [
      "Define sequence types in Python and identify ordered data structures",
      "Explain the fundamental difference between mutable and immutable types",
      "Master positive (0-indexed) and negative (-1 indexed) subscript access",
      "Measure sequence length using the built-in len() function"
    ],
    concepts: [
      {
        title: "Sequence Characteristics & Indexing",
        description: "In Python, both lists and tuples are ordered collections of arbitrary objects. Each element occupies a deterministic position called an index. Python supports both forward indexing starting at 0 and reverse indexing starting at -1.",
        syntaxBox: `# Forward indexing: 0 to len-1\n# Reverse indexing: -1 (last element) to -len`,
        examples: [
          {
            id: "seq-intro-1",
            title: "Accessing Elements via Positive and Negative Indices",
            description: "Demonstrating zero-based indexing and negative index wrapping on lists and tuples.",
            code: `# Define a list of dynamic items and a tuple of fixed coordinates
temperatures = [21.5, 22.0, 19.8, 24.3, 23.1]
coordinates = (37.7749, -122.4194)

print("First temperature:", temperatures[0])     # 21.5
print("Last temperature:", temperatures[-1])     # 23.1
print("Latitude:", coordinates[0])               # 37.7749
print("Longitude:", coordinates[-1])             # -122.4194
print("List length:", len(temperatures))         # 5
print("Tuple length:", len(coordinates))         # 2`,
            outputPreview: `First temperature: 21.5
Last temperature: 23.1
Latitude: 37.7749
Longitude: -122.4194
List length: 5
Tuple length: 2`,
            explanation: "Indexing a sequence with an index >= len(seq) or < -len(seq) raises an IndexError: list index out of range.",
            keyPoints: [
              "Python sequences are 0-indexed: index 0 is the first element.",
              "Negative index -1 always targets the final item in the collection.",
              "len(sequence) returns the total number of items in O(1) time."
            ]
          }
        ],
        commonGotchas: [
          "Off-by-one errors: an array of 5 elements has valid indices 0 through 4.",
          "Using parentheses instead of square brackets for item lookup (e.g. seq(0) throws a TypeError: 'list' object is not callable)."
        ]
      },
      {
        title: "The Mutability Divide: Lists vs Tuples",
        description: "The single most important architectural difference between lists and tuples is MUTABILITY. Lists are mutable: elements can be modified, added, replaced, or removed in-place. Tuples are immutable: once created, their structure and references cannot be altered.",
        syntaxBox: `items_list = [1, 2, 3]    # Mutable (square brackets)\nitems_tuple = (1, 2, 3)   # Immutable (parentheses or commas)`,
        examples: [
          {
            id: "mutability-demo",
            title: "In-Place Modification vs TypeError",
            description: "Observe what happens when trying to mutate a list versus a tuple.",
            code: `# 1. Lists can be mutated in-place (e.g. modifying an item in a shopping cart)
fruits = ["apple", "banana", "cherry"]
fruits[1] = "blueberry"
print("Mutated list:", fruits)

# 2. Tuples cannot be modified (e.g. an RGB color or GPS coordinate)
point = (10, 20)
try:
    point[0] = 99
except TypeError as error:
    print("Caught expected exception:", error)`,
            outputPreview: `Mutated list: ['apple', 'blueberry', 'cherry']
Caught expected exception: 'tuple' object does not support item assignment`,
            explanation: "Because tuples are immutable, Python guarantees their contents remain invariant, allowing them to be safely hashed and shared across functions without side-effects.",
            keyPoints: [
              "Lists use square brackets []; tuples typically use parentheses ().",
              "Mutating a list updates its internal pointer array in-place without altering the list's memory address id().",
              "Tuples reject item assignment: 'tuple' object does not support item assignment."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "module-2",
    title: "02. Python Lists in Depth & Dynamic Operations",
    subtitle: "Dynamic arrays, mutation methods, slicing syntax, and list comprehensions",
    estimatedMinutes: 25,
    learningObjectives: [
      "Construct lists using literals and the list() constructor",
      "Differentiate between append(), extend(), insert(), pop(), and remove()",
      "Apply the slice syntax [start:stop:step] for extraction and reversal",
      "Write idiomatic list comprehensions with conditional filtering"
    ],
    concepts: [
      {
        title: "List Mutation Methods in Practice",
        description: "Python lists provide a comprehensive set of in-place mutation methods. Understanding whether a method mutates in-place (returning None) or returns a new list is critical.",
        syntaxBox: `list.append(x)      # O(1) amortized: adds x to end\nlist.extend(iter)   # O(k): concatenates iterable\nlist.insert(i, x)   # O(n): inserts x at index i\nlist.pop(i=-1)      # O(1) for end, O(n) for arbitrary index\nlist.remove(x)      # O(n): removes first occurrence of x\nlist.sort()         # O(n log n): in-place Timsort`,
        examples: [
          {
            id: "list-methods-demo",
            title: "Managing a Student's Gradebook",
            description: "Adding exam scores, dropping lowest grades, and computing averages.",
            code: `# Real-World Gradebook: Dynamic list of academic scores
grades = [88.5, 92.0, 74.5, 96.0, 85.0]
print("Initial scores:", grades)

# Append new test score
grades.append(94.0)

# Drop lowest score
lowest = min(grades)
grades.remove(lowest)
print(f"Dropped lowest ({lowest}), Remaining:", grades)

# Sort from highest to lowest
grades.sort(reverse=True)
print("Sorted descending:", grades)

# Compute average
average = sum(grades) / len(grades)
print(f"Class average: {average:.1f}%")`,
            outputPreview: `Initial scores: [88.5, 92.0, 74.5, 96.0, 85.0]
Dropped lowest (74.5), Remaining: [88.5, 92.0, 96.0, 85.0, 94.0]
Sorted descending: [96.0, 94.0, 92.0, 88.5, 85.0]
Class average: 91.1%`,
            explanation: "grades.sort() sorts the list in-place and returns None. If you need a sorted copy without changing the original order, use sorted(grades).",
            keyPoints: [
              "append() appends its argument as a single object.",
              "extend() iterates through the argument and appends each element.",
              "remove(val) removes only the first matching occurrence; raises ValueError if not found.",
              "pop() removes and returns the item at index (defaulting to the end)."
            ]
          }
        ],
        commonGotchas: [
          "Assigning the result of an in-place method: e.g. x = my_list.sort() sets x to None!",
          "Using append() when you meant extend(): e.g. [1, 2].append([3, 4]) results in [1, 2, [3, 4]]."
        ]
      },
      {
        title: "The Power of List Slicing: [start:stop:step]",
        description: "Slicing extracts a new sublist without modifying the original. Slices follow the half-open interval [start, stop), meaning 'start' is included, but 'stop' is excluded.",
        syntaxBox: `sequence[start:stop:step]\n# start: defaults to 0\n# stop: defaults to len(sequence)\n# step: defaults to 1 (negative step traverses backwards)`,
        examples: [
          {
            id: "list-slicing-demo",
            title: "Slicing Mechanics and Reverse Traversal",
            description: "Extracting subsets, stepping through elements, and reversing sequences.",
            code: `nums = [10, 20, 30, 40, 50, 60, 70, 80]

print("First 3 elements ([:3]):", nums[:3])        # [10, 20, 30]
print("From index 3 to end ([3:]):", nums[3:])      # [40, 50, 60, 70, 80]
print("Slice index 2 to 6 ([2:6]):", nums[2:6])     # [30, 40, 50, 60]
print("Every second item ([::2]):", nums[::2])      # [10, 30, 50, 70]
print("Reversed sequence ([::-1]):", nums[::-1])    # [80, 70, 60, 50, 40, 30, 20, 10]
print("Shallow copy of list ([:]):", nums[:])       # New list with identical elements`,
            outputPreview: `First 3 elements ([:3]): [10, 20, 30]
From index 3 to end ([3:]): [40, 50, 60, 70, 80]
Slice index 2 to 6 ([2:6]): [30, 40, 50, 60]
Every second item ([::2]): [10, 30, 50, 70]
Reversed sequence ([::-1]): [80, 70, 60, 50, 40, 30, 20, 10]
Shallow copy of list ([:]): [10, 20, 30, 40, 50, 60, 70, 80]`,
            explanation: "Slicing never raises an IndexError even if indices are out of bounds; Python clamps them to the valid range gracefully.",
            keyPoints: [
              "The stop index is exclusive (half-open range [start, stop)).",
              "A step of -1 reverses the sequence cleanly: sequence[::-1].",
              "Slice assignments can replace chunks of a list: nums[1:3] = [99, 100]."
            ]
          }
        ]
      },
      {
        title: "Idiomatic List Comprehensions",
        description: "List comprehensions provide a concise, readable, and computationally efficient way to construct lists from existing iterables, replacing repetitive for-loops with map/filter pipelines.",
        syntaxBox: `[expression for item in iterable if condition]`,
        examples: [
          {
            id: "comprehension-demo",
            title: "Transforming and Filtering with Comprehensions",
            description: "Calculating squares of even numbers and filtering grade data.",
            code: `raw_scores = [78, 92, 65, 88, 95, 72, 84, 91]

# 1. Filter honors scores (>= 90)
honors = [score for score in raw_scores if score >= 90]
print("Honors scores:", honors)

# 2. Apply a 5% curve to passing grades (>= 70)
curved = [round(score * 1.05, 1) for score in raw_scores if score >= 70]
print("Curved passing scores:", curved)

# 3. String normalization pipeline for shopping items
raw_cart = ["  Apples ", "BANANAS", "  Milk  ", "BREAD "]
clean_cart = [item.strip().title() for item in raw_cart]
print("Formatted cart items:", clean_cart)`,
            outputPreview: `Honors scores: [92, 95, 91]
Curved passing scores: [81.9, 96.6, 92.4, 99.8, 75.6, 88.2, 95.5]
Formatted cart items: ['Apples', 'Bananas', 'Milk', 'Bread']`,
            explanation: "List comprehensions run in optimized C bytecode inside the CPython runtime, often 20-30% faster than manual for-loop .append() calls.",
            keyPoints: [
              "Syntax: [output_expression for item in iterable if predicate]",
              "Avoid nesting more than two loops inside a single comprehension for readability.",
              "Nested comprehensions can construct matrices: [[0 for _ in range(cols)] for _ in range(rows)]."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "module-3",
    title: "03. Python Tuples in Depth & Immutability",
    subtitle: "Immutability guarantees, singleton syntax, unpacking, and data integrity",
    estimatedMinutes: 20,
    learningObjectives: [
      "Construct tuples accurately, including the single-element tuple comma rule",
      "Leverage tuple packing and sequence unpacking (including star expressions)",
      "Utilize tuple methods count() and index()",
      "Explain why immutability makes tuples hashable and valid dictionary keys"
    ],
    concepts: [
      {
        title: "Tuple Creation & The Singleton Comma Rule",
        description: "Tuples are immutable sequence objects. While parentheses () are customary, it is actually the COMMA that defines a tuple in Python syntax. A single element in parentheses without a trailing comma is just a parenthesized expression, not a tuple!",
        syntaxBox: `empty_tuple = ()           # Empty tuple\nsingle_item = (42,)        # Trailing COMMA is required!\nnot_a_tuple = (42)         # WARNING: This evaluates to the integer 42!\nmultiple_items = 1, 2, 3   # Parentheses are optional for packing`,
        examples: [
          {
            id: "tuple-creation-singleton",
            title: "The Comma Rule & Type Verification",
            description: "Inspect the types of parenthesized expressions with and without commas.",
            code: `# The classic Python beginner trap:
item_a = ("apple")      # String in parentheses
item_b = ("apple",)     # 1-element tuple with trailing comma
item_c = "apple",       # Also a tuple (parentheses omitted)

print("Type of ('apple'):", type(item_a))       # <class 'str'>
print("Type of ('apple',):", type(item_b))      # <class 'tuple'>
print("Type of 'apple',:", type(item_c))        # <class 'tuple'>

# Verifying tuple length
print("Length of item_b:", len(item_b))         # 1`,
            outputPreview: `Type of ('apple'): <class 'str'>
Type of ('apple',): <class 'tuple'>
Type of 'apple',: <class 'tuple'>
Length of item_b: 1`,
            explanation: "Always remember: a single-element tuple MUST include a trailing comma: (value,). Without it, Python treats the parentheses as mathematical grouping.",
            keyPoints: [
              "A trailing comma is mandatory for 1-element tuples: (x,).",
              "Empty tuple is created with ().",
              "Tuple packing allows comma-separated literals without parentheses: t = 1, 2, 3."
            ]
          }
        ],
        commonGotchas: [
          "Writing (42) thinking it is a tuple, only to encounter TypeError: 'int' object is not subscriptable.",
          "Accidentally leaving a trailing comma in a variable assignment (e.g. x = 10, creates a tuple (10,))."
        ]
      },
      {
        title: "Tuple Unpacking & Real-World Coordinates",
        description: "Python supports elegant sequence unpacking. You can extract individual values from a tuple directly into separate variables. Python 3 also offers extended unpacking using the * (star) operator.",
        syntaxBox: `a, b = (10, 20)                 # Standard unpacking\nx, y = y, x                     # In-place variable swap!\nhead, *tail = (1, 2, 3, 4, 5)   # Extended star unpacking`,
        examples: [
          {
            id: "unpacking-demo",
            title: "Unpacking GPS Coordinates & RGB Color Tuples",
            description: "Practical idioms for unpacking coordinates, swapping variables, and capturing remainders.",
            code: `# 1. Coordinate unpacking (Fixed GPS Landmark)
golden_gate = (37.8199, -122.4783, 67.1)
lat, lon, alt = golden_gate
print(f"Latitude: {lat}° N, Longitude: {lon}° W, Elevation: {alt}m")

# 2. RGB Color Unpacking
crimson = (220, 20, 60)
r, g, b = crimson
print(f"Red: {r}, Green: {g}, Blue: {b}")

# 3. Pythonic variable swap without temporary variable
x = 100
y = 200
x, y = y, x
print(f"Swapped: x={x}, y={y}")

# 4. Extended unpacking with star operator
scores = (98, 92, 88, 85, 79, 72)
highest, second, *remaining, lowest = scores
print("Highest score:", highest)
print("Second score:", second)
print("Remaining scores:", remaining)
print("Lowest score:", lowest)`,
            outputPreview: `Latitude: 37.8199° N, Longitude: -122.4783° W, Elevation: 67.1m
Red: 220, Green: 20, Blue: 60
Swapped: x=200, y=100
Highest score: 98
Second score: 92
Remaining scores: [88, 85, 79]
Lowest score: 72`,
            explanation: "The *remaining variable absorbs any intermediate elements into a list, regardless of the tuple length.",
            keyPoints: [
              "Unpacking requires the number of variables on the left to match the sequence length, unless * is used.",
              "If variable count does not match: ValueError: too many values to unpack (expected 2, got 3).",
              "x, y = y, x works because the right side first evaluates as a packed tuple before binding."
            ]
          }
        ]
      },
      {
        title: "Tuple Methods & Hashability as Dictionary Keys",
        description: "Because tuples are immutable, they expose only two search methods: .count(x) and .index(x). Importantly, immutable tuples containing only hashable items are themselves hashable and can serve as dictionary keys or set elements.",
        syntaxBox: `tuple.count(value)   # Returns occurrences of value\ntuple.index(value)   # Returns index of first occurrence\nhash((1, 2, 3))      # Valid hash integer (usable in dict/set)`,
        examples: [
          {
            id: "tuple-hash-methods",
            title: "Spatial Map Lookup & Color Histogram Keys",
            description: "Using tuples to represent composite keys in dictionaries.",
            code: `# 1. Using coordinate tuples as Spatial Cache keys (Impossible with lists!)
city_coordinates = {
    (37.7749, -122.4194): "San Francisco, CA",
    (40.7128, -74.0060): "New York City, NY",
    (51.5074, -0.1278): "London, UK"
}

my_location = (37.7749, -122.4194)
print("Resolved City:", city_coordinates[my_location])

# 2. RGB Palette Lookup
color_palette = {
    (255, 255, 255): "Pure White",
    (0, 0, 0): "Pitch Black",
    (220, 20, 60): "Crimson Red"
}
target_rgb = (220, 20, 60)
print(f"Color {target_rgb} name:", color_palette[target_rgb])

# Note: Trying to use a list as a dict key fails:
try:
    bad_dict = {[37.7749, -122.4194]: "San Francisco"}
except TypeError as e:
    print("Lists cannot be dict keys:", e)`,
            outputPreview: `Resolved City: San Francisco, CA
Color (220, 20, 60) name: Crimson Red
Lists cannot be dict keys: unhashable type: 'list'`,
            explanation: "Lists cannot be dictionary keys because their contents can change, which would corrupt the hash table buckets.",
            keyPoints: [
              "Tuples have only 2 built-in methods: count() and index().",
              "Tuples are hashable IF AND ONLY IF all items inside the tuple are also hashable.",
              "A tuple containing a list (e.g. (1, [2, 3])) is NOT hashable."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "module-4",
    title: "04. Head-to-Head Architectural Comparison",
    subtitle: "Memory allocation, performance benchmarks, and the nested mutability paradox",
    estimatedMinutes: 15,
    learningObjectives: [
      "Quantify memory overhead differences using sys.getsizeof()",
      "Analyze time complexity tradeoffs for lists vs tuples",
      "Explain the nested mutability paradox: mutable objects within an immutable tuple",
      "Choose the optimal data structure based on safety and performance requirements"
    ],
    concepts: [
      {
        title: "Memory Overhead & Allocation Strategy",
        description: "Because lists are designed to grow and shrink dynamically, CPython allocates extra over-allocated buffer slots in memory. Tuples, being fixed-size, allocate exact block sizes with zero over-allocation, resulting in smaller memory footprints and faster iteration.",
        syntaxBox: `import sys\nsys.getsizeof(list_obj)   # Shows dynamic array overhead\nsys.getsizeof(tuple_obj)  # Shows compact immutable footprint`,
        examples: [
          {
            id: "memory-benchmark-demo",
            title: "Comparing sys.getsizeof() and Allocation",
            description: "Measure bytes allocated for an identical sequence of items.",
            code: `import sys

sample_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
sample_tuple = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

list_bytes = sys.getsizeof(sample_list)
tuple_bytes = sys.getsizeof(sample_tuple)

print("List memory (10 items):", list_bytes, "bytes")
print("Tuple memory (10 items):", tuple_bytes, "bytes")
print("Memory saved by tuple:", list_bytes - tuple_bytes, "bytes")
print("Empty list vs empty tuple:", sys.getsizeof([]), "vs", sys.getsizeof(()), "bytes")`,
            outputPreview: `List memory (10 items): 136 bytes
Tuple memory (10 items): 120 bytes
Memory saved by tuple: 16 bytes
Empty list vs empty tuple: 56 vs 40 bytes`,
            explanation: "In CPython, an empty tuple occupies only 40 bytes, while an empty list requires 56 bytes. As elements grow and reallocations happen, list buffers frequently hold 20-30% empty capacity.",
            keyPoints: [
              "Tuples consume less memory because they do not require over-allocation buffers.",
              "Tuples construct faster than lists because CPython caches small tuples.",
              "Lists amortize append operations by doubling or expanding capacity periodically."
            ]
          }
        ]
      },
      {
        title: "The Nested Mutability Paradox",
        description: "An infamous Python technical interview question: Can a tuple be mutated? The answer is nuanced: A tuple's REFERENCES are immutable. However, if a tuple contains a reference to a mutable object (like a list), that underlying list can still be mutated in-place!",
        syntaxBox: `t = (1, 2, [10, 20])\nt[2].append(30)   # VALID! The tuple reference didn't change, the inner list mutated!`,
        examples: [
          {
            id: "nested-paradox-demo",
            title: "Mutating a List Inside an Immutable Tuple",
            description: "Observe the behavior of mutable objects housed within an immutable container.",
            code: `# A tuple containing a student's ID, name, and grade list:
student_record = (101, "Alice", [90, 85, 95])

print("Original record:", student_record)

# Trying to replace the list reference directly fails:
try:
    student_record[2] = [100, 100]
except TypeError as e:
    print("Direct reassignment rejected:", e)

# But mutating the list in-place SUCCEEDS!
student_record[2].append(98)
print("After appending new grade:", student_record)

# The record is now unhashable due to the mutable list inside:
try:
    hash(student_record)
except TypeError as e:
    print("Hashability check:", e)`,
            outputPreview: `Original record: (101, 'Alice', [90, 85, 95])
Direct reassignment rejected: 'tuple' object does not support item assignment
After appending new grade: (101, 'Alice', [90, 85, 95, 98])
Hashability check: unhashable type: 'list'`,
            explanation: "The tuple holds pointer references to objects in memory. While the tuple pointer array is locked, the objects pointed to can change if their own type is mutable.",
            keyPoints: [
              "Tuple immutability means reference immutability, not deep recursive immutability.",
              "A tuple is only hashable if every single element recursively inside it is also hashable.",
              "For truly immutable nested structures, use nested tuples: (101, 'Alice', (90, 85, 95))."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "module-5",
    title: "05. Best Practices & Production Decision Framework",
    subtitle: "Contextual decision tree: Shopping cart vs GPS waypoint, mutable defaults, and multi-value returns",
    estimatedMinutes: 15,
    learningObjectives: [
      "Select between lists and tuples based on lifecycle, domain invariants, and performance",
      "Avoid the dangerous default mutable argument trap in Python functions",
      "Return multiple values idiomatic to Python functions"
    ],
    concepts: [
      {
        title: "Decision Framework: Shopping Cart vs Coordinates",
        description: "Follow the golden rules of Python sequence architecture:\n• Choose a LIST when data is dynamic, homogenous, and undergoes regular lifecycle modifications (e.g. an e-commerce shopping cart, user activity logs, student quiz scores).\n• Choose a TUPLE when data represents a fixed entity with invariant attributes, acts as a database record, or serves as a dictionary key (e.g. (latitude, longitude), (red, green, blue), (x, y, z)).",
        syntaxBox: `# DYNAMIC / MUTABLE -> LIST\ncart = ["keyboard", "mouse", "monitor"]\n\n# FIXED / INVARIANT -> TUPLE\ngps_point = (37.7749, -122.4194)\nrgb_color = (255, 99, 71)`,
        examples: [
          {
            id: "practical-patterns-demo",
            title: "Multi-Value Returns & The Mutable Default Argument Bug",
            description: "Safe multi-value returns and avoiding shared mutable list default parameters.",
            code: `# 1. Returning multiple values as a tuple
def get_geo_and_color():
    # Implicitly packs into a tuple:
    coords = (37.7749, -122.4194)
    color = (220, 20, 60)
    return coords, color

point, col = get_geo_and_color()
print("Returned coordinates:", point)
print("Returned color:", col)

# 2. ANTI-PATTERN: Mutable default argument!
def bad_add_to_cart(item, cart=[]):  # BUG: cart persists across function calls!
    cart.append(item)
    return cart

# 3. IDIOMATIC PATTERN: Safe default argument
def safe_add_to_cart(item, cart=None):
    if cart is None:
        cart = []  # Fresh list created per call
    cart.append(item)
    return cart

print("Customer 1 cart:", safe_add_to_cart("Shoes"))
print("Customer 2 cart:", safe_add_to_cart("Hat"))`,
            outputPreview: `Returned coordinates: (37.7749, -122.4194)
Returned color: (220, 20, 60)
Customer 1 cart: ['Shoes']
Customer 2 cart: ['Hat']`,
            explanation: "Default arguments in Python are evaluated once at function definition time, NOT at each call. A mutable default like cart=[] causes state leakage between distinct users or requests!",
            keyPoints: [
              "Functions returning multiple values use tuple packing by default: return a, b, c.",
              "Never use a mutable list as a default argument; use None and initialize inside.",
              "Tuples provide defensive programming against accidental modification."
            ]
          }
        ]
      }
    ]
  }
];

export const COMPARISON_MATRIX = [
  {
    criterion: "Syntax Literal",
    listVal: "['item1', 'item2'] or list()",
    tupleVal: "('item1', 'item2') or ('item1',) or tuple()",
    advantage: "neutral",
    note: "Tuples require trailing comma for 1-element: (x,)"
  },
  {
    criterion: "Mutability",
    listVal: "Mutable (in-place additions, deletions, updates)",
    tupleVal: "Immutable (read-only after creation)",
    advantage: "context",
    note: "Lists allow .append() for shopping carts; tuples safeguard GPS points from modification"
  },
  {
    criterion: "Real-World Best Match",
    listVal: "Shopping carts, gradebooks, task queues, logs",
    tupleVal: "GPS coordinates, RGB color channels, database records",
    advantage: "context",
    note: "Use lists for dynamic collections; tuples for fixed schemas/invariants"
  },
  {
    criterion: "Memory Overhead",
    listVal: "Higher (dynamic over-allocation buffer for append)",
    tupleVal: "Lower (compact memory footprint, zero extra buffer)",
    advantage: "tuple",
    note: "Tuples consume ~20-30% less RAM in CPython"
  },
  {
    criterion: "Hashability & Dict Keys",
    listVal: "Unhashable (cannot be dict keys or set items)",
    tupleVal: "Hashable (if all sub-items are hashable)",
    advantage: "tuple",
    note: "Tuples make ideal composite dictionary keys e.g. spatial_map[(lat, lon)]"
  },
  {
    criterion: "Methods Available",
    listVal: "11 methods (.append, .extend, .pop, .remove, .sort...)",
    tupleVal: "2 methods (.count, .index)",
    advantage: "list",
    note: "Lists provide rich collection manipulation APIs"
  },
  {
    criterion: "Instantiation Speed",
    listVal: "Slightly slower allocation in loops",
    tupleVal: "Faster creation; CPython reuses small tuples",
    advantage: "tuple",
    note: "Constant small tuples are cached and optimized by the interpreter"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: "tuples",
    question: "Why is a tuple the optimal data structure to represent RGB color values like (255, 99, 71) rather than a list?",
    options: [
      "Tuples can only store numbers, making them faster for graphics",
      "Colors are fixed, immutable specifications that should not be accidentally modified or mutated in memory",
      "Lists cannot hold three values at once",
      "Tuples automatically format into hexadecimal strings"
    ],
    correctIndex: 1,
    explanation: "An RGB color specification is an immutable, atomic value. Using an immutable tuple guarantees that a shared color like CRIMSON = (220, 20, 60) cannot have its red channel accidentally mutated in-place by a rogue function, and allows colors to be used as dictionary keys in palette tables."
  },
  {
    id: 2,
    topic: "lists",
    question: "Why should an e-commerce shopping cart be implemented as a Python list instead of a tuple?",
    options: [
      "Lists are smaller in RAM than tuples",
      "A shopping cart is dynamic and requires frequent in-place additions (.append) and removals (.remove/.pop) without reallocating the entire container",
      "Tuples cannot store strings like 'Mechanical Keyboard'",
      "Shopping carts require hashable data types"
    ],
    correctIndex: 1,
    explanation: "A shopping cart has a dynamic lifecycle: customers add items, remove items, and change quantities. A list provides O(1) amortized in-place .append() and .pop(), whereas an immutable tuple would force allocating a new tuple and copying all items on every user click."
  },
  {
    id: 3,
    topic: "tuples",
    question: "What is the data type of the expression: single_coord = (37.7749)?",
    codeSnippet: `single_coord = (37.7749)\nprint(type(single_coord))`,
    options: [
      "<class 'tuple'>",
      "<class 'float'>",
      "<class 'list'>",
      "<class 'coordinate'>"
    ],
    correctIndex: 1,
    explanation: "In Python, parentheses alone do not create a tuple; they only denote mathematical grouping. To create a 1-element tuple, a trailing comma is required: single_coord = (37.7749,)."
  },
  {
    id: 4,
    topic: "comparison",
    question: "Why can GPS coordinates (lat, lon) be used as keys in a spatial dictionary, but [lat, lon] cannot?",
    options: [
      "Dictionaries only accept text keys",
      "Tuples are immutable and hashable, whereas lists are mutable and unhashable",
      "Lists take up too much screen width",
      "GPS coordinates require positive numbers only"
    ],
    correctIndex: 1,
    explanation: "Dictionary lookups rely on a hash table. If a key's contents could be modified in-place, its hash value would change, corrupting the hash table buckets. Therefore, Python requires dictionary keys to be immutable and hashable (like tuples)."
  },
  {
    id: 5,
    topic: "lists",
    question: "A teacher wants to drop the lowest score from a student's grades list: [85, 92, 70, 95]. Which code accomplishes this in-place?",
    codeSnippet: `grades = [85, 92, 70, 95]`,
    options: [
      "grades.remove(min(grades))",
      "grades.pop(min(grades))",
      "grades = grades[1:]",
      "del min(grades)"
    ],
    correctIndex: 0,
    explanation: "min(grades) evaluates to 70. Calling grades.remove(70) searches for the value 70 and removes its first occurrence in-place. In contrast, grades.pop() expects an index, not a value."
  },
  {
    id: 6,
    topic: "tuples",
    question: "Given a student record represented as a tuple: record = (101, 'Alice', [90, 85]). Can the grade list inside be mutated?",
    codeSnippet: `record = (101, 'Alice', [90, 85])\nrecord[2].append(95)\nprint(record)`,
    options: [
      "No, raises TypeError because tuples are completely immutable",
      "Yes, prints (101, 'Alice', [90, 85, 95]) because the tuple references are locked, but the referenced list is mutable",
      "No, Python automatically converts inner lists to tuples",
      "Raises ValueError"
    ],
    correctIndex: 1,
    explanation: "The tuple's reference to index 2 is locked (you cannot reassign record[2] = [..]). However, the object living at that reference is a mutable list. Calling .append() mutates the list in-place on the heap without changing the tuple's pointer."
  }
];

export const EXPORTABLE_PYTHON_LESSON = `"""
=============================================================================
LESSON PLAN: PYTHON SEQUENCES (LISTS & TUPLES)
Course Code: PY-102 | Duration: 90 Minutes | Target: Python 3.10+
=============================================================================
Practical Real-World Focus:
  - Lists: E-Commerce Shopping Cart, Student Gradebook Analytics
  - Tuples: Geographical GPS Coordinates, RGB / RGBA Color Palettes
  - Architecture: Mutability, Memory Overhead (sys.getsizeof), Hashability
=============================================================================
"""

import sys

print("=" * 65)
print("MODULE 1: FOUNDATIONS OF SEQUENCES & REAL-WORLD CONCEPTS")
print("=" * 65)

# 1. LIST: Dynamic, mutable collection (e.g. Shopping Cart)
cart = ["Keyboard", "Mouse", "Monitor"]
print("Initial Shopping Cart:", cart)
cart.append("Webcam")
print("After adding Webcam:", cart)
cart.remove("Mouse")
print("After removing Mouse:", cart)

# 2. TUPLE: Invariant, immutable record (e.g. GPS Coordinates & RGB Colors)
gps_golden_gate = (37.8199, -122.4783, 67.1)
rgb_emerald = (16, 185, 129)
print("Golden Gate GPS (lat, lon, alt):", gps_golden_gate)
print("Emerald RGB (r, g, b):", rgb_emerald)

# Demonstrating tuple immutability guard
try:
    gps_golden_gate[0] = 0.0  # Attempt to mutate latitude
except TypeError as error:
    print("Caught expected protection error:", error)

print("\\n" + "=" * 65)
print("MODULE 2: PYTHON LISTS IN DEPTH (STUDENT GRADEBOOK CASE)")
print("=" * 65)

grades = [88.5, 92.0, 74.5, 96.0, 85.0]
print("Grades before final exam:", grades)
grades.append(94.0)

# Academic policy: Drop lowest score
lowest = min(grades)
grades.remove(lowest)
print(f"Dropped lowest grade ({lowest}):", grades)

# Statistical calculations
print(f"Final Semester Average: {sum(grades)/len(grades):.2f}%")

# List comprehension: Identify honors scores (>= 90%)
honors = [g for g in grades if g >= 90.0]
print("Honors-level scores:", honors)

print("\\n" + "=" * 65)
print("MODULE 3: PYTHON TUPLES IN DEPTH (UNPACKING & HASHABILITY)")
print("=" * 65)

# The Singleton Comma Rule
not_a_tuple = (42)
is_a_tuple = (42,)
print("Type of (42):", type(not_a_tuple))
print("Type of (42,):", type(is_a_tuple))

# Unpacking RGB values
r, g, b = rgb_emerald
luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
print(f"Emerald Color Luminance: {luminance:.1f}")

# Tuples as Dictionary Keys (Spatial Cache & Palette)
spatial_cache = {
    (37.8199, -122.4783): "Golden Gate Bridge",
    (35.6586, 139.7454): "Tokyo Tower",
    (27.9881, 86.9250): "Mount Everest"
}
query_point = (35.6586, 139.7454)
print(f"Landmark at {query_point}:", spatial_cache[query_point])

print("\\n" + "=" * 65)
print("MODULE 4: ARCHITECTURAL COMPARISON & MEMORY")
print("=" * 65)

sample_list = [10, 20, 30, 40, 50]
sample_tuple = (10, 20, 30, 40, 50)
print(f"List memory for 5 items:  {sys.getsizeof(sample_list)} bytes")
print(f"Tuple memory for 5 items: {sys.getsizeof(sample_tuple)} bytes")

# Nested mutability paradox
student_record = (101, "Alice", [90, 85, 95])
student_record[2].append(98)
print("Record with updated inner list:", student_record)

print("\\n" + "=" * 65)
print("LESSON COMPLETE: READY FOR PRODUCTION USE")
print("=" * 65)
`;
