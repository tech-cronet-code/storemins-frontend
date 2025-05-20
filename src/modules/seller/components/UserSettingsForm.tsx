import { Pencil } from "lucide-react";

const UserSettingsForm = () => {
  return (
    <form className="max-w-6xl w-full mx-auto bg-white rounded-xl px-4 py-6 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Profile Image */}
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

        {/* Right: Form Fields */}
        <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="Charlene Reed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="Charlene Reed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="charlenereed@gmail.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="*********"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="1990-01-25"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Present Address
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="San Jose, California, USA"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Permanent Address
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="San Jose, California, USA"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="San Jose"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="45962"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Country</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="USA"
            />
          </div>
        </div>
      </div>

      <div className="text-right mt-8">
        <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition">
          Save
        </button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
