import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db/mongodb';

const DEFAULT_GAMES = [
  {
    title: "HTML Puzzle",
    description: "Test your HTML knowledge by solving interactive puzzles",
    category: "Web Development",
    difficulty: "Beginner",
    imageUrl: "/games/html-puzzle.png",
    gameUrl: "/playground/html-puzzle",
    instructions: [
      "Arrange HTML elements in the correct order",
      "Match tags with their appropriate attributes",
      "Complete the missing parts of HTML structure"
    ],
    controls: [
      { key: "Drag and Drop", action: "Move elements" },
      { key: "Click", action: "Select element" }
    ],
    features: [
      "Interactive drag-and-drop interface",
      "Real-time validation",
      "Progressive difficulty"
    ],
    xp: 100,
    skills: ["HTML", "Web Structure", "Semantic HTML"],
  },
  {
    title: "CSS Challenge",
    description: "Master CSS styling through interactive challenges",
    category: "Web Development",
    difficulty: "Intermediate",
    imageUrl: "/games/css-challenge.png",
    gameUrl: "/playground/css-challenge",
    instructions: [
      "Write CSS to match the target design",
      "Use appropriate selectors and properties",
      "Optimize your CSS code"
    ],
    controls: [
      { key: "Type", action: "Write CSS" },
      { key: "Enter", action: "Submit solution" }
    ],
    features: [
      "Live preview",
      "Multiple difficulty levels",
      "Best practices validation"
    ],
    xp: 150,
    skills: ["CSS", "Layout", "Responsive Design"],
  },
  {
    title: "JavaScript Arena",
    description: "Practice JavaScript by solving coding challenges",
    category: "Programming",
    difficulty: "Advanced",
    imageUrl: "/games/js-arena.png",
    gameUrl: "/playground/js-arena",
    instructions: [
      "Solve algorithmic challenges",
      "Implement JavaScript functions",
      "Optimize code performance"
    ],
    controls: [
      { key: "Type", action: "Write code" },
      { key: "Ctrl + Enter", action: "Run code" }
    ],
    features: [
      "Built-in code editor",
      "Test cases",
      "Performance metrics"
    ],
    xp: 200,
    skills: ["JavaScript", "Algorithms", "Problem Solving"],
  }
];

const DEFAULT_ACHIEVEMENTS = [
  {
    title: "HTML Apprentice",
    description: "Complete your first HTML puzzle",
    imageUrl: "/achievements/html-apprentice.png",
    category: "Web Development",
    requirements: [{
      type: "games_completed",
      value: 1,
      gameCategory: "HTML"
    }]
  },
  {
    title: "CSS Stylist",
    description: "Successfully complete 3 CSS challenges",
    imageUrl: "/achievements/css-stylist.png",
    category: "Web Development",
    requirements: [{
      type: "games_completed",
      value: 3,
      gameCategory: "CSS"
    }]
  },
  {
    title: "JavaScript Ninja",
    description: "Achieve a perfect score in a JavaScript challenge",
    imageUrl: "/achievements/js-ninja.png",
    category: "Programming",
    requirements: [{
      type: "skill_level",
      value: 50,
      skillName: "JavaScript"
    }]
  },
  {
    title: "Code Master",
    description: "Earn 1000 XP across all games",
    imageUrl: "/achievements/code-master.png",
    category: "General",
    requirements: [{
      type: "xp_earned",
      value: 1000
    }]
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Initialize games if they don't exist
    const existingGames = await db.collection('games').countDocuments();
    if (existingGames === 0) {
      await db.collection('games').insertMany(DEFAULT_GAMES);
    }

    // Get all games
    const games = await db.collection('games').find().toArray();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectDB();

    // Initialize default games
    await db.collection('games').deleteMany({});
    await db.collection('games').insertMany(DEFAULT_GAMES);

    // Initialize default achievements
    await db.collection('achievements').deleteMany({});
    await db.collection('achievements').insertMany(DEFAULT_ACHIEVEMENTS);

    return NextResponse.json({
      message: 'Games and achievements initialized successfully',
      gamesCount: DEFAULT_GAMES.length,
      achievementsCount: DEFAULT_ACHIEVEMENTS.length
    });
  } catch (error) {
    console.error('Failed to initialize games and achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
