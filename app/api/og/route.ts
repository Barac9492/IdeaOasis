import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "IdeaOasis";
  const offer = searchParams.get("offer") || "Korea-fit startup ideas";
  const badges = (searchParams.get("badges") || "").split(",").slice(0, 3);

  return new ImageResponse(
    (
      // Use plain object style without JSX to avoid TSX parsing
      {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#0B1021", color: "#fff", padding: "64px", fontSize: 36 },
          children: [
            { type: "div", props: { style: { fontSize: 48, fontWeight: 700, marginBottom: 12 }, children: title } },
            { type: "div", props: { style: { fontSize: 28, opacity: 0.9 }, children: offer } },
            {
              type: "div",
              props: {
                style: { display: "flex", gap: 8, marginTop: 18 },
                children: badges.filter(Boolean).map((b, i) => ({
                  type: "div",
                  key: i,
                  props: { style: { padding: "6px 10px", borderRadius: 999, background: "#11193A", border: "1px solid #223", fontSize: 20 }, children: b },
                })),
              },
            },
            { type: "div", props: { style: { position: "absolute", bottom: 48, fontSize: 20, opacity: 0.7 }, children: "ideaoasis" } },
          ],
        },
      } as any
    ),
    { width: 1200, height: 630 }
  );
}