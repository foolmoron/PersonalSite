# foolmoron's Personal Site - Resume Builder

Check it out: [fool.dev](https://fool.dev/)

This is a design for a personal site that acts as an interactive resume builder, with a focus not just on projects, but key achievements in those projects. I thought of it after my experience applying to dozens of jobs with customized resumes and cover letters, especially with narrative-driven resumes.

## Tech stack

Svelte 5 with Vercel & Supabase. Wanted to try it out to see what the hype was about. It's alright.

NOTE: I also used this project to experiment with GitHub Copilot Agents, so large portions of the code (and nearly all the admin page code) is implemented by AI.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
