import { writeFile } from "fs/promises";
import { getAuthToken } from "./auth";
import { fetchUsers, fetchCurrentUser } from "./users";
import { getAuthValues } from "./utils/utility";
import { OUTPUT_FILE } from "./utils/config";

const main = async (retryCount: number = 0): Promise<void> => {
  if (retryCount > 1) {
    console.error("Authentication failed multiple times. Aborting...");
    return;
  }

  try {
    console.log("Authenticating user...");
    await getAuthToken();

    console.log("Fetching users...");
    const users = await fetchUsers();
    if (!users) throw new Error("Could not fetch users");

    console.log("Getting current user auth values...");
    const authValues: any = await getAuthValues();
    if (!authValues) throw new Error("Could not get auth values");

    console.log("Fetching current user...");
    const currentUser = await fetchCurrentUser(authValues);
    if (!currentUser) throw new Error("Could not fetch current user");

    const result = {
      users,
      currentUser
    };

    await writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`${OUTPUT_FILE} created successfully!`);
  } catch (error: any) {
    if (error.status === 401) {
      console.warn("Unauthorized. Retrying...");
      await main(retryCount + 1);
    } else {
      console.error("Error:", error.message);
    }
  }
}

main();
