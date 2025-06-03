<script lang="ts">
	const { url, fullVideo } = $props<{
		url: string;
		fullVideo?: boolean;
	}>();

	const mediaInfo = $derived(() => {
		let determinedMediaType: 'image' | 'video' | 'youtube' | 'vimeo' | 'googledrive' | 'unknown' =
			'unknown';
		let determinedEmbedUrl: string | null = null;
		let youtubeVideoId: string | null = null;

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
						youtubeVideoId = videoId;
					}
				} else if (urlObj.hostname === 'youtu.be') {
					const videoId = urlObj.pathname.substring(1);
					if (videoId) {
						determinedMediaType = 'youtube';
						determinedEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
						youtubeVideoId = videoId;
					}
				} else if (urlObj.hostname === 'vimeo.com') {
					const videoId = urlObj.pathname.split('/')[1];
					if (videoId && /^\d+$/.test(videoId)) {
						determinedMediaType = 'vimeo';
						determinedEmbedUrl = `https://player.vimeo.com/video/${videoId}`;
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

		return { mediaType: determinedMediaType, embedUrl: determinedEmbedUrl, youtubeVideoId };
	});
</script>

{#if mediaInfo().mediaType === 'image' && mediaInfo().embedUrl}
	<img src={mediaInfo().embedUrl} alt="Embedded content" class="embedded-media image" />
{:else if mediaInfo().mediaType === 'video' && mediaInfo().embedUrl}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video controls src={mediaInfo().embedUrl} class="embedded-media video"> </video>
{:else if mediaInfo().mediaType === 'youtube' && mediaInfo().embedUrl}
	{#if fullVideo}
		<iframe
			src={mediaInfo().embedUrl}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="embedded-media youtube"
			title="YouTube video player"
		></iframe>
	{:else}
		<div
			class="youtube-thumbnail embedded-media image"
			style="background: url('http://img.youtube.com/vi/{mediaInfo()
				.youtubeVideoId}/0.jpg') center / cover;"
		>
			<div class="play-button">
				<svg viewBox="0 0 68 48" class="play-icon">
					<path
						d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
						fill="#f00"
					></path>
					<path d="M 45,24 27,14 27,34" fill="#fff"></path>
				</svg>
			</div>
		</div>
	{/if}
{:else if mediaInfo().mediaType === 'vimeo' && mediaInfo().embedUrl}
	<iframe
		src={mediaInfo().embedUrl}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
		class="embedded-media vimeo"
		title="Vimeo video player"
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
		aspect-ratio: 16/9;
	}
	.embedded-media.unknown {
		color: #777;
		font-style: italic;
	}

	.youtube-thumbnail {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-button {
		width: 68px;
		height: 48px;
		transition: opacity 0.2s ease;
	}

	.play-icon {
		width: 100%;
		height: 100%;
	}
</style>
