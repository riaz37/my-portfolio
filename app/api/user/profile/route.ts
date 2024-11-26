import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongodb";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "You must be logged in to update your profile",
        }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, image } = body;

    if (!name || !email) {
      return new NextResponse(
        JSON.stringify({
          error: "Bad Request",
          message: "Name and email are required",
        }),
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.collection("users").findOne({
        email,
        _id: { $ne: session.user.id },
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({
            error: "Conflict",
            message: "Email is already taken",
          }),
          { status: 409 }
        );
      }
    }

    // Update user profile
    const updateData: any = {
      name,
      email,
      updatedAt: new Date(),
    };

    if (image) {
      updateData.image = image;
    }

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Failed to update profile",
      }),
      { status: 500 }
    );
  }
}
