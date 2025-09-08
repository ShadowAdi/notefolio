import axios from "axios";
import { debounce } from "lodash";

type DraftResponse =
  | { success: true; message: string; blogId: string }
  | { success: false; error: string };

export const saveDraft = debounce(
  async (
    token: string,
    title?: string,
    description?: string
  ): Promise<DraftResponse> => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/blog/draft`,
        {
          blogTitle: title,
          blogDescription: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response ",response)
      const result = response.data; 
      console.log("result ", result);
      if (!result.success || !result?.blogId) {
        throw new Error(result.error || "Invalid response from server");
      }
      return {
        success: true,
        message: "Draft saved",
        blogId: result.blogId,
      };
    } catch (error: any) {
      console.error(`Failed to create draft Blog: ${error}`);
      const errorMessage = error.response?.data?.error || error.message || "Failed to save draft";
      return { success: false, error: errorMessage };
    }
  },
  1500 
);