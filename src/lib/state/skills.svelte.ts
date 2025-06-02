import { CATEGORIES, SKILLS, TAGS } from '$lib/enums';
import { SvelteSet } from 'svelte/reactivity';

export const skills = Object.keys(SKILLS) as (keyof typeof SKILLS)[];
const skillTypes = Array.from(new Set(Object.values(SKILLS).map((item) => item[1]))); // ordered
skills.sort((a, b) => skillTypes.indexOf(SKILLS[a][1]) - skillTypes.indexOf(SKILLS[b][1]));

export const skillsScopeOnly = skills.filter((s) => SKILLS[s][1] === 'scope');
export const skillsWithoutScope = skills.filter((s) => SKILLS[s][1] !== 'scope');

export const skillsActive = $state(new SvelteSet(skills));

export const tags = Object.keys(TAGS) as (keyof typeof TAGS)[];
export const tagsActive = $state(new SvelteSet(tags));

export const categories = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
export const categoriesActive = $state<SvelteSet<keyof typeof CATEGORIES>>(
	new SvelteSet(categories),
);

export function toggleSkill(skill: keyof typeof SKILLS, enabled: boolean | null = null) {
	if ((enabled === null && skillsActive.has(skill)) || enabled === false) {
		skillsActive.delete(skill);
	} else if ((enabled === null && !skillsActive.has(skill)) || enabled === true) {
		skillsActive.add(skill);
	}
}

export function enableAllScopes() {
	for (const s of skillsScopeOnly) {
		skillsActive.add(s);
	}
}

export function toggleCategory(
	category: keyof typeof CATEGORIES | null,
	enabled: boolean | null = null,
) {
	if (category === null) {
		categoriesActive.clear();
	} else if ((enabled === null && categoriesActive.has(category)) || enabled === false) {
		categoriesActive.delete(category);
	} else if ((enabled === null && !categoriesActive.has(category)) || enabled === true) {
		categoriesActive.add(category);
	}
	for (const s of Array.from(skillsActive).filter((s) => SKILLS[s][1] !== 'scope')) {
		skillsActive.delete(s);
	}
	tagsActive.clear();
	if (categoriesActive.size > 0) {
		for (const c of categoriesActive) {
			for (const skill of CATEGORIES[c].skills) {
				skillsActive.add(skill);
			}
			for (const tag of CATEGORIES[c].tags) {
				tagsActive.add(tag);
			}
		}
	} else {
		for (const c of categories) {
			categoriesActive.add(c);
		}
		for (const s of skillsWithoutScope) {
			skillsActive.add(s);
		}
		for (const t of tags) {
			tagsActive.add(t);
		}
	}
}
