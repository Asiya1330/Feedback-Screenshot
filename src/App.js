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
      (_, index) => markerComments[index] !== ""
    );

    const filteredMarkerComments = markerComments.filter(
      (comment) => comment !== ""
    );

    setMarkers([...filteredMarkers, marker]);
    setSelectedMarkerIndex(filteredMarkers.length);
    setMarkerComments([...filteredMarkerComments, ""]);
  };

  const handleRemoveMarker = (index) => {
    const updatedMarkers = [...markers];
    const updatedComments = [...markerComments];
    updatedMarkers.splice(index, 1);
    updatedComments.splice(index, 1);

    setMarkers(updatedMarkers);
    setMarkerComments(updatedComments);
    setSelectedMarkerIndex(null);
  };

  const handleCommentEnter = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSaveCommentAndClose();
    }
  };

  const handleSaveCommentAndClose = () => {
    const updatedComments = [...markerComments];
    updatedComments[selectedMarkerIndex] = newComment;
    setMarkerComments(updatedComments);

    setSelectedMarkerIndex(null);
  };

  const handleMarkerClick = (index) => {
    setMarkerClicked(index);
  };

  return (
    <div>
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
              }px] ${hoveredMarkerIndex === index ? "visible" : "visible"} `}
              style={{
                left: `${marker.x + 15}px`,
                top: `${marker.y + 20}px`,
              }}
            >
              <div>
                {markerClicked === index ? (
                  <div className="bg-white p-2 border rounded shadow-md">
                    <div className="text-black">{markerComments[index]}</div>
                    <div className="text-gray-500">
                      {loggedInUser.first_name} {loggedInUser.last_name}
                    </div>

                    {/* text area logic here.. */}
                  </div>
                ) : (
                  hoveredMarkerIndex === index && (
                    <div className="text-sm  bg-white p-2 border rounded shadow-md">
                      <div className="text-black">{markerComments[index]}</div>
                      <div className="text-gray-500">
                        {loggedInUser.first_name} {loggedInUser.last_name}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          {selectedMarkerIndex !== null && (
            <div
              className="absolute bg-white p-4 rounded shadow-md"
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
              <textarea
                ref={textAreaRef}
                value={newComment}
                onChange={(e) => {
                  const updatedComments = [...markerComments];
                  updatedComments[selectedMarkerIndex] = e.target.value;
                  setMarkerComments(updatedComments);
                  setNewComment(e.target.value);
                }}
                placeholder="Add a comment..."
                className="p-2 border rounded"
                onKeyDown={handleCommentEnter} // Add this event handler
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
