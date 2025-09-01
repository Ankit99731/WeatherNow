import React, { useState } from "react";

// Map Open-Meteo weather codes to icons + descriptions
const weatherIcons = {
  0: { icon: "☀️", desc: "Clear Sky" },
  1: { icon: "🌤", desc: "Mainly Clear" },
  2: { icon: "⛅", desc: "Partly Cloudy" },
  3: { icon: "☁️", desc: "Overcast" },
  45: { icon: "🌫", desc: "Fog" },
  48: { icon: "🌫", desc: "Depositing Rime Fog" },
  51: { icon: "🌦", desc: "Light Drizzle" },
  53: { icon: "🌦", desc: "Moderate Drizzle" },
  55: { icon: "🌧", desc: "Dense Drizzle" },
  61: { icon: "🌦", desc: "Slight Rain" },
  63: { icon: "🌧", desc: "Moderate Rain" },
  65: { icon: "🌧️", desc: "Heavy Rain" },
  71: { icon: "🌨", desc: "Slight Snowfall" },
  73: { icon: "🌨", desc: "Moderate Snowfall" },
  75: { icon: "❄️", desc: "Heavy Snowfall" },
  95: { icon: "⛈", desc: "Thunderstorm" },
  99: { icon: "🌩", desc: "Severe Thunderstorm" },
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      // Step 1: Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather with weathercode
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      const code = weatherData.current_weather.weathercode;
      const mapped = weatherIcons[code] || { icon: "❓", desc: "Unknown" };

      setWeather({
        city: name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code,
        icon: mapped.icon,
        desc: mapped.desc,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-pink-400 opacity-30 rounded-full filter blur-3xl animate-blob1 z-0"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-yellow-300 opacity-30 rounded-full filter blur-3xl animate-blob2 z-0"></div>
      {/* Weather card */}
      <div className="relative z-10 bg-white/30 backdrop-blur-md shadow-2xl border border-white/40 rounded-3xl p-8 w-96 text-center transition-all duration-300">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 drop-shadow-lg tracking-wide">
          <span className="animate-pulse">🌤</span> Weather Now
        </h1>

        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border border-blue-200 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 placeholder-gray-400 transition"
        />

        <button
          onClick={fetchWeather}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 hover:from-indigo-500 hover:to-blue-500 transition-all font-semibold tracking-wide"
        >
          Get Weather
        </button>

        {loading && (
          <div className="mt-6 flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        )}
        {error && <p className="mt-6 text-red-600 font-semibold">{error}</p>}

        {weather && (
          <div className="mt-8 p-5 bg-white/60 rounded-2xl shadow-lg border border-blue-100 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {weather.city},{" "}
              <span className="text-indigo-600">{weather.country}</span>
            </h2>

            <div className="text-6xl mt-2 mb-2 animate-bounce">
              {weather.icon}
            </div>
            <p className="text-gray-700 text-lg mb-2">{weather.desc}</p>

            <div className="flex justify-center gap-4 mt-3">
              <span className="bg-blue-100 px-3 py-1 rounded-lg text-blue-700 font-medium shadow">
                🌡 <b>{weather.temp}°C</b>
              </span>
              <span className="bg-indigo-100 px-3 py-1 rounded-lg text-indigo-700 font-medium shadow">
                💨 <b>{weather.wind} km/h</b>
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Fade-in animation and blob keyframes */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-blob1 {
            animation: blobMove1 12s infinite alternate;
          }
          .animate-blob2 {
            animation: blobMove2 14s infinite alternate;
          }
          @keyframes blobMove1 {
            0% { transform: scale(1) translate(0, 0);}
            100% { transform: scale(1.2) translate(40px, 60px);}
          }
          @keyframes blobMove2 {
            0% { transform: scale(1) translate(0, 0);}
            100% { transform: scale(1.1) translate(-50px, -40px);}
          }
        `}
      </style>
    </div>
  );
}
