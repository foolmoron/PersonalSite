<script lang="ts">
	import type { PageData } from './$types';
	import type { Project } from '$lib/server/db/schema';
	import { SKILLS } from '$lib/enums';
	import { skills } from '$lib/state/skills.svelte';
	import TagClickable from '$lib/components/TagClickable.svelte';
	import Tag from '$lib/components/Tag.svelte';

	export let data: PageData;

	let editingProjectId: string | null = null;
	let editBuffer: Project | null = null;
	let formError: string | null = null;

	let editName = '';
	let editDescription = '';
	let editStart = '';
	let editEnd = '';
	let editSkillsArray: (keyof typeof SKILLS)[] = [];
	let editNoEnd = false;

	function startEdit(project: Project) {
		editingProjectId = project.id;
		editBuffer = { ...project };
		editName = project.name;
		editDescription = project.description ?? '';
		editStart = project.start ? project.start.toISOString().slice(0, 10) : '';
		editEnd = project.end ? project.end.toISOString().slice(0, 10) : '';
		editNoEnd = !project.end;
		editSkillsArray = Array.isArray(project.skills) ? [...project.skills] : [];
		formError = null;
	}

	function cancelEdit() {
		editingProjectId = null;
		editBuffer = null;
		formError = null;
	}

	function toggleEditSkill(skill: keyof typeof SKILLS) {
		if (editSkillsArray.includes(skill)) {
			editSkillsArray = editSkillsArray.filter((s) => s !== skill);
		} else {
			editSkillsArray = [...editSkillsArray, skill];
		}
	}
</script>

<div class="admin-list prose">
	{#each data.years as year}
		{#each year.projects as project}
			{#key project.id}
				{#if editingProjectId === project.id && editBuffer}
					<form
						class="not-prose"
						method="POST"
						action="?/update"
						onsubmit={(e) => {
							e.preventDefault();
							const form = e.currentTarget as HTMLFormElement;
							const fd = new FormData(form);
							fd.set('id', project.id);
							fd.set('name', editName);
							fd.set('description', editDescription);
							fd.set('start', editStart);
							fd.set('end', editNoEnd ? '' : editEnd);
							fd.set('skills', editSkillsArray.join(', '));
							const res = fetch(form.action, { method: 'POST', body: fd });
							return res
								.then((r) => r.json())
								.then((result) => {
									if (result.type === 'success') {
										location.reload();
									} else {
										formError = result.error || 'Unknown error';
									}
								});
						}}
					>
						<div class="flex gap-2">
							<input type="text" name="name" bind:value={editName} class="text-lg font-bold" />
							<span>({project.id})</span>
							<div class="flex gap-2">
								<button type="submit" class="btn btn-primary btn-action rounded-sm px-2"
									>Save</button
								>
								<button type="button" onclick={cancelEdit} class="btn btn-action rounded-sm px-2"
									>Cancel</button
								>
								<button type="button" class="btn btn-secondary btn-action rounded-sm px-2"
									>Archive</button
								>
							</div>
						</div>
						<div class="italic">
							<input type="date" name="start" bind:value={editStart} />
							to
							<label style="display: inline-flex; align-items: center; gap: 0.3em;">
								<input type="checkbox" bind:checked={editNoEnd} /> Present
							</label>
							{#if !editNoEnd}
								<input type="date" name="end" bind:value={editEnd} />
							{/if}
						</div>
						<textarea name="description" bind:value={editDescription} rows="2" class="w-full"
						></textarea>
						<div class="flex flex-wrap gap-1 py-1">
							{#each skills as skill}
								<TagClickable
									{skill}
									style={editSkillsArray.includes(skill) ? 'active' : 'inactive'}
									onclick={() => toggleEditSkill(skill)}
								/>
							{/each}
						</div>
						{#if formError}
							<div class="text-red-600">{formError}</div>
						{/if}
					</form>
				{:else}
					<h3 class="inline">{project.name} ({project.id})</h3>
					<button onclick={() => startEdit(project)} class="btn btn-sm btn-action rounded-sm px-2"
						>Edit</button
					>
					<div class="italic">
						{project.start ? project.start.toISOString().split('T')[0] : 'Unknown'}
						to
						{project.end ? project.end.toISOString().split('T')[0] : 'Present'}
					</div>
					<div>{project.description || 'No description'}</div>
					<div class="flex flex-wrap gap-1 py-1">
						{#each project.skills as skill}
							<Tag {skill} />
						{/each}
					</div>
				{/if}

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
										<div class="flex flex-wrap gap-1 py-1">
											{#each achievement.tags as tag}
												<Tag {tag} />
											{/each}
										</div>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<br />
			{/key}
		{/each}
	{/each}
</div>

<style>
	.admin-list {
		padding: 0 2rem;
		max-width: unset;
	}
	.btn-action {
		background-color: #e0e7ff;
		transition: background 0.15s;
	}
	.btn-action:hover {
		background-color: #a5b4fc;
	}
	.btn-primary.btn-action {
		background-color: #2563eb;
		color: #fff;
	}
	.btn-primary.btn-action:hover {
		background-color: #1d4ed8;
	}
	.btn-secondary.btn-action {
		background-color: #fbbf24;
		color: #fff;
	}
	.btn-secondary.btn-action:hover {
		background-color: #f59e42;
	}
</style>
