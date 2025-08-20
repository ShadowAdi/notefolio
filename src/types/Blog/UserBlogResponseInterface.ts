export interface UserBlogResponseInterface {
  id: string;
  title: string;
  description: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
  upvotes: string;
  downvotes: string;
  tags: string[];
  authorId: string;
}
