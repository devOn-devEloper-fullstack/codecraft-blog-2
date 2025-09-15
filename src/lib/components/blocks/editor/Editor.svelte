<script lang="ts">
	import './styles/editor.css';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { onMount } from 'svelte';
	import type { EditorProps } from '$lib/types';
	import EditorToolbar from './EditorToolbar.svelte';
	import { createLowlight } from 'lowlight';
	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';
	// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import { getEditorState, setEditorState } from '../post-creation/state.svelte';
	import { CustomCodeBlock } from './CustomCodeBlock';
	import { getFullHTMLWithPreservedNewlines } from './GetHTML';

	/** Properties **/
	let {
		image,
		content,
		htmlContent = $bindable(),
		jsonContent = $bindable()
	}: Omit<EditorProps, 'editor' | 'controlToolbar'> = $props();
	let contentHTML: string = $state('');

	/** State Declaration **/

	let elementReference: HTMLDivElement | undefined = $state();
	let innerHtml: string | undefined = $state();
	let editor = getEditorState();

	/** Setup lowlight instantiation **/

	const lowlight = createLowlight();

	lowlight.register('html', html);
	lowlight.register('css', css);
	lowlight.register('js', js);
	lowlight.register('ts', ts);

	/** Tiptap Instantiation **/

	onMount(() => {
		setEditorState(
			new Editor({
				element: elementReference,
				extensions: [
					StarterKit,
					Image,
					CustomCodeBlock.configure({
						lowlight
					}),
					Link.configure({
						openOnClick: false,
						autolink: true,
						defaultProtocol: 'https',
						protocols: ['http', 'https'],
						isAllowedUri: (url, ctx) => {
							try {
								// construct URL
								const parsedUrl = url.includes(':')
									? new URL(url)
									: new URL(`${ctx.defaultProtocol}://${url}`);

								// use default validation
								if (!ctx.defaultValidate(parsedUrl.href)) {
									return false;
								}

								// disallowed protocols
								const disallowedProtocols = ['ftp', 'file', 'mailto'];
								const protocol = parsedUrl.protocol.replace(':', '');

								if (disallowedProtocols.includes(protocol)) {
									return false;
								}

								// only allow protocols specified in ctx.protocols
								const allowedProtocols = ctx.protocols.map((p) =>
									typeof p === 'string' ? p : p.scheme
								);

								if (!allowedProtocols.includes(protocol)) {
									return false;
								}

								// disallowed domains
								const disallowedDomains = ['example-phishing.com', 'malicious-site.net'];
								const domain = parsedUrl.hostname;

								if (disallowedDomains.includes(domain)) {
									return false;
								}

								// all checks have passed
								return true;
							} catch {
								return false;
							}
						},
						shouldAutoLink: (url) => {
							try {
								// construct URL
								const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`);

								// only auto-link if the domain is not in the disallowed list
								const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com'];
								const domain = parsedUrl.hostname;

								return !disallowedDomains.includes(domain);
							} catch {
								return false;
							}
						}
					})
				],
				content: content,
				onTransaction: () => {
					editor = getEditorState();
				}
			})
		);
		htmlContent = getFullHTMLWithPreservedNewlines(getEditorState()) ?? '';
		jsonContent = getEditorState()?.getJSON() ?? '';
	});

	/** Setting HTML & JSON Content */
	function getElementContent() {
		htmlContent = getFullHTMLWithPreservedNewlines(getEditorState()) ?? '';
		jsonContent = editor?.getJSON() ?? '';
	}
</script>

<div class="editor-container">
	<EditorToolbar editor={getEditorState()} {image} />
	<div bind:this={elementReference} class="editor" oninput={() => getElementContent()}></div>
	<input bind:value={htmlContent} name="contentHtml" hidden />
	<input bind:value={jsonContent} name="contentJson" hidden />
</div>
