export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Get Food Catalog Data (GET)
      if (url.pathname === "/api/food" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM food_catalogue").all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Add New Food Item (POST)
      if (url.pathname === "/api/food" && request.method === "POST") {
        const body = await request.json();
        const { name, category, price, image_url, description } = body;

        await env.DB.prepare(
          "INSERT INTO food_catalogue (name, category, price, image_url, description) VALUES (?, ?, ?, ?, ?)"
        ).bind(name, category, price, image_url, description || "").run();

        return new Response(JSON.stringify({ success: true, message: "Food added successfully!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response("Endpoint not found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};