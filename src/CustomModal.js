import React, { useEffect } from "react";

const CustomModal = ({ children, isOpen, onRequestClose }) => {
  useEffect(() => {
    console.log(isOpen, "open");
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-auto bg-opacity-80 flex justify-center items-center ${
            isOpen ? "block" : "hidden"
          }`}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              top: 0,
              margin: "auto",
              background: "#0000005c",
              width: "100%",
              height: "100%",
            }}
        >
          <div
            className="modal relative w-11/12 md:w-2/3 lg:w-full max-w-screen-sm p-5 bg-white shadow-lg rounded-md h-[100vh] overflow-y-auto"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-600"
              onClick={onRequestClose}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
