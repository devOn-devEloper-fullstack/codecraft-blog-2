import type { PostPictures } from '@prisma/client';
import { Editor } from '@tiptap/core';
import type { Snippet } from 'svelte';

export interface PostsDataTable {
	postTitle: string;
	tags: string;
	published: boolean;
	createdAt: string;
	publishedAt: string;
	view: string;
	edit: string;
}

export type UserImageAPIData = {
	page: number | null;
	limit: number | null;
	total: number | null | undefined;
	images: PostPictures[] | null | undefined;
};

export type EditorTypes = InstanceType<typeof Editor> | undefined;

export type EditorSnippet = Snippet<[EditorTypes]>;

export type EditorProps = {
	editor: EditorTypes;
	controlToolbar: EditorSnippet;
	image: string | null;
	content: string;
	htmlContent?: string | undefined;
	jsonContent?: unknown;
};

/** Content Engagement (Posts, Likes, Comments) */
export type CommentFormData = {
		comment: string;
		postId: string;
	};
