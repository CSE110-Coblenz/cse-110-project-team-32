import { describe, it, expect, beforeEach } from "vitest";
import { LoginScreenModel } from "../src/screens/LoginScreen/LoginScreenModel";

describe("LoginScreenModel", () => {
  let model: LoginScreenModel;

  beforeEach(() => {
    model = new LoginScreenModel();
  });

  it("sets and gets username", () => {
    model.setUsername("ridhi");
    expect(model.getUsername()).toBe("ridhi");
  });

  it("sets and gets password", () => {
    model.setPassword("secret123");
    expect(model.getPassword()).toBe("secret123");
  });

  it("clears both username and password", () => {
    model.setUsername("user");
    model.setPassword("pass");

    model.clearCredentials();

    expect(model.getUsername()).toBe("");
    expect(model.getPassword()).toBe("");
  });

  it("sets and gets user ID", () => {
    model.setUserId(42);
    expect(model.getUserId()).toBe(42);
  });

  it("userId starts undefined until set", () => {
    // Access private with any-type to validate initial state
    expect((model as any).userid).toBeUndefined();
  });
});
