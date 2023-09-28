import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Blog from "../../../../../models/blog";
import { writeFile } from "fs/promises";
const fs = require("fs");
const dir = "./public/blog";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectMongoDB();
    const blog = await Blog.findOne({ slug: params.slug });
    return NextResponse.json({ blog, status: 200 });
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
) {
  try {
    await connectMongoDB();

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const data = await request.formData();

    const file: File | null = data.get("file") as unknown as File;
    const category = data.get("category");
    const title = data.get("title");
    const content = data.get("content");
    let tags = data.get("tags");
    const arrTags = tags !== null ? JSON.parse(tags.toString()) : null;

    const blog = await Blog.findOne({ slug: params.slug });

    if (!file) {
      await blog.updateOne({
        $set: {
          category: category,
          title: title,
          content: content,
          tags: arrTags,
        },
      });
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = getRandomFileName();
      const lastDot = file.name.lastIndexOf(".");
      const ext = file.name.substring(lastDot + 1);
      const path = `./public/blog/${fileName}.${ext}`;
      await writeFile(path, buffer);
      fs.unlinkSync(dir + "/" + blog.imageBlog);

      await blog.updateOne({
        $set: {
          imageBlog: fileName + "." + ext,
          category: category,
          title: title,
          content: content,
          tags: arrTags,
        },
      });
    }

    return NextResponse.json({ message: "Success", status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      error: e.toString(),
      status: 500,
    });
  }
}

function getRandomFileName() {
  var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  var random = ("" + Math.random()).substring(2, 8);
  var random_number = timestamp + random;
  return random_number;
}
