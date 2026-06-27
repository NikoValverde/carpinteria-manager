// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import { buildPrompt } from "./prompts/promptBuilder.ts";
import type { PromptContext } from "./types/promptContext.ts";
import { getProvider } from "./providers/providerFactory.ts";

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    // Called by another service with a secret key
    // ctx.supabaseAdmin bypasses RLS — use for privileged operations
    /*
    if (ctx.authMode === "secret") {
      const { user_id } = await req.json();
      const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(user_id);

      return Response.json({
        email: data?.user?.email,
      });
    }
    */

    const context = (await req.json()) as PromptContext;
    if (!context.mode) {
      return Response.json(
        {
          success: false,
          error: "El modo es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (context.mode === "improve" && !context.textoOriginal?.trim()) {
      return Response.json(
        {
          success: false,
          error: "El texto original es obligatorio para mejorar.",
        },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(context);

    const provider = getProvider();

    let response;

    switch (context.mode) {
      case "improve":
        response = await provider.improveText(
          `${prompt.system}\n\n${prompt.user}`,
        );
        break;

      case "generate":
        response = await provider.generateDescription(
          `${prompt.system}\n\n${prompt.user}`,
        );
        break;

      default:
        return Response.json(
          {
            success: false,
            error: "Modo no soportado.",
          },
          { status: 400 },
        );
    }

    return Response.json(response);
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/writing-assistant' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
