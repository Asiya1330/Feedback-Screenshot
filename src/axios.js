import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your API's base URL
  headers: {
    "Content-Type": "application/json", // You can add more headers if needed
  },
});

export const createMarkerOnServer = async (
  id,
  imageId,
  xCoordinate,
  yCoordinate
) => {
  try {
    console.log(id, 'in acios')
    const response = await instance.post("/api/marker", {
      id,
      imageId,
      xCoordinate,
      yCoordinate,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating marker:", error);
    return error;
  }
};

export const saveComment = async (userId, markerId, comment) => {
  try {
    const response = await instance.post("/api/comment", {
      userId,
      markerId,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving comment:", error);
    throw error;
  }
};

// Function to save an image from base64 data
export const saveImageFromBase64 = async (base64ImageData) => {
  try {
    const response = await instance.post("/api/image", {
      url: base64ImageData, // Send the base64 image data to the server
    });
    return response.data;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await instance.delete(`/api/marker/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
};
