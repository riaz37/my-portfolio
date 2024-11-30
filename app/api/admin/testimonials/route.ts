import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/auth";
import Testimonial from "@/lib/db/models/Testimonial";
import { authOptions } from "@/lib/auth";
import { validateAdminAccess } from "@/lib/auth/admin";

// Testimonial validation schema
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  featured: z.boolean().optional().default(false),
  order: z.number().optional(),
  isDeleted: z.boolean().optional().default(false),
});

// GET all testimonials (admin view)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();

    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: -1,
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Unauthorized") ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST new testimonial
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    const data = await req.json();

    // Validate input using Zod
    const validatedData = testimonialSchema.parse({
      ...data,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the highest order number and add 1
    const highestOrder = await Testimonial.findOne().sort("-order");
    validatedData.order = (highestOrder?.order || 0) + 1;

    const testimonial = await Testimonial.create(validatedData);

    console.log(
      `Testimonial created by admin ${session.user.email}:`,
      testimonial._id
    );

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid testimonial data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Unauthorized") ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

// PUT update testimonial
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Validate input using Zod (excluding ID)
    const validatedData = testimonialSchema.partial().parse({
      ...updateData,
      updatedAt: new Date(),
      updatedBy: session.user.id,
    });

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log(
      `Testimonial updated by admin ${session.user.email}:`,
      testimonial._id
    );

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to update testimonial:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid testimonial update data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Unauthorized") ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE testimonial (soft delete)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Soft delete instead of hard delete
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: session.user.id,
      },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Reorder remaining testimonials
    await Testimonial.updateMany(
      { order: { $gt: testimonial.order }, isDeleted: false },
      { $inc: { order: -1 } }
    );

    return NextResponse.json({
      message: "Testimonial soft-deleted successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Unauthorized") ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

// PATCH update testimonial order
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    await validateAdminAccess(session);

    await connectToDatabase();
    const data = await req.json();
    const { id, newOrder } = data;

    if (!id || newOrder === undefined) {
      return NextResponse.json(
        { error: "Testimonial ID and new order are required" },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const oldOrder = testimonial.order;

    // Update orders of testimonials in between old and new positions
    if (newOrder > oldOrder) {
      await Testimonial.updateMany(
        { order: { $gt: oldOrder, $lte: newOrder }, isDeleted: false },
        { $inc: { order: -1 } }
      );
    } else {
      await Testimonial.updateMany(
        { order: { $gte: newOrder, $lt: oldOrder }, isDeleted: false },
        { $inc: { order: 1 } }
      );
    }

    // Update the order of the target testimonial
    testimonial.order = newOrder;
    await testimonial.save();

   

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to update testimonial order:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes("Unauthorized") ? 401 : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update testimonial order" },
      { status: 500 }
    );
  }
}
