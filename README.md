# Sunvoy Legacy Web Scraper

This Node.js script reverse-engineers internal API calls of the legacy application at [challenge.sunvoy.com](https://challenge.sunvoy.com). It fetches a list of users and the currently authenticated user's details, and stores the results in a `users.json` file.

## Features

- Logs in using legacy credentials (username:`demo@example.org`, password: `test`)
- Extracts `nonce` from login page
- Authenticates and stores session in a local `.auth.json` file
- Reuses valid session across runs
- Fetches:
  - Top 10 users
  - Currently authenticated user's info
- Outputs data to a pretty formatted `users.json` file
- Handles token expiration and retries login if necessary

## Tech Stack

- Node.js (LTS v20.x)
- TypeScript
- Axios (HTTP requests)
- Native Node.js modules (`fs/promises`, `crypto`)

## Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/rajneeshkumar711/challenge_sunvoy_scrapper.git
   cd challenge_sunvoy_scrapper
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the script**

   ```bash
   npm run start
   ```

4. **Output**
   - Script creates a file named `users.json` in the root directory containing:
     - Top 10 users
     - Authenticated user’s info

## Example `users.json` Output

```json
{
  "users": [
    {
      "id": "123",
      "firstName": "User1",
      "lastName": "Last1",
      "email": "user1@example.org"
    },
    ...
  ],
  "currentUser": {
    "id": "999",
    "firstName": "John",
    "lastName": "Doe",
    "email": "demo@example.org"
  }
}
```

## Project Structure

```
├── .auth.json               # Stores session cookie (auto-created)
├── users.json               # Output file with fetched data
├── .env                     # Environment variables
├── src
│   ├── index.ts             # Main execution script
│   ├── auth
│   │   └── index.ts         # Handles login and session management
│   ├── users
│   │   └── index.ts         # Fetches users and current user info
│   ├── types
│   │   └── common.ts        # Shared type definitions
│   └── utils
│       ├── config.ts        # Environment/config setup
│       └── utility.ts       # Utility functions (e.g., HMAC, token, extractors)
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```
