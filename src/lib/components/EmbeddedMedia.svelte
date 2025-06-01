<script lang="ts">
	const { url, videoTracks } = $props<{
		url: string;
	}>();

	const mediaInfo = $derived(() => {
		let determinedMediaType: 'image' | 'video' | 'youtube' | 'googledrive' | 'unknown' = 'unknown';
		let determinedEmbedUrl: string | null = null;

		if (url) {
			try {
				const urlObj = new URL(url);
				const extension = url.split('.').pop()?.toLowerCase();

				if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'svg'].includes(extension ?? '')) {
					determinedMediaType = 'image';
					determinedEmbedUrl = url;
				} else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension ?? '')) {
					determinedMediaType = 'video';
					determinedEmbedUrl = url;
				} else if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname === '/watch') {
					const videoId = urlObj.searchParams.get('v');
					if (videoId) {
						determinedMediaType = 'youtube';
						determinedEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
					}
				} else if (urlObj.hostname === 'youtu.be') {
					const videoId = urlObj.pathname.substring(1);
					if (videoId) {
						determinedMediaType = 'youtube';
						determinedEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
					}
				} else if (
					urlObj.hostname === 'drive.google.com' &&
					urlObj.pathname.startsWith('/file/d/') &&
					(urlObj.pathname.endsWith('/preview') || urlObj.pathname.includes('/view'))
				) {
					const parts = urlObj.pathname.split('/');
					const fileId = parts[3];
					if (fileId) {
						determinedMediaType = 'googledrive';
						determinedEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
					}
				} // else: mediaType remains 'unknown', embedUrl remains null by default
			} catch (e) {
				// Invalid URL: mediaType remains 'unknown', embedUrl remains null by default
				console.error('Invalid URL for EmbeddedMedia:', url, e);
			}
		} // else: !url, mediaType remains 'unknown', embedUrl remains null by default

		return { mediaType: determinedMediaType, embedUrl: determinedEmbedUrl };
	});
</script>

{#if mediaInfo().mediaType === 'image' && mediaInfo().embedUrl}
	<img src={mediaInfo().embedUrl} alt="Embedded content" class="embedded-media image" />
{:else if mediaInfo().mediaType === 'video' && mediaInfo().embedUrl}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video controls src={mediaInfo().embedUrl} class="embedded-media video"> </video>
{:else if mediaInfo().mediaType === 'youtube' && mediaInfo().embedUrl}
	<iframe
		src={mediaInfo().embedUrl}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
		class="embedded-media youtube"
		title="YouTube video player"
	></iframe>
{:else if mediaInfo().mediaType === 'googledrive' && mediaInfo().embedUrl}
	<iframe
		src={mediaInfo().embedUrl}
		frameborder="0"
		allowfullscreen
		class="embedded-media googledrive"
		title="Google Drive content"
	></iframe>
{:else if url}
	<p class="embedded-media unknown">
		Unsupported media URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
	</p>
{/if}

<style>
	.embedded-media {
		height: auto;
		display: block;
		margin: 1em 0;
	}
	.embedded-media.googledrive {
		aspect-ratio: 4/3;
	}
	.embedded-media.unknown {
		color: #777;
		font-style: italic;
	}
</style>
