import React, { useEffect, useRef, useState } from "react";
import CustomModal from "./CustomModal";
import {
  createMarkerOnServer,
  deleteComment,
  fetchAllUsers,
  saveComment,
  saveImageFromBase64,
} from "./axios";

const CommentImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarkerID, setSelectedMarkerID] = useState(null);
  const [hoveredMarkerID, setHoveredMarkerID] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(null);

  const [markerComments, setMarkerComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [imageId, setImageId] = useState(null);

  useEffect(() => {
    const findAllUsers = async () => {
      const users = await fetchAllUsers();
      setLoggedInUser(users[0]);
      setUsers(users);
    };
    findAllUsers();
  }, []);

  const generateUniqueID = () => {
    // You can use a library like UUID or generate your own unique IDs.
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.focus();
      }, 0);
    }
  }, [selectedMarkerID]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        const res = await saveImageFromBase64(base64Image);
        setImageId(res.id);
        console.log("save image", res);
      };
      reader.readAsDataURL(file);

      const imageUrl = URL.createObjectURL(file);
      setImageURL(imageUrl);
      setIsModalOpen(true);
    }
  };

  const handleImageClick = async (e) => {
    setMarkerClicked(null);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left + 17;
    const y = e.clientY - rect.top + 17;
    const marker = { x, y, id: generateUniqueID() };

    console.log(markers.length, "length");
    const newMarker = await createMarkerOnServer(marker.id, imageId, x, y);
    console.log("New marker created:", newMarker);

    setNewComment("");

    setMarkers([...markers, marker]);
    setSelectedMarkerID(marker.id);
  };

  const handleRemoveMarker = async (id) => {
    if (
      !markerComments.some((item) => item.markerId === id) &&
      !markerComments.some((item) => item.markerId === selectedMarkerID)
    ) {
      const data = await deleteComment(id);
      const updatedMarkers = markers.filter((marker) => marker.id !== id);
      setMarkers(updatedMarkers);
      console.log(data, "deklte");
    }
    setSelectedMarkerID(null);
    setMarkerClicked(null);
    return;
  };

  const handleCommentEnter = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSaveCommentAndClose();
    }
  };

  const handleSaveCommentAndClose = async (id) => {
    if (selectedMarkerID !== null) {
      console.log(loggedInUser.id);
      const rest = await saveComment(
        loggedInUser.id,
        selectedMarkerID,
        newComment
      );
      console.log("Comment saved:", rest);

      const author = loggedInUser.firstName + " " + loggedInUser.lastName;
      const timestamp = new Date();
      setMarkerComments([
        ...markerComments,
        {
          comment: newComment,
          author,
          timestamp,
          markerId: selectedMarkerID,
        },
      ]);
      setNewComment("");
    } else if (id !== null) {
      const rest = await saveComment(loggedInUser.id, id, newComment);
      console.log("Comment saved:", rest);

      const author = loggedInUser.firstName + " " + loggedInUser.lastName;
      const timestamp = new Date();

      setMarkerComments([
        ...markerComments,
        {
          comment: newComment,
          author,
          timestamp,
          markerId: id,
        },
      ]);
      setNewComment("");
    }
  };

  const handleMarkerClick = (id) => {
    setMarkerClicked(id);
  };

  return (
    <div className="m-auto max-w-[300px]">
      <h1 className="text-blue-400 mb-2 text-lg">
        Logged In User: {loggedInUser.firstName + " " + loggedInUser.lastName}
      </h1>
      Select users
      <div className="flex gap-2 mb-2">
        {users.map((user) => (
          <div className="border p-4">
            <input
              type="radio"
              name="users"
              checked={loggedInUser.id === user.id}
              onChange={() => setLoggedInUser(user)}
            />
            <label htmlFor="">
              {user.firstName} {user.lastName}
            </label>
             
          </div>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setMarkerComments([]);
          setMarkers([]);
          fileInputRef.current.value = "";
        }}
      >
        <div className="">
          <img
            src={imageURL}
            alt="Uploaded"
            className="w-full"
            onClick={handleImageClick}
          />
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute w-4 h-4 bg-red-500 cursor-pointer shadow-lg"
              style={{
                borderRadius: "20px 20px 0px 20px",
                left: `${marker.x}px`,
                top: `${marker.y}px`,
              }}
              onMouseEnter={() => setHoveredMarkerID(marker.id)}
              onMouseLeave={() => setHoveredMarkerID(null)}
              onClick={() => handleMarkerClick(marker.id)}
            />
          ))}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`absolute left-[${marker.x + 15}px] top-[${
                marker.y + 20
              }px] `}
              style={{
                left: `${marker.x + 15}px`,
                top: `${marker.y + 20}px`,
              }}
            >
              <div>
                {markerClicked === marker.id ? (
                  <div className="bg-white p-2 border rounded shadow-md">
                    <div
                      className="w-100 flex justify-center rounded-full bg-gray-200 text-gray-800 text-lg cursor-pointer"
                      onClick={() => handleRemoveMarker(markerClicked)}
                    >
                      {" "}
                      &#10005;
                    </div>
                    {markerComments.map((data, index) =>
                      data.markerId === markerClicked ? (
                        <div key={index} className="border p-2">
                          <div className="text-black">{data.comment}</div>
                          <div className="text-gray-500 text-sm">
                            {data.author} - {data.timestamp.toLocaleString()}
                          </div>
                        </div>
                      ) : null
                    )}
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <button
                      className="flex border rounded px-2"
                      onClick={() => {
                        handleSaveCommentAndClose(marker.id);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  hoveredMarkerID === marker.id && (
                    <div className="text-sm  bg-white p-2 border rounded shadow-md">
                      {markerComments.map((data, index) =>
                        data.markerId === hoveredMarkerID ? (
                          <div key={index}>
                            <div className="text-black">{data.comment}</div>
                            <div className="text-gray-500">
                              {data.author} - {data.timestamp.toLocaleString()}
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          {selectedMarkerID !== null && (
            <div
              className="text-area-opened absolute bg-white p-4 rounded shadow-md"
              style={{
                left: `${
                  markers.find((marker) => marker.id === selectedMarkerID)?.x +
                  15
                }px`,
                top: `${
                  markers.find((marker) => marker.id === selectedMarkerID)?.y +
                  18
                }px`,
              }}
            >
              <button
                onClick={() => handleRemoveMarker(selectedMarkerID)}
                className="absolute top-0 right-0"
              >
                &#10005;
              </button>
              <div>
                {markerComments.map((data, index) =>
                  data.markerId === selectedMarkerID ? (
                    <div key={index}>
                      <div className="text-black">{data.comment}</div>
                      <div className="text-gray-500">
                        {data.author} - {data.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
              <textarea
                ref={textAreaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="p-2 border rounded"
                onKeyDown={handleCommentEnter}
              />
              <button
                className="flex border rounded px-2"
                onClick={() => handleSaveCommentAndClose(selectedMarkerID)}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default CommentImage;
