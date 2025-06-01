<script lang="ts">
	import type { PageData } from './$types';
	import type { Project, Achievement } from '$lib/server/db/schema';
	import { SKILLS, TAGS } from '$lib/enums';
	import { skills, tags } from '$lib/state/skills.svelte';
	import TagClickable from '$lib/components/TagClickable.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import EmbeddedMediaList from '$lib/components/EmbeddedMediaList.svelte';

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
	let editMedia = '';

	// New project form state
	let newProjectId = '';
	let newProjectName = '';
	let newProjectDescription = '';
	let newProjectStart = new Date().toISOString().slice(0, 10);
	let newProjectEnd = new Date().toISOString().slice(0, 10);
	let newProjectNoEnd = true;
	let newProjectSkillsArray: (keyof typeof SKILLS)[] = [];
	let newProjectFormError: string | null = null;
	let showNewProjectForm = false;
	let newProjectMedia = '';

	// Achievement edit state
	let editingAchievementId: number | null = null;
	let editingAchievementProjectId: string | null = null;
	let editAchievementBuffer: Achievement | null = null;
	let editAchievementSummary = '';
	let editAchievementDescription = '';
	let editAchievementPrivate = '';
	let editAchievementTagsArray: (keyof typeof TAGS)[] = [];
	let editAchievementFormError: string | null = null;
	let editAchievementMedia = '';

	// New achievement form state
	let showNewAchievementForm = false;
	let newAchievementProjectId = '';
	let newAchievementSummary = '';
	let newAchievementDescription = '';
	let newAchievementPrivate = '';
	let newAchievementTagsArray: (keyof typeof TAGS)[] = [];
	let newAchievementFormError: string | null = null;
	let newAchievementMedia = '';

	function startEdit(project: Project) {
		editingProjectId = project.id;
		editBuffer = { ...project };
		editName = project.name;
		editDescription = project.description ?? '';
		editStart = project.start ? project.start.toISOString().slice(0, 10) : '';
		editEnd = project.end ? project.end.toISOString().slice(0, 10) : editStart;
		editNoEnd = !project.end;
		editSkillsArray = Array.isArray(project.skills) ? [...project.skills] : [];
		editMedia = Array.isArray(project.media) ? project.media.join('\n') : '';
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

	function toggleNewProjectSkill(skill: keyof typeof SKILLS) {
		if (newProjectSkillsArray.includes(skill)) {
			newProjectSkillsArray = newProjectSkillsArray.filter((s) => s !== skill);
		} else {
			newProjectSkillsArray = [...newProjectSkillsArray, skill];
		}
	}
	function resetNewProjectForm() {
		newProjectId = '';
		newProjectName = '';
		newProjectDescription = '';
		newProjectStart = new Date().toISOString().slice(0, 10);
		newProjectEnd = '';
		newProjectNoEnd = true;
		newProjectSkillsArray = [];
		newProjectFormError = null;
		newProjectMedia = '';
	}

	// Achievement functions
	function startEditAchievement(achievement: Achievement) {
		editingAchievementId = achievement.id;
		editingAchievementProjectId = achievement.projectId;
		editAchievementBuffer = { ...achievement };
		editAchievementSummary = achievement.summary;
		editAchievementDescription = achievement.description ?? '';
		editAchievementPrivate = achievement.private ?? '';
		editAchievementTagsArray = Array.isArray(achievement.tags) ? [...achievement.tags] : [];
		editAchievementMedia = Array.isArray(achievement.media) ? achievement.media.join('\n') : '';
		editAchievementFormError = null;
	}

	function cancelEditAchievement() {
		editingAchievementId = null;
		editingAchievementProjectId = null;
		editAchievementBuffer = null;
		editAchievementFormError = null;
	}

	function startNewAchievement(projectId: string) {
		showNewAchievementForm = true;
		newAchievementProjectId = projectId;
		newAchievementSummary = '';
		newAchievementDescription = '';
		newAchievementPrivate = '';
		newAchievementTagsArray = [];
		newAchievementMedia = '';
		newAchievementFormError = null;
	}

	function cancelNewAchievement() {
		showNewAchievementForm = false;
		newAchievementProjectId = '';
		newAchievementFormError = null;
	}

	function toggleEditAchievementTag(tag: keyof typeof TAGS) {
		if (editAchievementTagsArray.includes(tag)) {
			editAchievementTagsArray = editAchievementTagsArray.filter((t) => t !== tag);
		} else {
			editAchievementTagsArray = [...editAchievementTagsArray, tag];
		}
	}

	function toggleNewAchievementTag(tag: keyof typeof TAGS) {
		if (newAchievementTagsArray.includes(tag)) {
			newAchievementTagsArray = newAchievementTagsArray.filter((t) => t !== tag);
		} else {
			newAchievementTagsArray = [...newAchievementTagsArray, tag];
		}
	}
</script>

<div class="admin-list">
	{#each data.years as year}
		{#each year.projects as project}
			{#key project.id}
				{#if editingProjectId === project.id && editBuffer}
					<form
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
							fd.set('media', editMedia);
							const res = fetch(form.action, { method: 'POST', body: fd });
							return res
								.then((r) => r.json())
								.then((result) => {
									if (result.type === 'success') {
										location.reload();
									} else {
										formError = result.data || 'Unknown error';
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
						<textarea name="description" bind:value={editDescription} rows="6" class="w-full"
						></textarea>
						<label class="mt-2 mb-1 block font-bold" for="media">Media URLs (one per line):</label>
						<textarea
							name="media"
							bind:value={editMedia}
							rows="3"
							class="w-full"
							placeholder="Enter media URLs, one per line"
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
					{#if project.media && project.media.length > 0}
						<div class="mt-2">
							<h5 class="mb-1 font-medium">Media:</h5>
							<EmbeddedMediaList urls={project.media} />
						</div>
					{/if}
				{/if}

				<div class="achievement-container mt-2 ml-4">
					<h4 class="text-lg font-medium">Achievements</h4>
					{#if project.achievements && project.achievements.length > 0}
						<ul class="space-y-3">
							{#each project.achievements.toSorted((a, b) => a.id - b.id) as achievement}
								<li class="border-l-2 border-gray-200 pl-3">
									{#if editingAchievementId === achievement.id && editAchievementBuffer}
										<form
											method="POST"
											action="?/updateAchievement"
											onsubmit={(e) => {
												e.preventDefault();
												const form = e.currentTarget as HTMLFormElement;
												const fd = new FormData(form);
												fd.set('id', String(achievement.id));
												fd.set('projectId', achievement.projectId);
												fd.set('summary', editAchievementSummary);
												fd.set('description', editAchievementDescription);
												fd.set('private', editAchievementPrivate);
												fd.set('tags', editAchievementTagsArray.join(', '));
												fd.set('media', editAchievementMedia);
												const res = fetch(form.action, { method: 'POST', body: fd });
												return res
													.then((r) => r.json())
													.then((result) => {
														if (result.type === 'success') {
															location.reload();
														} else {
															editAchievementFormError = result.data || 'Unknown error';
														}
													});
											}}
										>
											<div class="flex gap-2">
												<input
													type="text"
													name="summary"
													bind:value={editAchievementSummary}
													class="w-3xl text-base font-medium"
												/>
												<span>(#{achievement.id})</span>
												<div class="flex gap-2">
													<button type="submit" class="btn btn-primary btn-action rounded-sm px-2"
														>Save</button
													>
													<button
														type="button"
														onclick={cancelEditAchievement}
														class="btn btn-action rounded-sm px-2">Cancel</button
													>
													<button
														type="button"
														formaction="?/archiveAchievement"
														class="btn btn-secondary btn-action rounded-sm px-2">Archive</button
													>
												</div>
											</div>
											<textarea
												name="description"
												bind:value={editAchievementDescription}
												rows="6"
												class="w-full"
											></textarea>
											<label class="mt-2 mb-1 block font-bold" for="private"
												>Private (admin-only):</label
											>
											<textarea
												name="private"
												bind:value={editAchievementPrivate}
												rows="3"
												class="w-full"
											></textarea>
											<label class="mt-2 mb-1 block font-bold" for="media"
												>Media URLs (one per line):</label
											>
											<textarea
												name="media"
												bind:value={editAchievementMedia}
												rows="3"
												class="w-full"
												placeholder="Enter media URLs, one per line"
											></textarea>
											<div class="flex flex-wrap gap-1 py-1">
												{#each tags as tag}
													<TagClickable
														{tag}
														style={editAchievementTagsArray.includes(tag as keyof typeof TAGS)
															? 'active'
															: 'inactive'}
														onclick={() => toggleEditAchievementTag(tag as keyof typeof TAGS)}
													/>
												{/each}
											</div>
											{#if editAchievementFormError}
												<div class="text-red-600">{editAchievementFormError}</div>
											{/if}
										</form>
									{:else}
										<div class="flex items-center gap-2">
											<strong>{achievement.summary}</strong>
											<span class="text-sm text-gray-500">(#{achievement.id})</span>
											<button
												onclick={() => startEditAchievement(achievement)}
												class="btn btn-sm btn-action rounded-sm px-2 text-sm"
											>
												Edit
											</button>
										</div>
										{#if achievement.description}
											<div class="text-sm">{achievement.description}</div>
										{/if}
										{#if achievement.private}
											<div class="text-sm italic">{achievement.private}</div>
										{/if}
										{#if achievement.tags && achievement.tags.length > 0}
											<div class="flex flex-wrap gap-1 py-1">
												{#each achievement.tags as tag}
													<Tag {tag} />
												{/each}
											</div>
										{/if}
										{#if achievement.media && achievement.media.length > 0}
											<div class="mt-2">
												<h6 class="mb-1 text-sm font-medium">Media:</h6>
												<EmbeddedMediaList urls={achievement.media} />
											</div>
										{/if}
									{/if}
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500">No achievements yet</p>
					{/if}

					{#if showNewAchievementForm && newAchievementProjectId === project.id}
						<div class="mt-3 border-t border-gray-200 pt-3">
							<h5 class="font-medium">Add New Achievement</h5>
							<form
								method="POST"
								action="?/createAchievement"
								onsubmit={(e) => {
									e.preventDefault();
									const form = e.currentTarget as HTMLFormElement;
									const fd = new FormData(form);
									fd.set('projectId', newAchievementProjectId);
									fd.set('summary', newAchievementSummary);
									fd.set('description', newAchievementDescription);
									fd.set('private', newAchievementPrivate);
									fd.set('tags', newAchievementTagsArray.join(', '));
									fd.set('media', newAchievementMedia);
									const res = fetch(form.action, { method: 'POST', body: fd });
									return res
										.then((r) => r.json())
										.then((result) => {
											if (result.type === 'success') {
												location.reload();
											} else {
												newAchievementFormError = result.data || 'Unknown error';
											}
										});
								}}
							>
								<div class="flex flex-col gap-2">
									<input
										type="text"
										name="summary"
										bind:value={newAchievementSummary}
										class="text-base"
										placeholder="Achievement summary"
										required
									/>
									<textarea
										name="description"
										bind:value={newAchievementDescription}
										rows="6"
										class="w-full"
										placeholder="Achievement description"
									></textarea>
									<label class="mt-2 mb-1 block font-bold" for="private"
										>Private (admin-only):</label
									>
									<textarea
										name="private"
										bind:value={newAchievementPrivate}
										rows="3"
										class="w-full"
										placeholder="Private notes (only visible in admin)"
									></textarea>
									<label class="mt-2 mb-1 block font-bold" for="media"
										>Media URLs (one per line):</label
									>
									<textarea
										name="media"
										bind:value={newAchievementMedia}
										rows="3"
										class="w-full"
										placeholder="Enter media URLs, one per line"
									></textarea>
									<div class="flex flex-wrap gap-1 py-1">
										{#each tags as tag}
											<TagClickable
												{tag}
												style={newAchievementTagsArray.includes(tag as keyof typeof TAGS)
													? 'active'
													: 'inactive'}
												onclick={() => toggleNewAchievementTag(tag as keyof typeof TAGS)}
											/>
										{/each}
									</div>
									<div class="flex gap-2">
										<button type="submit" class="btn btn-primary btn-action rounded-sm px-2"
											>Create</button
										>
										<button
											type="button"
											onclick={cancelNewAchievement}
											class="btn btn-action rounded-sm px-2"
										>
											Cancel
										</button>
									</div>
									{#if newAchievementFormError}
										<div class="text-red-600">{newAchievementFormError}</div>
									{/if}
								</div>
							</form>
						</div>
					{:else}
						<button
							class="btn btn-sm btn-action mt-2 rounded-sm px-2"
							onclick={() => startNewAchievement(project.id)}
						>
							Add Achievement
						</button>
					{/if}
				</div>
				<br />
			{/key}
		{/each}
	{/each}

	<div class="border-black-200 mt-8 border-t-2 pt-4">
		{#if !showNewProjectForm}
			<button
				class="btn btn-primary btn-action rounded-sm px-4 py-2"
				onclick={() => (showNewProjectForm = true)}
			>
				Add New Project
			</button>
		{:else}
			<h3>Create New Project</h3>
			<form
				method="POST"
				action="?/create"
				onsubmit={(e) => {
					e.preventDefault();
					const form = e.currentTarget as HTMLFormElement;
					const fd = new FormData(form);
					fd.set('id', newProjectId);
					fd.set('name', newProjectName);
					fd.set('description', newProjectDescription);
					fd.set('start', newProjectStart);
					fd.set('end', newProjectNoEnd ? '' : newProjectEnd);
					fd.set('skills', newProjectSkillsArray.join(', '));
					fd.set('media', newProjectMedia);

					const res = fetch(form.action, { method: 'POST', body: fd });
					return res
						.then((r) => r.json())
						.then((result) => {
							if (result.type === 'success') {
								location.reload();
							} else {
								newProjectFormError = result.data || 'Unknown error';
							}
						});
				}}
			>
				<div class="flex gap-2">
					<input
						type="text"
						name="name"
						bind:value={newProjectName}
						class="text-lg font-bold"
						placeholder="Project Name"
						required
					/>
					<input
						type="text"
						name="id"
						bind:value={newProjectId}
						class="text-lg font-bold"
						placeholder="project-id"
						required
					/>
					<div class="flex gap-2">
						<button type="submit" class="btn btn-primary btn-action rounded-sm px-2">Create</button>
						<button
							type="button"
							onclick={() => {
								showNewProjectForm = false;
								resetNewProjectForm();
							}}
							class="btn btn-action rounded-sm px-2"
						>
							Cancel
						</button>
					</div>
				</div>
				<div class="italic">
					<input type="date" name="start" bind:value={newProjectStart} required />
					to
					<label style="display: inline-flex; align-items: center; gap: 0.3em;">
						<input type="checkbox" bind:checked={newProjectNoEnd} /> Present
					</label>
					{#if !newProjectNoEnd}
						<input type="date" name="end" bind:value={newProjectEnd} />
					{/if}
				</div>
				<textarea
					name="description"
					bind:value={newProjectDescription}
					rows="6"
					class="w-full"
					placeholder="Project description"
				></textarea>
				<label class="mt-2 mb-1 block font-bold" for="media">Media URLs (one per line):</label>
				<textarea
					name="media"
					bind:value={newProjectMedia}
					rows="3"
					class="w-full"
					placeholder="Enter media URLs, one per line"
				></textarea>
				<div class="flex flex-wrap gap-1 py-1">
					{#each skills as skill}
						<TagClickable
							{skill}
							style={newProjectSkillsArray.includes(skill) ? 'active' : 'inactive'}
							onclick={() => toggleNewProjectSkill(skill)}
						/>
					{/each}
				</div>
				{#if newProjectFormError}
					<div class="text-red-600">{newProjectFormError}</div>
				{/if}
			</form>
		{/if}
	</div>
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
