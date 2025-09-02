export interface SingleBlogInterface {
  authorId: string;
  blogCover?: string;
  blogDescription: string;
  blogTitle: string;
  tags?: string[] | [];
  createdAt: string;
  updatedAt: string;
  id: string;
  username:string;
  profileUrl:string;
}
