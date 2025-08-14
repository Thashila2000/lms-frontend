import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../Components/Admin_navbar";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import GaugeChart from "react-gauge-chart";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ClassroomDetailsPage() {
  const { id } = useParams(); // e.g. "hall-1"
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [airQuality, setAirQuality] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const classroomRef = ref(db, `classrooms/${id}/sensors`);
    const unsubscribe = onValue(classroomRef, (snapshot) => {
      const sensors = snapshot.val();
      if (sensors) {
        setTemperature(sensors.temperature || 0);
        setHumidity(sensors.humidity || 0);
        setAirQuality(sensors.airQuality || 0);

        setHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            temperature: sensors.temperature || 0,
            humidity: sensors.humidity || 0,
            airQuality: sensors.airQuality || 0,
          },
        ]);
      }
    });

    return () => unsubscribe();
  }, [id]);

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
      },
    ],
  });

  const report = () => {
    let status = [];
    if (temperature < 18) status.push("The room is quite cold.");
    else if (temperature > 30) status.push("The room is warm, consider cooling.");
    else status.push("The temperature is comfortable.");

    if (humidity < 30) status.push("Humidity is low, which may cause dryness.");
    else if (humidity > 70) status.push("Humidity is high, possible discomfort.");
    else status.push("Humidity levels are optimal.");

    if (airQuality > 150) status.push("Air quality is poor, ventilation recommended.");
    else status.push("Air quality is good.");

    return status.join(" ");
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen p-4 mt-16 ml-0 sm:p-6 md:p-8 lg:p-12 md:ml-64 bg-gradient-to-b from-gray-100 to-gray-200">
        {/* Classroom Title */}
        <motion.h1
          className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {id.toUpperCase()} Environmental Details
        </motion.h1>

        {/* Gauges */}
        <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 md:grid-cols-3">
          <GaugeCard title="Temperature (°C)" value={temperature} max={50} colors={["#00ff00", "#ff0000"]} />
          <GaugeCard title="Humidity (%)" value={humidity} max={100} colors={["#87CEEB", "#0000FF"]} />
          <GaugeCard title="Air Quality (PPM)" value={airQuality} max={500} colors={["#00ff00", "#ff0000"]} />
        </div>

        {/* Line Charts */}
        <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 md:grid-cols-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Line data={lineData("Temperature", "temperature", "#ff5733")} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Line data={lineData("Humidity", "humidity", "#3399ff")} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Line data={lineData("Air Quality", "airQuality", "#33cc33")} />
          </motion.div>
        </div>

        {/* Report */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white shadow-md rounded-xl"
        >
          <h2 className="mb-2 text-lg font-semibold text-gray-700 sm:text-xl">Environment Report</h2>
          <p className="text-sm text-gray-600 sm:text-base">{report()}</p>
        </motion.div>
      </div>
    </>
  );
}

function GaugeCard({ title, value, max, colors }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white shadow-md sm:p-6 rounded-xl"
    >
      <h2 className="mb-4 text-base font-semibold text-gray-700 sm:text-lg">{title}</h2>
      <GaugeChart
        nrOfLevels={20}
        colors={colors}
        arcWidth={0.3}
        percent={value / max}
        textColor="#000"
      />
    </motion.div>
  );
}