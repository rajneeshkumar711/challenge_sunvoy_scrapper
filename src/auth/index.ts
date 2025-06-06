import axios, { AxiosResponse } from "axios";
import { credential, BASE_URL, AUTH_FILE } from "../utils/config";
import { getNonceValue } from "../utils/utility";
import { writeFile, readFile, unlink } from "fs/promises";

let cookieHeader = "";

export const getCookieHeader = () => cookieHeader;

// Save token to local file to reuse token
const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await writeFile(AUTH_FILE, JSON.stringify({ token }, null, 2));
  } catch (err: any) {
    console.error("Failed to save auth token:", err.message);
  }
}

// Load existing token from local saved file
const loadAuthToken = async (): Promise<string | null> => {
  try {
    const data = await readFile(AUTH_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.token;
  } catch {
    return null;
  }
}

// Remove saved token from local file
export const removeAuthToken = async (): Promise<void> => {
  try {
    await unlink(AUTH_FILE);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn("Auth token file does not exist. Skipping delete.");
    } else {
      console.error("Failed to delete auth token:", err.message);
    }
  }
}

// Perform login and append cookies to session
const login = async (): Promise<void> => {
  const nonce = await getNonceValue();
  const formData = new URLSearchParams({
    ...credential,
    nonce
  }).toString();

  const res: AxiosResponse<any> = await axios.post(`${BASE_URL}/login`, formData, {
    headers: {
      Cookie: cookieHeader
    },
    maxRedirects: 0,
    validateStatus: (status: any) => status < 400
  });

  const setCookie = res.headers["set-cookie"];
  if (setCookie) {
    cookieHeader = setCookie.map((c: string) => c.split(";")[0]).join("; ");
    await saveAuthToken(cookieHeader);
  }
}

// Get valid auth token
export const getAuthToken = async (): Promise<void> => {
  let token = await loadAuthToken();
  if (token) {
    console.log("Using existing local stored token...");
    cookieHeader = token;
    return;
  }
  else {
    console.log("Logging in...");
    await login();
  }
}

