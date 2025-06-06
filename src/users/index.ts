import axios, { AxiosResponse } from "axios";
import { BASE_URL, SETTING_URL } from "../utils/config";
import { User, AuthValues } from "../types/common";
import { getCookieHeader } from "../auth";
import { handleUnauthorized } from "../utils/utility";

// Fetch the user list
export const fetchUsers = async (): Promise<User[] | undefined> => {
  try {
    const res: AxiosResponse<any[]> = await axios.post(`${BASE_URL}/api/users`, {}, {
      headers: {
        Cookie: getCookieHeader()
      }
    });
    return res.data.slice(0, 10);
  } catch (error: any) {
    await handleUnauthorized(error);
  }
}

// Fetch the currently authenticated userInfo
export const fetchCurrentUser = async (authValues: AuthValues): Promise<User | undefined> => {
  try {
    const res: AxiosResponse<any> = await axios.post(`${SETTING_URL}/api/settings`, authValues, {
      headers: {
        Cookie: getCookieHeader()
      }
    });
    return res.data;

  } catch (error: any) {
    await handleUnauthorized(error);
  }
}
