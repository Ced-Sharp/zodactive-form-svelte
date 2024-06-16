<script lang="ts">
import { getContext } from "svelte";
import { derived } from "svelte/store";
import type { useForm } from "./zodactive-svelte";

export let id = "";
export let className = "";
export let name = "";
export let label = "";
export let type: HTMLInputElement["type"] = "text";
export let path: string | string[];

if (!path) throw new Error("Missing required prop 'path'!");

const form = getContext<ReturnType<typeof useForm>>("form");

if (!form)
  throw new Error(
    "ZFormField: missing context. ZFormField must be used inside a ZForm!",
  );

const normalizedPath = Array.isArray(path) ? path : path.split(".");
const field = derived(form.form, () => form.getFieldByPath(normalizedPath));

const updateValue = (e: Event) =>
  form.assign(path, (e.target as HTMLInputElement).value);
</script>

<label for={id}>
    <slot name="label" {label}>
        <span>{label}</span>
    </slot>
    <slot name="input" {id} class={className} {type} inputName={name} value={$field.value}>
        <input {id} {name} {type} value={$field.value} on:input={updateValue} />
    </slot>
    <slot name="error" error={$field.error}>
        {#if $field.error}
            <p>{$field.error}</p>
        {/if}
    </slot>
</label>
