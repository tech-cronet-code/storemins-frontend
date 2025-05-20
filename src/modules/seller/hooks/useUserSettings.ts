import { useState } from "react";

const useUserSettings = () => {
  const [userData, setUserData] = useState({
    name: "Charlene Reed",
    email: "charlenereed@gmail.com",
    password: "*********",
    // ... more fields
  });

  const updateUser = async (updated: typeof userData) => {
    // connect to API, handle optimistic update or errors
    console.log("Saving user:", updated);
    setUserData(updated);
  };

  return { userData, updateUser };
};

export default useUserSettings;
  