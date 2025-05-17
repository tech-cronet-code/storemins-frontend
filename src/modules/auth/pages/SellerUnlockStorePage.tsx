import AdFormContainer from "../containers/AdFormContainer";
import SellerUnlockStoreContainer from "../containers/SellerUnlockStoreContainer";

const SellerUnlockStorePage = () => {
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row">
        {/* <div className="hidden sm:block md:block"> */}
          <AdFormContainer />
        {/* </div> */}

        {/* RIGHT SIDE - 50% width */}
        <div className="lg:w-full md:w-3xl flex justify-center item-center lg:px-2 xl:px-10 md:mx-auto mx-5 lg:mt-45">
          <div className="flex flex-col gap-3 mx-auto sm:mx-10 sm:mt-5 w-full max-w-dvh">
            <SellerUnlockStoreContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerUnlockStorePage;
