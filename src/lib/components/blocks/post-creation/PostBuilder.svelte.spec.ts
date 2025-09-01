import { expect, describe, it } from 'vitest';
import PostForm from './PostForm.svelte';
import { render } from 'vitest-browser-svelte';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const mockData = {
	form: {
		id: 'form',
		data: {
			title: '',
			slug: '',
			excerpt: '',
			tags: [],
			contentHtml: '',
			contentJson: ''
		},
		errors: {},
		valid: false,
		posted: false,
		constraints: {}
	}
};

export const formSchema = z.object({
	title: z.string().trim().min(2).max(200),
	slug: z.string().min(2).lowercase(),
	excerpt: z.string().min(2).max(250),
	tags: z.string().array(),
	contentHtml: z.string().min(1),
	contentJson: z.any()
});

describe('PostForm.svelte', () => {
	it('renders the SlugField Component', async () => {
		const form = await superValidate(zod4(formSchema));

		const screen = render(PostForm, {
			data: {
				form: form
			}
		});
		const slugField = screen.getByLabelText('Post Slug');
		await expect.element(slugField).toBeInTheDocument();
	});
});
