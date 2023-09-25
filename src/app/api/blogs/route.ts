import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Blog from "../../../../models/blog";

export async function GET() {
  await connectMongoDB();
  const blogs = await Blog.find();
  return NextResponse.json({ blogs });
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectMongoDB();
    const newBlog = new Blog(request.body);
    const savedBlog = await newBlog.save();
    return NextResponse.json({ savedBlog });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      error: e.toString(),
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {}
