import React from 'react';

interface ImageModalProps {
  selectedImage: string | ArrayBuffer | null;
  onClose: () => void;
  onSave: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  selectedImage,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg max-w-screen-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage as string}
                alt="Selected"
                className="rounded-md max-h-[300px] w-[400px]"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black dark:text-white rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                onSave();
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
