import { parseClientType, ClientType } from "../src/services/clientAuthUrl";

describe("ClientAuthUrl", () => {
  test("parsing Gmail client type", () => {
    expect(parseClientType("gmail")).toBe(ClientType.GMAIL);
  });
  test("parsing Office client type", () => {
    expect(parseClientType("office365")).toBe(ClientType.OFFICE);
  });
});
