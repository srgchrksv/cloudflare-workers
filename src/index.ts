import { renderHtml } from "./renderHtml";

export default {
  async fetch(request, env, ctx) {

    const cache = caches.default;
    const cacheKey = new Request(request.url);
    const cached = await cache.match(cacheKey);

    if (cached) return cached;


    const stmt = env.DB.prepare("SELECT * FROM comments LIMIT 3");
    const { results } = await stmt.all();

    const response = new Response(renderHtml(JSON.stringify(results, null, 2)), {
      headers: {
        "content-type": "text/html",
        'Cache-Control': 'public, max-age=300'
      },
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
} satisfies ExportedHandler<Env>;
