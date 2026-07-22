import { theme } from "./theme";

export default function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        padding: 0;
        background: ${theme.ink};
        color: ${theme.white};
        font-family: ${theme.fontBody};
        font-size: 15px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      a { color: inherit; text-decoration: none; }
      button { font: inherit; color: inherit; background: none; border: none; }

      /* Hide the horizontal scrollbar on the category rail */
      .no-scrollbar { scrollbar-width: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }

      :focus-visible { outline: 2px solid ${theme.white}; outline-offset: 3px; }

      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `}</style>
  );
}