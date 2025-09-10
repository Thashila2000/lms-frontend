import { useState } from "react";
import AdminNavbar from "../Components/Admin_navbar";

export default function DoorControl() {
  const [status, setStatus] = useState("unknown");
  const [espIp, setEspIp] = useState("http://192.168.4.1"); // default AP IP

  const sendCommand = async (cmd) => {
    try {
      const response = await fetch(`${espIp}/${cmd}`);
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      setStatus(data.status);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    
    <>
    <AdminNavbar />
       
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-2xl">
        <h1 className="mb-4 text-2xl font-bold">Door Lock Control</h1>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            ESP IP Address
          </label>
          <input
            type="text"
            value={espIp}
            onChange={(e) => setEspIp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="mb-4 text-lg">
          Status:{" "}
          <span
            className={`font-bold ${
              status === "UNLOCKED"
                ? "text-green-600"
                : status === "LOCKED"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {status}
          </span>
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => sendCommand("LOCK")}
            className="px-4 py-2 text-white transition bg-red-500 shadow hover:bg-red-600 rounded-xl"
          >
            Lock
          </button>
          <button
            onClick={() => sendCommand("UNLOCK")}
            className="px-4 py-2 text-white transition bg-green-500 shadow hover:bg-green-600 rounded-xl"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
