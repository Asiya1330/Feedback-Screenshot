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
            />
          ))}
          {markers.map((marker, index) => (
            <div
              key={index}
              className={`absolute left-[${marker.x + 15}px] top-[${
                marker.y + 20
              }px] ${
                hoveredMarkerIndex === index ? "visible" : "hidden"
              } bg-white p-2 border rounded shadow-md`}
              style={{
                left: `${marker.x + 15}px`,
                top: `${marker.y + 20}px`,
              }}
            >
              {markerComments[index]}
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
              />
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default CommentImage;
