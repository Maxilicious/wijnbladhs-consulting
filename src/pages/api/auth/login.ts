import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request, redirect }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return new Response('Missing GOOGLE_CLIENT_ID environment variable.', { status: 500 });
  }

  // Construct the redirect URI. Since this is an API route, we want to redirect back to our callback API route
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return redirect(authUrl.toString());
};
