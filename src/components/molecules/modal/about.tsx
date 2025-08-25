import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import {
  Line,
  Scatter,
  Bar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

// Define interface untuk row dataset
interface ElectricityData {
  Region: string;
  Year: number;
  "Con. Res": number;
  "Con. Ind": number;
  "N. Price. Res": number;
  "N. Price. Ind": number;
}

interface ModalAboutProps {
  onClose: () => void;
}

export default function ModalAbout({ onClose }: ModalAboutProps) {
  const [data, setData] = useState<ElectricityData[]>([]);
  const [region, setRegion] = useState<string>("");
  const [sector, setSector] = useState<"Residential" | "Industrial">("Residential");

  useEffect(() => {
    Papa.parse<ElectricityData>("/data/electricity_data.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result: ParseResult<ElectricityData>) => {
        const filtered = result.data.filter(row => row.Region);
        setData(filtered);
        if (filtered.length > 0) setRegion(filtered[0].Region);
      },
    });
  }, []);

  if (data.length === 0) return null;

  // --- Data untuk tabel ---
  const tableHeaders = Object.keys(data[0]) as (keyof ElectricityData)[];

  // --- Data untuk grafik 1 (Time Series) ---
  const filteredRegion = data.filter(d => d.Region === region);
  const lineData = {
    labels: filteredRegion.map(d => d.Year),
    datasets: [
      {
        label: "Residential",
        data: filteredRegion.map(d => d["Con. Res"]),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Industrial",
        data: filteredRegion.map(d => d["Con. Ind"]),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    ]
  };

  // --- Data untuk grafik 2 (Scatter) ---
  const priceCol = sector === "Residential" ? "N. Price. Res" : "N. Price. Ind";
  const consumptionCol = sector === "Residential" ? "Con. Res" : "Con. Ind";
  const scatterData = {
    datasets: [
      {
        label: sector,
        data: data.map(d => ({
          x: d[priceCol],
          y: d[consumptionCol]
        })),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }
    ]
  };

  // --- Data untuk grafik 3 (Bar per Region) ---
  type AvgData = { count: number; res: number; ind: number; };
  const avgPerRegion: Record<string, AvgData> = {};
  data.forEach(d => {
    if (!avgPerRegion[d.Region]) avgPerRegion[d.Region] = { count: 0, res: 0, ind: 0 };
    avgPerRegion[d.Region].count++;
    avgPerRegion[d.Region].res += d["Con. Res"];
    avgPerRegion[d.Region].ind += d["Con. Ind"];
  });

  const regions = Object.keys(avgPerRegion);
  const barData = {
    labels: regions,
    datasets: [
      {
        label: "Residential",
        data: regions.map(r => avgPerRegion[r].res / avgPerRegion[r].count),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      },
      {
        label: "Industrial",
        data: regions.map(r => avgPerRegion[r].ind / avgPerRegion[r].count),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[500]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose} 
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-[90%] md:w-[80%] h-[90vh] bg-white/90 backdrop-blur-md border border-gray-300 rounded-lg shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 text-slate-800">
          <h4 className="font-bold text-lg">About - Japan's Electricity Consumption</h4>
          <button
            onClick={onClose}
            className="cursor-pointer font-bold text-lg hover:text-red-600"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-4 text-sm text-slate-700 h-full overflow-y-auto flex-1">
          <p>Information and visualization from Japan's electricity consumption dataset.</p>

          {/* Dataset Preview */}
          <h5 className="mt-4 font-bold">Dataset</h5>
          <table className="table-auto w-full border border-gray-300 text-xs mt-2">
            <thead className="bg-gray-200">
              <tr>
                {tableHeaders.map(key => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, idx) => (
                <tr key={idx}>
                  {tableHeaders.map(key => (
                    <td key={key} className="border px-2 py-1">{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grafik 1: Time Series */}
          <h5 className="mt-6 font-bold">Electricity Consumption Over the Years</h5>
          <select
            className="border p-1 mt-2"
            value={region}
            onChange={e => setRegion(e.target.value)}
          >
            {Array.from(new Set(data.map(d => d.Region))).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="mt-4">
            <Line data={lineData} />
          </div>

          {/* Grafik 3: Perbandingan Region */}
          <h5 className="mt-6 font-bold">Comparison of Electricity Consumption by Region</h5>
          <div className="mt-4">
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}
