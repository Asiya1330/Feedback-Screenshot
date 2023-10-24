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
              style={{
                left: marker.x,
                top: marker.y,
                position: "absolute",
                width: "20px",
                height: "20px",
                background: "red",
                borderRadius: "48% 52% 0% 100% / 47% 46% 54% 53% ",
                cursor: "pointer",
                boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
              }}
              onMouseEnter={() => setHoveredMarkerIndex(index)}
              onMouseLeave={() => setHoveredMarkerIndex(null)}
            />
          ))}
          {markers.map((marker, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: marker.x + 15,
                top: marker.y + 20,
                visibility: hoveredMarkerIndex === index ? "visible" : "hidden",
                background: "white",
                padding: "5px",
                border: "1px solid gray",
                borderRadius: "5px",
                boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              {markerComments[index]}
            </div>
          ))}
          {selectedMarkerIndex !== null && (
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
              style={{
                position: "absolute",
                left: markers[selectedMarkerIndex].x + 15,
                top: markers[selectedMarkerIndex].y + 20,
              }}
              className="p-2 border rounded"
            />
          )}
        </div>
      </CustomModal>
    </div>
  );
};

export default CommentImage;
