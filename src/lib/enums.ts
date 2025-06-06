export const COLORS = {
	lang: '#fff127',
	tech: '#a7c7ff',
	platform: '#ffa6de',
	activity: '#ffc280',
	scope: '#c8c8c8',
} as const satisfies Record<string, `#${string}`>;

export const SKILLS = {
	ts: ['TypeScript', 'lang'],
	js: ['JavaScript', 'lang'],
	cs: ['C#', 'lang'],
	python: ['Python', 'lang'],
	java: ['Java', 'lang'],
	ruby: ['Ruby', 'lang'],
	rust: ['Rust', 'lang'],
	htmlcss: ['HTML/CSS', 'lang'],
	sql: ['SQL', 'lang'],
	nosql: ['NoSQL', 'lang'],
	node: ['Node', 'tech'],
	react: ['React', 'tech'],
	svelte: ['Svelte', 'tech'],
	aws: ['AWS', 'tech'],
	gcp: ['GCP', 'tech'],
	unity: ['Unity', 'tech'],
	godot: ['Godot', 'tech'],
	canvas: ['Canvas2D', 'tech'],
	webgl: ['WebGL', 'tech'],
	desktop: ['Desktop', 'platform'],
	mobile: ['Mobile', 'platform'],
	consoles: ['Consoles', 'platform'],
	vr: ['VR/AR/XR', 'platform'],
	gamedesign: ['Game Design', 'activity'],
	audio: ['Audio Design', 'activity'],
	vfx: ['VFX Design', 'activity'],
	architect: ['Architecture', 'activity'],
	manage: ['Management', 'activity'],
	talks: ['Tech Talks', 'activity'],
	perf: ['Performance Optimization', 'activity'],
	realtime: ['Realtime Multiplayer', 'activity'],
	anim: ['Animation', 'activity'],
	devops: ['Dev Ops', 'activity'],
	oncall: ['On-Call', 'activity'],
	webrtc: ['WebRTC', 'tech'],
	diffusion: ['Diffusion Models', 'tech'],
	llm: ['LLM Models', 'tech'],
	gpu: ['GPU', 'tech'],
	pro: ['Professional', 'scope'],
	extra: ['Extracurricular', 'scope'],
	startup: ['Startup', 'scope'],
	enterprise: ['Enterprise', 'scope'],
	solo: ['Sole Dev', 'scope'],
} as const satisfies Record<string, [string, keyof typeof COLORS]>;

export const TAGS = {
	subtle: ['Subtlety', '#e4e4e4'],
	general: ['General', '#bfbfbf'],
	lead: ['Leadership', '#c596ff'],
	onlyi: ['Only I Could Solve', '#ffbc5f'],
	process: ['Process', '#91f086'],
	docs: ['Documentation', '#87d1ff'],
} as const satisfies Record<string, [string, `#${string}`]>;

interface Category {
	name: string;
	color: `#${string}`;
	skills: (keyof typeof SKILLS)[];
	tags: (keyof typeof TAGS)[];
}
export const CATEGORIES = {
	games: {
		name: 'Game Developer',
		color: '#ffbc5f',
		skills: ['cs', 'unity', 'godot', 'consoles', 'vr', 'gamedesign', 'audio', 'vfx', 'gpu'],
		tags: ['onlyi', 'docs'],
	},
	web: {
		name: 'Web Developer',
		color: '#ffbc5f',
		skills: [
			'ts',
			'js',
			'htmlcss',
			'sql',
			'nosql',
			'node',
			'react',
			'svelte',
			'aws',
			'gcp',
			'canvas',
			'webgl',
			'webrtc',
		],
		tags: ['onlyi', 'docs'],
	},
	realtime: {
		name: 'Realtime Engineer',
		color: '#ffbc5f',
		skills: ['perf', 'realtime', 'anim', 'webgl', 'webrtc'],
		tags: ['onlyi', 'docs'],
	},
	ai: {
		name: 'AI Developer',
		color: '#ffbc5f',
		skills: ['diffusion', 'llm'],
		tags: ['onlyi', 'docs'],
	},
	lead: {
		name: 'Engineering Lead',
		color: '#ffbc5f',
		skills: ['architect', 'manage', 'talks', 'oncall'],
		tags: ['process', 'lead', 'docs'],
	},
} as const satisfies Record<string, Category>;

export const TAG_SUBTLE: keyof typeof TAGS = 'subtle';
