import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export function useProfile() {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const userId = user?.id || user?._id;

  const [profile, setProfile] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
    backgroundPhoto: user?.backgroundPhoto || "",
  });
  const [fileData, setFileData] = useState({
    profileImage: null,
    backgroundPhoto: null,
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Handle input change for profile
  const handleProfileChange = useCallback((e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Handle file input (store file in state)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    setFileData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    // For preview
    setEditData((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(files[0]),
    }));
  };

  // PATCH /users/{userId} for profile update (with file)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("phone", editData.phone);
      formData.append("address", editData.address);
      if (fileData.profileImage) formData.append("profileImage", fileData.profileImage);
      if (fileData.backgroundPhoto) formData.append("backgroundPhoto", fileData.backgroundPhoto);

      const res = await api.patch(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Update local state
      setProfile(res.data.data);
      
      // Update authData in cookies with fresh data
      const authDataString = Cookies.get("authData");
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          // Update the user data in authData
          authData.data = { 
            ...authData.data, 
            name: res.data.data.name,
            phone: res.data.data.phone,
            address: res.data.data.address,
            profileImage: res.data.data.profileImage,
            backgroundPhoto: res.data.data.backgroundPhoto
          };
          
          // Save updated authData back to cookies
          Cookies.set("authData", JSON.stringify(authData), { expires: 1 });
          
          // Refresh user data in current state
          setEditData(prev => ({
            ...prev,
            name: res.data.data.name,
            phone: res.data.data.phone,
            address: res.data.data.address,
            profileImage: res.data.data.profileImage,
            backgroundPhoto: res.data.data.backgroundPhoto
          }));
        } catch (error) {
          console.error("Error updating auth data in cookies:", error);
        }
      }
      
      toast({ title: "Profile updated" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
    setLoadingProfile(false);
  };

  // PATCH /users/{userId} for password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword.length < 10) {
      toast({
        title: "Password too short",
        description: "Password must be more than 10 chars long.",
        variant: "destructive",
      });
      return;
    }
    setLoadingPassword(true);
    try {
      await api.patch(`/users/${userId}`, {
        password: passwordData.newPassword,
      });
      toast({ title: "Password updated" });
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || "Failed to update password.",
        variant: "destructive",
      });
    }
    setLoadingPassword(false);
  };

  return {
    profile,
    loading,
    editData,
    setEditData,
    passwordData,
    setPasswordData,
    loadingProfile,
    loadingPassword,
    handleProfileChange,
    handleFileChange,
    handleProfileUpdate,
    handlePasswordUpdate,
  };
}