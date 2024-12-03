import { NextResponse } from 'next/server';

import Testimonial from '@/lib/db/models/Testimonial';
import { getServerSession } from 'next-auth';
import {connectToDatabase} from '@/lib/db/mongodb';

// GET all testimonials
export async function GET(req: Request) {
  try {
    console.group('🔍 Testimonials API Debug');
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');

    console.log('🔎 Featured Filter:', featured);

    let filter = {};
    if (featured !== null) {
      filter = { featured: featured === 'true' };
    }

    console.log('📋 Query Filter:', filter);

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    
    console.log('📊 Total Testimonials Found:', testimonials.length);
    console.log('📝 Testimonials Details:', testimonials.map(test => ({
      id: test._id,
      name: test.name,
      featured: test.featured,
      order: test.order
    })));
    console.groupEnd();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('❌ Testimonials Fetch Error:', error);
    console.error('❌ Error Details:', error.stack);
    console.error('❌ Error Message:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials', details: error.message },
      { status: 500 }
    );
  }
}

// POST new testimonial
export async function POST(req: Request) {
  try {
    console.group('📝 Testimonials API Debug');
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const session = await getServerSession();
    if (!session) {
      console.error('❌ Unauthorized Access Attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await req.json();

    console.log('📝 New Testimonial Data:', data);

    // Get the highest order number and add 1
    const highestOrder = await Testimonial.findOne().sort('-order');
    const newOrder = (highestOrder?.order || 0) + 1;

    console.log('📈 New Testimonial Order:', newOrder);

    const testimonial = await Testimonial.create({ ...data, order: newOrder });
    console.log('📝 New Testimonial Created:', testimonial);
    console.groupEnd();

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('❌ Testimonials Creation Error:', error);
    console.error('❌ Error Details:', error.stack);
    console.error('❌ Error Message:', error.message);
    return NextResponse.json(
      { error: 'Failed to create testimonial', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update testimonial
export async function PUT(req: Request) {
  try {
    console.group('🔄 Testimonials API Debug');
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const session = await getServerSession();
    if (!session) {
      console.error('❌ Unauthorized Access Attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await req.json();
    const { id, ...updateData } = data;

    console.log('📝 Testimonial Update Data:', updateData);

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    if (!testimonial) {
      console.error('❌ Testimonial Not Found');
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    console.log('📝 Testimonial Updated:', testimonial);
    console.groupEnd();

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('❌ Testimonials Update Error:', error);
    console.error('❌ Error Details:', error.stack);
    console.error('❌ Error Message:', error.message);
    return NextResponse.json(
      { error: 'Failed to update testimonial', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(req: Request) {
  try {
    console.group('🚮 Testimonials API Debug');
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const session = await getServerSession();
    if (!session) {
      console.error('❌ Unauthorized Access Attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    console.log('📝 Testimonial ID to Delete:', id);

    if (!id) {
      console.error('❌ Testimonial ID is Required');
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      console.error('❌ Testimonial Not Found');
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    console.log('📝 Testimonial Deleted:', testimonial);

    // Reorder remaining testimonials
    await Testimonial.updateMany(
      { order: { $gt: testimonial.order } },
      { $inc: { order: -1 } }
    );

    console.log('📈 Testimonials Reordered');
    console.groupEnd();

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('❌ Testimonials Deletion Error:', error);
    console.error('❌ Error Details:', error.stack);
    console.error('❌ Error Message:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete testimonial', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH update testimonial order
export async function PATCH(req: Request) {
  try {
    console.group('🔄 Testimonials API Debug');
    console.log('🕒 Timestamp:', new Date().toISOString());
    
    const session = await getServerSession();
    if (!session) {
      console.error('❌ Unauthorized Access Attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await req.json();
    const { id, newOrder } = data;

    console.log('📝 Testimonial ID to Update:', id);
    console.log('📈 New Testimonial Order:', newOrder);

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      console.error('❌ Testimonial Not Found');
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const oldOrder = testimonial.order;

    console.log('📊 Old Testimonial Order:', oldOrder);

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

    console.log('📈 Testimonials Reordered');

    // Update the order of the target testimonial
    testimonial.order = newOrder;
    await testimonial.save();

    console.log('📝 Testimonial Order Updated:', testimonial);
    console.groupEnd();

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('❌ Testimonials Order Update Error:', error);
    console.error('❌ Error Details:', error.stack);
    console.error('❌ Error Message:', error.message);
    return NextResponse.json(
      { error: 'Failed to update testimonial order', details: error.message },
      { status: 500 }
    );
  }
}
