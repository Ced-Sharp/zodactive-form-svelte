<script lang="ts">
import { ZForm, ZFormField, type useForm } from "../src";

export let form: ReturnType<typeof useForm>;
export let onSubmit: () => void;
</script>

<ZForm {form} on:submit={onSubmit}>
    <ZFormField id="username" path="username" label="Username" />
    <ZFormField id="email" path="email" label="Email" />
    <ZFormField id="password" path="password" label="Password" type="password" />
    <ZFormField id="confirmPassword" path="confirmPassword" label="Confirm Password" type="password" />
</ZForm>
