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
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';

	/** Properties **/
	let { editor = $bindable(), controlToolbar, image }: EditorProps = $props();
	let contentHTML: string = $state('');

	/** State Declaration **/

	let elementReference: HTMLDivElement | undefined = $state();

	function getHTML() {
		contentHTML = elementReference?.innerHTML ?? '';
	}

	const lowlight = createLowlight();

	lowlight.register('html', html);
	lowlight.register('css', css);
	lowlight.register('js', js);
	lowlight.register('ts', ts);

	/** Tiptap Instantiation **/

	onMount(() => {
		editor = new Editor({
			element: elementReference,
			extensions: [
				StarterKit,
				Image,
				CodeBlockLowlight.configure({
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
			content: `
        <p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>
      `,
			onTransaction: () => {
				editor = editor;
			}
		});
	});
</script>

<div class="editor-container">
	<EditorToolbar {editor} {image} />
	<div bind:this={elementReference} class="editor"></div>
</div>

<button onclick={getHTML} class="toolbar-button">Get HTML</button>
<p>{contentHTML}</p>
