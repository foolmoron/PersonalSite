# Project coding standards

## Response Guidelines

- Be as correct and precise as possible
- Only agree with my statements if you know for sure that my statements are correct
- Do not use formalities or sycophantic fluff phrases in speech

## Code Guidelines

- Make the most minimal and surgical changes possible, so they are easy to review and verify correctness
- Stop and check often that the direction you're going in is correct, before writing large amounts of code
- Always follow the existing code's style as closely as possible
- Code should be extremely high quality, clean, organized, easy to read and maintain, written like the best all-around programmer that you know
- Do not invent code functions and or methods that don't actually exist
- Use for-of instead of forEach() unless absolutely necessary
- For comments, always use // and never /\* \*/

## TypeScript

- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use modern idiomatic TypeScript features like optional chaining (?.) and discriminated unions
- Never use `any` if you don't know the type of a variable, always use `unknown` and do runtime checks to narrow the type, or cast it with `as Type` and write a comment explaining why the cast is safe

## Svelte

- We are using Svelte 5 and SvelteKit 2, which have very different syntax from Svelte 4
- Create new components when they need to be heavily reused, or when they get very large and complicated
- Always follow the style that you see in existing components
- Use CSS class styling, like the existing components
- The app MUST use URL routing for all meaningful view state changes, so you can copy/paste links to other people and it will load to the correct state, and you can use browser back/forward as expected

## Database

- The DB schema is in `src/lib/server/db/schema.ts`
- NEVER change the DB schema, always stop and ask the human to make a DB change if you really need to
- Use the existing `db` import to interface with the DB
