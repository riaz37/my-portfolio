const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const challenges = [
  {
    title: "Array Reversal",
    category: "Data Structures",
    language: "javascript",
    difficulty: "Beginner",
    description: "Create a function that reverses an array without using the built-in reverse() method.",
    steps: [
      {
        title: "Understanding the Problem",
        content: "We need to reverse an array by swapping elements from the start with elements from the end."
      },
      {
        title: "Algorithm Steps",
        content: "1. Create two pointers: one at start and one at end\n2. Swap elements at these positions\n3. Move start pointer forward and end pointer backward\n4. Repeat until pointers meet"
      }
    ],
    hints: [
      "Think about using a temporary variable for swapping",
      "Consider what happens when the array length is odd"
    ],
    code: "function reverseArray(arr) {\n  // Your code here\n}",
    solution: "function reverseArray(arr) {\n  let start = 0;\n  let end = arr.length - 1;\n  \n  while (start < end) {\n    // Swap elements\n    let temp = arr[start];\n    arr[start] = arr[end];\n    arr[end] = temp;\n    \n    start++;\n    end--;\n  }\n  \n  return arr;\n}"
  },
  {
    title: "Binary Search Implementation",
    category: "Algorithms",
    language: "python",
    difficulty: "Intermediate",
    description: "Implement binary search algorithm to find an element in a sorted array.",
    steps: [
      {
        title: "Understanding Binary Search",
        content: "Binary search is a divide-and-conquer algorithm that finds an element in a sorted array by repeatedly dividing the search space in half."
      },
      {
        title: "Implementation Steps",
        content: "1. Find the middle element\n2. If target equals middle element, return index\n3. If target is less, search left half\n4. If target is more, search right half\n5. Repeat until element is found or search space is empty"
      }
    ],
    hints: [
      "Remember that binary search only works on sorted arrays",
      "Be careful with the middle index calculation to avoid integer overflow"
    ],
    code: "def binary_search(arr, target):\n    # Your code here\n    pass",
    solution: "def binary_search(arr, target):\n    left = 0\n    right = len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1"
  },
  {
    title: "Palindrome Checker",
    category: "Strings",
    language: "javascript",
    difficulty: "Beginner",
    description: "Write a function that checks if a given string is a palindrome, considering only alphanumeric characters and ignoring case.",
    steps: [
      {
        title: "String Preparation",
        content: "First, clean the string by removing non-alphanumeric characters and converting to lowercase."
      },
      {
        title: "Comparison Logic",
        content: "Compare characters from start and end, moving inward until they meet in the middle."
      }
    ],
    hints: [
      "Use regular expressions to remove non-alphanumeric characters",
      "Consider using two pointers technique"
    ],
    code: "function isPalindrome(str) {\n  // Your code here\n}",
    solution: "function isPalindrome(str) {\n  // Clean the string\n  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  \n  // Check if palindrome\n  let left = 0;\n  let right = str.length - 1;\n  \n  while (left < right) {\n    if (str[left] !== str[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  \n  return true;\n}"
  },
  {
    title: "Merge Sort Implementation",
    category: "Algorithms",
    language: "python",
    difficulty: "Advanced",
    description: "Implement the merge sort algorithm to sort an array in ascending order.",
    steps: [
      {
        title: "Understanding Merge Sort",
        content: "Merge sort is a divide-and-conquer algorithm that recursively divides the array into smaller subarrays, sorts them, and then merges them back together."
      },
      {
        title: "Implementation Steps",
        content: "1. Divide the array into two halves\n2. Recursively sort both halves\n3. Merge the sorted halves\n4. Continue until the entire array is sorted"
      }
    ],
    hints: [
      "Think about the base case for recursion",
      "The merge function is key to the algorithm's success"
    ],
    code: "def merge_sort(arr):\n    # Your code here\n    pass",
    solution: "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    \n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    \n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result"
  },
  {
    title: "Fibonacci Generator",
    category: "Recursion",
    language: "javascript",
    difficulty: "Intermediate",
    description: "Create a function that generates the nth number in the Fibonacci sequence using different approaches (recursive, iterative, and memoization).",
    steps: [
      {
        title: "Understanding Fibonacci",
        content: "Each number is the sum of the two preceding ones, starting from 0 and 1."
      },
      {
        title: "Implementation Approaches",
        content: "1. Implement recursive solution\n2. Implement iterative solution\n3. Implement memoized solution\n4. Compare performance"
      }
    ],
    hints: [
      "Consider the time complexity of each approach",
      "Think about how to optimize the recursive solution"
    ],
    code: "function fibonacci(n) {\n  // Your code here\n}",
    solution: "// Recursive with memoization\nfunction fibonacci(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  \n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n}\n\n// Iterative solution\nfunction fibonacciIterative(n) {\n  if (n <= 1) return n;\n  \n  let prev = 0;\n  let curr = 1;\n  \n  for (let i = 2; i <= n; i++) {\n    const next = prev + curr;\n    prev = curr;\n    curr = next;\n  }\n  \n  return curr;\n}"
  },
  {
    title: "Tree Traversal",
    category: "Data Structures",
    language: "python",
    difficulty: "Advanced",
    description: "Implement different tree traversal methods (inorder, preorder, postorder) for a binary tree.",
    steps: [
      {
        title: "Understanding Tree Traversals",
        content: "Learn the different orders of visiting nodes: inorder (left-root-right), preorder (root-left-right), and postorder (left-right-root)."
      },
      {
        title: "Implementation Steps",
        content: "1. Create a Node class\n2. Implement recursive traversal methods\n3. Implement iterative traversal methods\n4. Add example usage"
      }
    ],
    hints: [
      "Think about using a stack for iterative solutions",
      "Remember the order of operations for each traversal type"
    ],
    code: "class Node:\n    def __init__(self, val=0):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef inorder_traversal(root):\n    # Your code here\n    pass",
    solution: "class Node:\n    def __init__(self, val=0):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef inorder_traversal(root):\n    result = []\n    if root:\n        result.extend(inorder_traversal(root.left))\n        result.append(root.val)\n        result.extend(inorder_traversal(root.right))\n    return result\n\ndef preorder_traversal(root):\n    result = []\n    if root:\n        result.append(root.val)\n        result.extend(preorder_traversal(root.left))\n        result.extend(preorder_traversal(root.right))\n    return result\n\ndef postorder_traversal(root):\n    result = []\n    if root:\n        result.extend(postorder_traversal(root.left))\n        result.extend(postorder_traversal(root.right))\n        result.append(root.val)\n    return result"
  }
];

async function seedChallenges() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('challenges');

    // Clear existing challenges
    await collection.deleteMany({});

    // Insert new challenges
    const result = await collection.insertMany(challenges);
    console.log(`Successfully seeded ${result.insertedCount} challenges`);

  } catch (error) {
    console.error('Error seeding challenges:', error);
  } finally {
    await client.close();
  }
}

seedChallenges();
