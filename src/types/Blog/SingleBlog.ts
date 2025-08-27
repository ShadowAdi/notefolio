export interface SingleBlogUserFollowersResponseInterface {
  id: string;
}

export interface SingleBlogResponseInterface {
  authorId: string;
  blogCover?: string;
  blogDescription: string;
  blogTitle: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  followers: SingleBlogUserFollowersResponseInterface[];
}
export interface SingleBlogDownvotesResponseInterface {
  id: string;
  blogId: string;
  userId: string;
}
export interface SingleBlogUpvotesResponseInterface {
  id: string;
  blogId: string;
  userId: string;
}
export interface SingleBlogUserResponseInterface {
  id: string;
  profileUrl: string;
  email: string;
  username: string;
  followers: string[];
}

export interface SingleBlogUserDiscussionsResponseInterface {
  description: string;
  blogId: string;
  id: string;
  userId: string;
  createdAt: string;
}

export interface SingleBlogResponseCombinedInterface {
  blogFound: SingleBlogResponseInterface;
  blogDownvotes: SingleBlogDownvotesResponseInterface[];
  blogUpvotes: SingleBlogUpvotesResponseInterface[];
  user: SingleBlogUserResponseInterface;
  blogTagsFound: string[];
  discussionsCount: number;
  success: boolean;
  error: any;
}
