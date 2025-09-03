import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SlugField from '../SlugField.svelte';

const SLUG_EXCEEDED =
	'xqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyqwertyuiop';
const SLUG_TRUNCATED =
	'xqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyzudwplsgfkbiaexqjvhrmtncoyqwerty';

describe('Slug Component', () => {
	it('kebab-cases and removes punctuation', async () => {
		const screen = render(SlugField, {
			title: 'Hello, World!',
			slug: ''
		});

		const input = screen.getByRole('textbox');

		await expect(input).toHaveValue('hello-world');
	});

	it('collapses whitespace and dashes', async () => {
		const screen = render(SlugField, {
			title: 'A   B -- C',
			slug: ''
		});

		const input = screen.getByRole('textbox');

		await expect(input).toHaveValue('a-b-c');
	});

	it('truncates slugs that exceed maximum character threshold', async () => {
		const screen = render(SlugField, {
			title: SLUG_EXCEEDED,
			slug: ''
		});

		const input = screen.getByRole('textbox');

		await expect(input).toHaveValue(SLUG_TRUNCATED);
	});
});
