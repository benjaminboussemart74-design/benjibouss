
import React from "react";

export default function FontPreview() {
  return (
    <div style={{ position: "absolute", left: 0, top: 60, width: "40vw", padding: "2rem", fontFamily: "SpaceGrotesk, Arial, sans-serif", color: "#222" }}>
      <div style={{ fontWeight: 700, fontSize: "2.5rem", marginBottom: "1.5rem" }}>
        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
        abcdefghijklmnopqrstuvwxyz<br />
        1234567890
      </div>
    </div>
  );
}
