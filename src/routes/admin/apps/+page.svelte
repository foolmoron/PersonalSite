<script lang="ts">
	import type { PageData } from './$types';
	import type { Application, Achievement, Project } from '$lib/server/db/schema';
	import { CATEGORIES, SKILLS } from '$lib/enums';
	import { skills } from '$lib/state/skills.svelte';
	import TagClickable from '$lib/components/TagClickable.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import SortableList from '$lib/components/SortableList.svelte';

	interface ApplicationsPageData extends PageData {
		applications: Application[];
		achievements: Achievement[];
		projects: Project[];
	}

	interface HighlightedAchievementItem {
		id: number;
		comment: string;
	} // Extend Application type for client-side handling of new highlighted achievements structure
	interface ClientApplication extends Application {
		// `highlightedAchievements` from the DB can be a JSON string or null/undefined.
		// `highlightedAchievementIds` is the old numeric array.
		// `highlightedComments` is the corresponding comments array (inherited from Application).
		highlightedAchievements?: string | null | HighlightedAchievementItem[]; // Allow for already parsed or string
		highlightedAchievementsData_parsed?: HighlightedAchievementItem[]; // Store successfully parsed data
	}

	const { data }: { data: ApplicationsPageData } = $props(); // Edit state
	let editingId = $state<number | null>(null);
	let editBuffer = $state<ClientApplication | null>(null);
	let formError = $state<string | null>(null);
	let editUrl = $state('');
	let editArchived = $state(false);
	let editCompany = $state('');
	let editIntroduction = $state('');
	let editHighlightedAchievements = $state<HighlightedAchievementItem[]>([]);
	let editDefaultCategoriesArray = $state<(keyof typeof CATEGORIES)[]>([]);
	let editDefaultScopesArray = $state<(keyof typeof SKILLS)[]>([]);
	// New application form state
	let newUrl = $state('');
	let newCompany = $state('');
	let newIntroduction = $state('');
	let newHighlightedAchievements = $state<HighlightedAchievementItem[]>([]);
	let newDefaultCategoriesArray = $state<(keyof typeof CATEGORIES)[]>([]);
	let newDefaultScopesArray = $state<(keyof typeof SKILLS)[]>([]);
	let newFormError = $state<string | null>(null);
	let showNewForm = $state(false);

	// Helpers
	const categories = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
	const skillsScopes = skills.filter((s) => SKILLS[s]?.[1] === 'scope');

	function getProjectName(projectId?: string): string {
		if (!projectId) return 'Unknown Project';
		const project = data.projects?.find((p) => p.id === projectId);
		return project ? project.name : projectId;
	}

	// Master list of all achievements, sorted
	const masterSortedAchievements = data.achievements
		? [...data.achievements].sort((a, b) => {
				const aProjectName = getProjectName(a.projectId);
				const bProjectName = getProjectName(b.projectId);
				if (aProjectName !== bProjectName) {
					return aProjectName.localeCompare(bProjectName);
				}
				return a.id - b.id;
			})
		: [];
	// Reactive lists for available achievements
	const availableForEdit = $derived(
		masterSortedAchievements.filter(
			(ach) => !editHighlightedAchievements.some((hAch) => hAch.id === ach.id),
		),
	);
	const availableForNew = $derived(
		masterSortedAchievements.filter(
			(ach) => !newHighlightedAchievements.some((hAch) => hAch.id === ach.id),
		),
	);
	function parseHighlightedAchievements(app: ClientApplication): HighlightedAchievementItem[] {
		if (app.highlightedAchievementsData_parsed) {
			return JSON.parse(JSON.stringify(app.highlightedAchievementsData_parsed)); // Deep clone
		}
		if (typeof app.highlightedAchievements === 'string') {
			try {
				const parsed = JSON.parse(app.highlightedAchievements);
				if (
					Array.isArray(parsed) &&
					parsed.every((item) => typeof item.id === 'number' && typeof item.comment === 'string')
				) {
					app.highlightedAchievementsData_parsed = parsed;
					return JSON.parse(JSON.stringify(parsed)); // Deep clone
				}
			} catch (e) {
				console.error(
					'Failed to parse application.highlightedAchievements JSON string:',
					e,
					app.highlightedAchievements,
				);
			}
		}
		// Handle the database format with separate arrays for IDs and comments
		if (Array.isArray(app.highlightedAchievementIds)) {
			const mappedFromIds = app.highlightedAchievementIds.map((id, index) => ({
				id,
				comment: (Array.isArray(app.highlightedComments) && app.highlightedComments[index]) || '', // Use corresponding comment or empty string
			}));
			app.highlightedAchievementsData_parsed = mappedFromIds;
			return JSON.parse(JSON.stringify(mappedFromIds)); // Deep clone
		}
		app.highlightedAchievementsData_parsed = [];
		return [];
	}

	function startEdit(application: ClientApplication) {
		editingId = application.id;
		editBuffer = { ...application }; // Shallow copy is fine for buffer, deep for actual edit fields
		editUrl = application.url;
		editArchived = application.archived;
		editCompany = application.company;
		editIntroduction = application.introduction;
		editHighlightedAchievements = parseHighlightedAchievements(application);

		editDefaultCategoriesArray = (
			Array.isArray(application.defaultCategories) ? [...application.defaultCategories] : []
		) as (keyof typeof CATEGORIES)[];
		editDefaultScopesArray = (
			Array.isArray(application.defaultScopes) ? [...application.defaultScopes] : []
		) as (keyof typeof SKILLS)[];
		formError = null;
	}

	function cancelEdit() {
		editingId = null;
		editBuffer = null;
		editHighlightedAchievements = [];
		formError = null;
	}
	function resetNewForm() {
		newUrl = '';
		newCompany = '';
		newIntroduction = '';
		newHighlightedAchievements = [];
		newDefaultCategoriesArray = [];
		newDefaultScopesArray = [];
		newFormError = null;
	}

	function toggleEditCategory(category: keyof typeof CATEGORIES) {
		if (editDefaultCategoriesArray.includes(category)) {
			editDefaultCategoriesArray = editDefaultCategoriesArray.filter((c) => c !== category);
		} else {
			editDefaultCategoriesArray = [...editDefaultCategoriesArray, category];
		}
	}

	function toggleEditScope(scope: keyof typeof SKILLS) {
		if (editDefaultScopesArray.includes(scope)) {
			editDefaultScopesArray = editDefaultScopesArray.filter((s) => s !== scope);
		} else {
			editDefaultScopesArray = [...editDefaultScopesArray, scope];
		}
	}

	function toggleNewCategory(category: keyof typeof CATEGORIES) {
		if (newDefaultCategoriesArray.includes(category)) {
			newDefaultCategoriesArray = newDefaultCategoriesArray.filter((c) => c !== category);
		} else {
			newDefaultCategoriesArray = [...newDefaultCategoriesArray, category];
		}
	}

	function toggleNewScope(scope: keyof typeof SKILLS) {
		if (newDefaultScopesArray.includes(scope)) {
			newDefaultScopesArray = newDefaultScopesArray.filter((s) => s !== scope);
		} else {
			newDefaultScopesArray = [...newDefaultScopesArray, scope];
		}
	}

	// Edit Mode: Highlight/Unhighlight
	function highlightAchievementEdit(achievementId: number) {
		if (!editHighlightedAchievements.some((h) => h.id === achievementId)) {
			editHighlightedAchievements = [
				...editHighlightedAchievements,
				{ id: achievementId, comment: '' },
			];
		}
	}

	function unhighlightAchievementEdit(achievementId: number) {
		editHighlightedAchievements = editHighlightedAchievements.filter((h) => h.id !== achievementId);
	}

	// New Mode: Highlight/Unhighlight
	function highlightAchievementNew(achievementId: number) {
		if (!newHighlightedAchievements.some((h) => h.id === achievementId)) {
			newHighlightedAchievements = [
				...newHighlightedAchievements,
				{ id: achievementId, comment: '' },
			];
		}
	}

	function unhighlightAchievementNew(achievementId: number) {
		newHighlightedAchievements = newHighlightedAchievements.filter((h) => h.id !== achievementId);
	} // Helper for SortableList rendering
	function renderHighlightedAchievementItem(
		item: HighlightedAchievementItem,
		index: number,
		mode: 'edit' | 'new',
	) {
		return `
			<div class=\"highlighted-item mb-2 flex cursor-grab items-start gap-2 rounded border border-gray-300 bg-white p-2 shadow-sm last:mb-0\">
				<span class=\"drag-handle pt-1 pr-1 text-gray-500\">☰</span>
				<div class=\"flex-1\">
					<div class=\"text-sm font-medium\">${getAchievementWithProject(item.id)}</div>
					<textarea
						class=\"mt-1 w-full rounded border border-gray-300 p-2 text-xs\"
						placeholder=\"Comment for this achievement...\"
						rows=\"2\"
						onchange=\"this.dispatchEvent(new CustomEvent('commentchange', { detail: { index: ${index}, value: this.value }, bubbles: true }))\"
					>${item.comment ?? ''}</textarea>
				</div>
				<button type=\"button\" class=\"btn btn-action btn-remove rounded-sm px-2 py-1 text-xs\" onclick=\"this.dispatchEvent(new CustomEvent('remove', { detail: { index: ${index} }, bubbles: true }))\">Remove</button>
			</div>		`;
	}
	function handleEditCommentChange(e: CustomEvent) {
		const { index, value } = e.detail;
		editHighlightedAchievements = editHighlightedAchievements.map((item, i) =>
			i === index ? { ...item, comment: value } : item,
		);
	}
	function handleNewCommentChange(e: CustomEvent) {
		const { index, value } = e.detail;
		newHighlightedAchievements = newHighlightedAchievements.map((item, i) =>
			i === index ? { ...item, comment: value } : item,
		);
	}

	function handleEditRemove(e: CustomEvent) {
		const { index } = e.detail;
		editHighlightedAchievements = editHighlightedAchievements.filter((_, i) => i !== index);
	}
	function handleNewRemove(e: CustomEvent) {
		const { index } = e.detail;
		newHighlightedAchievements = newHighlightedAchievements.filter((_, i) => i !== index);
	}

	function getAchievementSummary(id: number): string {
		const achievement = data.achievements?.find((a: Achievement) => a.id === id);
		return achievement ? achievement.summary : `Achievement #${id}`;
	}

	function getAchievementWithProject(id: number): string {
		const achievement = data.achievements?.find((a: Achievement) => a.id === id);
		if (!achievement) return `Achievement #${id}`;
		const projectName = getProjectName(achievement.projectId);
		return `${projectName} - ${achievement.summary}`;
	}

	// Reactive helper to get parsed achievements for display
	function getDisplayableHighlightedAchievements(
		app: ClientApplication,
	): HighlightedAchievementItem[] {
		return parseHighlightedAchievements(app);
	}
</script>

<h1 class="my-4 text-2xl">Applications</h1>

<div class="admin-list">
	{#each data.applications as applicationData}
		{@const application = applicationData as ClientApplication}
		{#key application.id}
			{#if editingId === application.id && editBuffer}
				<form
					method="POST"
					action="?/update"
					onsubmit={(e) => {
						e.preventDefault();
						const form = e.currentTarget as HTMLFormElement;
						const fd = new FormData(form);
						fd.set('id', application.id.toString());
						fd.set('url', editUrl);
						fd.set('archived', editArchived.toString());
						fd.set('company', editCompany);
						fd.set('introduction', editIntroduction);
						fd.set('highlightedAchievements', JSON.stringify(editHighlightedAchievements));
						fd.set('defaultCategories', editDefaultCategoriesArray.join(', '));
						fd.set('defaultScopes', editDefaultScopesArray.join(', '));
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
					<!-- ... existing form fields for company, url, introduction ... -->
					<div class="mb-2 flex items-center gap-2">
						<input type="text" name="company" bind:value={editCompany} class="text-lg font-bold" />
						<span>({application.id})</span>
						<label class="flex items-center gap-1">
							<input type="checkbox" bind:checked={editArchived} />
							Archived
						</label>
						<div class="flex gap-2">
							<button type="submit" class="btn btn-primary btn-action rounded-sm px-2">Save</button>
							<button type="button" onclick={cancelEdit} class="btn btn-action rounded-sm px-2"
								>Cancel</button
							>
						</div>
					</div>

					<div class="mb-2">
						<label class="mb-1 block font-bold" for="url">URL Slug:</label>
						<input
							type="text"
							name="url"
							bind:value={editUrl}
							class="w-full"
							placeholder="unique-url-slug"
						/>
					</div>

					<div class="mb-2">
						<label class="mb-1 block font-bold" for="introduction">Introduction:</label>
						<textarea name="introduction" bind:value={editIntroduction} rows="4" class="w-full"
						></textarea>
					</div>

					<!-- New Highlighted Achievements Section -->
					<div class="mb-2">
						<div class="mb-1 block font-bold">Highlighted Achievements (Drag to Reorder):</div>
						<SortableList
							bind:items={editHighlightedAchievements}
							render={(item, index) =>
								renderHighlightedAchievementItem(item as HighlightedAchievementItem, index, 'edit')}
							on:commentchange={handleEditCommentChange}
							on:remove={handleEditRemove}
						/>
						{#if editHighlightedAchievements.length === 0}
							<p class="text-sm text-gray-500">
								No achievements highlighted yet. Check some from the list below.
							</p>
						{/if}
					</div>

					<div class="mb-2">
						<div class="mb-1 block font-bold">Available Achievements to Highlight:</div>
						<div class="max-h-64 overflow-y-auto rounded border border-gray-300 p-2">
							{#each availableForEdit as achievement (achievement.id)}
								<div class="mb-2 border-b border-gray-200 pb-2 last:border-b-0">
									<label class="flex items-start gap-2 py-1">
										<input
											type="checkbox"
											onchange={() => highlightAchievementEdit(achievement.id)}
											class="mt-1"
										/>
										<div class="flex-1">
											<span class="text-sm font-medium">
												#{achievement.id} - {getProjectName(achievement.projectId)} - {achievement.summary}
											</span>
										</div>
									</label>
								</div>
							{:else}
								<p class="text-sm text-gray-500">All achievements are currently highlighted.</p>
							{/each}
						</div>
					</div>

					<div class="mb-2">
						<div class="mb-1 block font-bold">Default Categories:</div>
						<div class="flex flex-wrap gap-1 py-1">
							{#each categories as category}
								<TagClickable
									{category}
									style={editDefaultCategoriesArray.includes(category) ? 'active' : 'inactive'}
									onclick={() => toggleEditCategory(category)}
								/>
							{/each}
						</div>
					</div>

					<div class="mb-2">
						<div class="mb-1 block font-bold">Default Scopes:</div>
						<div class="flex flex-wrap gap-1 py-1">
							{#each skillsScopes as scope}
								<TagClickable
									skill={scope}
									style={editDefaultScopesArray.includes(scope) ? 'active' : 'inactive'}
									onclick={() => toggleEditScope(scope)}
								/>
							{/each}
						</div>
					</div>

					{#if formError}
						<div class="text-red-600">{formError}</div>
					{/if}
				</form>
			{:else}
				<div class="mb-4 rounded border border-gray-200 p-4">
					<!-- ... existing display structure ... -->
					<div class="mb-2 flex items-center gap-2">
						<h3 class="text-lg font-bold">
							<span class="text-sm text-gray-500">#{application.id}</span>
							{application.company}
						</h3>
						{#if application.archived}
							<span class="rounded bg-gray-200 px-2 py-1 text-xs">ARCHIVED</span>
						{/if}
						<button
							onclick={() => startEdit(application)}
							class="btn btn-sm btn-action ml-auto rounded-sm px-2"
						>
							Edit
						</button>
					</div>

					<div class="mb-2">
						<strong>URL:</strong>
						<a href="/{application.url}" target="_blank">/{application.url}</a>
					</div>

					<div class="mb-2">
						<strong>Introduction:</strong>
						<p class="text-sm">{application.introduction}</p>
					</div>

					<!-- Updated display for highlighted achievements -->
					{#if getDisplayableHighlightedAchievements(application)?.length > 0}
						<div class="mb-2">
							<strong>Highlighted Achievements:</strong>
							<ul class="list-disc pl-5 text-sm">
								{#each getDisplayableHighlightedAchievements(application) as achItem}
									<li>
										{getAchievementWithProject(achItem.id)}
										{#if achItem.comment}
											<p class="text-s ml-4">{achItem.comment}</p>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{:else if application.highlightedAchievementIds && application.highlightedAchievementIds.length > 0}
						<div class="mb-2">
							<strong>Highlighted Achievements (Legacy - needs update):</strong>
							<ul class="list-disc pl-5 text-sm">
								{#each application.highlightedAchievementIds as id}
									<li>{getAchievementWithProject(id)}</li>
								{/each}
							</ul>
							<p class="text-xs text-gray-500">
								Edit this application to update achievement comments and order.
							</p>
						</div>
					{/if}

					{#if application.defaultCategories && application.defaultCategories.length > 0}
						<div class="mb-2">
							<strong>Default Categories:</strong>
							<div class="flex flex-wrap gap-1">
								{#each application.defaultCategories as category}
									<Tag category={category as keyof typeof CATEGORIES} />
									<!-- Safe: category is from defaultCategories which matches enum -->
								{/each}
							</div>
						</div>
					{/if}

					{#if application.defaultScopes && application.defaultScopes.length > 0}
						<div class="mb-2">
							<strong>Default Scopes:</strong>
							<div class="flex flex-wrap gap-1">
								{#each application.defaultScopes as scope}
									<Tag skill={scope as keyof typeof SKILLS} />
									<!-- Safe: scope is from defaultScopes which matches enum -->
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{/key}
	{/each}
</div>

<div class="border-black-200 mt-8 border-t-2 pt-4">
	{#if !showNewForm}
		<button
			class="btn btn-primary btn-action rounded-sm px-4 py-2"
			onclick={() => (showNewForm = true)}
		>
			Add New Application
		</button>
	{:else}
		<h3>Create New Application</h3>
		<form
			method="POST"
			action="?/create"
			onsubmit={(e) => {
				e.preventDefault();
				const form = e.currentTarget as HTMLFormElement;
				const fd = new FormData(form);
				fd.set('url', newUrl);
				fd.set('company', newCompany);
				fd.set('introduction', newIntroduction);
				fd.set('highlightedAchievements', JSON.stringify(newHighlightedAchievements));
				fd.set('defaultCategories', newDefaultCategoriesArray.join(', '));
				fd.set('defaultScopes', newDefaultScopesArray.join(', '));

				const res = fetch(form.action, { method: 'POST', body: fd });
				return res
					.then((r) => r.json())
					.then((result) => {
						if (result.type === 'success') {
							location.reload();
						} else {
							newFormError = result.data || 'Unknown error';
						}
					});
			}}
		>
			<!-- ... existing new form fields for company, url, introduction ... -->
			<div class="mb-2">
				<input
					type="text"
					name="company"
					bind:value={newCompany}
					class="text-lg font-bold"
					placeholder="Company Name"
					required
				/>
			</div>

			<div class="mb-2">
				<label class="mb-1 block font-bold" for="url">URL Slug:</label>
				<input
					type="text"
					name="url"
					bind:value={newUrl}
					class="w-full"
					placeholder="unique-url-slug"
					required
				/>
			</div>

			<div class="mb-2">
				<label class="mb-1 block font-bold" for="introduction">Introduction:</label>
				<textarea name="introduction" bind:value={newIntroduction} rows="4" class="w-full" required
				></textarea>
			</div>

			<!-- New Highlighted Achievements Section for New Form -->
			<div class="mb-2">
				<div class="mb-1 block font-bold">Highlighted Achievements (Drag to Reorder):</div>
				<SortableList
					bind:items={newHighlightedAchievements}
					render={(item, index) =>
						renderHighlightedAchievementItem(item as HighlightedAchievementItem, index, 'new')}
					on:commentchange={handleNewCommentChange}
					on:remove={handleNewRemove}
				/>
				{#if newHighlightedAchievements.length === 0}
					<p class="text-sm text-gray-500">
						No achievements highlighted yet. Check some from the list below.
					</p>
				{/if}
			</div>

			<div class="mb-2">
				<div class="mb-1 block font-bold">Available Achievements to Highlight:</div>
				<div class="max-h-64 overflow-y-auto rounded border border-gray-300 p-2">
					{#each availableForNew as achievement (achievement.id)}
						<div class="mb-2 border-b border-gray-200 pb-2 last:border-b-0">
							<label class="flex items-start gap-2 py-1">
								<input
									type="checkbox"
									onchange={() => highlightAchievementNew(achievement.id)}
									class="mt-1"
								/>
								<div class="flex-1">
									<span class="text-sm font-medium">
										#{achievement.id} - {getProjectName(achievement.projectId)} - {achievement.summary}
									</span>
								</div>
							</label>
						</div>
					{:else}
						<p class="text-sm text-gray-500">All achievements are currently highlighted.</p>
					{/each}
				</div>
			</div>

			<div class="mb-2">
				<div class="mb-1 block font-bold">Default Categories:</div>
				<div class="flex flex-wrap gap-1 py-1">
					{#each categories as category}
						<TagClickable
							{category}
							style={newDefaultCategoriesArray.includes(category) ? 'active' : 'inactive'}
							onclick={() => toggleNewCategory(category)}
						/>
					{/each}
				</div>
			</div>

			<div class="mb-2">
				<div class="mb-1 block font-bold">Default Scopes:</div>
				<div class="flex flex-wrap gap-1 py-1">
					{#each skillsScopes as scope}
						<TagClickable
							skill={scope}
							style={newDefaultScopesArray.includes(scope) ? 'active' : 'inactive'}
							onclick={() => toggleNewScope(scope)}
						/>
					{/each}
				</div>
			</div>

			<div class="flex gap-2">
				<button type="submit" class="btn btn-primary btn-action rounded-sm px-2">Create</button>
				<button
					type="button"
					onclick={() => {
						showNewForm = false;
						resetNewForm();
					}}
					class="btn btn-action rounded-sm px-2"
				>
					Cancel
				</button>
			</div>

			{#if newFormError}
				<div class="text-red-600">{newFormError}</div>
			{/if}
		</form>
	{/if}
</div>

<style>
	/* ... existing styles ... */
	.admin-list {
		max-width: 72rem;
	}

	:global(.btn) {
		border: 1px solid #ccc;
		background: white;
		color: black;
		text-decoration: none;
		cursor: pointer;
	}

	:global(.btn-primary) {
		background: #0066cc;
		color: white;
		border-color: #0066cc;
	}

	:global(.btn:hover) {
		background: #f0f0f0;
	}

	:global(.btn-primary:hover) {
		background: #0052a3;
	}
	:global(.btn-action) {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
	}

	:global(.btn-remove) {
		background: #f8d7da;
		color: #721c24;
		border-color: #f5c6cb;
		transition: background 0.15s;
	}
	:global(.btn-remove:hover) {
		background: #f5c6cb;
	}
</style>
