import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from '@vitest/browser/context';
import TagInput from '../TagInput.svelte';

const errorMessage =
	'You have added too many tags. Please review your tag selection and try again.';
describe('Slug Component', () => {
	it('renders a new tag from a user input', async () => {
		const screen = render(TagInput, {
			tags: []
		});

		const input = screen.getByRole('textbox');
		const button = screen.getByTestId('button');

		await userEvent.fill(input, 'Tag Insert');
		await userEvent.click(button);

		const tag = screen.getByText('Tag Insert');

		await expect(tag).toBeInTheDocument();
	});

	it('displays an error message if a user attempts to exceed maximum allowable tags', async () => {
		const screen = render(TagInput, {
			tags: []
		});

		const input = screen.getByRole('textbox');
		const button = screen.getByTestId('button');

		await userEvent.fill(input, '1');
		await userEvent.click(button);

		await userEvent.fill(input, '2');
		await userEvent.click(button);

		await userEvent.fill(input, '3');
		await userEvent.click(button);

		await userEvent.fill(input, '4');
		await userEvent.click(button);

		await userEvent.fill(input, '5');
		await userEvent.click(button);

		const message = screen.getByText(errorMessage);

		await expect(message).toBeInTheDocument();
	});

	it('disables button if user attempts to exceed maximum allowable tags', async () => {
		const screen = render(TagInput, {
			tags: []
		});

		const input = screen.getByRole('textbox');
		const button = screen.getByTestId('button');

		await userEvent.fill(input, '1');
		await userEvent.click(button);

		await userEvent.fill(input, '2');
		await userEvent.click(button);

		await userEvent.fill(input, '3');
		await userEvent.click(button);

		await userEvent.fill(input, '4');
		await userEvent.click(button);

		await userEvent.fill(input, '5');
		await userEvent.click(button);

		expect(button).toHaveAttribute('disabled');
	});

	it('allows a user to delete an inputted tag', async () => {
		const screen = render(TagInput, {
			tags: []
		});

		const input = screen.getByRole('textbox');
		const button = screen.getByTestId('button');

		await userEvent.fill(input, 'Tag Insert');
		await userEvent.click(button);

		const tag = screen.getByText('Tag Insert');
		const deleteButton = screen.getByText('✕');

		await userEvent.click(deleteButton);

		await expect.poll(() => tag.query()).not.toBeInTheDocument();
	});

	it('initializes state by rendering tags when passed properties', async () => {
		const screen = render(TagInput, {
			tags: ['Tag Input 1', 'Tag Input 2']
		});

		const tag = screen.getByText('Tag Input 1');

		await expect(tag).toBeInTheDocument();
	});
});
