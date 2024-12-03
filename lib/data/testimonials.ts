import connectDB from '@/lib/db/mongodb';
import Testimonial from '@/lib/db/models/Testimonial';
import { cache } from 'react';

export const getFeaturedTestimonials = cache(async () => {
  try {
    await connectDB();
    
    const testimonials = await Testimonial.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Convert MongoDB documents to plain objects and ensure _id is a string
    return testimonials.map(testimonial => ({
      ...testimonial,
      _id: testimonial._id.toString()
    }));
  } catch (error) {
    console.error('Failed to fetch featured testimonials:', error);
    return [];
  }
});
