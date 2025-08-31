export interface AuthorSingleBlogInterface {
  authorId: string;
  id: string;
  upvotes: number;
  downvotes: number;
  blogTitle: string;
  blogCover: string;
}

export interface AuthorBlogInterface {
  authorBlogs: AuthorSingleBlogInterface[];
  success: boolean;
  error?: unknown;
}
