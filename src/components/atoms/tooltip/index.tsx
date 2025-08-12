interface TooltipProps {
  hoveredRegion: string | null;
  hoverPos: { x: number; y: number } | null;
  mapping: Record<string, string>;
}

export default function Tooltip({ hoveredRegion, hoverPos, mapping }: TooltipProps) {
  if (!hoverPos || !hoveredRegion) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: hoverPos.y - 30,
        left: hoverPos.x,
        pointerEvents: "none",
        backgroundColor: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "4px 8px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        transform: "translateX(-50%)",
        zIndex: 1000,
        userSelect: "none"
      }}
    >
      {mapping[hoveredRegion]} - {hoveredRegion}
    </div>
  );
}
