<script lang="ts">
import { createEventDispatcher, setContext } from "svelte";
import { derived } from "svelte/store";
import type { useForm } from "./zodactive-svelte";

export let id = "";
export let className = "";
export let hideErrors = false;
export let form: ReturnType<typeof useForm>;

if (!form) throw new Error("Missing required prop 'form'!");

setContext("form", form);

const dispatch = createEventDispatcher();
const formErrors = derived(form.formErrors, (errors) => errors);

const onSubmit = (e: Event) => {
  e.preventDefault();
  if (form.validate()) {
    dispatch("submit");
  }
};
</script>

<form {id} class={className} on:submit={onSubmit}>
    <slot />
    <slot name="errors" errors={$formErrors}>
        {#if !hideErrors}
            {#each $formErrors as error}
                <p>{error}</p>
            {/each}
        {/if}
    </slot>
    <slot name="actions">
        <button type="submit">Submit</button>
    </slot>
</form>