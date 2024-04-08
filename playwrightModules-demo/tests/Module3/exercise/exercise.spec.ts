import { expect, test } from "@playwright/test";
import fs from "fs";
import { Contact, addContact, deleteContact } from "./Contacts";
import { ContactListPage } from "../../../pages/ThinkingTesterAppPages/ContactListPage";

let tokenCookie: string;

test.beforeAll(async () => {
    const authFile = "playwright/.auth/contactListSession.json";
    const state = JSON.parse(fs.readFileSync(authFile, "utf-8"));
    tokenCookie = state.cookies.find(
        (cookie: { name: string; value: string }) => cookie.name === "token"
    ).value;
});

test("Create and validate a new contact @aaa", async ({ request }) => {
  const newContact: Contact = {
    firstName: "Test",
    lastName: "Addition",
    birthdate: "1970-01-01",
    email: "ln@test.com",
    phone: "123456789",
    street1: "1 Wynham St.",
    street2: "",
    city: "AKL",
    stateProvince: "AKL",
    postalCode: "1010",
    country: "NZ",
  };
  const response = await addContact(request, newContact, tokenCookie);
  await expect(response.ok()).toBeTruthy();

  const contactResponse = await response.json();
  await expect(contactResponse.email).toBe(newContact.email);
  await expect(contactResponse.firstName).toBe(newContact.firstName);
  await expect(contactResponse.lastName).toBe(newContact.lastName);
});

test("Delete a contact @aaa", async ({ request }) => {
  const newContact: Contact = {
    firstName: "Test",
    lastName: "Deletion",
    birthdate: "1970-01-01",
    email: "td@test.com",
    phone: "123456789",
    street1: "1 Wynham St.",
    street2: "",
    city: "AKL",
    stateProvince: "AKL",
    postalCode: "1010",
    country: "NZ",
  };

  const addContactResponse = await addContact(request, newContact, tokenCookie);
  expect(addContactResponse.ok()).toBeTruthy();
  const createdContact = await addContactResponse.json();

  const deleteResponse = await deleteContact(
    request,
    createdContact._id,
    tokenCookie
  );
  expect(await deleteResponse.ok()).toBeTruthy();
});

test("Mocking an empty contact list @aaa", async ({ request, page }) => {
  const firstContact: Contact = {
    firstName: "First",
    lastName: "Contact",
    birthdate: "1970-01-01",
    email: "ln@test.com",
    phone: "123456789",
    street1: "1 Wynham St.",
    street2: "",
    city: "AKL",
    stateProvince: "AKL",
    postalCode: "1010",
    country: "NZ",
  };
  const secondContact: Contact = {
    firstName: "Second",
    lastName: "Contact",
    birthdate: "1970-01-01",
    email: "ln@test.com",
    phone: "123456789",
    street1: "1 Wynham St.",
    street2: "",
    city: "AKL",
    stateProvince: "AKL",
    postalCode: "1010",
    country: "NZ",
  };
  await addContact(request, firstContact, tokenCookie);
  await addContact(request, secondContact, tokenCookie);

  await page.route(
    `https://thinking-tester-contact-list.herokuapp.com/contacts`,
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })
  );

  await page.goto(
    "https://thinking-tester-contact-list.herokuapp.com/contactList"
  );

  const contactListPage = new ContactListPage(page);
  await contactListPage.tableHasNoContact();
});
