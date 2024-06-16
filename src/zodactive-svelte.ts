import type {
  FormFields,
  Obj,
  ObjEffect,
  ZodactiveOptions,
} from "@zodactive-form/core";
import { useZodactiveForm } from "@zodactive-form/core";
import { type Writable, get, writable } from "svelte/store";
import type { z } from "zod";

export const useForm = <S extends Obj | ObjEffect>(
  schema: S,
  initialData?: z.TypeOf<S>,
) => {
  const options: ZodactiveOptions<Writable<unknown>> = {
    createReactive: () => writable(),
    getReactive: (ref: Writable<unknown>) => get(ref),
    setReactive: (ref: Writable<unknown>, value: unknown) => {
      switch (Object.prototype.toString.call(value)) {
        case "[object Object]":
          ref.set({ ...(value as object) });
          break;
        case "[object Array]":
          ref.set([...(value as any[])]);
          break;
        default:
          ref.set(value);
      }
    },
  };

  const {
    form: formRef,
    formErrors: formErrorsRef,
    valid: validRef,
    ...others
  } = useZodactiveForm<S, Writable<unknown>>(options, schema, initialData);

  const form = formRef as Writable<FormFields<z.TypeOf<S>>>;
  const formErrors = formErrorsRef as Writable<string[]>;
  const valid = validRef as Writable<boolean>;

  return {
    form,
    formErrors,
    valid,
    ...others,
  };
};
