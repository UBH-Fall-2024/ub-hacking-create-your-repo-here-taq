import { getFromSecureStore } from "./secureStore";

export const fetchAccessToken = async () => {
  const token = await getFromSecureStore("autolab_token");
  if (!token) {
    throw new Error("Access token not found");
  }

  return token;
};
