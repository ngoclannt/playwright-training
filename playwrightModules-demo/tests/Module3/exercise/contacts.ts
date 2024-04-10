import { APIRequestContext, APIResponse } from "playwright";

export interface Contact {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface ContactResponse extends Contact {
    _id: string;
    owner: string;
    __v: number
}

export async function addContact(request: APIRequestContext, contact: Contact, token: string): Promise<APIResponse> {
  const response = await request.post(
    `https://thinking-tester-contact-list.herokuapp.com/contacts`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: contact
    }
  );
  return response;
}

export async function deleteContact(request: APIRequestContext, contactId: string, token: string): Promise<APIResponse> {
  const deleteResponse = await request.delete(
    `https://thinking-tester-contact-list.herokuapp.com/contacts/${contactId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  );
  return deleteResponse;
}