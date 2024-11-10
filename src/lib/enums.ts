export const SKILLS = {
	ts: 'TypeScript',
	js: 'JavaScript',
	cs: 'C#',
	python: 'Python',
	java: 'Java',
	ruby: 'Ruby',
	rust: 'Rust',
	htmlcss: 'HTML/CSS',
	sql: 'SQL',
	nosql: 'NoSQL',
	node: 'Node',
	react: 'React',
	svelte: 'Svelte',
	aws: 'AWS',
	gcp: 'GCP',
	unity: 'Unity',
	godot: 'Godot',
	canvas: 'Canvas2D',
	webgl: 'WebGL',
	desktop: 'Desktop',
	mobile: 'Mobile',
	consoles: 'Consoles',
	vr: 'VR/AR/XR',
	gamedesign: 'Game Design',
	audio: 'Audio Design',
	vfx: 'VFX Design',
	architect: 'Architecture',
	manage: 'Management',
	talks: 'Tech Talks',
	perf: 'Performance Optimization',
	realtime: 'Realtime Multiplayer',
	webrtc: 'WebRTC',
	diffusion: 'Diffusion Models',
	llm: 'LLM Models',
	devops: 'Dev Ops',
	oncall: 'On-Call',
	gpu: 'GPU',
	anim: 'Animation',
	pro: 'Professional',
	extra: 'Extracurricular',
} as const;

export const TAGS = {
	subtle: 'Subtlety',
	general: 'General',
	lead: 'Leadership',
	onlyi: 'Only I Could Solve',
	process: 'Process',
	docs: 'Documentation',
} as const;

interface Category {
	name: string;
	skills: (keyof typeof SKILLS)[];
}
export const CATEGORIES = {
	web: {
		name: 'Web Developer',
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
	},
	games: {
		name: 'Game Developer',
		skills: ['cs', 'unity', 'godot', 'consoles', 'vr', 'gamedesign', 'audio', 'vfx', 'gpu'],
	},
	ai: {
		name: 'AI Developer',
		skills: ['diffusion', 'llm'],
	},
	Lead: {
		name: 'Engineering Lead',
		skills: ['architect', 'manage', 'talks', 'oncall'],
	},
} as const satisfies Record<string, Category>;

export const TAG_SUBTLE: keyof typeof TAGS = 'subtle';
