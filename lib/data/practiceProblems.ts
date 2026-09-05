export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCodes: {
    python: string;
    javascript: string;
    c: string;
    java: string;
  };
  solutionCodes: {
    python: string;
    javascript: string;
    c: string;
    java: string;
  };
  testCases: TestCase[];
  hints: string[];
  solutionExplanation: string;
  xpReward: number;
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  // EASY PROBLEMS
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'easy',
    category: 'Strings',
    description: 'Given a string `s`, write a function that returns the reversed string.',
    constraints: ['1 <= len(s) <= 10^4', 'String contains printable ASCII characters'],
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'Reversing letters in "hello" produces "olleh".' },
      { input: 'terminal', output: 'lanimret' }
    ],
    starterCodes: {
      python: `def reverse_string(s: str) -> str:
    # Write your solution here
    return ""

print(reverse_string("hello"))`,
      javascript: `function reverseString(s) {
    // Write your solution here
    return "";
}

console.log(reverseString("hello"));`,
      c: `#include <stdio.h>
#include <string.h>

void reverse_string(char *s) {
    // Reverse in-place
    int len = strlen(s);
    for (int i = 0; i < len / 2; i++) {
        char tmp = s[i];
        s[i] = s[len - 1 - i];
        s[len - 1 - i] = tmp;
    }
}

int main() {
    char str[] = "hello";
    reverse_string(str);
    printf("%s\\n", str);
    return 0;
}`,
      java: `public class Main {
    public static String reverseString(String s) {
        // Write your solution
        return new StringBuilder(s).reverse().toString();
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`
    },
    solutionCodes: {
      python: `def reverse_string(s: str) -> str:
    return s[::-1]

print(reverse_string("hello"))`,
      javascript: `function reverseString(s) {
    return s.split("").reverse().join("");
}

console.log(reverseString("hello"));`,
      c: `#include <stdio.h>
#include <string.h>

void reverse_string(char *s) {
    int len = strlen(s);
    for (int i = 0; i < len / 2; i++) {
        char tmp = s[i];
        s[i] = s[len - 1 - i];
        s[len - 1 - i] = tmp;
    }
}

int main() {
    char str[] = "hello";
    reverse_string(str);
    printf("%s\\n", str);
    return 0;
}`,
      java: `public class Main {
    public static String reverseString(String s) {
        return new StringBuilder(s).reverse().toString();
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '"hello"', expectedOutput: 'olleh' },
      { id: 'tc-2', input: '"python"', expectedOutput: 'nohtyp' },
      { id: 'tc-3', input: '"a"', expectedOutput: 'a', isSecret: true }
    ],
    hints: [
      'Hint 1: Think about slicing in Python or array two-pointer reversal.',
      'Hint 2: In Python, `s[::-1]` creates a reversed copy with a negative step.',
      'Hint 3: In JavaScript, splitting into characters, reversing array, and joining yields the result.'
    ],
    solutionExplanation: 'Using Python slicing `[::-1]` or two pointers swapping from both ends achieves optimal O(N) time complexity and O(N) space complexity.',
    xpReward: 30
  },
  {
    id: 'even-or-odd',
    title: 'Check Even or Odd',
    difficulty: 'easy',
    category: 'Math / Logic',
    description: 'Write a program that takes an integer `n` and returns "Even" if `n` is divisible by 2, or "Odd" otherwise.',
    constraints: ['-10^9 <= n <= 10^9'],
    examples: [
      { input: '4', output: 'Even' },
      { input: '7', output: 'Odd' }
    ],
    starterCodes: {
      python: `def check_even_odd(n: int) -> str:
    # Write your solution here
    pass

print(check_even_odd(4))`,
      javascript: `function checkEvenOdd(n) {
    // Write your solution here
    return n % 2 === 0 ? "Even" : "Odd";
}

console.log(checkEvenOdd(4));`,
      c: `#include <stdio.h>

const char* check_even_odd(int n) {
    return (n % 2 == 0) ? "Even" : "Odd";
}

int main() {
    printf("%s\\n", check_even_odd(4));
    return 0;
}`,
      java: `public class Main {
    public static String checkEvenOdd(int n) {
        return n % 2 == 0 ? "Even" : "Odd";
    }

    public static void main(String[] args) {
        System.out.println(checkEvenOdd(4));
    }
}`
    },
    solutionCodes: {
      python: `def check_even_odd(n: int) -> str:
    return "Even" if n % 2 == 0 else "Odd"

print(check_even_odd(4))`,
      javascript: `function checkEvenOdd(n) {
    return n % 2 === 0 ? "Even" : "Odd";
}

console.log(checkEvenOdd(4));`,
      c: `#include <stdio.h>

const char* check_even_odd(int n) {
    return (n % 2 == 0) ? "Even" : "Odd";
}

int main() {
    printf("%s\\n", check_even_odd(4));
    return 0;
}`,
      java: `public class Main {
    public static String checkEvenOdd(int n) {
        return n % 2 == 0 ? "Even" : "Odd";
    }

    public static void main(String[] args) {
        System.out.println(checkEvenOdd(4));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '4', expectedOutput: 'Even' },
      { id: 'tc-2', input: '7', expectedOutput: 'Odd' },
      { id: 'tc-3', input: '0', expectedOutput: 'Even', isSecret: true }
    ],
    hints: [
      'Hint 1: The modulo operator `%` calculates remainder of division.',
      'Hint 2: An even integer has 0 remainder when divided by 2 (`n % 2 == 0`).',
      'Hint 3: Return "Even" for True condition and "Odd" for False condition.'
    ],
    solutionExplanation: 'Modulo division by 2 checks the least significant bit in binary, running in O(1) constant time.',
    xpReward: 25
  },
  {
    id: 'find-largest-number',
    title: 'Find Largest Number',
    difficulty: 'easy',
    category: 'Arrays',
    description: 'Given an array or list of integers, find and return the maximum value without using built-in max().',
    constraints: ['1 <= len(arr) <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    examples: [
      { input: '[3, 7, 2, 9, 5]', output: '9' },
      { input: '[-10, -5, -20]', output: '-5' }
    ],
    starterCodes: {
      python: `def find_max(numbers: list[int]) -> int:
    # Do not use max()
    largest = numbers[0]
    for n in numbers:
        if n > largest:
            largest = n
    return largest

print(find_max([3, 7, 2, 9, 5]))`,
      javascript: `function findMax(numbers) {
    let largest = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > largest) {
            largest = numbers[i];
        }
    }
    return largest;
}

console.log(findMax([3, 7, 2, 9, 5]));`,
      c: `#include <stdio.h>

int find_max(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 5};
    printf("%d\\n", find_max(arr, 5));
    return 0;
}`,
      java: `public class Main {
    public static int findMax(int[] numbers) {
        int largest = numbers[0];
        for (int n : numbers) {
            if (n > largest) largest = n;
        }
        return largest;
    }

    public static void main(String[] args) {
        System.out.println(findMax(new int[]{3, 7, 2, 9, 5}));
    }
}`
    },
    solutionCodes: {
      python: `def find_max(numbers: list[int]) -> int:
    largest = numbers[0]
    for n in numbers:
        if n > largest:
            largest = n
    return largest

print(find_max([3, 7, 2, 9, 5]))`,
      javascript: `function findMax(numbers) {
    let largest = numbers[0];
    for (let n of numbers) {
        if (n > largest) largest = n;
    }
    return largest;
}

console.log(findMax([3, 7, 2, 9, 5]));`,
      c: `#include <stdio.h>

int find_max(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

int main() {
    int arr[] = {3, 7, 2, 9, 5};
    printf("%d\\n", find_max(arr, 5));
    return 0;
}`,
      java: `public class Main {
    public static int findMax(int[] numbers) {
        int largest = numbers[0];
        for (int n : numbers) {
            if (n > largest) largest = n;
        }
        return largest;
    }

    public static void main(String[] args) {
        System.out.println(findMax(new int[]{3, 7, 2, 9, 5}));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '[3, 7, 2, 9, 5]', expectedOutput: '9' },
      { id: 'tc-2', input: '[-10, -5, -20]', expectedOutput: '-5' },
      { id: 'tc-3', input: '[42]', expectedOutput: '42', isSecret: true }
    ],
    hints: [
      'Hint 1: Initialize `largest` with the first element `numbers[0]` (not 0, in case all numbers are negative).',
      'Hint 2: Iterate through the sequence and compare each item against `largest`.',
      'Hint 3: Update `largest = item` whenever a greater value is encountered.'
    ],
    solutionExplanation: 'Linear scanning takes O(N) time with O(1) space, examining each element exactly once.',
    xpReward: 30
  },

  // MEDIUM PROBLEMS
  {
    id: 'palindrome-checker',
    title: 'Palindrome Checker',
    difficulty: 'medium',
    category: 'Strings / Two Pointers',
    description: 'Determine if a given string `s` is a palindrome, considering only alphanumeric characters and ignoring cases.',
    constraints: ['1 <= len(s) <= 2 * 10^5'],
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'True', explanation: '"amanaplanacanalpanama" reads the same forward and backward.' },
      { input: '"race a car"', output: 'False' }
    ],
    starterCodes: {
      python: `def is_palindrome(s: str) -> bool:
    # Clean string and check palindrome
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))`,
      javascript: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <stdbool.h>

bool is_palindrome(const char *s) {
    int left = 0, right = strlen(s) - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    printf("%s\\n", is_palindrome("A man, a plan, a canal: Panama") ? "True" : "False");
    return 0;
}`,
      java: `public class Main {
    public static boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}`
    },
    solutionCodes: {
      python: `def is_palindrome(s: str) -> bool:
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))`,
      javascript: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <stdbool.h>

bool is_palindrome(const char *s) {
    int left = 0, right = strlen(s) - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    printf("%s\\n", is_palindrome("A man, a plan, a canal: Panama") ? "True" : "False");
    return 0;
}`,
      java: `public class Main {
    public static boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True' },
      { id: 'tc-2', input: '"race a car"', expectedOutput: 'False' },
      { id: 'tc-3', input: '" "', expectedOutput: 'True', isSecret: true }
    ],
    hints: [
      'Hint 1: First filter out punctuation and whitespace, then lowercase all characters.',
      'Hint 2: Compare the filtered string to its reverse.',
      'Hint 3: Alternatively use two pointers (left and right) moving inward.'
    ],
    solutionExplanation: 'Filtering alphanumeric characters followed by two-pointer or reverse comparison verifies palindromes in O(N) time.',
    xpReward: 50
  },
  {
    id: 'prime-checker',
    title: 'Prime Number Checker',
    difficulty: 'medium',
    category: 'Math & Algorithms',
    description: 'Write a function that determines if an integer `n` is a prime number (greater than 1 with no positive divisors other than 1 and itself).',
    constraints: ['1 <= n <= 10^9'],
    examples: [
      { input: '29', output: 'True', explanation: '29 is divisible only by 1 and 29.' },
      { input: '15', output: 'False', explanation: '15 is divisible by 3 and 5.' }
    ],
    starterCodes: {
      python: `import math

def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    for i in range(3, int(math.isqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

print(is_prime(29))`,
      javascript: `function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

console.log(isPrime(29));`,
      c: `#include <stdio.h>
#include <stdbool.h>
#include <math.h>

bool is_prime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;

    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    printf("%s\\n", is_prime(29) ? "True" : "False");
    return 0;
}`,
      java: `public class Main {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;

        for (int i = 3; i * i <= n; i += 2) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(29));
    }
}`
    },
    solutionCodes: {
      python: `import math

def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(math.isqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

print(is_prime(29))`,
      javascript: `function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

console.log(isPrime(29));`,
      c: `#include <stdio.h>
#include <stdbool.h>

bool is_prime(int n) {
    if (n <= 1) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    printf("%s\\n", is_prime(29) ? "True" : "False");
    return 0;
}`,
      java: `public class Main {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;
        for (int i = 3; i * i <= n; i += 2) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(29));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '29', expectedOutput: 'True' },
      { id: 'tc-2', input: '15', expectedOutput: 'False' },
      { id: 'tc-3', input: '1', expectedOutput: 'False', isSecret: true }
    ],
    hints: [
      'Hint 1: Numbers less than or equal to 1 are not prime.',
      'Hint 2: 2 is the only even prime number.',
      'Hint 3: You only need to test divisors up to `sqrt(n)` because any factor larger than `sqrt(n)` has a complementary factor smaller than `sqrt(n)`.'
    ],
    solutionExplanation: 'Checking odd divisors up to sqrt(N) achieves optimal O(sqrt(N)) time complexity.',
    xpReward: 50
  },

  // HARD PROBLEMS
  {
    id: 'binary-search',
    title: 'Binary Search Algorithm',
    difficulty: 'hard',
    category: 'Algorithms / Searching',
    description: 'Given a sorted array of distinct integers `nums` and a target integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1 in O(log N) runtime.',
    constraints: ['1 <= len(nums) <= 10^5', 'nums is sorted in ascending order'],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    starterCodes: {
      python: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

print(binary_search([-1,0,3,5,9,12], 9))`,
      javascript: `function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

console.log(binarySearch([-1,0,3,5,9,12], 9));`,
      c: `#include <stdio.h>

int binary_search(int nums[], int size, int target) {
    int left = 0, right = size - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int nums[] = {-1,0,3,5,9,12};
    printf("%d\\n", binary_search(nums, 6, 9));
    return 0;
}`,
      java: `public class Main {
    public static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(binarySearch(new int[]{-1,0,3,5,9,12}, 9));
    }
}`
    },
    solutionCodes: {
      python: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([-1,0,3,5,9,12], 9))`,
      javascript: `function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

console.log(binarySearch([-1,0,3,5,9,12], 9));`,
      c: `#include <stdio.h>

int binary_search(int nums[], int size, int target) {
    int left = 0, right = size - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int nums[] = {-1,0,3,5,9,12};
    printf("%d\\n", binary_search(nums, 6, 9));
    return 0;
}`,
      java: `public class Main {
    public static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(binarySearch(new int[]{-1,0,3,5,9,12}, 9));
    }
}`
    },
    testCases: [
      { id: 'tc-1', input: '[-1,0,3,5,9,12], target=9', expectedOutput: '4' },
      { id: 'tc-2', input: '[-1,0,3,5,9,12], target=2', expectedOutput: '-1' },
      { id: 'tc-3', input: '[5], target=5', expectedOutput: '0', isSecret: true }
    ],
    hints: [
      'Hint 1: Maintain two pointers `left` and `right` bounding the search space.',
      'Hint 2: Find the midpoint `mid = (left + right) // 2`. If `nums[mid] == target`, you found it!',
      'Hint 3: If `nums[mid] < target`, discard left half by setting `left = mid + 1`. Otherwise set `right = mid - 1`.'
    ],
    solutionExplanation: 'Binary search halves the search space each step, yielding logarithmic O(log N) time complexity with O(1) space.',
    xpReward: 75
  }
];
