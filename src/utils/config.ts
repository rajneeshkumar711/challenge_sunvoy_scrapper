import dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.BASE_URL || "";
export const SETTING_URL = process.env.SETTING_URL || "";
export const AUTH_FILE = process.env.AUTH_FILE || "";
export const OUTPUT_FILE = process.env.OUTPUT_FILE || "";
export const HMAC_SECRET = process.env.HMAC_SECRET || "";

export const credential = {
  username: process.env.NODE_USERNAME || "",
  password: process.env.NODE_PASSWORD || ""
};