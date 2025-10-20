// src/containers/SellerUnlockStoreContainer.tsx
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerUnlockStoreForm from "../components/SellerUnlockStoreForm";
import { SellerUnlockStoreFormValues } from "../schemas/sellerUnlockStoreSchema";
import { useSellerAuth } from "../contexts/SellerAuthContext";

const SellerUnlockStoreContainer: React.FC = () => {
  const {
    userDetails,
    logout,
    checkDomainAvailability,
    saveDomain,
    refetchUserDetails,
  } = useSellerAuth();

  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const memoizedCheckAvailability = useCallback(
    (name: string) => checkDomainAvailability(name),
    [checkDomainAvailability]
  );

  // const handleUnlock = async (data: SellerUnlockStoreFormValues) => {
  //   console.log("👉 handleUnlock triggered with:", data);

  //   setSaving(true);
  //   const slug = data.businessName.trim().toLowerCase();

  //   const userData = userDetails?.data;
  //   const businessId = userData?.storeLinks?.[0]?.businessId ?? "";

  //   try {
  //     if (!businessId) {
  //       throw new Error("No business ID available");
  //     }

  //     await saveDomain({
  //       businessId,
  //       domainUrl: slug,
  //       domainType: "SUBDOMAIN",
  //     });

  //     navigate("/seller");
  //   } catch (err) {
  //     console.error("Failed to unlock store:", err);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleUnlock = async (data: SellerUnlockStoreFormValues) => {
    setSaving(true);
    const slug = data.businessName.trim().toLowerCase();

    const businessId = userDetails?.storeLinks?.[0]?.businessId ?? "";

    try {
      if (!businessId) {
        throw new Error("No business ID available");
      }

      const saved = await saveDomain({
        businessId,
        domainUrl: slug,
        domainType: "SUBDOMAIN",
      });

      if (saved) {
        console.log("✅ Domain saved");
        // 🔁 force refresh user profile from server
        await refetchUserDetails(); // now works
        navigate("/seller");
      }
    } catch (err) {
      console.error("Failed to unlock store:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerUnlockStoreForm
      onSubmit={handleUnlock}
      logout={logout}
      checkAvailability={memoizedCheckAvailability}
      isSubmitting={saving}
    />
  );
};

export default SellerUnlockStoreContainer;
