import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import * as z from "zod";
import { showToast } from "../../../common/utils/showToast";
import { useAuth } from "../../auth/contexts/AuthContext";
import { convertPath } from "../../auth/utils/useImagePath"; // keep your existing util

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

  // 🔻 New: track the picked file + preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // keep name in sync with userDetails
  useEffect(() => {
    if (userDetails) setName(userDetails.name);
  }, [userDetails]);

  // validate name live
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

  // cleanup preview object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!userDetails) return <div>Loading...</div>;

  //  Form change checks
  const isNameChanged = name.trim() !== (userDetails?.name || "").trim();
  const isImageChanged = !!avatarFile;
  const isFormChanged = isNameChanged || isImageChanged;

  const onFileButtonClick = () => fileInputRef.current?.click();

  //  Resolve current image URL (preview takes priority)
  // Backend returns: top-level "imageId": "<fileId>.webp"
  const serverImageDiskName = userDetails?.image ?? undefined; // already has .webp
  const serverThumbUrl = serverImageDiskName
    ? convertPath(serverImageDiskName, "original/auth")
    : undefined;

  const currentImgSrc = previewUrl || serverThumbUrl || undefined; // fallback handled by onError UI

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setImageError(false);
    // local preview for instant UX
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

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

      //  NEW: send multipart (name + optional avatarFile)
      const resp = await updateProfile(name, avatarFile || undefined);

      // Update succeeded; clear transient preview file
      setAvatarFile(null);

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
            {!imageError && currentImgSrc ? (
              <img
                src={currentImgSrc}
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
              onChange={handleFileChange}
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
