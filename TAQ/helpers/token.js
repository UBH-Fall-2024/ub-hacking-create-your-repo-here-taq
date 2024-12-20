import { getFromSecureStore } from "./secureStore";

export const isTokenValid = async () => {
  const expiry = await getFromSecureStore("autolab_token_expiry");
  const currentTime = Math.floor(Date.now() / 1000);

  if (!expiry || currentTime >= parseInt(expiry)) {
    console.log("Token expired or not found");
    return false;
  }

  console.log("Token is valid");
  return true;
};
