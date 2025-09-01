import { expect, describe, it } from 'vitest';
import PostForm from './PostForm.svelte';
import { render } from 'vitest-browser-svelte';

describe('PostForm.svelte', () => {
	it('renders the SlugField Component', async () => {
		const screen = render(PostForm, {
			data: {
				form: {
					title: 'Post Title',
					slug: 'post-title',
					excerpt: 'Description about my post',
					tags: ['cool-tags', 'awesome-tags', 'super-tags'],
					contentHtml: '',
					contentJson: ''
				}
			}
		});
		const slugField = screen.getByLabelText('Post Slug');
		await expect.element(slugField).toBeInTheDocument();
	});
});
