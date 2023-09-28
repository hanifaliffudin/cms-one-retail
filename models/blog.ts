import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

export type BlogDocument = mongoose.Document & {
  imageBlog: string;
  category: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
};

const BlogSchema = new Schema<BlogDocument>(
  {
    imageBlog: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

BlogSchema.pre("save", function save(next) {
  const blog = this as BlogDocument;

  blog.slug = slugify(this.title, {
    replacement: "-",
    lower: true,
    strict: false,
  });
  next();
});

const Blog =
  mongoose.models.Blog || mongoose.model<BlogDocument>("Blog", BlogSchema);

export default Blog;
