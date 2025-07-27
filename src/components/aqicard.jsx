import React from "react";

const AQICard = ({ aqi }) => {
  return (
    <div className="aqi-card">
      <h4>Air Quality</h4>
      <p>PM2.5: {aqi.toFixed(2)}</p>
      <p>{aqi < 50 ? "Good" : aqi < 100 ? "Moderate" : "Poor"}</p>
    </div>
  );
};

export default AQICard;
