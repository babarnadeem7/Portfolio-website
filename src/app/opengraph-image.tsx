import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role} in ${site.location.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#EA4416";
const INK = "#111111";
const CANVAS = "#EDEBE6";

/** Social card: the name inside a Figma selection, on the canvas. */
export default function OpengraphImage() {
  const handle = (pos: Record<string, number>) => (
    <div
      style={{
        position: "absolute",
        width: 14,
        height: 14,
        background: CANVAS,
        border: `2px solid ${ACCENT}`,
        ...pos,
      }}
    />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: CANVAS,
          color: INK,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5A5752" }}>
          <span>
            {site.firstName} / Portfolio
          </span>
          <span>
            {site.location.city}, {site.location.country}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: ACCENT,
              color: INK,
              fontSize: 22,
              padding: "6px 12px",
              marginBottom: 6,
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignSelf: "flex-start",
              border: `2px solid ${ACCENT}`,
              padding: "12px 28px 20px",
            }}
          >
            {handle({ left: -8, top: -8 })}
            {handle({ right: -8, top: -8 })}
            {handle({ left: -8, bottom: -8 })}
            {handle({ right: -8, bottom: -8 })}
            <span style={{ fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>{site.name}</span>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#5A5752" }}>
          Mobile apps, websites, web apps and scalable design systems in Figma.
        </div>
      </div>
    ),
    size,
  );
}
