import { act, fireEvent, render } from "@testing-library/svelte";
import { get } from "svelte/store";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { useForm } from "../src";

import TestFormWithSlots from "./test-form-with-slots.svelte";
import TestForm from "./test-form.svelte";

const onSubmit = vi.fn();

const testSchema = z
  .object({
    username: z.string().min(3, "3!"),
    email: z
      .string()
      .refine(
        (v) => /[a-zA-Z0-9_]{2,}@[a-zA-Z0-9_]{2,}\.[a-zA-Z0-9_]{2,}/.test(v),
        "@!",
      ),
    password: z.string().min(3, "3!"),
    confirmPassword: z.string().min(3, "3!"),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "P!",
  );

describe("Zodactive Form - Svelte - Form Component", () => {
  it("should render with default values", () => {
    const form = useForm(testSchema);

    // @ts-ignore
    const { container } = render(TestForm, { props: { form, onSubmit } });

    const usernameInput = container.querySelector("#username");
    expect(usernameInput).not.toBeNull();
    expect(usernameInput).toBeInstanceOf(HTMLInputElement);
    expect(usernameInput).toHaveProperty("value", "");

    expect(container.querySelector("#email")).toHaveProperty("value", "");
    expect(container.querySelector("#password")).toHaveProperty("value", "");
    expect(container.querySelector("#confirmPassword")).toHaveProperty(
      "value",
      "",
    );

    expect(get(form.valid)).toBe(false);
  });

  it("should render with initial values", () => {
    const initialData = {
      username: "user",
      email: "user@example.com",
      password: "password",
      confirmPassword: "password",
    };

    const form = useForm(testSchema, initialData);

    // @ts-ignore
    const { container } = render(TestForm, { props: { form, onSubmit } });

    expect(container.querySelector("#username")).toHaveProperty(
      "value",
      "user",
    );
    expect(container.querySelector("#email")).toHaveProperty(
      "value",
      "user@example.com",
    );
    expect(container.querySelector("#password")).toHaveProperty(
      "value",
      "password",
    );
    expect(container.querySelector("#confirmPassword")).toHaveProperty(
      "value",
      "password",
    );

    expect(get(form.valid)).toBe(true);
  });

  it("should give errors when validating an invalid form", () => {
    const form = useForm(testSchema);
    // @ts-ignore
    render(TestForm, { props: { form, onSubmit } });

    form.validate();
    expect(get(form.valid)).toBe(false);
    expect(get(form.form)).toMatchObject({
      username: { value: "", error: "3!" },
      email: { value: "", error: "@!" },
      password: { value: "", error: "3!" },
      confirmPassword: { value: "", error: "3!" },
    });
  });

  it("should give form errors when there are errors that do not belong to a field", async () => {
    const form = useForm(testSchema);
    // @ts-ignore
    render(TestForm, { props: { form, onSubmit } });

    form.assign("username", "user");
    form.assign("email", "user@example.com");
    form.assign("password", "password");
    form.assign("confirmPassword", "password2");

    await act(() => form.validate());

    expect(get(form.valid)).toBe(false);
    expect(get(form.formErrors)).toHaveLength(1);
    expect(get(form.formErrors)[0]).toBe("P!");
  });

  it("should receive the global errors when using the named slot", async () => {
    const form = useForm(testSchema);
    // @ts-ignore
    const { container } = render(TestFormWithSlots, {
      props: { form, onSubmit },
    });

    form.assign("username", "user");
    form.assign("email", "user@example.com");
    form.assign("password", "password");
    form.assign("confirmPassword", "password2");

    await act(() => form.validate());

    expect(get(form.valid)).toBe(false);
    expect(get(form.formErrors)).toHaveLength(1);
    expect(get(form.formErrors)[0]).toBe("P!");

    expect(container.querySelector("ul")).not.toBeNull();
  });

  it("should update field values when updating the form", async () => {
    const form = useForm(testSchema);
    // @ts-ignore
    const { container } = render(TestFormWithSlots, {
      props: { form, onSubmit },
    });

    expect(get(form.form)).toHaveProperty("username", { value: "", error: "" });
    expect(container.querySelector("#username")).toHaveProperty("value", "");

    await act(() => form.assign("username", "user"));

    expect(get(form.form)).toHaveProperty("username", {
      value: "user",
      error: "",
    });
    expect(container.querySelector("#username")).toHaveProperty(
      "value",
      "user",
    );
  });

  it("should update the form when updating a field", async () => {
    const form = useForm(testSchema);
    // @ts-ignore
    const { container } = render(TestFormWithSlots, {
      props: { form, onSubmit },
    });

    expect(get(form.form)).toHaveProperty("username", { value: "", error: "" });
    expect(container.querySelector("#username")).toHaveProperty("value", "");

    const username = container.querySelector("#username");
    expect(username).not.toBeNull();

    await fireEvent.input(username as HTMLInputElement, {
      target: { value: "user" },
    });

    expect(get(form.form)).toHaveProperty("username", {
      value: "user",
      error: "",
    });
    expect(username).toHaveProperty("value", "user");
  });

  it("should emit submit event only if form is valid", async () => {
    const spy = vi.fn();
    const form = useForm(testSchema);
    // @ts-ignore
    const { container } = render(TestFormWithSlots, {
      props: { form, onSubmit: spy },
    });

    expect(spy).not.toHaveBeenCalled();

    const submit = container.querySelector("button[type='submit']");
    expect(submit).not.toBeNull();

    await fireEvent.click(submit as HTMLButtonElement);

    expect(get(form.valid)).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    await Promise.all([
      fireEvent.input(
        container.querySelector("#username") as HTMLInputElement,
        {
          target: { value: "user" },
        },
      ),
      fireEvent.input(container.querySelector("#email") as HTMLInputElement, {
        target: { value: "user@example.com" },
      }),
      fireEvent.input(
        container.querySelector("#password") as HTMLInputElement,
        {
          target: { value: "password" },
        },
      ),
      fireEvent.input(
        container.querySelector("#confirmPassword") as HTMLInputElement,
        {
          target: { value: "password2" },
        },
      ),
    ]);

    await fireEvent.click(submit as HTMLButtonElement);

    expect(get(form.valid)).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    await fireEvent.input(
      container.querySelector("#confirmPassword") as HTMLInputElement,
      {
        target: { value: "password" },
      },
    );

    await fireEvent.click(submit as HTMLButtonElement);

    expect(get(form.valid)).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
});
