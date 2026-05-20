import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code query parameter.', { status: 400 });
  }

  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('Missing Google OAuth environment variables.', { status: 500 });
  }

  const redirectUri = `${url.origin}/api/auth/callback`;

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Failed to exchange code for tokens: ${response.status} ${response.statusText} - ${errorText}`, { status: response.status });
    }

    const data = await response.json();

    if (!data.refresh_token) {
       return new Response('No refresh token received. You might need to re-authorize and force consent.', { status: 400 });
    }

    return new Response(data.refresh_token, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    return new Response(`Error exchanging code for tokens: ${error.message}`, { status: 500 });
  }
};
