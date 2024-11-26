import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { avatar } = await request.json();
    if (!avatar) {
      return new NextResponse("Avatar URL is required", { status: 400 });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { image: avatar },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating avatar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
