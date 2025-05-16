// src/containers/SellerStoreDetailsContainer.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import SellerStoreDetailsForm from "../components/SellerStoreDetailsForm";
import { useAuth } from "../contexts/AuthContext";
import { SellerStoreDetailsFormValues } from "../schemas/sellerStoreDetailsSchema";
import {
  useListBusinessCategoriesQuery,
  useListBusinessTypesQuery,
  useCreateOrUpdateBusinessCategoryMutation,
} from "../services/authApi";

const SellerStoreDetailsContainer: React.FC = () => {
  const { user, createOrUpdateBusinessDetails } = useAuth();
  const navigate = useNavigate();

  // 1️⃣ Fetch the existing business‐type & category lists
  const { data: businessTypes = [] } = useListBusinessTypesQuery();
  const { data: categories = [] } = useListBusinessCategoriesQuery();

  // 2️⃣ Hook for creating/updating a custom category
  const [createOrUpdateCategory] = useCreateOrUpdateBusinessCategoryMutation();

  const handleSellerStoreDetails = async (
    formValues: SellerStoreDetailsFormValues
  ) => {
    if (!user) return;

    // 3️⃣ Pull out the raw categoryId (might be a UUID or a new name)
    let { categoryId } = formValues;

    // 4️⃣ If it’s not one of our fetched IDs, treat it as a new category name
    const isExisting = categories.some((c) => c.id === categoryId);
    if (!isExisting) {
      try {
        // POST /business-categories { name } → returns BusinessCategoryResponseDto
        const newCat = await createOrUpdateCategory({
          name: categoryId,
        }).unwrap();
        categoryId = newCat.id; // swap in the real UUID
      } catch (err) {
        console.error("Failed to create custom category:", err);
        // fallback: leave categoryId as the original string,
        // but your schema now allows it, and you could surface an error toast here.
      }
    }

    // 5️⃣ Build the final business‐details payload with the correct categoryId
    const payload = {
      ...formValues,
      categoryId,
      userId: user.id,
    };

    try {
      // call through your AuthContext (no unwrap here)
      const saved = await createOrUpdateBusinessDetails(payload);

      // 6️⃣ Redirect on success
      if (!user.mobile_confirmed) {
        navigate("/otp-verify");
      } else {
        // const r = user.role?.[0];
        if (saved) navigate("/seller/store-unlock");
        // else if (r === "SELLER") navigate("/seller");
        else navigate("/home");
      }
    } catch (err) {
      console.error("Saving business details failed:", err);
      // TODO: show error notification
    }
  };

  return (
    <SellerStoreDetailsForm
      onSubmit={handleSellerStoreDetails}
      loading={false}
      error={undefined}
      logout={() => navigate("/logout")}
      businessTypes={businessTypes}
      businessCategories={categories}
    />
  );
};

export default SellerStoreDetailsContainer;
