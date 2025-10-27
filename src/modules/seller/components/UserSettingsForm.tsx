import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { showToast } from "../../../common/utils/showToast";
import { useSellerAuth } from "../../auth/contexts/SellerAuthContext";
import { convertPath } from "../../auth/utils/useImagePath"; // keep your existing util

const UserSettingsForm = () => {
  const { userDetails, updateProfile } = useSellerAuth();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🔻 Track picked file + preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // cleanup preview object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!userDetails) return <div>Loading...</div>;

  // Form change checks
  const isImageChanged = !!avatarFile;

  const onFileButtonClick = () => fileInputRef.current?.click();

  // Resolve current image URL (preview takes priority)
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
    if (!isImageChanged) {
      showToast({
        type: "error",
        message: "Nothing to update.",
        showClose: true,
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await updateProfile(undefined, avatarFile || undefined);

      // Update succeeded; clear transient preview file
      setAvatarFile(null);

      showToast({
        type: "success",
        message: "Profile image updated successfully!",
        showClose: true,
      });
    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        message: "Failed to update profile. Please try again.",
        showClose: true,
      });
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

        {/* Info Fields */}
        <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
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
            loading || !isImageChanged
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={loading || !isImageChanged}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
