<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import Password from '$lib/components/auth/password.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	// STEP #1: Data loading properties

	let { data }: { data: PageData } = $props();

	// STEP #2: Declare state variables

	let form = $derived(
		superForm(data.form, {
			validators: zod4Client(formSchema),
			dataType: 'json'
		})
	);

	let formData = $derived(form.form);
	let errors = $derived(form.errors);
	let message = $derived(form.message);
	let submitting = $derived(form.submitting);
	let enhance = $derived(form.enhance);
</script>

<Card.Root class="mx-auto mt-[50vh] h-[65vh] w-[25vw] -translate-y-1/2 justify-center">
	<Card.Header class="text-center">
		<Card.Title class="text-2xl">Sign up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if $message}
			<div class="mt-3 rounded-md text-center text-green-700">
				{$message}
			</div>
		{/if}

		<form action="?/signUp" method="POST" use:enhance class="flex flex-col gap-2">
			<Form.Field {form} name="fullname">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full Name:</Form.Label>
						<Input
							{...props}
							bind:value={$formData.fullname}
							placeholder="Enter your first and last name"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email:</Form.Label>
						<Input {...props} bind:value={$formData.email} placeholder="Enter you email address" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password:</Form.Label>
						<Password
							bind:value={$formData.password}
							placeholder="Enter a secure password"
							{...props}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="passwordConfirm">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Password
							bind:value={$formData.passwordConfirm}
							placeholder="Confirm your password"
							{...props}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex justify-between pb-6">
				<a href="/auth/sign-in">Sign In Instead</a>
			</div>

			<Form.Button disabled={$submitting} class="w-full">
				{$submitting ? 'Submitting...' : 'Submit'}
			</Form.Button>

			{#if $errors?._errors}
				<div class="mt-3 rounded-md text-red-700">
					{$errors?._errors}
				</div>
			{/if}
		</form>
	</Card.Content>
</Card.Root>
