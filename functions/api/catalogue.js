function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequest({ request, env }) {
  if (!env.DB) {
    return json({ error: "D1 database binding DB is missing" }, 500);
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const method = request.method;

  try {
    if (method === "GET") {
      const { results } = await env.DB.prepare(`
        SELECT id, name, price, image
        FROM catalogue
        WHERE active = 1
        ORDER BY id DESC
      `).all();

      return json(results);
    }

    if (method === "POST") {
      const body = await request.json();

      if (!body.name || body.price == null || !body.image) {
        return json({
          error: "name, price and image are required"
        }, 400);
      }

      const result = await env.DB.prepare(`
        INSERT INTO catalogue (name, price, image)
        VALUES (?, ?, ?)
      `).bind(
        String(body.name).trim(),
        String(body.price),
        String(body.image).trim()
      ).run();

      return json({
        success: true,
        id: result.meta.last_row_id
      }, 201);
    }

    if (method === "PUT") {
      if (!id) {
        return json({ error: "Product id is required" }, 400);
      }

      const body = await request.json();

      if (!body.name || body.price == null || !body.image) {
        return json({
          error: "name, price and image are required"
        }, 400);
      }

      const result = await env.DB.prepare(`
        UPDATE catalogue
        SET name = ?, price = ?, image = ?
        WHERE id = ?
      `).bind(
        String(body.name).trim(),
        String(body.price),
        String(body.image).trim(),
        id
      ).run();

      return json({
        success: true,
        changes: result.meta.changes
      });
    }

    if (method === "DELETE") {
      if (!id) {
        return json({ error: "Product id is required" }, 400);
      }

      const result = await env.DB.prepare(`
        UPDATE catalogue
        SET active = 0
        WHERE id = ?
      `).bind(id).run();

      return json({
        success: true,
        changes: result.meta.changes
      });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return json({ error: "Catalogue operation failed" }, 500);
  }
}