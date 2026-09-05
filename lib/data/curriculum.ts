export interface LessonTopic {
  id: string;
  language: 'python' | 'c' | 'java';
  title: string;
  category: string;
  description: string;
  conceptBreakdown: {
    title: string;
    content: string;
  }[];
  sampleCode: string;
  expectedOutput: string;
  commonMistakes: {
    mistake: string;
    whyWrong: string;
    correction: string;
  }[];
  practiceChallenge: {
    title: string;
    instructions: string;
    starterCode: string;
    solutionCode: string;
    hint: string;
  };
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xp: number;
}

export const CURRICULUM_PYTHON: LessonTopic[] = [
  {
    id: 'py-variables',
    language: 'python',
    title: 'Variables & Assignments',
    category: 'Fundamentals',
    description: 'Learn how to store and manage data dynamically using Python variables.',
    conceptBreakdown: [
      {
        title: 'Dynamic Typing',
        content: 'In Python, you do not need to declare types explicitly. The interpreter infers the type automatically when a value is assigned.'
      },
      {
        title: 'Naming Conventions',
        content: 'Use snake_case for variable names (e.g., student_age, total_score). Variable names are case-sensitive and must not start with a digit.'
      }
    ],
    sampleCode: `# Variable assignment and dynamic typing
student_name = "Alex"
student_age = 20
gpa = 3.85
is_enrolled = True

print(f"Student: {student_name}")
print(f"Age: {student_age}")
print(f"GPA: {gpa}")
print(f"Active Status: {is_enrolled}")`,
    expectedOutput: `Student: Alex
Age: 20
GPA: 3.85
Active Status: True`,
    commonMistakes: [
      {
        mistake: 'Using reserved keywords as variable names (e.g., class = 10)',
        whyWrong: 'Keywords like class, for, if, def have special syntactical meaning in Python.',
        correction: 'Use descriptive alternate names like class_name or student_class.'
      }
    ],
    practiceChallenge: {
      title: 'Swap Two Variables',
      instructions: 'Declare two variables `a = 10` and `b = 20`. Swap their values and print both.',
      starterCode: `a = 10
b = 20

# Write your swap code here:

print(f"a = {a}, b = {b}")`,
      solutionCode: `a = 10
b = 20
a, b = b, a
print(f"a = {a}, b = {b}")`,
      hint: 'Python allows multiple assignments in a single line using tuple unpacking: `a, b = b, a`.'
    },
    quickQuiz: {
      question: 'Which of the following is a valid Python variable name?',
      options: ['2nd_player', 'student-score', 'user_age_2026', 'def'],
      correctIndex: 2,
      explanation: 'Variable names cannot start with numbers, cannot contain hyphens, and cannot be reserved keywords.'
    },
    xp: 25
  },
  {
    id: 'py-datatypes',
    language: 'python',
    title: 'Data Types & Conversions',
    category: 'Fundamentals',
    description: 'Understand integers, floats, strings, booleans, and type casting in Python.',
    conceptBreakdown: [
      {
        title: 'Primitive Types',
        content: 'Python supports int (whole numbers), float (decimals), str (text enclosed in quotes), and bool (True/False).'
      },
      {
        title: 'Type Casting',
        content: 'Convert between types using built-in functions: int("42"), float(10), str(3.14), bool(1).'
      }
    ],
    sampleCode: `val_str = "100"
val_int = int(val_str)
val_float = float(val_int) + 0.5

print(f"Type of val_str: {type(val_str).__name__}")
print(f"Type of val_int: {type(val_int).__name__}")
print(f"Result: {val_float}")`,
    expectedOutput: `Type of val_str: str
Type of val_int: int
Result: 100.5`,
    commonMistakes: [
      {
        mistake: 'Concatenating string with integer directly (e.g., "Score: " + 95)',
        whyWrong: 'Python does not perform implicit string conversion when using the + operator.',
        correction: 'Use f-strings f"Score: {95}" or explicit conversion "Score: " + str(95).'
      }
    ],
    practiceChallenge: {
      title: 'Calculate Temperature in Fahrenheit',
      instructions: 'Convert celsius = 25 into fahrenheit using the formula `(celsius * 9/5) + 32`.',
      starterCode: `celsius = 25
# Compute fahrenheit
fahrenheit = 0
print(f"Temperature: {fahrenheit} F")`,
      solutionCode: `celsius = 25
fahrenheit = (celsius * 9/5) + 32
print(f"Temperature: {fahrenheit} F")`,
      hint: 'Use standard arithmetic operations and assign the result to fahrenheit.'
    },
    quickQuiz: {
      question: 'What is the output of `type(3.0)` in Python?',
      options: ['<class "int">', '<class "float">', '<class "double">', '<class "number">'],
      correctIndex: 1,
      explanation: 'Numbers containing decimal points are instances of the float class in Python.'
    },
    xp: 25
  },
  {
    id: 'py-conditions',
    language: 'python',
    title: 'Conditionals (if / elif / else)',
    category: 'Control Flow',
    description: 'Master logical branching and decision making in your programs.',
    conceptBreakdown: [
      {
        title: 'Indentation Blocks',
        content: 'Python uses 4 spaces (or a tab) to define code blocks inside if, elif, and else statements.'
      },
      {
        title: 'Logical Operators',
        content: 'Combine multiple conditions using `and`, `or`, and `not` keywords.'
      }
    ],
    sampleCode: `score = 88

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Score {score} receives grade {grade}")`,
    expectedOutput: `Score 88 receives grade B`,
    commonMistakes: [
      {
        mistake: 'Using = instead of == in condition checks (e.g., if x = 5:)',
        whyWrong: '= is the assignment operator, whereas == is the comparison operator.',
        correction: 'Always use == for equality comparisons: `if x == 5:`'
      }
    ],
    practiceChallenge: {
      title: 'Even or Odd Determiner',
      instructions: 'Check if number `num = 17` is even or odd, printing "Even" or "Odd".',
      starterCode: `num = 17
# Write conditional check
`,
      solutionCode: `num = 17
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,
      hint: 'Use the modulo operator `%`. If `num % 2 == 0`, it is even.'
    },
    quickQuiz: {
      question: 'Which keyword in Python is used for multiple alternative conditional branches?',
      options: ['else if', 'elseif', 'elif', 'switch'],
      correctIndex: 2,
      explanation: 'Python uses the `elif` keyword for chained conditional checks.'
    },
    xp: 30
  },
  {
    id: 'py-loops',
    language: 'python',
    title: 'Loops (for & while)',
    category: 'Control Flow',
    description: 'Iterate over sequences, ranges, and execute code blocks repeatedly with loops.',
    conceptBreakdown: [
      {
        title: 'for Loop & range()',
        content: 'The `range(start, stop, step)` generates a sequence of numbers from start up to (but excluding) stop.'
      },
      {
        title: 'Loop Control: break & continue',
        content: '`break` terminates the loop immediately; `continue` skips the remainder of the current iteration.'
      }
    ],
    sampleCode: `# For loop with range
print("Counting squares:")
for i in range(1, 6):
    print(f"{i}^2 = {i * i}")

# While loop
count = 3
print("\\nCountdown:")
while count > 0:
    print(count)
    count -= 1
print("Liftoff!")`,
    expectedOutput: `Counting squares:
1^2 = 1
2^2 = 4
3^2 = 9
4^2 = 16
5^2 = 25

Countdown:
3
2
1
Liftoff!`,
    commonMistakes: [
      {
        mistake: 'Forgetting to increment/decrement the counter in a while loop',
        whyWrong: 'This leads to an infinite loop, freezing program execution.',
        correction: 'Ensure the loop condition eventually evaluates to False.'
      }
    ],
    practiceChallenge: {
      title: 'Sum of First 10 Numbers',
      instructions: 'Use a loop to calculate the sum of numbers from 1 to 10 inclusive.',
      starterCode: `total = 0
# Compute sum using a for loop

print(f"Total: {total}")`,
      solutionCode: `total = 0
for i in range(1, 11):
    total += i
print(f"Total: {total}")`,
      hint: 'Use `range(1, 11)` to iterate through numbers 1 to 10.'
    },
    quickQuiz: {
      question: 'How many times will `for i in range(2, 6):` execute?',
      options: ['6 times', '5 times', '4 times', '3 times'],
      correctIndex: 2,
      explanation: 'It iterates through values 2, 3, 4, 5 — exactly 4 times.'
    },
    xp: 30
  },
  {
    id: 'py-functions',
    language: 'python',
    title: 'Functions & Parameters',
    category: 'Structure',
    description: 'Organize modular, reusable code using functions, return values, and default arguments.',
    conceptBreakdown: [
      {
        title: 'Function Definition',
        content: 'Define functions using the `def` keyword, followed by parameters in parentheses and a colon.'
      },
      {
        title: 'Return Values',
        content: 'The `return` statement sends a computed result back to the caller.'
      }
    ],
    sampleCode: `def calculate_area(width, height=10):
    """Calculates rectangle area with default height 10"""
    return width * height

print(f"Area 1: {calculate_area(5, 4)}")
print(f"Area 2 (default height): {calculate_area(5)}")`,
    expectedOutput: `Area 1: 20
Area 2 (default height): 50`,
    commonMistakes: [
      {
        mistake: 'Placing positional parameters after default parameters in signature',
        whyWrong: 'Python syntax requires non-default parameters to precede default parameters.',
        correction: 'Write `def func(a, b=2):` instead of `def func(a=2, b):`.'
      }
    ],
    practiceChallenge: {
      title: 'Factorial Function',
      instructions: 'Write a function `factorial(n)` that returns the factorial of positive integer n.',
      starterCode: `def factorial(n):
    # Calculate n!
    pass

print(factorial(5)) # Expected: 120`,
      solutionCode: `def factorial(n):
    res = 1
    for i in range(1, n + 1):
        res *= i
    return res

print(factorial(5))`,
      hint: 'Multiply numbers from 1 to n in a loop.'
    },
    quickQuiz: {
      question: 'What does a Python function return if no return statement is executed?',
      options: ['0', 'False', 'None', 'undefined'],
      correctIndex: 2,
      explanation: 'Python functions return `None` implicitly by default.'
    },
    xp: 35
  },
  {
    id: 'py-lists',
    language: 'python',
    title: 'Lists & List Operations',
    category: 'Data Structures',
    description: 'Work with ordered, mutable collections: indexing, slicing, methods, and list comprehensions.',
    conceptBreakdown: [
      {
        title: 'Indexing & Slicing',
        content: 'Access elements with 0-based indexing `list[0]` or negative indexing `list[-1]` for the last item. Slice with `list[start:stop:step]`.'
      },
      {
        title: 'List Comprehensions',
        content: 'Create new lists concisely: `[x**2 for x in numbers if x % 2 == 0]`.'
      }
    ],
    sampleCode: `fruits = ["apple", "banana", "cherry"]
fruits.append("dragonfruit")

# List comprehension: lengths of each fruit
lengths = [len(f) for f in fruits]

print(f"First fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
print(f"All fruits: {fruits}")
print(f"Lengths: {lengths}")`,
    expectedOutput: `First fruit: apple
Last fruit: dragonfruit
All fruits: ['apple', 'banana', 'cherry', 'dragonfruit']
Lengths: [5, 6, 6, 11]`,
    commonMistakes: [
      {
        mistake: 'IndexError: list index out of range when accessing list[len(list)]',
        whyWrong: 'Lists are 0-indexed, so the valid maximum index is `len(list) - 1`.',
        correction: 'Use `list[-1]` to access the last element safely.'
      }
    ],
    practiceChallenge: {
      title: 'Filter Even Numbers',
      instructions: 'Given `nums = [1, 2, 3, 4, 5, 6, 7, 8]`, create a list of only even numbers.',
      starterCode: `nums = [1, 2, 3, 4, 5, 6, 7, 8]
# Filter evens
evens = []
print(evens)`,
      solutionCode: `nums = [1, 2, 3, 4, 5, 6, 7, 8]
evens = [x for x in nums if x % 2 == 0]
print(evens)`,
      hint: 'Use list comprehension `[x for x in nums if x % 2 == 0]`.'
    },
    quickQuiz: {
      question: 'What is the result of `["a", "b", "c"][1:]`?',
      options: ['["a"]', '["b", "c"]', '["a", "b"]', '["c"]'],
      correctIndex: 1,
      explanation: 'Slice `1:` takes all elements from index 1 to the end: `["b", "c"]`.'
    },
    xp: 35
  },
  {
    id: 'py-dictionaries',
    language: 'python',
    title: 'Dictionaries & Sets',
    category: 'Data Structures',
    description: 'Store key-value pairs and unique elements with high performance hash-based structures.',
    conceptBreakdown: [
      {
        title: 'Key-Value Mapping',
        content: 'Dictionaries map immutable keys to values. Access values via `dict["key"]` or `dict.get("key", default)`.'
      },
      {
        title: 'Sets',
        content: 'Sets are unordered collections of unique elements with fast membership testing: `item in my_set`.'
      }
    ],
    sampleCode: `student = {
    "name": "Jordan",
    "major": "Computer Science",
    "year": 3
}

student["gpa"] = 3.9

for key, value in student.items():
    print(f"{key}: {value}")

unique_tags = {"python", "ai", "terminal", "python"}
print(f"Unique tags: {unique_tags}")`,
    expectedOutput: `name: Jordan
major: Computer Science
year: 3
gpa: 3.9
Unique tags: {'ai', 'terminal', 'python'}`,
    commonMistakes: [
      {
        mistake: 'KeyError when accessing a non-existent key directly via dict[key]',
        whyWrong: 'Direct bracket indexing throws KeyError if the key does not exist.',
        correction: 'Use `dict.get(key, default_value)` to handle missing keys gracefully.'
      }
    ],
    practiceChallenge: {
      title: 'Word Frequency Counter',
      instructions: 'Count the frequency of each word in the list `words = ["apple", "banana", "apple", "cherry", "banana", "apple"]`.',
      starterCode: `words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = {}
# Fill counts dictionary

print(counts)`,
      solutionCode: `words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)`,
      hint: 'Use `counts.get(w, 0) + 1` to increment counts safely.'
    },
    quickQuiz: {
      question: 'Which method returns a default value instead of throwing KeyError if key is not found?',
      options: ['dict.find()', 'dict.get()', 'dict.lookup()', 'dict.fetch()'],
      correctIndex: 1,
      explanation: '`dict.get(key, default)` returns the default value without raising KeyError.'
    },
    xp: 40
  },
  {
    id: 'py-oop',
    language: 'python',
    title: 'Object-Oriented Programming (OOP)',
    category: 'Advanced',
    description: 'Classes, Objects, Constructors (__init__), Methods, and Inheritance in Python.',
    conceptBreakdown: [
      {
        title: 'Classes & __init__',
        content: 'Classes encapsulate state and behavior. The `__init__` constructor initializes instance attributes.'
      },
      {
        title: 'The self Parameter',
        content: '`self` represents the current instance of the class and is passed automatically as the first parameter in instance methods.'
      }
    ],
    sampleCode: `class Robot:
    def __init__(self, name, model):
        self.name = name
        self.model = model
        self.battery = 100

    def greet(self):
        return f"Hello! I am {self.name} (Model: {self.model})"

    def perform_task(self, cost):
        self.battery -= cost
        return f"Task complete. Battery remaining: {self.battery}%"

bot = Robot("Antigravity-1", "AG-2026")
print(bot.greet())
print(bot.perform_task(15))`,
    expectedOutput: `Hello! I am Antigravity-1 (Model: AG-2026)
Task complete. Battery remaining: 85%`,
    commonMistakes: [
      {
        mistake: 'Omitting self when defining methods inside a class (e.g. def greet():)',
        whyWrong: 'Python passes the instance as the first argument, causing a TypeError.',
        correction: 'Always include self as the first parameter: `def greet(self):`.'
      }
    ],
    practiceChallenge: {
      title: 'Create a BankAccount Class',
      instructions: 'Create a BankAccount class with owner and balance attributes, and deposit(amount) and withdraw(amount) methods.',
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        # Initialize
        pass

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass

acct = BankAccount("Sam", 100)
acct.deposit(50)
acct.withdraw(30)
print(acct.balance) # Expected: 120`,
      solutionCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
        return self.balance

acct = BankAccount("Sam", 100)
acct.deposit(50)
acct.withdraw(30)
print(acct.balance)`,
      hint: 'Store owner and balance on self (`self.owner`, `self.balance`).'
    },
    quickQuiz: {
      question: 'What is the purpose of `__init__` in Python classes?',
      options: ['To destroy an object', 'To initialize instance attributes when creating an object', 'To import modules', 'To make class private'],
      correctIndex: 1,
      explanation: '`__init__` is the constructor method called automatically when instantiating a new object.'
    },
    xp: 45
  }
];

export const CURRICULUM_C: LessonTopic[] = [
  {
    id: 'c-variables',
    language: 'c',
    title: 'Variables & Data Types in C',
    category: 'Fundamentals',
    description: 'Learn static typing, primitive types, memory size, and format specifiers in C.',
    conceptBreakdown: [
      {
        title: 'Static Typing',
        content: 'In C, every variable must be declared with an explicit type (int, float, double, char) before use.'
      },
      {
        title: 'Format Specifiers',
        content: 'printf and scanf require format specifiers: %d for int, %f for float, %lf for double, %c for char, %s for strings.'
      }
    ],
    sampleCode: `#include <stdio.h>

int main() {
    int age = 21;
    float gpa = 3.75f;
    char grade = 'A';

    printf("Age: %d\\n", age);
    printf("GPA: %.2f\\n", gpa);
    printf("Grade: %c\\n", grade);
    printf("Memory for int: %lu bytes\\n", sizeof(int));
    return 0;
}`,
    expectedOutput: `Age: 21
GPA: 3.75
Grade: A
Memory for int: 4 bytes`,
    commonMistakes: [
      {
        mistake: 'Using %d for float or %f for int in printf',
        whyWrong: 'Mismatched format specifiers result in undefined behavior and incorrect outputs.',
        correction: 'Use %d for integers, %f for floats, %lf for double.'
      }
    ],
    practiceChallenge: {
      title: 'Calculate Rectangle Perimeter',
      instructions: 'Write a C program to calculate the perimeter of a rectangle with length 12 and width 8.',
      starterCode: `#include <stdio.h>

int main() {
    int length = 12;
    int width = 8;
    // Calculate perimeter
    int perimeter = 0;
    
    printf("Perimeter: %d\\n", perimeter);
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int length = 12;
    int width = 8;
    int perimeter = 2 * (length + width);
    printf("Perimeter: %d\\n", perimeter);
    return 0;
}`,
      hint: 'Formula: `2 * (length + width)`.'
    },
    quickQuiz: {
      question: 'Which format specifier is used to print a double precision floating point number in C printf?',
      options: ['%d', '%f or %lf', '%c', '%s'],
      correctIndex: 1,
      explanation: '`%f` or `%lf` is used for printing floating point / double numbers in C.'
    },
    xp: 25
  },
  {
    id: 'c-pointers',
    language: 'c',
    title: 'Pointers & Memory Addresses',
    category: 'Memory Management',
    description: 'Master memory pointers, address-of operator (&), and dereference operator (*).',
    conceptBreakdown: [
      {
        title: 'Address-of Operator (&)',
        content: '`&variable` retrieves the memory address where the variable is stored.'
      },
      {
        title: 'Dereferencing (*)',
        content: '`*ptr` accesses or modifies the value stored at the memory address pointed to by ptr.'
      }
    ],
    sampleCode: `#include <stdio.h>

int main() {
    int x = 42;
    int *ptr = &x; // ptr stores address of x

    printf("Value of x: %d\\n", x);
    printf("Address of x: %p\\n", (void*)&x);
    printf("Value via pointer: %d\\n", *ptr);

    // Modify x via pointer
    *ptr = 100;
    printf("New value of x: %d\\n", x);
    return 0;
}`,
    expectedOutput: `Value of x: 42
Address of x: 0x7fff5fbff8ac
Value via pointer: 42
New value of x: 100`,
    commonMistakes: [
      {
        mistake: 'Dereferencing uninitialized pointer (wild pointer) or NULL pointer',
        whyWrong: 'Accessing invalid memory leads to Segmentation Fault (crash).',
        correction: 'Always initialize pointers: `int *ptr = NULL;` or assign to valid memory.'
      }
    ],
    practiceChallenge: {
      title: 'Swap Using Pointers',
      instructions: 'Implement swap function `void swap(int *a, int *b)` that swaps two integers.',
      starterCode: `#include <stdio.h>

void swap(int *a, int *b) {
    // Implement swap using temp variable
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x = %d, y = %d\\n", x, y); // Expected: x = 20, y = 10
    return 0;
}`,
      solutionCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
      hint: 'Save `*a` to `temp`, set `*a = *b`, then set `*b = temp`.'
    },
    quickQuiz: {
      question: 'What does `*ptr` do when ptr is a pointer to an integer?',
      options: ['Returns the memory address of ptr', 'Multiplies ptr by itself', 'Accesses the integer value stored at the address in ptr', 'Declares a new pointer'],
      correctIndex: 2,
      explanation: 'The dereference operator `*` accesses the value residing at the address stored in the pointer.'
    },
    xp: 45
  },
  {
    id: 'c-arrays',
    language: 'c',
    title: 'Arrays & Strings in C',
    category: 'Data Structures',
    description: 'Understand contiguous memory arrays, bounds, and null-terminated char arrays (strings).',
    conceptBreakdown: [
      {
        title: 'Fixed Size & Zero Indexing',
        content: 'C arrays have a fixed size defined at compilation time. Array names act as pointers to the first element.'
      },
      {
        title: 'Strings as Char Arrays',
        content: 'In C, strings are character arrays terminated by the null character `\\0`.'
      }
    ],
    sampleCode: `#include <stdio.h>

int main() {
    int scores[4] = {85, 92, 78, 96};
    char greeting[] = "Hello C";

    printf("Scores:\\n");
    for (int i = 0; i < 4; i++) {
        printf("  Exam %d: %d\\n", i + 1, scores[i]);
    }

    printf("\\nString: %s (length: %lu)\\n", greeting, sizeof(greeting) - 1);
    return 0;
}`,
    expectedOutput: `Scores:
  Exam 1: 85
  Exam 2: 92
  Exam 3: 78
  Exam 4: 96

String: Hello C (length: 7)`,
    commonMistakes: [
      {
        mistake: 'Array index out of bounds (e.g. scores[4] on a 4-element array)',
        whyWrong: 'C does not perform bounds checking; accessing out of bounds causes undefined behavior or memory corruption.',
        correction: 'Always stay within `0` to `size - 1`.'
      }
    ],
    practiceChallenge: {
      title: 'Find Maximum in Array',
      instructions: 'Find and print the largest number in array `arr = {14, 58, 29, 91, 42}`.',
      starterCode: `#include <stdio.h>

int main() {
    int arr[] = {14, 58, 29, 91, 42};
    int n = 5;
    int max = arr[0];
    
    // Find max in loop
    
    printf("Max: %d\\n", max);
    return 0;
}`,
      solutionCode: `#include <stdio.h>

int main() {
    int arr[] = {14, 58, 29, 91, 42};
    int n = 5;
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    printf("Max: %d\\n", max);
    return 0;
}`,
      hint: 'Iterate through the array and update `max` whenever `arr[i] > max`.'
    },
    quickQuiz: {
      question: 'What character marks the end of a string in C?',
      options: ['\\n', '\\t', '\\0', ';'],
      correctIndex: 2,
      explanation: 'The null character `\\0` with ASCII value 0 terminates strings in C.'
    },
    xp: 35
  }
];

export const CURRICULUM_JAVA: LessonTopic[] = [
  {
    id: 'java-variables',
    language: 'java',
    title: 'Variables & Class Structure in Java',
    category: 'Fundamentals',
    description: 'Learn Java class structure, public static void main, and strong typing.',
    conceptBreakdown: [
      {
        title: 'Class Blueprint',
        content: 'Every Java program requires at least one class matching the file name. Execution begins at `public static void main(String[] args)`.'
      },
      {
        title: 'Strong Typing',
        content: 'Java enforces strict type checking: byte, short, int, long, float, double, boolean, char, and String.'
      }
    ],
    sampleCode: `public class Main {
    public static void main(String[] args) {
        String studentName = "Elena";
        int studentId = 1042;
        double gpa = 3.92;
        boolean isEnrolled = true;

        System.out.println("Student: " + studentName);
        System.out.println("ID: " + studentId);
        System.out.println("GPA: " + gpa);
        System.out.println("Enrolled: " + isEnrolled);
    }
}`,
    expectedOutput: `Student: Elena
ID: 1042
GPA: 3.92
Enrolled: true`,
    commonMistakes: [
      {
        mistake: 'Declaring public class with name different from the filename',
        whyWrong: 'Java compiler requires public class name to match the file name exactly.',
        correction: 'Ensure class Main is in Main.java.'
      }
    ],
    practiceChallenge: {
      title: 'Simple Calculator in Java',
      instructions: 'Calculate and print sum, difference, and product of `a = 15` and `b = 4`.',
      starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        // Compute and print sum, diff, prod
    }
}`,
      solutionCode: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        System.out.println("Sum: " + (a + b));
        System.out.println("Diff: " + (a - b));
        System.out.println("Prod: " + (a * b));
    }
}`,
      hint: 'Enclose arithmetic expressions in parentheses when concatenating with strings: `"Sum: " + (a + b)`.'
    },
    quickQuiz: {
      question: 'What is the signature of the entry point method in Java?',
      options: [
        'public void main()',
        'public static void main(String[] args)',
        'static int main(String[] args)',
        'private static void main()'
      ],
      correctIndex: 1,
      explanation: 'Java virtual machine specifically looks for `public static void main(String[] args)` as the application entry point.'
    },
    xp: 25
  },
  {
    id: 'java-oop',
    language: 'java',
    title: 'OOP & Inheritance in Java',
    category: 'Object-Oriented',
    description: 'Classes, Objects, Encapsulation, `extends` inheritance, and method overriding.',
    conceptBreakdown: [
      {
        title: 'Encapsulation',
        content: 'Hide internal fields using `private` and provide controlled access via `getters` and `setters`.'
      },
      {
        title: 'Inheritance with `extends`',
        content: 'Subclasses inherit public/protected members from superclasses and can override methods with `@Override`.'
      }
    ],
    sampleCode: `class Vehicle {
    protected String brand = "Generic";

    public void honk() {
        System.out.println("Beep beep!");
    }
}

class Car extends Vehicle {
    private String model;

    public Car(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }

    public void displayInfo() {
        System.out.println("Car: " + brand + " " + model);
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car("Tesla", "Model S");
        myCar.displayInfo();
        myCar.honk();
    }
}`,
    expectedOutput: `Car: Tesla Model S
Beep beep!`,
    commonMistakes: [
      {
        mistake: 'Multiple inheritance of classes in Java (e.g. class C extends A, B)',
        whyWrong: 'Java does not support multiple class inheritance to avoid the diamond problem.',
        correction: 'Use interfaces (`implements InterfaceA, InterfaceB`) for multiple contract implementations.'
      }
    ],
    practiceChallenge: {
      title: 'Create an Animal & Dog Hierarchy',
      instructions: 'Create an Animal superclass with `speak()` printing "Animal sound", and a Dog subclass overriding `speak()` to print "Woof!".',
      starterCode: `class Animal {
    public void speak() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    // Override speak()
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.speak(); // Expected: Woof!
    }
}`,
      solutionCode: `class Animal {
    public void speak() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.speak();
    }
}`,
      hint: 'Use the `@Override` annotation and print "Woof!".'
    },
    quickQuiz: {
      question: 'Which keyword is used in Java to inherit a class?',
      options: ['inherits', 'implements', 'extends', 'super'],
      correctIndex: 2,
      explanation: 'In Java, the `extends` keyword is used for class inheritance.'
    },
    xp: 45
  }
];

export const ALL_CURRICULA = {
  python: CURRICULUM_PYTHON,
  c: CURRICULUM_C,
  java: CURRICULUM_JAVA
};
