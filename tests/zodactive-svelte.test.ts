import type { FormFields } from "@zodactive-form/core";
import { type Writable, get } from "svelte/store";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import { useForm } from "../src";

const userSchema = z.object({
  name: z.string().min(3, "3!"),
  age: z.number().min(18, "18!"),
  displayName: z.string().min(3, "3!").optional(),
});

const matchInitial = {
  name: { value: "", error: "" },
  age: { value: 0, error: "" },
};

const matchInvalid = {
  name: { value: "a", error: "3!" },
  age: { value: 1, error: "18!" },
  displayName: { value: "b", error: "3!" },
};

const matchValidNoOptional = {
  name: { value: "test", error: "" },
  age: { value: 20, error: "" },
};

const matchValidWithOptional = {
  name: { value: "test", error: "" },
  age: { value: 20, error: "" },
  displayName: { value: "Test", error: "" },
};

describe("Zodactive Form - Svelte", () => {
  it("should return a svelte/store writable() with proper typing", () => {
    const { form, valid } = useForm(userSchema);
    expectTypeOf(form).toMatchTypeOf<
      Writable<FormFields<z.infer<typeof userSchema>>>
    >();
    expectTypeOf(valid).toMatchTypeOf<Writable<boolean>>();
  });

  it("should have the value react to calling `assign()`", () => {
    const { form, assign } = useForm(userSchema);
    expect(get(form)).toMatchObject(matchInitial);
    assign("name", "test");
    assign("age", 20);
    expect(get(form)).toMatchObject(matchValidNoOptional);
  });

  it("should have errors react to calling `validate()`", () => {
    const { form, assign, validate } = useForm(userSchema);
    expect(get(form)).toMatchObject(matchInitial);
    assign("name", "a");
    assign("age", 1);
    assign("displayName", "b");
    validate();
    expect(get(form)).toMatchObject(matchInvalid);
  });

  it("should have valid react to calling `validate()`", () => {
    const { assign, form, valid, validate } = useForm(userSchema);
    expect(get(valid)).toBe(false);
    assign("name", "test");
    assign("age", 20);
    validate();
    expect(get(valid)).toBe(true);
    assign("displayName", "Test");
    validate();
    expect(get(valid)).toBe(true);
    expect(get(form)).toMatchObject(matchValidWithOptional);
  });
});
