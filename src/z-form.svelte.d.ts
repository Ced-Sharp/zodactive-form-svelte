import type { SvelteComponent } from "svelte";
import type { useForm } from "./zodactive-form-svelte";

export interface ZFormProps {
  id?: string;
  className?: string;
  hideErrors?: boolean;
  form: ReturnType<typeof useForm>;
}

export default class ZForm extends SvelteComponent<
  ZFormProps,
  { submit: Event },
  {
    default: Record<string, never>;
    errors: { errors: string[] };
    actions: Record<string, never>;
  }
> {}
