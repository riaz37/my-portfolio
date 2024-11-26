import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Testimonial from '@/lib/db/models/Testimonial';
import { getServerSession } from 'next-auth';

// GET all testimonials
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');

    let filter = {};
    if (featured !== null) {
      filter = { featured: featured === 'true' };
    }

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST new testimonial
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();

    // Get the highest order number and add 1
    const highestOrder = await Testimonial.findOne().sort('-order');
    const newOrder = (highestOrder?.order || 0) + 1;

    const testimonial = await Testimonial.create({ ...data, order: newOrder });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

// PUT update testimonial
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();
    const { id, ...updateData } = data;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Reorder remaining testimonials
    await Testimonial.updateMany(
      { order: { $gt: testimonial.order } },
      { $inc: { order: -1 } }
    );

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

// PATCH update testimonial order
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await req.json();
    const { id, newOrder } = data;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const oldOrder = testimonial.order;

    // Update orders of testimonials in between old and new positions
    if (newOrder > oldOrder) {
      await Testimonial.updateMany(
        { order: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { order: -1 } }
      );
    } else {
      await Testimonial.updateMany(
        { order: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }

    // Update the order of the target testimonial
    testimonial.order = newOrder;
    await testimonial.save();

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update testimonial order' },
      { status: 500 }
    );
  }
}
