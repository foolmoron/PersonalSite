<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="admin-list prose">
	{#each data.years as year}
		{#each year.projects as project}
			<div>
				<h3>{project.name} ({project.id})</h3>
				<div class="italic">
					{project.start ? project.start.toISOString().split('T')[0] : 'Unknown'}
					to
					{project.end ? project.end.toISOString().split('T')[0] : 'Present'}
				</div>
				<div>{project.description || 'No description'}</div>
				<div>
					<strong>Skills:</strong>
					{project.skills.join(', ')}
				</div>

				<div>
					{#if project.achievements.length > 0}
						<ul>
							{#each project.achievements as achievement}
								<li>
									<div>
										<strong>{achievement.summary}</strong>
										<span>(#{achievement.id})</span>
										{#if achievement.private}
											<span>(Private)</span>
										{/if}
										<div>{achievement.description || 'No description'}</div>
										<div>
											<strong>Tags:</strong>
											{achievement.tags.join(', ')}
										</div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/each}
	{/each}
</div>

<style>
	.admin-list {
		padding: 0 2rem;
		max-width: unset;
	}
</style>
