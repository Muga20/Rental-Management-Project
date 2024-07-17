import React, { useState } from 'react';
import { UserData } from '../../../../types/UserData';
import ImageModal from './ImageModal';

import { AxiosProgressEvent } from 'axios';
import { useLoading } from '../../../../context/LoadingContext';
import { useAlert } from '../../../../context/AlertContext';
import { useUserData } from '../../../../constants/UserData';
import { api } from '../../../../middleware/Api';

interface ProfileImageProps {
  userData: UserData;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ userData }) => {
  const statusBorderColor = userData?.status === 'active' ? 'green' : 'red';
  const containerStyle: React.CSSProperties = {
    border: `5px solid ${statusBorderColor}`,
    position: 'relative',
  };

  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { fetchUserData } = useUserData();

  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(userData?.detail.profileImage || null); // Ensure it starts with a valid value
  const [tempImage, setTempImage] = useState<string | ArrayBuffer | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setTempImage(result);
          setProfileImage(files[0]);
          setShowModal(true);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = async () => {
    setLoading(true);
    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        '/member/remove-profile-image',
        'POST',
        {},
        trackProgress,
      );

      if (response?.success) {
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Profile Image removed successfully',
          error: null,
        });
        setSelectedImage(null);
      }
      await fetchUserData();
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message ?? 'Error occurred while removing profile image',
        error: error.message || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!profileImage) {
      setAlert({
        success: false,
        message: 'Profile Image is required.',
        error: null,
      });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        '/member/update-profile-image',
        'POST',
        {},
        formData,
        trackProgress,
      );

      if (response?.success) {
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Profile Image updated successfully',
          error: null,
        });
        if (tempImage) {
          setSelectedImage(tempImage);
          setTempImage(null);
        }
        setShowModal(false);
        await fetchUserData();
      }
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage ?? 'Error occurred while updating profile image',
        error: errorMessage || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3 flex justify-center items-center"
        style={containerStyle}
        onMouseEnter={toggleOptions}
        onMouseLeave={toggleOptions}
      >
        <div className="relative drop-shadow-md">
          <img
            src={
              selectedImage
                ? String(selectedImage)
                : 'https://via.placeholder.com/150'
            }
            alt="profile"
            className="rounded-full object-cover"
          />
        </div>
        {showOptions && (
          <div className="absolute -bottom-10 -left-20 bg-white dark:bg-boxdark border border-gray-300 rounded-md p-2 shadow-md">
            <div className="flex flex-col items-start">
              <label
                className="px-2 py-1 bg-gray-800 text-black dark:text-white text-sm rounded-md mb-1 hover:bg-[#AEB7C0] cursor-pointer"
                htmlFor="fileInput"
              >
                Update Profile
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <button
                className="px-2 py-1 bg-gray-800 text-black dark:text-white text-sm rounded-md hover:bg-[#AEB7C0]"
                onClick={handleRemoveImage}
              >
                Remove Profile
              </button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <ImageModal
          selectedImage={tempImage}
          onClose={() => setShowModal(false)}
          onSave={handleSaveImage}
        />
      )}
    </div>
  );
};
