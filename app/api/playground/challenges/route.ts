import { NextResponse } from 'next/server';

const challenges = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: 'Easy',
    category: 'Arrays',
    hints: [
      'Try using a hash map to store previously seen numbers',
      'For each number, check if its complement (target - num) exists in the hash map',
      'Remember to store each number\'s index in the hash map'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`
    },
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: '[0,1]'
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: '[1,2]'
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: '[0,1]'
      }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
    difficulty: 'Easy',
    category: 'Strings',
    hints: [
      'Use a stack to keep track of opening brackets',
      'When encountering a closing bracket, check if it matches the last opening bracket',
      'The string is valid only if all brackets are matched and the stack is empty'
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}`,
      python: `def is_valid(s):
    # Write your solution here
    pass`
    },
    testCases: [
      {
        input: { s: "()" },
        output: 'true'
      },
      {
        input: { s: "()[]{}" },
        output: 'true'
      },
      {
        input: { s: "(]" },
        output: 'false'
      },
      {
        input: { s: "([)]" },
        output: 'false'
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(challenges);
}
