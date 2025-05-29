import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SellerCategoriesHeader = () => {
    const navigate = useNavigate();

    const handleAddCategories = () => navigate("/seller/catalogue/categories/create");

    return (
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="w-full md:w-[300px]">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full h-[44px] px-4 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="w-full md:w-auto inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={handleAddCategories}
                        className="flex items-center justify-center gap-2 px-4 h-[44px] rounded-md border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold whitespace-nowrap"
                    >
                        <Plus className="w-[18px] h-[18px]" />
                        <span>Add New Category</span>
                    </button>

                    {/* <button className="w-[44px] h-[44px] bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center">
            <Settings className="w-[20px] h-[20px]" />
          </button> */}
                </div>
            </div>
        </div>
    );
};

export default SellerCategoriesHeader;
