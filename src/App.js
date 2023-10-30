import React, { useState } from "react";

const ImageMarker = () => {
  const [image, setImage] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState({
    name: "asiya",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleImageClick = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    // You can customize the marker appearance using Tailwind classes
    const marker = {
      x,
      y,
      comments: [],
      loggedInUser,
    };

    setMarkers([...markers, marker]);
  };

  const handleCommentSubmit = (e, markerIndex, comment) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      const updatedMarkers = [...markers];
      updatedMarkers[markerIndex].comments.push(comment);
      setMarkers(updatedMarkers);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {image && (
        <div className="relative">
          <img src={image} alt="Selected" onClick={handleImageClick} />

          {markers.map((marker, index) => (
            <div
              key={index}
              className="absolute bg-red-500 w-4 h-4 rounded-full cursor-pointer"
              style={{ top: marker.y, left: marker.x }}
              onClick={() => setActiveMarker(marker)}
            >
              {activeMarker === marker && (
                <div className="absolute p-2 bg-white shadow-md">
                  <textarea
                    placeholder="Add a comment..."
                    onKeyDown={(e) =>
                      handleCommentSubmit(e, index, e.target.value)
                    }
                  />
                  <ul>
                    {marker.comments.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <div className="text-sm text-gray-600">{marker.loggedInUser.name}</div>
                        <div className="border p-2 rounded">{comment}</div>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageMarker;
