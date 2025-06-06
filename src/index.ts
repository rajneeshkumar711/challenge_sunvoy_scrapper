import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://challenge.sunvoy.com";

const credential: { username: string; password: string } = {
  username: "demo@example.org",
  password: "test"
}

let cookieHeader = "";

// Fetch the login page and extract the nonce value
const getNonceValue = async (): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/login`, {
    withCredentials: true
  });
  const html = response.data as string;
  const regex = new RegExp(`<input[^>]*name=["']nonce["'][^>]*value=["']([^"']+)["']`);
  const matchNonce = html.match(regex);
  if (!matchNonce) {
    throw new Error("nonce not found in HTML");
  }
  return matchNonce[1];
}

// Perform login and append cookies to session
const login = async (): Promise<void> => {
  const nonce = await getNonceValue();
  const formData = new URLSearchParams({
    ...credential,
    nonce
  }).toString();

  const res = await axios.post(`${BASE_URL}/login`, formData, {
    headers: {
      Cookie: cookieHeader
    },
    maxRedirects: 0,
    validateStatus: (status: any) => status < 400
  });

  const setCookie = res.headers["set-cookie"];
  if (setCookie) {
    const newCookies = setCookie.map((c: string) => c.split(";")[0]).join("; ");
    cookieHeader = `${newCookies}`;
  }
}

// Fetch the user list
const fetchUsers = async (): Promise<any> => {
  try {
    const res: AxiosResponse<any[]> = await axios.post(`${BASE_URL}/api/users`, {}, {
      headers: {
        Cookie: cookieHeader
      }
    });
    return res.data.slice(0, 10);
  } catch (error: any) {
  }
}

// Main execution flow
const main = async (): Promise<void> => {
  try {
    console.log("Authenticating user...");
    await login();

    console.log("Fetching users...");
    const users = await fetchUsers();
    console.log(users);

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

main();
