import { useEffect, useState } from "react";

interface PopupProps {
    selectedRegion: any;
    setSelectedRegion: (region: any) => void;
    popupPosition: { x: number; y: number };
    mapping: Record<string, string>;
}

async function postData<T>(url: string, payload: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export default function Modal({ selectedRegion, setSelectedRegion, popupPosition, mapping }: PopupProps) {

    const [prediction, setPrediction] = useState<{pred : number; forecast: string; sensivity: string} | null>()
    const [section, setSection] = useState<number>(0)
    const [sector, setSector] = useState<"residential" | "industrial" | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        nominalPrice:"",
        realPrice: "",
        year: "",
        intensity: "",
    })

    const region_map: Record<string, number> = {
        Chubu: 0,
        Chugoku: 1,
        Hokkaidō: 2,
        Hokuriku: 3,
        Kansai: 4,
        Kyusyu: 5,
        Okinawa: 6,
        Shikoku: 7,
        Tohoku: 8,
        Tokyo: 9
    };

    useEffect(() => {
        setFormData({
            nominalPrice: "",
            realPrice: "",
            year: "",
            intensity: "",
        });
        setSector(null);
        setSection(0);
    }, [selectedRegion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, 
            [name]: value === "" ? 0 : Number(value)});
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sector) {
            setErrorMsg("Please select a sector before proceeding.");
            return;
        }

        if (!formData.year || !formData.nominalPrice || !formData.realPrice) {
            setErrorMsg("Please fill in all input fields before predicting.");
            return;
        }


        const regionName = selectedRegion.properties.name;
        const regionCode = region_map[regionName] ?? -1;


        const payload = {
            Region: regionCode,
            NominalPrice: formData.nominalPrice,
            RealPrice: formData.realPrice,
            Year: formData.year,
            Intensity: formData.intensity
        };

        if (sector === null) return null;
        console.log("data : ", payload);

        try {
            setErrorMsg("");
            setLoading(true);
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const predictionUrl = `${API_BASE_URL}/predict/${sector}`;
            const forecastUrl = `${API_BASE_URL}/visualize/${sector}/forecast`;
            const sensivityUrl = `${API_BASE_URL}/visualize/${sector}/price-sensitivity`;

            const predictionRes = await postData<{ prediction_kwh: number }>(predictionUrl, payload);
            

            console.log("hasil:", predictionRes.prediction_kwh);

            const forecastRes = await postData<any>(forecastUrl, payload);
            console.log("forecast:", forecastRes);

            const sensivityRes = await postData<any>(sensivityUrl, payload);
            console.log("sensivity:", sensivityRes);

            setPrediction(prev => prev
                ? { ...prev, pred: predictionRes.prediction_kwh, forecast: forecastRes.image_base64, sensivity: sensivityRes.image_base64 }
                : { pred: predictionRes.prediction_kwh, forecast: forecastRes.image_base64, sensivity: sensivityRes.image_base64 }
            );

            setSection(1);
        } catch (error) {
            console.error("Error saat fetch:", error);
            setErrorMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }

        // setSelectedRegion(null);
    }

    const handleBack = () => {
        setSection(0);
    }

    return (
    <div
    style={{
    top: popupPosition.y,
    left: popupPosition.x,
    }}
    className="absolute flex flex-col w-[30vw] h-[75vh] transform translate-x-[10px] -translate-y-[50%] bg-white/60 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg z-500"
    >

        {/* === Overlay Loading === */}
        {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
            <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                ></circle>
                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
                ></path>
            </svg>
        </div>
        )}
        

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 text-slate-800">
        <div>
            <h4>{mapping[selectedRegion.properties.name]}</h4>
            <p className="text-sm">{selectedRegion.properties.name}</p>
        </div>
        <button
            onClick={() => setSelectedRegion(null)}
            className="cursor-pointer font-bold text-lg"
        >
            X
        </button>
        </div>

        {errorMsg && (
        <div className="mb-3 p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {errorMsg}
        </div>
        )}

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 text-slate-800">
        {section === 0 && (
            <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            >
            {/* Pilih sector */}
            <div className="flex gap-3">
                <button
                type="button"
                onClick={() => setSector("residential")}
                className={`basis-1/2 py-2 rounded-md border border-gray-300 ${sector === "residential" ? "bg-blue-500 text-white" : "bg-transparent"}`}
                >
                Residential
                </button>
                <button
                type="button"
                onClick={() => setSector("industrial")}
                className={`basis-1/2 py-2 rounded-md border border-gray-300 ${sector === "industrial" ? "bg-blue-500 text-white" : "bg-transparent"}`}
                >
                Industrial
                </button>
            </div>

            {/* Input fields */}
            {[
                { label: "Year", name: "year" },
                { label: "Nominal Price", name: "nominalPrice" },
                { label: "Real Price", name: "realPrice" },
                { label: "Intensity", name: "intensity" },
            ].map((field) => (
                <div key={field.name} className="flex flex-col">
                <label htmlFor={field.name} className="mb-1 font-medium">
                    {field.label}
                </label>
                <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    placeholder={`Input ${field.label.toLowerCase()}`}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                </div>
            ))}
            </form>
        )}

        {section === 1 && prediction && (
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="font-medium text-md mb-2">Visualization prediction for 10 years</h1>
                    <img
                    src={`data:image/png;base64,${prediction.forecast}`}
                    alt="forecast"
                    />
                </div>
                <div>
                    <h1 className="font-medium text-md mb-2">Sensitivity to real prices</h1>
                    <img
                    src={`data:image/png;base64,${prediction.sensivity}`}
                    alt="sensivity"
                    />
                </div>
                {/* === Policy Conclusion === */}
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <h2 className="font-semibold text-lg mb-2">Policy Implication</h2>
                <p>
                    Based on the input parameters, the predicted electricity consumption for{" "}
                    <strong>{formData.year}</strong> in the{" "}
                    <strong>{sector}</strong> sector is estimated at{" "}
                    <strong>
                    {Number(prediction.pred).toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}{" "}
                    KWh
                    </strong>
                    . This projection provides a valuable reference for policymakers and energy
                    planners to adjust pricing strategies and develop programs that can manage
                    electricity demand effectively while maintaining supply stability.
                </p>
                </div>

            </div>
        )}
        </div>

        {/* FOOTER FIXED */}
        <div className="p-4 border-t border-gray-300">
        {section === 0 ? (
            <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
            >
            Predict
            </button>
        ) : (
            <button
            onClick={handleBack}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200"
            >
            Back
            </button>
        )}
        </div>
    </div>

    )
}