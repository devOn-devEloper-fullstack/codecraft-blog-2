import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';
import { page } from '@vitest/browser/context';

test('renders SlugField component', async () => {
	render(Page);
	const slugField = page.getByPlaceholder('Enter a unique slug for your post');
	await expect.element(slugField).toBeInTheDocument();
});
