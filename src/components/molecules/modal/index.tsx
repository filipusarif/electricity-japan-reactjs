interface PopupProps {
    selectedRegion: any;
    setSelectedRegion: (region: any) => void;
    popupPosition: { x: number; y: number };
    mapping: Record<string, string>;
}

export default function Modal({ selectedRegion, setSelectedRegion, popupPosition, mapping }: PopupProps) {
    return (
        <div
            style={{
        position: "absolute",
        top: popupPosition.y,
        left: popupPosition.x,
        width: "30vw",
        height: "20vh",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transform: "translate(10px, -50%)",
        zIndex: 1100,
        overflow: "auto",
        }}
    >
        <h4>{mapping[selectedRegion.properties.name]}</h4>
        <p>{selectedRegion.properties.name}</p>
        <button onClick={() => setSelectedRegion(null)}>Tutup</button>
    </div>
    )
}