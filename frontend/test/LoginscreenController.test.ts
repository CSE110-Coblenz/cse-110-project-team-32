import { describe, it, expect, beforeEach, vi } from "vitest";

// --- Stub global alert ---
vi.stubGlobal("alert", vi.fn());

// --- Mocks ---
vi.mock("../src/context/UserState.ts", () => ({
  userStore: {
    setUsername: vi.fn(),
    setCurrLevel: vi.fn(),
  },
}));

vi.mock("../src/screens/LoginScreen/LoginScreenView.ts", () => {
  return {
    LoginScreenView: vi.fn().mockImplementation(function (onLogin, onSignup) {
      return {
        show: vi.fn(),
        hide: vi.fn(),
        clearInputs: vi.fn(),
        showSignupModal: vi.fn(),
        prefillLoginFields: vi.fn(),
        __onLogin: onLogin,
        __onSignup: onSignup,
      };
    }),
  };
});

vi.mock("../src/screens/LoginScreen/LoginScreenModel.ts", () => {
  const setUsername = vi.fn();
  const setPassword = vi.fn();
  return {
    LoginScreenModel: vi.fn().mockImplementation(function () {
      return {
        setUsername,
        setPassword,
      };
    }),
  };
});

// --- Imports AFTER mocks ---
import { LoginScreenController } from "../src/screens/LoginScreen/LoginScreenController";
import { userStore } from "../src/context/UserState";
import { LoginScreenView } from "../src/screens/LoginScreen/LoginScreenView";
import { LoginScreenModel } from "../src/screens/LoginScreen/LoginScreenModel";

describe("LoginScreenController", () => {
  let switcher: any;
  let controller: LoginScreenController;

  beforeEach(() => {
    vi.clearAllMocks();

    switcher = {
      switchToScreen: vi.fn(),
    };

    controller = new LoginScreenController(switcher);
  });

  // --------------------------------------------
  it("creates model and view", () => {
    expect(LoginScreenModel).toHaveBeenCalledTimes(1);
    expect(LoginScreenView).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------
  it("successful login sets userStore + switches screen", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: vi.fn() }) // login
      .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ username: "ridhi", currLevel: 3 }) }) // fetch user
    );

    const MockedView = vi.mocked(LoginScreenView);
    const viewInstance = MockedView.mock.results[0].value;

    await viewInstance.__onLogin("ridhi", "pass123");

    // Get the mocked model instance
    const modelInstance = vi.mocked(LoginScreenModel).mock.results[0].value;

    expect(modelInstance.setUsername).toHaveBeenCalledWith("ridhi");
    expect(modelInstance.setPassword).toHaveBeenCalledWith("pass123");

    expect(userStore.setUsername).toHaveBeenCalledWith("ridhi");
    expect(userStore.setCurrLevel).toHaveBeenCalledWith(3);

    expect(switcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
  });

  // --------------------------------------------
  it("login failure shows alert and stops", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Invalid credentials" }),
    }));

    const MockedView = vi.mocked(LoginScreenView);
    const viewInstance = MockedView.mock.results[0].value;

    await viewInstance.__onLogin("ridhi", "wrong");

    expect(alert).toHaveBeenCalledWith("Login error: Invalid credentials");
    expect(switcher.switchToScreen).not.toHaveBeenCalled();
  });

  // --------------------------------------------
  it("handleSignup calls view.showSignupModal", () => {
    const MockedView = vi.mocked(LoginScreenView);
    const viewInstance = MockedView.mock.results[0].value;

    viewInstance.__onSignup();

    expect(viewInstance.showSignupModal).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------
  it("successful signup sets userStore + switches screen", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: vi.fn() }) // create user
      .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ username: "newUser", currLevel: 1 }) }) // fetch user
    );

    const MockedView = vi.mocked(LoginScreenView);
    const viewInstance = MockedView.mock.results[0].value;

    // Trigger signup callback
    viewInstance.__onSignup();

    expect(viewInstance.showSignupModal).toHaveBeenCalledTimes(1);

    const signupCb = viewInstance.showSignupModal.mock.calls[0][0];

    await signupCb("newUser", "pw123");

    const modelInstance = vi.mocked(LoginScreenModel).mock.results[0].value;

    expect(modelInstance.setUsername).toHaveBeenCalledWith("newUser");
    expect(modelInstance.setPassword).toHaveBeenCalledWith("pw123");
    expect(viewInstance.prefillLoginFields).toHaveBeenCalledWith("newUser", "pw123");
    expect(userStore.setUsername).toHaveBeenCalledWith("newUser");
    expect(userStore.setCurrLevel).toHaveBeenCalledWith(1);
    expect(switcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
  });

  // --------------------------------------------
  it("show calls view.show()", () => {
    const view = (LoginScreenView as any).mock.results[0].value;
    controller.show();
    expect(view.show).toHaveBeenCalled();
  });

  it("hide calls view.hide() and clearInputs()", () => {
    const view = (LoginScreenView as any).mock.results[0].value;
    controller.hide();
    expect(view.hide).toHaveBeenCalled();
    expect(view.clearInputs).toHaveBeenCalled();
  });
});
