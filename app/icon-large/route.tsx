import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "#29a373",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 280,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: "serif",
        }}
      >
        Т
      </span>
    </div>,
    { width: 512, height: 512 },
  );
}
