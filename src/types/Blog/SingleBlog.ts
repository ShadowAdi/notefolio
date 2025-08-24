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
  count: number;
}
export interface SingleBlogUpvotesResponseInterface {
  count: number;
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
  blogDownvote: SingleBlogDownvotesResponseInterface;
  blogUpvote: SingleBlogUpvotesResponseInterface;
  user: SingleBlogUserResponseInterface;
  blogTagsFound: string[];
  discussions: SingleBlogUserDiscussionsResponseInterface;
  success: boolean;
  error: any;
}
