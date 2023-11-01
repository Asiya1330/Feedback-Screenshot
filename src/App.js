import React, { useEffect, useRef, useState } from "react";
import CustomModal from "./CustomModal";

const CommentImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(null);

  const [markerComments, setMarkerComments] = useState([]);
  const loggedInUser = {
    id: 1,
    first_name: "asiya",
    last_name: "batool",
    email: "asiya.batool987@gmail.com",
  };

  useEffect(() => {
    if (textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.focus();
      }, 0);
    }
  }, [selectedMarkerIndex]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageURL(imageUrl);
      setIsModalOpen(true);
    }
  };

  const handleImageClick = (e) => {
    setMarkerClicked(null);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left + 17;
    const y = e.clientY - rect.top + 17;
    const marker = { x, y };

    setNewComment("");

    const filteredMarkers = markers.filter(
      (_, index) => markerComments[index].length > 0
    );

    const filteredMarkerComments = markerComments.filter(
      (comment) => comment.length > 0
    );

    setMarkers([...filteredMarkers, marker]);
    setSelectedMarkerIndex(filteredMarkers.length);
    setMarkerComments([...filteredMarkerComments, []]);
  };

  const handleRemoveMarker = (index) => {
    const updatedMarkers = [...markers];
    const updatedComments = [...markerComments];

    if (updatedComments[index] && updatedComments[index].length === 0) {
      updatedMarkers.splice(index, 1);
      updatedComments.splice(index, 1);
    }

    setMarkers(updatedMarkers);
    setMarkerComments(updatedComments);
    setSelectedMarkerIndex(null);
  };

  const handleCommentEnter = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSaveCommentAndClose();
    }
  };

  const handleSaveCommentAndClose = (index) => {
    console.log(index, selectedMarkerIndex);

    if (selectedMarkerIndex !== null) {
      const updatedComments = [...markerComments];
      const author = loggedInUser.first_name + " " + loggedInUser.last_name;
      updatedComments[selectedMarkerIndex].push({
        comment: newComment,
        author,
      });
      setMarkerComments(updatedComments);
      setNewComment("");
    } else if (index !== null) {
      console.log(index, "xw");
      const updatedComments = [...markerComments];
      const author = loggedInUser.first_name + " " + loggedInUser.last_name;
      updatedComments[index].push({
        comment: newComment,
        author,
      });
      setMarkerComments(updatedComments);
      setNewComment("");
    }
  };

  const handleMarkerClick = (index) => {
    setMarkerClicked(index);
  };

  return (
    <div>
      <h1 className="text-blue-400 mb-2 text-lg">
        Logged In User: {loggedInUser.first_name + " " + loggedInUser.last_name}
      </h1>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="">
          <img
            src={imageURL}
            alt="Uploaded"
            className="w-full"
            onClick={handleImageClick}
          />
          {markers.map((marker, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 bg-red-500 cursor-pointer shadow-lg"
              style={{
                borderRadius: "20px 20px 0px 20px",
                left: `${marker.x}px`,
                top: `${marker.y}px`,
              }}
              onMouseEnter={() => setHoveredMarkerIndex(index)}
              onMouseLeave={() => setHoveredMarkerIndex(null)}
              onClick={() => handleMarkerClick(index)}
            />
          ))}
          {markers.map((marker, index) => (
            <div
              key={index}
              className={`absolute left-[${marker.x + 15}px] top-[${
                marker.y + 20
              }px] `}
              style={{
                left: `${marker.x + 15}px`,
                top: `${marker.y + 20}px`,
              }}
            >
              <div>
                {markerClicked === index ? (
                  <div className="bg-white p-2 border rounded shadow-md">
                    {markerComments[index].map((commentData, commentIndex) => (
                      <div key={commentIndex} className="border p-2">
                        <div className="text-black">{commentData.comment}</div>
                        <div className="text-gray-500 text-sm">
                          by {commentData.author}
                        </div>
                      </div>
                    ))}
                    {/* mew code */}
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <button
                      className="flex border rounded px-2"
                      onClick={() => {
                        handleSaveCommentAndClose(index);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  hoveredMarkerIndex === index && (
                    <div className="text-sm  bg-white p-2 border rounded shadow-md">
                      {markerComments[index].map(
                        (commentData, commentIndex) => (
                          <div key={commentIndex}>
                            <div className="text-black">
                              {commentData.comment}
                            </div>
                            <div className="text-gray-500">
                              {commentData.author}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          {selectedMarkerIndex !== null && (
            <div
              className="text-area-opened absolute bg-white p-4 rounded shadow-md"
              style={{
                left: `${markers[selectedMarkerIndex].x + 15}px`,
                top: `${markers[selectedMarkerIndex].y + 18}px`,
              }}
            >
              <button
                onClick={() => handleRemoveMarker(selectedMarkerIndex)}
                className="absolute top-0 right-0"
              >
                &#10005;
              </button>
              <div>
                {markerComments[selectedMarkerIndex] && (
                  <div className="comments">
                    {markerComments[selectedMarkerIndex].map(
                      (commentData, commentIndex) => (
                        <div key={commentIndex}>
                          <div className="text-black">
                            {commentData.comment}
                          </div>
                          <div className="text-gray-500">
                            {commentData.author}
                          </div>
                        </div>
                      )
                    )}
                  </div>
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
                onClick={handleSaveCommentAndClose}
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
