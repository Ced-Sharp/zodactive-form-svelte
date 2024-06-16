import type { SvelteComponent } from "svelte";
import type { useForm } from "./zodactive-form-svelte";

export interface ZFormFieldProps {
  id?: string;
  className?: string;
  name?: string;
  label?: string;
  type?: HTMLInputElement["type"];
  path: string | string[];
}

export default class ZForm extends SvelteComponent<
  ZFormProps,
  { submit: Event },
  {
    default: Record<string, never>;
    label: { label: string };
    error: { error: string };
  }
> {}
