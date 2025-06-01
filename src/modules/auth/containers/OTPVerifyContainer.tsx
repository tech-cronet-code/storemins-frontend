import { Pencil } from "lucide-react";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast"; // ✅ make sure you have react-hot-toast installed

const UserSettingsForm = () => {
  const { userDetails, updateProfile } = useAuth();
  const [name, setName] = useState(userDetails?.name || "");
  const [loading, setLoading] = useState(false);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const isNameValid = (name: string) => {
    return name.trim().length >= 3;
  };

  const isNameChanged = name.trim() !== (userDetails?.name || "").trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid(name)) {
      toast.error("🚫 Name must be at least 3 characters long.");
      return;
    }
    if (!isNameChanged) {
      toast.error("⚠️ Name is unchanged.");
      return;
    }
    try {
      setLoading(true);
      await updateProfile(name);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update profile. Please try again.");
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
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User"
              className="w-full h-full rounded-full object-cover border shadow"
            />
            <button
              type="button"
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
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

      <div className="text-right mt-8">
        <button
          type="submit"
          className={`bg-blue-600 text-white px-8 py-2 rounded-lg transition ${
            loading || !isNameChanged
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          disabled={loading || !isNameChanged}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
