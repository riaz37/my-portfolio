import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Game } from '@/models/Game';
import { Achievement } from '@/models/Achievement';

const DEFAULT_GAMES = [
  {
    title: "HTML Puzzle",
    description: "Test your HTML knowledge by solving interactive puzzles",
    category: "Web Development",
    difficulty: "easy",
    imageUrl: "/games/html-puzzle.png",
    instructions: [
      "Arrange HTML elements in the correct order",
      "Match tags with their appropriate attributes",
      "Complete the missing parts of HTML structure"
    ],
    hints: [
      "Start with basic HTML structure",
      "Consider semantic meaning",
      "Check tag nesting"
    ],
    points: 100,
    solution: `<!DOCTYPE html>
<html>
<head>
  <title>Sample Solution</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>Article Title</h2>
      <p>Content here...</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2024</p>
  </footer>
</body>
</html>`,
    testCases: [
      {
        input: "document structure",
        expectedOutput: "<!DOCTYPE html>",
        description: "Check DOCTYPE declaration"
      }
    ]
  },
  {
    title: "CSS Challenge",
    description: "Master CSS styling through interactive challenges",
    category: "Web Development",
    difficulty: "medium",
    imageUrl: "/games/css-challenge.png",
    instructions: [
      "Write CSS to match the target design",
      "Use appropriate selectors and properties",
      "Optimize your CSS code"
    ],
    hints: [
      "Consider using flexbox",
      "Check responsive breakpoints",
      "Use CSS variables for colors"
    ],
    points: 150,
    solution: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`,
    testCases: [
      {
        input: "flex container",
        expectedOutput: "display: flex",
        description: "Check flexbox usage"
      }
    ]
  },
  {
    title: "JavaScript Arena",
    description: "Practice JavaScript by solving coding challenges",
    category: "Programming",
    difficulty: "hard",
    imageUrl: "/games/js-arena.png",
    instructions: [
      "Solve algorithmic challenges",
      "Implement JavaScript functions",
      "Optimize code performance"
    ],
    hints: [
      "Use array methods",
      "Consider recursion",
      "Check for edge cases"
    ],
    points: 200,
    solution: `function findMax(arr) {
  return Math.max(...arr);
}`,
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        expectedOutput: 5,
        description: "Find maximum in array"
      },
      {
        input: [-1, -5, -2],
        expectedOutput: -1,
        description: "Find maximum in negative numbers"
      }
    ]
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

    await connectToDatabase();

    // Initialize games if they don't exist
    const existingGames = await Game.countDocuments();
    if (existingGames === 0) {
      await Game.insertMany(DEFAULT_GAMES);
    }

    // Get all games
    const games = await Game.find().sort({ difficulty: 1, points: 1 });
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

    await connectToDatabase();

    // Initialize default games
    await Game.deleteMany({});
    const games = await Game.insertMany(DEFAULT_GAMES);

    // Initialize default achievements
    await Achievement.deleteMany({});

    return NextResponse.json({
      message: 'Games initialized successfully',
      gamesCount: games.length
    });
  } catch (error) {
    console.error('Failed to initialize games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
