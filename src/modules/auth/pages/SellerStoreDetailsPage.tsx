import AdFormContainer from "../containers/AdFormContainer";
import SellerStoreDetailsContainer from "../containers/SellerStoreDetailsContainer";

const SellerStoreDetailsPage = () => {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* <div className="hidden sm:block md:block"> */}
          <AdFormContainer />
        {/* </div> */}

        {/* RIGHT SIDE - 50% width */}
        <div className="lg:w-full md:w-3xl flex justify-center lg:px-10 md:mx-auto mx-5">
          <div className="flex flex-col gap-3 mx-auto sm:mx-10 sm:mt-5  w-full max-w-dvh">
            <SellerStoreDetailsContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerStoreDetailsPage;
