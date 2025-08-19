import axios from "axios";

export const DeleteBlog = async (id: string, token: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/blog/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    if (data.success) {
      return { message: data.message, success: data.success };
    } else {
      return { error: data.error, success: data.success };
    }
  } catch (error) {
    console.error(`Failed to delete Blog: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};
