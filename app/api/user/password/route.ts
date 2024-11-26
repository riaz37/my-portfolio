import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from '@/lib/db/mongodb';
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "You must be logged in to change your password",
        }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse(
        JSON.stringify({
          error: "Bad Request",
          message: "Current password and new password are required",
        }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get user from database
    const user = await db.collection("users").findOne({
      email: session.user.email,
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: "Not Found",
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Current password is incorrect",
        }),
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Failed to update password",
      }),
      { status: 500 }
    );
  }
}
