import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { getImageUrlsById } from "../../../common/utils/getImageUrlsById";
import { showToast } from "../../../common/utils/showToast";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useImageUpload } from "../../auth/hooks/useImageUpload";
import { FaUserCircle } from "react-icons/fa";

// ✅ Zod name schema
const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long.")
  .max(50, "Name cannot be more than 50 characters.")
  .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces.");

const UserSettingsForm = () => {
  const { userDetails, updateProfile } = useAuth();
  const [name, setName] = useState(userDetails?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { imageUrl, handleImageUpload, imageId, imageDiskName } =
    useImageUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name);
    }
  }, [userDetails]);

  useEffect(() => {
    try {
      nameSchema.parse(name);
      setNameError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0]?.message || "Invalid name");
      }
    }
  }, [name]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  // ✅ Check if form has any changes
  const isNameChanged = name.trim() !== (userDetails?.name || "").trim();
  const isFormChanged = isNameChanged || !!imageId;

  const onFileButtonClick = () => fileInputRef.current?.click();

  // ✅ Prefer uploaded imageDiskName, fallback to DB-stored imageId
  const resolvedDiskName = imageDiskName ?? userDetails?.image;
  const fullImageUrls = resolvedDiskName
    ? getImageUrlsById(resolvedDiskName)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      nameSchema.parse(name);
      if (!isFormChanged) {
        showToast({
          type: "error",
          message: "Nothing to update.",
          showClose: true,
        });
        return;
      }

      setLoading(true);
      await updateProfile(name, imageId ?? userDetails?.image);

      showToast({
        type: "success",
        message: "Profile updated successfully!",
        showClose: true,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast({
          type: "error",
          message: error.errors[0]?.message || "Invalid name",
          showClose: true,
        });
      } else {
        console.error(error);
        showToast({
          type: "error",
          message: "Failed to update profile. Please try again.",
          showClose: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl w-full mx-auto bg-white rounded-xl px-4 py-6 sm:p-6 md:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Profile Image */}
        <div className="md:col-span-2 flex flex-col items-center justify-start">
          <div className="relative w-24 h-24">
            {!imageError ? (
              <img
                src={
                  imageUrl ||
                  fullImageUrls?.thumbnail ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt="User"
                className="w-full h-full rounded-full object-cover shadow"
                onError={() => setImageError(true)}
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400 rounded-full shadow" />
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageUpload(e.target.files[0], "userProfile");
                  setImageError(false); // ✅ reset error state on new upload
                }
              }}
            />

            <button
              type="button"
              onClick={onFileButtonClick}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow hover:bg-blue-700"
            >
              <Pencil className="text-white w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              className={`mt-1 w-full border ${
                nameError ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={userDetails?.mobile || ""}
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tenant ID
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={userDetails?.tenantId || "N/A"}
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Linked Domain?
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={userDetails?.isDomainLinked ? "Yes" : "No"}
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Roles</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={
                Array.isArray(userDetails?.role)
                  ? userDetails.role.join(", ")
                  : userDetails?.role || ""
              }
              disabled
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="text-right mt-8">
        <button
          type="submit"
          className={`bg-blue-600 text-white px-8 py-2 rounded-lg transition ${
            loading || !isFormChanged || nameError
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={loading || !isFormChanged || !!nameError}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
