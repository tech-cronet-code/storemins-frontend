// src/modules/store/containers/StoreSettingForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

import BusinessInformationSection from "./BusinessInformationSection";
import ContactInformationSection from "./ContactInformationSection";
import SocialLinksSection from "./SocialLinksSection";
import StoreSettingInfoSection from "./StoreSettingInfoSection";
import StoreSettingMediaSection from "./StoreSettingMediaSection";

import { useSellerAuth } from "../../../auth/contexts/SellerAuthContext";
import {
  useGetMyStoreQuery,
  useUpdateStoreMutation,
} from "../../../auth/services/sellerApi";
import { storeSettingsSchema } from "../../Schemas/storeSettingsSchema";
import { removeEmptyStrings } from "../../common/utils";
import { UpdateStorePayload } from "../../types/storeTypes";

type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

const StoreSettingForm: React.FC = () => {
  /* auth / query --------------------------------------------------- */
  const { userDetails } = useSellerAuth();
  const businessIdFromAuth = userDetails?.storeLinks?.[0]?.businessId ?? "";

  const { data: storeData, refetch } = useGetMyStoreQuery();

  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();

  /* react-hook-form ------------------------------------------------ */
  const methods = useForm<StoreSettingsInput>({
    resolver: zodResolver(storeSettingsSchema),
    mode: "onBlur",
    defaultValues: {
      /* identifiers */
      businessId: businessIdFromAuth,
      businessName: "",
      categoryId: "",

      /* contacts */
      businessEmail: "",
      businessPhone: "",
      whatsappNumber: "",
      websiteUrl: "",
      instagramHandle: "",

      /* address (root) */
      address: "",
      street2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",

      /* nested profile */
      businessProfile: {
        legalName: "",
        businessTypeId: "",
        gstNumber: "",
        cin: "",
        fssaiLicenseNumber: "",
        address: "",
        street2: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },

      /* socials */
      socialMediaLinks: [],
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = methods;

  /* populate on initial fetch ------------------------------------- */
  /* inside your `useEffect` that populates the form */
  useEffect(() => {
    if (storeData) {
      const bp = (storeData.businessProfile ?? {}) as Partial<
        StoreSettingsInput["businessProfile"]
      >;
      const businessType = (storeData.businessProfile as any)?.businessType;

      reset({
        ...storeData,
        businessId: businessIdFromAuth,

        // root address
        address: storeData.address ?? "",
        street2: storeData.street2 ?? "",
        city: storeData.city ?? "",
        state: storeData.state ?? "",
        pincode: storeData.pincode ?? "",
        country: storeData.country ?? "",

        businessProfile: {
          legalName: bp.legalName ?? "",
          businessTypeId: businessType?.id ?? "",
          gstNumber: bp.gstNumber ?? "",
          cin: bp.cin ?? "",
          fssaiLicenseNumber: bp.fssaiLicenseNumber ?? "",
          address: bp.address ?? "",
          street2: bp.street2 ?? "",
          city: bp.city ?? "",
          state: bp.state ?? "",
          pincode: bp.pincode ?? "",
          country: bp.country ?? "",
        },
      });
    }
  }, [storeData, businessIdFromAuth, reset]);

  /* keep businessId in sync (just in case) ------------------------ */
  useEffect(() => {
    if (businessIdFromAuth) {
      setValue("businessId", businessIdFromAuth, { shouldValidate: true });
    }
  }, [businessIdFromAuth, setValue]);

  /* submit -------------------------------------------------------- */
  const onSubmit = async (data: StoreSettingsInput) => {
    try {
      /* drop links with blank url */
      const cleanedLinks = (data.socialMediaLinks ?? []).filter(
        (l): l is { platform: string; url: string; icon?: string } =>
          l.url.trim().length > 0
      );

      const cleanedData: UpdateStorePayload = {
        ...removeEmptyStrings({
          ...data,
          businessProfile: {
            ...data.businessProfile,
            businessTypeId:
              data.businessProfile?.businessTypeId?.trim() || undefined,
          },
        }),
        socialMediaLinks: cleanedLinks,
      };

      await updateStore(cleanedData).unwrap();
      await refetch();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Store updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update store");
    }
  };

  /* render -------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section id="store-media" className="scroll-mt-24">
          <StoreSettingMediaSection />
        </section>

        <section id="store-setting" className="scroll-mt-24">
          <StoreSettingInfoSection />
        </section>

        <section id="business-info" className="scroll-mt-24">
          <BusinessInformationSection />
        </section>

        <section id="contact-info" className="scroll-mt-24">
          <ContactInformationSection />
        </section>

        <section id="social-links" className="scroll-mt-24">
          <SocialLinksSection />
        </section>

        <div className="flex justify-end mt-6 pb-15 pt-1">
          <button
            type="submit"
            disabled={isUpdating || !isDirty}
            className={`px-6 py-3 rounded-md text-sm text-white
              ${
                isUpdating || !isDirty
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isUpdating ? "Updating…" : "Update Store"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default StoreSettingForm;
