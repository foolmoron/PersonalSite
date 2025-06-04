<script lang="ts">
	const { url, fullEmbed } = $props<{
		url: string;
		fullEmbed?: boolean;
	}>();
	const mediaInfo = $derived(() => {
		let determinedMediaType: 'image' | 'video' | 'youtube' | 'vimeo' | 'googledrive' | 'unknown' =
			'unknown';
		let determinedEmbedUrl: string | null = null;
		let youtubeVideoId: string | null = null;
		let vimeoVideoId: string | null = null;

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
						vimeoVideoId = videoId;
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

		return {
			mediaType: determinedMediaType,
			embedUrl: determinedEmbedUrl,
			youtubeVideoId,
			vimeoVideoId,
		};
	});
</script>

{#if mediaInfo().mediaType === 'image' && mediaInfo().embedUrl}
	<img src={mediaInfo().embedUrl} alt="Embedded content" class="embedded-media image" />
{:else if mediaInfo().mediaType === 'video' && mediaInfo().embedUrl}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video controls src={mediaInfo().embedUrl} class="embedded-media video"> </video>
{:else if mediaInfo().mediaType === 'youtube' && mediaInfo().embedUrl}
	{#if fullEmbed}
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
				<svg viewBox="0 0 24 24" class="play-icon">
					<circle cx="12" cy="12" r="12" fill="rgba(0, 0, 0, 0.8)"></circle>
					<polygon points="10,8 16,12 10,16" fill="white"></polygon>
				</svg>
			</div>
		</div>
	{/if}
{:else if mediaInfo().mediaType === 'vimeo' && mediaInfo().embedUrl}
	{#if fullEmbed}
		<iframe
			src={mediaInfo().embedUrl}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="embedded-media vimeo"
			title="Vimeo video player"
		></iframe>
	{:else}
		<div
			class="vimeo-thumbnail embedded-media image"
			style="background: url('https://vumbnail.com/{mediaInfo().vimeoVideoId}.jpg') center / cover;"
		>
			<div class="play-button">
				<svg viewBox="0 0 24 24" class="play-icon">
					<circle cx="12" cy="12" r="12" fill="rgba(0, 0, 0, 0.8)"></circle>
					<polygon points="10,8 16,12 10,16" fill="white"></polygon>
				</svg>
			</div>
		</div>
	{/if}
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

	.vimeo-thumbnail {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.play-button {
		width: 48px;
		height: 48px;
		transition: opacity 0.2s ease;
	}

	.play-icon {
		width: 100%;
		height: 100%;
	}
</style>
