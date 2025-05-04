import { SKILLS } from '$lib/enums';
import { SvelteSet } from 'svelte/reactivity';

export const skills = Object.keys(SKILLS) as (keyof typeof SKILLS)[];
const skillTypes = Array.from(new Set(Object.values(SKILLS).map((item) => item[1]))); // ordered
skills.sort((a, b) => skillTypes.indexOf(SKILLS[a][1]) - skillTypes.indexOf(SKILLS[b][1]));

export const skillsActive = $state(new SvelteSet(skills));
