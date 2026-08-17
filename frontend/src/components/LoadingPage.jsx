import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [visible, setVisible] = useState(true);

  // Fade out after a brief moment so it feels snappy
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#092a1f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}
    >
      <img
        src="/logo.png"
        alt="MedTrack"
        style={{
          height: 100,
          width: "auto",
          animation: "mtPulse 1.4s ease-in-out infinite",
        }}
      />
      <span
        style={{
          marginTop: 16,
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "inherit",
        }}
      >
        Loading…
      </span>

      <style>{`
        @keyframes mtPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.97); }
        }
      `}</style>
    </div>
  );
}