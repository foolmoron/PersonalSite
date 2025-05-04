import { SKILLS } from '$lib/enums';
import { SvelteSet } from 'svelte/reactivity';

export const skills = Object.keys(SKILLS) as (keyof typeof SKILLS)[];
export const skillsActive = $state(new SvelteSet(skills));
