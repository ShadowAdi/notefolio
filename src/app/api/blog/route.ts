import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { BlogDownvote } from "@/schemas/BlogDownvote";
import { BlogUpvote } from "@/schemas/BlogUpvote";
import { tagTable } from "@/schemas/Tag";
import { User } from "@/schemas/User";
import { verifyUser } from "@/services/VerifyUser";
import { eq, getTableColumns, ilike, or, SQL, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const safeUser = await verifyUser(request);
  if (safeUser instanceof Response) {
    return safeUser;
  }
  const body = await request.json();
  const {
    blogTitle,
    blogDescription,
    blogCover,
    tags,
    status: statusBody,
  } = body;
  if (!blogTitle || !blogDescription || !blogCover) {
    return new Response(JSON.stringify({ success: false,message:`Necessary Details are not provided` }), {
      status: 400,
    });
  }
  let status:"published"|"draft";
  if (statusBody) {
    status = "published";
  } else {
    status = "draft";
  }
  if (!safeUser.id) {
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      statusText: `User not authenticated`,
    });
  }
  try {
    const blogId = uuidv4();
    const newBlog = await db
      .insert(BlogSchema)
      .values({
        id: blogId,
        blogTitle,
        blogDescription,
        blogCover,
        authorId: safeUser.id,
        createdAt: new Date(),
        status:status
      })
      .returning();
    if (tags && tags.length > 0) {
      const tagValues = tags.map(
        (blogTag: { blogId: string; tag: string }) => ({
          blogId,
          tag: blogTag,
        })
      );
      await db.insert(tagTable).values(tagValues);
    }
    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to Create Blog " + error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search")?.trim() || "";
    const tags = searchParams.get("tags")?.trim() || "";
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const offset = (page - 1) * limit;
    let whereCondition: SQL<boolean> = sql`TRUE`;
    if (search || tagsArray.length > 0) {
      const conditions: SQL<boolean>[] = [];

      if (search) {
        conditions.push(
          ilike(BlogSchema.blogTitle, `%${search}%`) as SQL<boolean>
        );
      }

      if (tagsArray.length > 0) {
        conditions.push(
          sql`
      EXISTS(
        SELECT 1
        FROM ${tagTable}
        WHERE ${tagTable.blogId} = ${BlogSchema.id}
        AND ${tagTable.tag} IN (${sql.join(tagsArray, sql`, `)})
      )
    ` as SQL<boolean>
        );
      }

      whereCondition = or(...conditions) as SQL<boolean>;
    }
    const blogs = await db
      .select({
        ...getTableColumns(BlogSchema),
        tags: sql<
          string[]
        >`coalesce(array_agg(${tagTable.tag}),'{}'::text[])`.as("tags"),
        username: User.username,
        profileUrl: User.profileUrl,
      })
      .from(BlogSchema)
      .leftJoin(tagTable, eq(BlogSchema.id, tagTable.blogId))
      .leftJoin(User, eq(BlogSchema.authorId, User.id))
      .groupBy(BlogSchema.id, User.id)
      .where(whereCondition || sql`TRUE`)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(BlogSchema)
      .where(whereCondition || sql`TRUE`);

    const blogUpvotes = await db
      .select({
        blogId: BlogUpvote.blogId,
        count: sql<number>`COUNT(*)`,
      })
      .from(BlogUpvote)
      .groupBy(BlogUpvote.blogId);

    const BlogDownvotes = await db
      .select({ blogId: BlogDownvote.blogId, count: sql<number>`COUNT(*)` })
      .from(BlogDownvote)
      .groupBy(BlogDownvote.blogId);

    const blogWithVotes = blogs.map((b) => {
      const ups = blogUpvotes.find((u) => u.blogId === b.id)?.count || 0;
      const downs = BlogDownvotes.find((d) => d.blogId === b.id)?.count || 0;
      return { ...b, upvotes: ups, downvotes: downs };
    });

    return new Response(
      JSON.stringify({
        data: blogWithVotes,
        pagination: {
          total: Number(count),
          limit,
          page,
          totalPages: Math.ceil(Number(count) / limit),
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Failed to get all blogs `, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: `Internal Server Error ${error}`,
      }),
      {
        status: 500,
      }
    );
  }
}
