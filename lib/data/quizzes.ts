export interface QuizQuestion {
  id: string;
  language: 'python' | 'c' | 'java' | 'javascript';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // PYTHON
  {
    id: 'q-py-1',
    language: 'python',
    topic: 'Loops',
    difficulty: 'beginner',
    question: 'What does a for loop do in Python?',
    options: [
      'Defines a reusable function',
      'Repeats a block of code for each item in a sequence',
      'Declares a new object-oriented class',
      'Catches and handles runtime exceptions'
    ],
    correctIndex: 1,
    explanation: 'A for loop iterates over the elements of a sequence (like a list, tuple, or range) executing the code block for each element.',
    xp: 15
  },
  {
    id: 'q-py-2',
    language: 'python',
    topic: 'Lists',
    difficulty: 'beginner',
    question: 'What is the index of the first element in a Python list?',
    options: ['1', '0', '-1', 'null'],
    correctIndex: 1,
    explanation: 'Python lists use zero-based indexing, meaning the first element is at index 0.',
    xp: 15
  },
  {
    id: 'q-py-3',
    language: 'python',
    topic: 'Functions',
    difficulty: 'intermediate',
    question: 'What keyword creates an anonymous inline function in Python?',
    options: ['def', 'inline', 'lambda', 'anonymous'],
    correctIndex: 2,
    explanation: 'The `lambda` keyword defines anonymous, small single-expression functions in Python.',
    xp: 20
  },
  {
    id: 'q-py-4',
    language: 'python',
    topic: 'Memory / Mutability',
    difficulty: 'advanced',
    question: 'Which of the following built-in types in Python is immutable?',
    options: ['list', 'dict', 'set', 'tuple'],
    correctIndex: 3,
    explanation: 'Tuples are immutable; once created, their elements cannot be added, removed, or modified.',
    xp: 25
  },

  // C
  {
    id: 'q-c-1',
    language: 'c',
    topic: 'Pointers',
    difficulty: 'intermediate',
    question: 'What operator is used to get the memory address of a variable in C?',
    options: ['*', '&', '->', '%'],
    correctIndex: 1,
    explanation: 'The address-of operator `&` retrieves the memory address of a variable in C.',
    xp: 20
  },
  {
    id: 'q-c-2',
    language: 'c',
    topic: 'Strings',
    difficulty: 'beginner',
    question: 'How are strings represented in C?',
    options: [
      'A built-in String primitive type',
      'An array of characters terminated by \\0',
      'A dynamic linked list',
      'A key-value hash table'
    ],
    correctIndex: 1,
    explanation: 'Strings in C are character arrays terminated by the null character `\\0`.',
    xp: 15
  },
  {
    id: 'q-c-3',
    language: 'c',
    topic: 'Memory Management',
    difficulty: 'advanced',
    question: 'Which function dynamically allocates uninitialized memory on the heap in C?',
    options: ['alloc()', 'calloc()', 'malloc()', 'new'],
    correctIndex: 2,
    explanation: '`malloc(size)` allocates the requested number of bytes on the heap without zero-initializing.',
    xp: 25
  },

  // JAVA
  {
    id: 'q-java-1',
    language: 'java',
    topic: 'OOP',
    difficulty: 'beginner',
    question: 'Which keyword is used to inherit a class in Java?',
    options: ['inherits', 'implements', 'extends', 'super'],
    correctIndex: 2,
    explanation: 'In Java, the `extends` keyword is used for class inheritance.',
    xp: 15
  },
  {
    id: 'q-java-2',
    language: 'java',
    topic: 'Interfaces',
    difficulty: 'intermediate',
    question: 'Can a Java class implement multiple interfaces?',
    options: [
      'Yes, separated by commas',
      'No, only single interface implementation is allowed',
      'Only if the interfaces are abstract',
      'Only in Java 8 and below'
    ],
    correctIndex: 0,
    explanation: 'Java supports multiple interface implementation: `class C implements A, B`.',
    xp: 20
  },
  {
    id: 'q-java-3',
    language: 'java',
    topic: 'Garbage Collection',
    difficulty: 'advanced',
    question: 'Where are Java object instances allocated in memory?',
    options: ['Stack', 'Heap', 'CPU Registers', 'Static Code Segment'],
    correctIndex: 1,
    explanation: 'In Java, all object instances are created on the Heap memory managed by the JVM Garbage Collector.',
    xp: 25
  },

  // JAVASCRIPT
  {
    id: 'q-js-1',
    language: 'javascript',
    topic: 'Variables',
    difficulty: 'beginner',
    question: 'What is the main difference between `let` and `const` in JavaScript?',
    options: [
      'let is block scoped, const is function scoped',
      'const cannot be reassigned after declaration',
      'let only stores numbers, const stores strings',
      'const variables are deleted after one execution'
    ],
    correctIndex: 1,
    explanation: '`const` creates a block-scoped read-only reference that cannot be reassigned.',
    xp: 15
  },
  {
    id: 'q-js-2',
    language: 'javascript',
    topic: 'Asynchronous',
    difficulty: 'intermediate',
    question: 'What does `Promise.all()` do?',
    options: [
      'Runs promises sequentially one by one',
      'Resolves when all promises resolve, or rejects immediately if any fails',
      'Cancels all pending HTTP network requests',
      'Converts synchronous code to asynchronous'
    ],
    correctIndex: 1,
    explanation: '`Promise.all(iterable)` returns a promise that resolves when all input promises have resolved or rejects when any promise rejects.',
    xp: 20
  }
];
