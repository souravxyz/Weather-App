import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import axios from "axios";
import "./Home.css";

const apiKey = "f66d9727501911f62c328508b94c5e3e";

const fetchWeather = async ({ queryKey }) => {
  const [_, city] = queryKey;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(weatherUrl);
  return response.data;
};

const fetchForecast = async ({ queryKey }) => {
  const [_, city] = queryKey;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(forecastUrl);
  return response.data;
};

export const Home = () => {
  const { register, handleSubmit } = useForm();
  const [city, setCity] = React.useState("Kolkata"); 
  const [searchCity, setSearchCity] = React.useState("Kolkata"); 
  const [showForecast, setShowForecast] = React.useState(false);
  const [expandedDay, setExpandedDay] = React.useState(null);

  // Fetch weather data
  const { data: weatherData, isLoading: weatherLoading } = useQuery(
    ["weather", searchCity],
    fetchWeather,
    { enabled: !!searchCity }
  );

  // Fetch forecast data
  const { data: forecastData, isLoading: forecastLoading } = useQuery(
    ["forecast", searchCity],
    fetchForecast,
    { enabled: !!searchCity }
  );

  // Handle form submission
  const onSubmit = (data) => {
    setSearchCity(data.city);
    setCity(data.city);
  };


  const toggleForecast = () => {
    setShowForecast((prev) => !prev);
  };


  const toggleDay = (date) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  // Get 5-day forecast
  const getFiveDayForecast = () => {
    if (!forecastData) return [];

    const dailyForecasts = [];
    const forecastMap = {};

    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!forecastMap[date]) {
        forecastMap[date] = forecast;
      }
    });

    Object.keys(forecastMap).forEach((date) => {
      dailyForecasts.push(forecastMap[date]);
    });

    return dailyForecasts.slice(0, 5);
  };

  const fiveDayForecast = getFiveDayForecast();

  return (
    <div className="container">
      <h1 className="header">Weather App</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="input-container">
        <input
          type="text"
          {...register("city")}
          defaultValue={city}
          placeholder="Enter city"
        />
        <button type="submit">Search</button>
      </form>

      {weatherLoading ? (
        <p className="loading-text">Loading weather data...</p>
      ) : (
        weatherData && (
          <div className="weather-card">
            <h2>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt="Weather Icon"
            />
            <p>Description: {weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Max Temperature: {weatherData.main.temp_max} °C</p>
            <p>Min Temperature: {weatherData.main.temp_min} °C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Pressure: {weatherData.main.pressure} hPa</p>
            <p>
              Sunrise:{" "}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p>
              Sunset:{" "}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
        )
      )}

      {forecastLoading ? (
        <p className="loading-text">Loading forecast data...</p>
      ) : (
        <div>
          <button onClick={toggleForecast}>
            {showForecast ? "Hide" : "See"} 5-Day Forecast
          </button>
          {showForecast && (
            <div className="forecast-list">
              <h2>5-Day Forecast</h2>
              {fiveDayForecast.map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <p>
                    Date: {new Date(forecast.dt * 1000).toLocaleDateString()}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                    alt="Weather Icon"
                  />
                  <p>Temperature: {forecast.main.temp} °C</p>
                  <p>Max Temperature: {forecast.main.temp_max} °C</p>
                  <p>Min Temperature: {forecast.main.temp_min} °C</p>
                  <p>Humidity: {forecast.main.humidity}%</p>
                  <p>Pressure: {forecast.main.pressure} hPa</p>
                  <p>Wind Speed: {forecast.wind.speed} m/s</p>
                  <p>Description: {forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
