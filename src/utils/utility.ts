import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import { HMAC_SECRET, BASE_URL } from "./config";
import { AuthValues } from "../types/common";
import { getCookieHeader, removeAuthToken } from "../auth";

// Extract value from html
const extractFromHtml = (html: string, by: string, search: string): string => {
  const regex = new RegExp(`<input[^>]*${by}=["']${search}["'][^>]*value=["']([^"']+)["']`);
  const match = html.match(regex);
  if (!match) {
    throw new Error(`${search} not found in HTML`);
  }
  return match[1];
}

// Create checkcode 
const createCheckCode = async (params: any): Promise<string> => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const fullParams = { ...params, timestamp };
  const payload = Object.keys(fullParams)
    .sort()
    .map(key => `${key}=${encodeURIComponent(fullParams[key])}`)
    .join("&");
  const hmac = crypto.createHmac("sha1", HMAC_SECRET);
  hmac.update(payload);

  return hmac.digest("hex").toUpperCase();
}

// Fetch the login page and extract the nonce value
export const getNonceValue = async (): Promise<string> => {
  const response: AxiosResponse<any> = await axios.get(`${BASE_URL}/login`, {
    withCredentials: true
  });
  const html = response.data as string;
  return extractFromHtml(html, "name", "nonce");
}

// get auth values of currently loggedin user
export const getAuthValues = async (): Promise<AuthValues | undefined> => {
  try {
    const res: AxiosResponse<any> = await axios.get(`${BASE_URL}/settings/tokens`, {
      headers: {
        Cookie: getCookieHeader()
      }
    });

    const html = res.data as string;
    const access_token = extractFromHtml(html, "id", "access_token");
    const openId = extractFromHtml(html, "id", "openId");
    const userId = extractFromHtml(html, "id", "userId");
    const apiuser = extractFromHtml(html, "id", "apiuser");
    const operateId = extractFromHtml(html, "id", "operateId");
    const language = extractFromHtml(html, "id", "language");

    const authValues = {
      access_token,
      openId,
      userId,
      apiuser,
      operateId,
      language
    };
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const checkcode = await createCheckCode(authValues);

    return {
      ...authValues,
      checkcode,
      timestamp
    }

  } catch (error: any) {
    await handleUnauthorized(error);
  }
}

// Handle 401 Unauthorized 
export const handleUnauthorized = async (error: any): Promise<void> => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    await removeAuthToken();
  }
  throw error;
}