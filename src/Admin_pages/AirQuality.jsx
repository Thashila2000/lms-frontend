import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../Components/Admin_navbar";
import { airQualityRealtime as realtime } from '../firebase';
import { ref, onValue } from "firebase/database";
import GaugeChart from "react-gauge-chart";
import { Line } from "react-chartjs-2";
import { FaLeaf } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AirQuality() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [airQuality, setAirQuality] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ name: "", image: "", classNumber: "" });
  const { slug } = useParams();

  useEffect(() => {
    const sensorRef = ref(realtime, `classrooms/${slug}/sensors`);
    const metaRef = ref(realtime, `classrooms/${slug}/meta`);

    const unsubscribeSensors = onValue(sensorRef, (snapshot) => {
      const sensors = snapshot.val();
      if (sensors) {
        setTemperature(sensors.temperature || 0);
        setHumidity(sensors.humidity || 0);
        setAirQuality(sensors.airQuality || 0);

        setHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: sensors.temperature || 0,
            humidity: sensors.humidity || 0,
            airQuality: sensors.airQuality || 0,
          },
        ]);
      }
      setLoading(false);
    });

    const unsubscribeMeta = onValue(metaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMeta({
          name: data.name || `Classroom ${slug.toUpperCase()}`,
          image: data.image || "",
          classNumber: data.classNumber || "",
        });
      }
    });

    return () => {
      unsubscribeSensors();
      unsubscribeMeta();
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lineData = (label, key, color) => ({
    labels: history.map((h) => h.time),
    datasets: [
      {
        label,
        data: history.map((h) => h[key]),
        borderColor: color,
        backgroundColor: `${color}50`,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = (unit) => ({
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw} ${unit}`,
      },
      bodyFont: { size: 14 },
      titleFont: { size: 16 },
    },
    legend: { labels: { font: { size: 14 } } },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: Math.floor(history.length / 2),
        
        callback: function (value, index) {
          const label = this.getLabelForValue(value);
          return index % 2 === 0 ? label : "";
        },
        font: { size: 12 },
      },
    },
    y: {
      beginAtZero: true,
      ticks: { font: { size: 14 } },
    },
  },
});

  const report = () => {
    let status = [];

    if (temperature < 18) status.push("The room is cold. Consider heating.");
    else if (temperature <= 26) status.push("Temperature is comfortable.");
    else if (temperature <= 30) status.push("The room is slightly warm.");
    else status.push("The room is hot. Cooling recommended.");

    if (humidity < 30) status.push("Humidity is low. May cause dryness or irritation.");
    else if (humidity <= 60) status.push("Humidity levels are optimal.");
    else if (humidity <= 70) status.push("Humidity is slightly high. Monitor for discomfort.");
    else status.push("Humidity is high. Risk of mold or discomfort.");

    if (airQuality < 400) status.push("Air quality is excellent.");
    else if (airQuality <= 800) status.push("Air quality is good.");
    else if (airQuality <= 1200) status.push("Air quality is moderate. Consider ventilation.");
    else if (airQuality <= 2000) status.push("Air quality is poor. Ventilation recommended.");
    else status.push("Air quality is very poor. Immediate action needed.");

    return status.join(" ");
  };

  const latestTime = history.length ? history[history.length - 1].time : "N/A";

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen p-4 mt-14 sm:p-6 md:p-8 lg:p-12 md:ml-64 bg-gradient-to-b from-gray-100 to-gray-200">
        {/* Page Title */}
        <motion.h1
          className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaLeaf className="text-green-600" size={36} />
          <span> {meta.name} Environmental Details {slug && `– ${slug.toUpperCase()}`}
</span>
        </motion.h1>

        {/* Classroom Image */}
        {meta.image && (
          <motion.img
            src={meta.image}
            alt={meta.name}
            className="object-cover w-full h-48 mb-6 shadow-md sm:h-64 md:h-80 lg:h-[24rem] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* Loader */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-gray-600"
          >
            <motion.div
              className="w-12 h-12 border-4 border-blue-400 rounded-full border-t-transparent animate-spin"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.p className="mt-4 text-sm font-medium animate-pulse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Fetching sensor data...
            </motion.p>
          </motion.div>
        ) : (
          <>
            {/* Warning */}
            {airQuality > 1200 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-6 text-sm text-red-700 bg-red-100 rounded-lg sm:p-4 sm:text-base"
              >
                Air quality is poor. Please ventilate the room.
              </motion.div>
            )}

            {/* Gauges */}
            <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 md:grid-cols-3">
              <GaugeCard title="Temperature (°C)" value={temperature} max={50} unit="°C" colors={["#00ff00", "#ffff00", "#ff0000"]} />
              <GaugeCard title="Humidity (%)" value={humidity} max={100} unit="%" colors={["#87CEEB", "#3399ff", "#0000FF"]} />
              <GaugeCard title="Air Quality" value={airQuality} max={2000} unit="" colors={["#00ff00", "#ffff00", "#ff0000"]} />
            </div>

            {/* Line Charts */}
            <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                { label: "Temperature", key: "temperature", color: "#ff5733", unit: "°C" },
                { label: "Humidity", key: "humidity", color: "#3399ff", unit: "%" },
                { label: "Air Quality", key: "airQuality", color: "#33cc33", unit: "" },
              ].map((c) => (
                <motion.div
                  key={c.key}
                  className="w-full p-2 overflow-x-auto bg-white rounded-lg shadow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Line data={lineData(c.label, c.key, c.color)} options={chartOptions(c.unit)} />
                </motion.div>
              ))}
            </div>

            {/* Report */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white shadow-md sm:p-6 rounded-xl"
            >
              <h2 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg md:text-xl">
                Environment Report
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">{report()}</p>
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">Last updated: {latestTime}</p>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}

//  GaugeCard 
function GaugeCard({ title, value, max, colors, unit }) {
  const percent = Math.min(Number(value) / max, 1);
  const displayUnit = title === "Air Quality" ? "" : unit;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-48 p-3 bg-white shadow-lg sm:p-4 rounded-xl sm:h-52 md:h-56"
    >
      <h2 className="mb-2 ml-0 text-sm font-semibold text-center text-gray-700 sm:text-base md:text-lg">{title}</h2>
      <GaugeChart
        nrOfLevels={30}
        colors={colors}
        arcWidth={0.42}
        percent={percent}
        textColor="#111"
        formatTextValue={() => `${value} ${displayUnit}`}
        style={{ width: "100%", maxWidth: "240px" }}
      />
    </motion.div>
  );
}
