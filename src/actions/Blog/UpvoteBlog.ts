import axios from "axios";

export const UpvoteBlogAction = async (id: string, token: string) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/blog/${id}/upvote`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.data;
    return result
  } catch (error) {
    console.error(`Failed to upvote Blog: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};
