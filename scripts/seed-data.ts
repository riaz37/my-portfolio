import { connectToDatabase } from '@/lib/db/mongodb';

async function seedData() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();

    // Seed analytics
    console.log('Seeding analytics...');
    await db.collection('analytics').updateOne(
      { _id: 'global' },
      {
        $set: {
          views: 100,
          likes: 50,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Seed sample blog post
    console.log('Seeding blog posts...');
    await db.collection('posts').insertOne({
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: 'Sample blog post content...',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed sample project
    console.log('Seeding projects...');
    await db.collection('projects').insertOne({
      title: 'Portfolio Website',
      description: 'A personal portfolio website built with Next.js',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed sample testimonial
    console.log('Seeding testimonials...');
    await db.collection('testimonials').insertOne({
      author: 'John Doe',
      role: 'Software Engineer',
      content: 'Great work on the project!',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed sample game
    console.log('Seeding playground games...');
    await db.collection('playground').insertOne({
      title: 'Sample Game',
      description: 'A fun interactive game',
      category: 'Puzzle',
      difficulty: 'Medium',
      instructions: ['Step 1: Start game', 'Step 2: Solve puzzle'],
      controls: [
        { key: 'Arrow Keys', action: 'Move' },
        { key: 'Space', action: 'Jump' }
      ],
      features: ['Multiple levels', 'High scores'],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedData();
