// import { NextRequest, NextResponse } from "next/server";
// import { getBlog } from "../../../../../libs/api/blog";

import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Blog from "../../../../../models/blog";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectMongoDB();
    const blog = await Blog.findOne({ slug: params.slug });
    return NextResponse.json({ blog });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      error: e.toString(),
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {}
