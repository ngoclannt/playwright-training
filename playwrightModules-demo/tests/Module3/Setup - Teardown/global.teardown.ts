import { expect, test as teardown } from '@playwright/test';
import fs from "fs";

teardown('Global teardown', async ({ request }) => {
    const authFile = "playwright/.auth/contactListSession.json";
    const state = JSON.parse(fs.readFileSync(authFile, "utf-8"));
    const tokenCookie = state.cookies.find(
      (cookie: { name: string; value: string }) => cookie.name === "token"
    ).value;

    const response = await request.post(
      `https://thinking-tester-contact-list.herokuapp.com/users/logout`,
      {
        headers: {
          Authorization: `Bearer ${tokenCookie}`,
        },
      }
    );
    expect(response.ok()).toBeTruthy();
    fs.unlinkSync(authFile);
});