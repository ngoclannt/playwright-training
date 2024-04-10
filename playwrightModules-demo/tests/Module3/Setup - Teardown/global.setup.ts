import { test as setup } from "@playwright/test";

export const authFile = "playwright/.auth/contactListSession.json";

setup("Session storage state", async ({ page }) => {
  console.log("Setup saving storage state...");
  const response = await page.request.post(
    "https://thinking-tester-contact-list.herokuapp.com/users/login",
    {
      data: {
        email: "lan.nguyen@test.com",
        password: "Password@123",
      },
    }
  );

  const { token } = await response.json();
  console.log(`Token: ${token}`);
  await page.context().storageState({ path: authFile });
});
