import React from "react";

const WeatherCard = ({ location, current }) => {
  return (
    <div className="weather-card">
      <h2>{location.name}, {location.country}</h2>
      <img src={current.condition.icon} alt={current.condition.text} />
      <h3>{Math.round(current.temp_c)}°C</h3>
      <p>{current.condition.text}</p>
      <p>Humidity: {current.humidity}% | Wind: {current.wind_kph} km/h</p>
    </div>
  );
};

export default WeatherCard;
