import { db } from "@/db/db";
import { BlogSchema } from "@/schemas/Blog";
import { tagTable } from "@/schemas/Tag";
import { verifyUser } from "@/services/VerifyUser";
import { eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const safeUser = await verifyUser(request);
  if (safeUser instanceof Response) {
    return safeUser;
  }
  const body = await request.json();
  const { blogTitle, blogDescription, blogCover, tags } = body;
  if (!blogTitle || !blogDescription || !blogCover) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      statusText: `Necessary Details are not provided`,
    });
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

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? or(
          ilike(BlogSchema.blogTitle, `%${search}%`),
          sql`
      EXISTS(
        SELECT 1 FROM ${tagTable}
        WHERE ${tagTable.blogId}=${BlogSchema.id}
        AND ${tagTable.tag} ilike ${`%${search}%`}
      ) `
        )
      : undefined;

    const blogs = await db
      .select({
        ...getTableColumns(BlogSchema),
        tags: sql<
          string[]
        >`coalesce(array_agg(${tagTable.tag}),'{}'::text[])`.as("tags"),
      })
      .from(BlogSchema)
      .leftJoin(tagTable, eq(BlogSchema.id, tagTable.blogId))
      .groupBy(BlogSchema.id)
      .where(whereCondition || sql`TRUE`)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(BlogSchema)
      .where(whereCondition || sql`TRUE`);

    return new Response(
      JSON.stringify({
        data: blogs,
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
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      statusText: `Internal Server Error ${error}`,
    });
  }
}
