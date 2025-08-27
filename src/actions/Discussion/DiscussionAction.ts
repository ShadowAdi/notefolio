import axios from "axios";

export const CreateDiscussionAction = async (
  description: string,
  token: string,
  blogId: string
) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/discussions/${blogId}`,
      { description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    const { success, message, error, discussion } = data;
    if (success) {
      return {
        message,
        discussion,
        success: true,
      };
    } else {
      return {
        error,
        message,
        success: false,
      };
    }
  } catch (error) {
    console.error(`Failed to create discussion: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};

export const GetDiscussionAction = async (blogId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/discussions/${blogId}`
    );
    const data = await response.data;
    const { success, message, error, discussions } = data;
    if (success) {
      return {
        message,
        discussions,
        success: true,
      };
    } else {
      return {
        error,
        message,
        success: false,
      };
    }
  } catch (error) {
    console.error(`Failed to get discussion: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};

export const DeleteDiscussionAction = async (
  discussionId: string,
  token: string
) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/discussions/discussion/${discussionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    const { success, message, error } = data;
    if (success) {
      return {
        message,
        success: true,
      };
    } else {
      return {
        error,
        message,
        success: false,
      };
    }
  } catch (error) {
    console.error(`Failed to delete discussion: ${error}`);
    return {
      error: error,
      success: false,
    };
  }
};
