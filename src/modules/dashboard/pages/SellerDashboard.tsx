import { useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CreditsBanner from "../components/CreditsBanner";
import FeatureCarouselInsideCard from "../components/FeatureCarouselInsideCard";
import GetMoreCard from "../components/GetMoreCard";
import Layout from "../components/Layout";
import SalesAnalyticsCard from "../components/SalesAnalyticsCard";
import ShortcutCard from "../components/ShortcutCard";
import ShortcutModal from "../components/ShortcutModal";
import StoreLinkCard from "../components/StoreLinkCard";
import StoreSetupChecklist from "../components/StoreSetupChecklist";
import WalletAlert from "../components/WalletAlert";
import { useAuth } from "../../auth/contexts/AuthContext";
import {
  buildStoreUrl,
  getSuggestedDomain,
} from "../../../common/utils/buildStoreUrl";

const SellerDashboard = () => {
  const { userDetails } = useAuth();

  const initialShortcuts = [
    {
      label: "Facebook Pixel",
      icon: (
        <img
          src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
          alt="Facebook Pixel"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Petpooja",
      icon: (
        <img
          src="https://static.wixstatic.com/media/11e516_f905eef97f454bd88d8ea8b6d58ad67d~mv2.png"
          alt="Petpooja"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Countdown Timer",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
          alt="Countdown Timer"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "All-in-one SEO",
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/All_in_One_SEO_Pack_Logo.png"
          alt="All-in-one SEO"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Product Reviews and Ratings",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/179/179386.png"
          alt="Product Reviews and Ratings"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Mailchimp",
      icon: (
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/mailchimp-282134.png"
          alt="Mailchimp"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Wishlist",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
          alt="Wishlist"
          className="w-8 h-8 object-contain"
        />
      ),
      added: true,
    },
    {
      label: "Create Order",
      icon: (
        <span className="text-2xl leading-none text-gray-700 font-bold">
          ＋
        </span>
      ),
      added: true,
    },
    {
      label: "Intercom Live Chat",
      icon: (
        <img
          src="https://static-00.iconduck.com/assets.00/intercom-icon-2048x2048-k12oqp4v.png"
          alt="Intercom"
          className="w-8 h-8 object-contain"
        />
      ),
      added: false,
    },
    {
      label: "Privy Ecommerce Marketing",
      icon: (
        <img
          src="https://uploads-ssl.webflow.com/5ff9b961be725b579fad8e5c/5ffb3283df2b4269c4351229_logo-white.svg"
          alt="Privy"
          className="w-8 h-8 object-contain bg-black rounded"
        />
      ),
      added: false,
    },
  ];

  const [shortcuts, setShortcuts] = useState(initialShortcuts);
  const [isShortcutModalOpen, setShortcutModalOpen] = useState(false);

  const handleToggleShortcut = (label: string) => {
    setShortcuts((prev) =>
      prev.map((item) =>
        item.label === label ? { ...item, added: !item.added } : item
      )
    );
  };

  /* ------------ helper to pick active link & card JSX ------------ */
  const renderStoreLinkCard = () => {
    if (!userDetails?.storeLinks?.length) return null;

    const activeLink = userDetails.storeLinks.find((l) => l.domain?.isActive);
    if (!activeLink?.domain) return null;

    const storeUrl = buildStoreUrl(activeLink.domain);
    const suggestedDomain = getSuggestedDomain(activeLink.domain);

    // ⬇️ Do NOT pass custom copy/share using the raw URL.
    // The card now normalizes & uses localhost:5173 automatically when on localhost.
    return (
      <StoreLinkCard
        storeUrl={storeUrl}
        suggestedDomain={suggestedDomain}
        onClose={() => console.log("Closed")}
        onGetNow={() => console.log("Get Now clicked:", suggestedDomain)}
      />
    );
  };

  return (
    <Layout role={UserRoleName.SELLER}>
      <div className="w-full overflow-x-hidden">
        {/* Credits */}
        <CreditsBanner
          credits={41}
          onBuyCredits={() => console.log("Redirect to Buy Credits")}
        />

        {/* Wallet Alert */}
        <WalletAlert
          onAddCredits={() => console.log("Add credits")}
          onLearnMore={() => console.log("Learn more")}
          className="mb-1"
          defaultVisible={true}
        />

        {/* Sales Analytics Cards */}
        <div className="bg-[#f9fafb] p-4 rounded-md border border-gray-100 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Sales analytics
            </h3>
            <div className="relative inline-block text-left">
              <select
                defaultValue="30"
                className="appearance-none pl-8 pr-8 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
              >
                <option value="30">Last 30 days</option>
                <option value="7">Last 7 days</option>
                <option value="this-month">This month</option>
                <option value="last-month">Last month</option>
              </select>

              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <SalesAnalyticsCard
              title="Average orders per day"
              value="0"
              tooltipText="Calculated as total orders divided by days"
            />

            <SalesAnalyticsCard
              title="Average order value"
              value="₹0"
              tooltipText="The average value of an individual order"
            />

            <SalesAnalyticsCard
              title="Average sales per day"
              value="₹0"
              tooltipText="Total sales divided by number of days"
            />

            <SalesAnalyticsCard
              title="Returning customers"
              value="0%"
              highlight
              tooltipText="Percentage of users who placed more than one order"
            />
          </div>
        </div>

        {/* Store Links Cards */}
        {renderStoreLinkCard()}

        {/* Feature + Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
          {/* Left Column */}
          <div className="flex flex-col h-[320px]">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide relative w-fit px-4 pt-3 mb-2">
              Latest Features & Updates
              <span className="absolute left-4 -bottom-1 h-[2px] w-[40%] bg-orange-500 rounded-full"></span>
            </h3>
            <div className="flex-grow px-4 pb-4 overflow-hidden">
              <FeatureCarouselInsideCard />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-[320px]">
            <h3 className="text-sm font-semibold text-gray-900 px-4 pt-3 mb-2">
              Complete your store setup...
            </h3>
            <div className="flex-grow px-4 pb-4 overflow-hidden">
              <StoreSetupChecklist />
            </div>
          </div>
        </div>

        {/* Get More Section */}
        <div className="bg-[#f9fafb] px-4 py-6 rounded-md border border-gray-100 mb-6">
          <h3 className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.08em] text-center mb-6 relative w-fit mx-auto">
            Get more out of your website
            <span className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 h-[2px] w-[120px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            <GetMoreCard
              title="Setup payment details"
              subtitle="Connect bank account to receive payments directly"
              bgColor="bg-yellow-50"
              icon={
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  $
                </div>
              }
              customButton={
                <button className="bg-[#FF5C00] text-white text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-[#e24f00] transition-colors duration-200">
                  Add
                </button>
              }
            />

            <GetMoreCard
              title="Share coupon discounts"
              subtitle="To attract new customers"
              bgColor="bg-white"
              icon={
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  %
                </div>
              }
              customButton={
                <button className="bg-orange-50 text-[#FF5C00] text-sm font-semibold px-5 py-1.5 rounded-xl hover:bg-orange-100 transition-colors duration-200">
                  Start
                </button>
              }
            />

            <GetMoreCard
              title="Share coupon discounts"
              subtitle="To attract new customers"
              bgColor="bg-white"
              icon={
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  %
                </div>
              }
              customButton={
                <button className="bg-orange-50 text-[#FF5C00] text-sm font-semibold px-5 py-1.5 rounded-xl hover:bg-orange-100 transition-colors duration-200">
                  Start
                </button>
              }
            />
          </div>
        </div>

        {/* Shortcuts Section */}
        <div className="px-4 mb-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Shortcuts
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {shortcuts
              .filter((s) => s.added)
              .map((s) => (
                <ShortcutCard key={s.label} label={s.label} icon={s.icon} />
              ))}
            <ShortcutCard
              label="Add new shortcut"
              isAddCard
              onClick={() => setShortcutModalOpen(true)}
            />
          </div>
        </div>

        <ShortcutModal
          isOpen={isShortcutModalOpen}
          onClose={() => setShortcutModalOpen(false)}
          shortcuts={shortcuts}
          onToggle={handleToggleShortcut}
          onSave={() => setShortcutModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default SellerDashboard;
