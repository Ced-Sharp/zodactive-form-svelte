<script lang="ts">
import { ZForm, ZFormField, type useForm } from "../src";

export let form: ReturnType<typeof useForm>;
export let onSubmit: () => void;
</script>

<ZForm {form} on:submit={onSubmit}>
    <ZFormField id="username" label="Username" path="username">
        <div slot="label" let:label>
            {label}
        </div>

        <svelte:fragment slot="error" let:error>
            {#if error}
                <ul><li>{error}</li></ul>
            {/if}
        </svelte:fragment>
    </ZFormField>

    <ZFormField id="email" path="email" label="Email" />
    <ZFormField id="password" path="password" label="Password" type="password" />
    <ZFormField id="confirmPassword" path="confirmPassword" label="Confirm Password" type="password" />

    <svelte:fragment slot="errors" let:errors>
        {#if errors.length}
            <ul>
                {#each errors as error}
                    <li>{error}</li>
                {/each}
            </ul>
        {/if}
    </svelte:fragment>
    
    <svelte:fragment slot="actions">
        <button type="submit">Register</button>
    </svelte:fragment>
</ZForm>
