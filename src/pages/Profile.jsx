import { useState } from "react";
import { useProfile } from "@/hooks/use-Profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

function Profile() {
  const [tab, setTab] = useState("profile");
  const {
    profile,
    loading,
    editData,
    passwordData,
    loadingProfile,
    loadingPassword,
    handleProfileChange,
    handleFileChange,
    handleProfileUpdate,
    handlePasswordUpdate,
    setPasswordData,
  } = useProfile();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <Card className="overflow-hidden">
        {/* Background Photo */}
        <div
          className="h-48 bg-gradient-to-r from-orange-100 to-yellow-200 relative"
          style={
            editData.backgroundPhoto
              ? {
                  backgroundImage: `url(${editData.backgroundPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {/* Edit background button */}
          <label
            htmlFor="background-upload"
            className="absolute bottom-3 right-3 cursor-pointer"
          >
            <div className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <Pencil className="h-4 w-4 text-gray-600" />
            </div>
            <input
              id="background-upload"
              type="file"
              name="backgroundPhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Sidebar with Avatar */}
            <div className="flex flex-col items-center md:w-1/3 -mt-12 relative">
              <div className="relative">
                <img
                  src={
                    editData.profileImage ||
                    `https://ui-avatars.com/api/?name=${editData.name}`
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-1 right-1 cursor-pointer"
                >
                  <div className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                    <Pencil className="h-3 w-3 text-gray-600" />
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="mt-4 text-2xl font-bold">{editData.name}</h2>
              <span className="text-green-600 font-medium mt-1">
                {profile?.role}
              </span>
              <span className="text-gray-500 text-sm mt-1">
                {editData.email}
              </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 mt-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium border-b-2 ${
                    tab === "profile"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`px-4 py-2 font-medium border-b-2 ${
                    tab === "password"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setTab("password")}
                >
                  Password
                </button>
              </div>

              {/* Edit Profile */}
              {tab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={editData.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      value={editData.email}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      value={editData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <Input
                      name="address"
                      value={editData.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="submit" disabled={loadingProfile}>
                      {loadingProfile ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Change Password */}
              {tab === "password" && (
                <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      minLength={10}
                      placeholder="Password must be more than 10 chars long."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setPasswordData({
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      disabled={loadingPassword}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loadingPassword}>
                      {loadingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
