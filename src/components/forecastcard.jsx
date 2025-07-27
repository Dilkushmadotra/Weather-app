import React from "react";

const ForecastCard = ({ data }) => {
  return (
    <div className="forecast-card">
      <p>{new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
      <img src={data.day.condition.icon} alt="forecast" />
      <p>{Math.round(data.day.avgtemp_c)}°C</p>
    </div>
  );
};

export default ForecastCard;
