import { createClient } from "@supabase/supabase-js";
import { fetchAccessToken } from "./helpers/auth";
import { getFromSecureStore, saveToSecureStore } from "./helpers/secureStore";

const supabaseUrl = "https://ijcorhcaxkyxheioiqti.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqY29yaGNheGt5eGhlaW9pcXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjkxMzYsImV4cCI6MjA0Njc0NTEzNn0.a5jb9HY-Sx6u4AgpxM9ctTtTfD44DVOuSHYjT3wH3Us";
const jwtServerUrl = "https://a634-106-51-171-57.ngrok-free.app/generate-jwt";

const fetchJwtToken = async (autolab_token) => {
  const supabaseJwt = await getFromSecureStore("supabase_jwt");
  const supabaseJwtExpiry = await getFromSecureStore("supabase_jwt_expiry");
  if (supabaseJwt !== null) {
    if (Date.now() < supabaseJwtExpiry) {
      console.log("Using cached jwt token");
      return supabaseJwt;
    }
  }

  // Generate a new token if it doesnt exist
  const response = await fetch(jwtServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: autolab_token }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch jwt token from server");
  }

  const data = await response.json();
  await saveToSecureStore("supabase_jwt", data.supabaseJwt);
  await saveToSecureStore(
    "supabase_jwt_expiry",
    (Date.now() + 1000 * 60 * 60 * 2).toString()
  ); // 2 hours expiry
  return data.supabaseJwt;
};

const initializeSupabaseClient = async (autolabToken) => {
  try {
    // Now get the jwtEncoded token
    const jwtToken = await fetchJwtToken(autolabToken);
    console.log("JWT Token:", jwtToken);

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize supabase client:", err);
    throw err;
  }
};

let supabase = null;

const initialize = async () => {
  if (supabase) {
    return;
  } else {
    try {
      const accessToken = await fetchAccessToken();
      console.log("Access token found, initializing supabase client...");
      supabase = await initializeSupabaseClient(accessToken);
    } catch (err) {
      // accessToken not found
      console.log("Access token not found, skipping supabase initialization");
    }
  }
};

const removeSupabaseClient = () => {
  supabase = null;
};

initialize();

export { initialize, supabase, removeSupabaseClient };
