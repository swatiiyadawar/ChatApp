import { useState,useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import avatarPlaceholder from "../assets/avatar.png";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, fetchUserProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    fetchUserProfile(); // Fetch the user profile when the component is mounted
  }, [fetchUserProfile]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
  
      try {
        // Call the API to update the profile picture using fetch
        const response = await fetch("http://localhost:5001/api/auth/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePic: base64Image }),
          credentials: "include", // Include credentials (cookies, etc.)
        });
        
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Failed to update profile");
        }
  
        // If successful, update the local user state
        console.log("Profile updated successfully", data);
      } catch (error) {
        console.error("Error updating profile:", error.message);
        alert(error.message);
      }
    };
  };
  
  

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
      {isUpdatingProfile || !authUser ? (
        <p>Loading...</p> // Or any other loading indicator
      ) : (
      <div className="bg-base-300 rounded-xl  shadow-md p-6 space-y-8 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
       

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <img
                src={selectedImg || authUser.profilePic || avatarPlaceholder}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-transform duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {authUser?.fullName || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {authUser?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-inner">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-300 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {authUser?.createdAt?.split("T")[0] || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
         )}
      </div>
    </div>
  );
};

export default ProfilePage;
