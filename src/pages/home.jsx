import React, { useEffect, useState } from "react";
import axios from "axios";
import ForecastCard from "../components/forecastcard";
import AQICard from "../components/aqicard";
import WeatherCard from "../components/weathercard";

const API_KEY = "c5db7161116b4b19b1883913252707";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("New York");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWeatherData(city);
    loadFavorites();
    detectLocation();
  }, []);

  // ✅ Detect location using Geolocation API
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      });
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes`
      );
      setWeather(res.data);
      setCity(res.data.location.name);
    } catch (err) {
      console.error("Location fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch weather by city name
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&aqi=yes`
      );
      setWeather(res.data);
    } catch (err) {
      console.error("API Error:", err.message);
      setError("Failed to fetch weather data. Check your API key or city name.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeatherData(city);
    }
  };

  // ✅ Save favorite cities in LocalStorage
  const addFavorite = () => {
    if (!favorites.includes(city)) {
      const updated = [...favorites, city];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  };

  // ✅ Scroll slider for hourly forecast
  const scrollSlider = (scrollOffset) => {
    document.getElementById("hourly-slider").scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  };

  return (
    <div className="weather-app-container">
      {/* ✅ Header */}
      <header className="header glass-effect mb-4">
        <h1 className="fw-bold">🌤 Weather Forecast App</h1>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ms-2">Search</button>
      </form>

      {/* Favorites */}
      <div className="mb-3">
        <button className="btn btn-outline-warning" onClick={addFavorite}>Add to Favorites</button>
        <div className="mt-2">
          {favorites.map((fav, idx) => (
            <button
              key={idx}
              className="btn btn-outline-light m-1"
              onClick={() => fetchWeatherData(fav)}
            >
              {fav}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {weather && !loading && !error && (
        <>
          {/* ✅ Current Weather */}
          <WeatherCard location={weather.location} current={weather.current} />

          {/* ✅ Hourly Forecast */}
          <h4 className="text-center mt-4">Hourly Forecast</h4>
          <div className="hourly-slider-container position-relative">
            <button className="slider-btn left" onClick={() => scrollSlider(-200)}>◀</button>
            <div className="hourly-slider d-flex overflow-auto p-2" id="hourly-slider">
              {weather.forecast.forecastday[0].hour.map((hour, index) => (
                <div key={index} className="forecast-card text-center p-2 m-2">
                  <p>{hour.time.split(" ")[1]}</p>
                  <img src={hour.condition.icon} alt="icon" />
                  <h6>{Math.round(hour.temp_c)}°C</h6>
                </div>
              ))}
            </div>
            <button className="slider-btn right" onClick={() => scrollSlider(200)}>▶</button>
          </div>

          {/* ✅ 7-Day Forecast */}
          <h4 className="text-center mt-4">7-Day Forecast</h4>
          <div className="forecast-section d-flex justify-content-around flex-wrap">
            {weather.forecast.forecastday.map((day, index) => (
              <ForecastCard key={index} data={day} />
            ))}
          </div>

          {/* ✅ AQI */}
          <AQICard aqi={weather.current.air_quality.pm2_5} />
        </>
      )}

      {/* ✅ Footer */}
      <footer className="footer text-center mt-4 p-3 glass-effect">
        <p className="mb-0">Made with ❤️ by <strong>Dilkush</strong></p>
      </footer>
    </div>
  );
};

export default Home;
