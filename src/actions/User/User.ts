import { FollowersInterface } from "@/types/Blog/Followers";
import { FollowingsInterface } from "@/types/Blog/Followings";
import { UserBlogResponseInterface } from "@/types/Blog/UserBlogResponseInterface";
import { UserProfileInterface } from "@/types/user/UserInterface";
import axios from "axios";

export type GetUserResponse =
  | {
      success: true;
      blogs?: UserBlogResponseInterface[];
      user?: UserProfileInterface;
      followersCount: number;
      followingsCount: number;
      followings?: FollowingsInterface[];
      followers?: FollowersInterface[];
    }
  | {
      success: false;
      error: unknown;
    };

export const GetUserAction = async (
  token: string
): Promise<GetUserResponse> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    console.error(`Failed to get user profile: ${error}`);
    return {
      error,
      success: false,
    };
  }
};

export const FollowAction = async (otherUserId: string, token: string) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/user/follow/${otherUserId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(`Failed to follow user: ${error}`);
    return {
      error,
      success: false,
    };
  }
};

export const UnFollowAction = async (otherUserId: string, token: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/user/unfollow/${otherUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(`Failed to unfollow user: ${error}`);
    return {
      error,
      success: false,
    };
  }
};
