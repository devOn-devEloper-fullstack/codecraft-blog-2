import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const deleteAllAccounts = await prisma.account.deleteMany({});
	const deleteAllSessions = await prisma.session.deleteMany({});
	const deleteAllUsers = await prisma.user.deleteMany({});
	const deleteAllRevisions = await prisma.revision.deleteMany({});
	const deleteAllLikes = await prisma.postLike.deleteMany({});
	const deleteAllComments = await prisma.comment.deleteMany({});
	const deleteAllViews = await prisma.postViewEvent.deleteMany({});
	const deleteAllPostStats = await prisma.postStats.deleteMany({});
	const deleteAllModerationJobs = await prisma.moderationJob.deleteMany({})
	const deleteAllDecisions = await prisma.decision.deleteMany({})
	const deleteAllPosts = await prisma.posts.deleteMany({});
	
	// const deleteAllPictures = await prisma.postPictures.deleteMany({})
	// const deleteAllReviewTasks = await prisma.reviewTask.deleteMany({})

	const user = await prisma.user.createManyAndReturn({
		data: [
			{
				name: 'Admin User',
				email: 'admin@example.com',
				emailVerified: true,
				role: 'Admin'
			},
			{
				name: 'Author User',
				email: 'author@example.com',
				emailVerified: true,
				role: 'Creator'
			},
			{
				name: 'Moderator User',
				email: 'moderator@example.com',
				emailVerified: true,
				role: 'Moderator'
			},
			{
				name: 'Basic User',
				email: 'basic@example.com',
				emailVerified: true,
				role: 'User'
			}
		]
	});

	const session = await prisma.session.createMany({
		data: [
			{
				userId: user[0].id,
				expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
				token: 'admin-session-token',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[1].id,
				expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
				token: 'author-session-token',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[2].id,
				expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
				token: 'moderator-session-token',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[3].id,
				expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
				token: 'basic-session-token',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]
	});

	const posts = await prisma.posts.createManyAndReturn({
		data: [
			{
				postTitle: 'My First Post',
				userId: user[1].id,
				slug: 'my-first-post',
				status: 'DRAFT',
				excerpt: 'This is a brief summary of my first post.',
				contentHtml: '<p>This is the content of my first post.</p>',
				contentJson: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'This is the content of my first post.' }]
						}
					]
				}
			},
			{
				postTitle: 'My Second Post',
				userId: user[1].id,
				slug: 'my-second-post',
				status: 'DRAFT',
				excerpt: 'This is a brief summary of my second post.',
				contentHtml: '<p>This is the content of my second post.</p>',
				contentJson: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'This is the content of my second post.' }]
						}
					]
				}
			},
			{
				postTitle: 'This post should get flagged!',
				userId: user[1].id,
				slug: 'this-post-should-get-flagged',
				status: 'DRAFT',
				excerpt: 'This post contains inappropriate content and should be flagged.',
				contentHtml:
					'<p>This post contains inappropriate content and should be flagged, bitch!</p>',
				contentJson: {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'This post contains inappropriate content and should be flagged, bitch!'
								}
							]
						}
					]
				}
			},
			{
				postTitle: 'Learn Svelte 5',
				userId: user[1].id,
				slug: 'learn-svelte-5',
				tags: ['Svelte', 'SvelteKit', 'JavaScript'],
				status: 'APPROVED',
				published: true,
				excerpt: 'The author shares knowledge on learning Svelte 5, reflecting on best practices and common syntax.',
				contentHtml: '<p>Because Svelte is a compiled language, it can wield the same syntax of a language thats not great at making user interfaces like JavaScript and change the semantics for a better developer experience:</p><pre class="shiki shiki-themes github-dark-default github-dark-default" style="background-color:#0d1117;--shiki-dark-bg:#0d1117;color:#e6edf3;--shiki-dark:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;</span><span style="color:#7EE787;--shiki-dark:#7EE787">script</span><span style="color:#79C0FF;--shiki-dark:#79C0FF"> lang</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">=</span><span style="color:#A5D6FF;--shiki-dark:#A5D6FF">"ts"</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// reactive state</span></span><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">	let</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> count </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> $</span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">state</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(</span><span style="color:#79C0FF;--shiki-dark:#79C0FF">0</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// reassignment updates the UI</span></span><span class="line"><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">	setInterval</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(() </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=></span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> count </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">+=</span><span style="color:#79C0FF;--shiki-dark:#79C0FF"> 1</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">, </span><span style="color:#79C0FF;--shiki-dark:#79C0FF">1000</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;/</span><span style="color:#7EE787;--shiki-dark:#7EE787">script</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;</span><span style="color:#7EE787;--shiki-dark:#7EE787">p</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span><span style="color:#FF7B72;--shiki-dark:#FF7B72">{</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">count</span><span style="color:#FF7B72;--shiki-dark:#FF7B72">}</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;/</span><span style="color:#7EE787;--shiki-dark:#7EE787">p</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span></code></pre><p>You might think how Svelte does some crazy compiler stuff under the hood to make this work, but the output is human readable JavaScript:</p><pre class="shiki shiki-themes github-dark-default github-dark-default" style="background-color:#0d1117;--shiki-dark-bg:#0d1117;color:#e6edf3;--shiki-dark:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">function</span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> App</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(</span><span style="color:#FFA657;--shiki-dark:#FFA657">$$anchor</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">) {</span></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// create signal</span></span><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">	let</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> count </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=</span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> state</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(</span><span style="color:#79C0FF;--shiki-dark:#79C0FF">0</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// update signal</span></span><span class="line"><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">	setInterval</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(() </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=></span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> set</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(count, </span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">get</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(count) </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">+</span><span style="color:#79C0FF;--shiki-dark:#79C0FF"> 1</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">), </span><span style="color:#79C0FF;--shiki-dark:#79C0FF">1000</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// create element</span></span><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">	var</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> p </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=</span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> from_html</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(</span><span style="color:#A5D6FF;--shiki-dark:#A5D6FF">` `</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">	var</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> text </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=</span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> child</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(p, </span><span style="color:#79C0FF;--shiki-dark:#79C0FF">true</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">)</span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// update DOM when `count` changes</span></span><span class="line"><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">	template_effect</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(() </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=></span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF"> set_text</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(text, </span><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">get</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">(count)))</span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">	// add to DOM</span></span><span class="line"><span style="color:#D2A8FF;--shiki-dark:#D2A8FF">	append</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">($$anchor, p)</span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">}</span></span></code></pre><p>Svelte’s reactivity is based on <u><a target="_blank" rel="noopener noreferrer nofollow" class="null" href="https://www.youtube.com/watch?v=1TSLEzNzGQM">signals</a></u>, so there’s nothing magical about it — you could write Svelte code without a compiler, but it would be tedious like writing <u><a target="_blank" rel="noopener noreferrer nofollow" class="null" href="https://react.dev/learn/writing-markup-with-jsx">JSX</a></u> by hand using functions.</p><p></p><p>Just by reading the output code, you can start to understand how Svelte works. There’s no virtual DOM, or re-rendering the component when state updates like in React — Svelte only updates the part of the DOM that changed.</p><p></p><p>This is what <strong>“does minimal work in the browser”</strong> means!</p><p></p><p>Svelte also has a more opinionated application framework called <u><a target="_blank" rel="noopener noreferrer nofollow" class="null" href="https://svelte.dev/docs/kit/introduction">SvelteKit</a></u> (equivalent to <u><a target="_blank" rel="noopener noreferrer nofollow" class="null" href="https://nextjs.org/">Next.js</a></u> for React) if you need routing, server-side rendering, adapters to deploy to different platforms and so on.</p><p></p><h1>Single File Components</h1><p>In Svelte, files ending with <code>.svelte</code> are called <strong>single file components</strong> because they contain the JavaScript, HTML, and CSS in a single file.</p><p></p><p>Here’s an example of a Svelte component:</p><pre class="shiki shiki-themes github-dark-default github-dark-default" style="background-color:#0d1117;--shiki-dark-bg:#0d1117;color:#e6edf3;--shiki-dark:#e6edf3" tabindex="0"><code><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">&#x3C;!-- logic --></span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;</span><span style="color:#7EE787;--shiki-dark:#7EE787">script</span><span style="color:#79C0FF;--shiki-dark:#79C0FF"> lang</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">=</span><span style="color:#A5D6FF;--shiki-dark:#A5D6FF">"ts"</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"><span style="color:#FF7B72;--shiki-dark:#FF7B72">	let</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> title </span><span style="color:#FF7B72;--shiki-dark:#FF7B72">=</span><span style="color:#A5D6FF;--shiki-dark:#A5D6FF"> `Svelte`</span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;/</span><span style="color:#7EE787;--shiki-dark:#7EE787">script</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">&#x3C;!-- markup --></span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;</span><span style="color:#7EE787;--shiki-dark:#7EE787">h1</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span><span style="color:#FF7B72;--shiki-dark:#FF7B72">{</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">title</span><span style="color:#FF7B72;--shiki-dark:#FF7B72">}</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;/</span><span style="color:#7EE787;--shiki-dark:#7EE787">h1</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"></span><span class="line"><span style="color:#8B949E;--shiki-dark:#8B949E">&#x3C;!-- styles --></span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;</span><span style="color:#7EE787;--shiki-dark:#7EE787">style</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span><span class="line"><span style="color:#7EE787;--shiki-dark:#7EE787">	h1</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3"> {</span></span><span class="line"><span style="color:#79C0FF;--shiki-dark:#79C0FF">		color</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">: </span><span style="color:#79C0FF;--shiki-dark:#79C0FF">orangered</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">;</span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">	}</span></span><span class="line"><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">&#x3C;/</span><span style="color:#7EE787;--shiki-dark:#7EE787">style</span><span style="color:#E6EDF3;--shiki-dark:#E6EDF3">></span></span></code></pre><p></p>',
				contentJson: {
					"type":"doc","content":[{"type":"paragraph","content":[{"text":"Because Svelte is a compiled language, it can wield the same syntax of a language that’s not great at making user interfaces like JavaScript and change the semantics for a better developer experience:","type":"text"}]},{"type":"codeBlock","attrs":{"language":"svelte"},"content":[{"text":"<script lang=\"ts\">\n\t// reactive state\n\tlet count = $state(0)\n\n\t// reassignment updates the UI\n\tsetInterval(() => count += 1, 1000)\n</script>\n\n<p>{count}</p>","type":"text"}]},{"type":"paragraph","content":[{"text":"You might think how Svelte does some crazy compiler stuff under the hood to make this work, but the output is human readable JavaScript:","type":"text"}]},{"type":"codeBlock","attrs":{"language":"js"},"content":[{"text":"function App($$anchor) {\n\t// create signal\n\tlet count = state(0)\n\n\t// update signal\n\tsetInterval(() => set(count, get(count) + 1), 1000)\n\n\t// create element\n\tvar p = from_html(`<p> </p>`)\n\tvar text = child(p, true)\n\n\t// update DOM when `count` changes\n\ttemplate_effect(() => set_text(text, get(count)))\n\n\t// add to DOM\n\tappend($$anchor, p)\n}","type":"text"}]},{"type":"paragraph","content":[{"text":"Svelte’s reactivity is based on ","type":"text"},{"text":"signals","type":"text","marks":[{"type":"link","attrs":{"rel":"noopener noreferrer nofollow","href":"https://www.youtube.com/watch?v=1TSLEzNzGQM","class":null,"target":"_blank"}},{"type":"underline"}]},{"text":", so there’s nothing magical about it — you could write Svelte code without a compiler, but it would be tedious like writing ","type":"text"},{"text":"JSX","type":"text","marks":[{"type":"link","attrs":{"rel":"noopener noreferrer nofollow","href":"https://react.dev/learn/writing-markup-with-jsx","class":null,"target":"_blank"}},{"type":"underline"}]},{"text":" by hand using functions.","type":"text"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"text":"Just by reading the output code, you can start to understand how Svelte works. There’s no virtual DOM, or re-rendering the component when state updates like in React — Svelte only updates the part of the DOM that changed.","type":"text"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"text":"This is what ","type":"text"},{"text":"“does minimal work in the browser”","type":"text","marks":[{"type":"bold"}]},{"text":" means!","type":"text"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"text":"Svelte also has a more opinionated application framework called ","type":"text"},{"text":"SvelteKit","type":"text","marks":[{"type":"link","attrs":{"rel":"noopener noreferrer nofollow","href":"https://svelte.dev/docs/kit/introduction","class":null,"target":"_blank"}},{"type":"underline"}]},{"text":" (equivalent to ","type":"text"},{"text":"Next.js","type":"text","marks":[{"type":"link","attrs":{"rel":"noopener noreferrer nofollow","href":"https://nextjs.org/","class":null,"target":"_blank"}},{"type":"underline"}]},{"text":" for React) if you need routing, server-side rendering, adapters to deploy to different platforms and so on.","type":"text"}]},{"type":"paragraph"},{"type":"heading","attrs":{"level":1},"content":[{"text":"Single File Components","type":"text"}]},{"type":"paragraph","content":[{"text":"In Svelte, files ending with ","type":"text"},{"text":".svelte","type":"text","marks":[{"type":"code"}]},{"text":" are called ","type":"text"},{"text":"single file components","type":"text","marks":[{"type":"bold"}]},{"text":" because they contain the JavaScript, HTML, and CSS in a single file.","type":"text"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"text":"Here’s an example of a Svelte component:","type":"text"}]},{"type":"codeBlock","attrs":{"language":"svelte"},"content":[{"text":"<!-- logic -->\n<script lang=\"ts\">\n\tlet title = 'Svelte'\n</script>\n\n<!-- markup -->\n<h1>{title}</h1>\n\n<!-- styles -->\n<style>\n\th1 {\n\t\tcolor: orangered;\n\t}\n</style>","type":"text"}]},{"type":"paragraph"}]
				}
			}
		]
	});

	const revisions = await prisma.revision.createMany({
		data: [
			{
				postId: posts[0].id,
				content: posts[0].contentHtml,
				createdBy: user[1].id,
				version: 1
			},
			{
				postId: posts[0].id,
				content: '<p>This is the content of my first post. I have also made some edits. </p>',
				createdBy: user[1].id,
				currentRevisionPostId: posts[0].id,
				version: 2
			},
			{
				postId: posts[1].id,
				content: posts[1].contentHtml,
				createdBy: user[1].id,
				currentRevisionPostId: posts[1].id,
				version: 1
			},
			{
				postId: posts[2].id,
				content: posts[2].contentHtml,
				createdBy: user[1].id,
				currentRevisionPostId: posts[2].id,
				version: 1
			},
			{
				postId: posts[3].id,
				content: posts[3].contentHtml,
				createdBy: user[1].id,
				currentRevisionPostId: posts[3].id,
				version: 1
			}
		]
	});

	const accounts = await prisma.account.createMany({
		data: [
			{
				userId: user[0].id,
				accountId: user[0].id,
				providerId: 'credential',
				password:
					'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[1].id,
				accountId: user[1].id,
				providerId: 'credential',
				password:
					'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[2].id,
				accountId: user[2].id,
				providerId: 'credential',
				password:
					'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: user[3].id,
				accountId: user[3].id,
				providerId: 'credential',
				password:
					'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]
	});

	const likes = await prisma.postLike.createMany({
		data:[
			{
				postId: posts[3].id,
				userId: user[0].id,
				createdAt: new Date(),
			},
			{
				postId: posts[3].id,
				userId: user[1].id,
				createdAt: new Date(),
			},
			{
				postId: posts[3].id,
				userId: user[2].id,
				createdAt: new Date(),
			},
			{
				postId: posts[3].id,
				userId: user[3].id,
				createdAt: new Date(),
			}
		]
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
