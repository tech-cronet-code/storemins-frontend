import React from "react";
import StoreSettingDomainInfoSection from "./StoreSettingDomainInfoSection";
import ConnectExternalDomainCard from "./ConnectExternalDomainCard";

interface StoreSettingDomainFormProps {
  storeId?: string;
}

const StoreSettingDomainForm: React.FC<StoreSettingDomainFormProps> = ({ storeId }) => {
  return (
    <form className="space-y-8">
      <section id="store-domain" className="scroll-mt-24">
        <StoreSettingDomainInfoSection />
      </section>

       <section id="store-domain-connect" className="scroll-mt-24">
          <ConnectExternalDomainCard />
      </section>

      {/* <section id="store-setting" className="scroll-mt-24">
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
      </section> */}

      <div className="flex justify-end mt-6 pb-15 pt-1">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm hover:bg-blue-700"
        >
          {storeId ? "Update Store" : "Add Store"}
        </button>
      </div>
    </form>
  );
};

export default StoreSettingDomainForm;