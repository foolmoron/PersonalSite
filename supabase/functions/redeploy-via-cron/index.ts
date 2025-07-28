// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { Vercel } from 'npm:@vercel/sdk';

const CRON_INTERVAL_MINS = 1;

const vercel = new Vercel({
	bearerToken: Deno.env.get('VERCEL_TOKEN') ?? '',
});

async function queryTable(supabase: SupabaseClient, tableName: string) {
	const timeToCheck = new Date(Date.now() - 1000 * 60 * CRON_INTERVAL_MINS * 1.25);
	const { data, error } = await supabase
		.from(tableName)
		.select('updated_at')
		.gt('updated_at', timeToCheck.toISOString())
		.limit(1);
	if (error) {
		throw error;
	}
	return data;
}

Deno.serve(async (req) => {
	try {
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			{ global: { headers: { Authorization: req.headers.get('Authorization')! } } },
		);

		const datas = await Promise.all(
			['projects', 'achievements', 'applications'].map((tableName) => {
				return queryTable(supabase, tableName);
			}),
		);
		const count = datas.reduce((acc, data) => {
			return acc + data.length;
		}, 0);

		if (count > 0) {
			const res = await vercel.deployments.getDeployments({
				app: `personal-site`,
				limit: 1,
			});
			const latestDeployment = res.deployments[0];
			await vercel.deployments.createDeployment({
				requestBody: {
					name: `personal-site`,
					deploymentId: latestDeployment.uid,
					target: 'production',
				},
			});
		}

		return new Response('OK - ' + count, { status: 200 });
	} catch (err) {
		return new Response(String((err as Error)?.message ?? err), { status: 500 });
	}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/redeploy-via-cron' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
