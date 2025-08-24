import axios from "axios";

export const DownvoteBlogAction = async (id: string, token: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/blog/${id}/downvote`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.error(`Failed to downvote Blog: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};
