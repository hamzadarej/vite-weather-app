import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const key = import.meta.env.VITE_API_KEY;

  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState();
  const getWeather = (endpoint) => {
    axios
      .get(`${baseUrl}weather?q=${endpoint}&units=metric&appid=${key}`)
      .then((weather) => {
        setError("");
        setWeatherData(weather.data);
        setUserInput("");
        localStorage.setItem("weather", JSON.stringify(weather.data));
      })
      .catch(() => {
        const error = "Please enter a valid city name";
        setError(error);
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(userInput);
  };

  const { weather, main, name, sys, wind } = weatherData ?? {};

  const direction = wind?.deg;

  const windD = [
    { direction: "N", start: 310, end: 360 },
    { direction: "N", start: 1, end: 50 },
    { direction: "W", start: 230, end: 309 },
    { direction: "S", start: 130, end: 229 },
    { direction: "E", start: 49, end: 129 },
  ];

  const windDirection = windD.find(
    (dir) => dir.start <= direction && dir.end >= direction,
  )?.direction;

  // the time
  const year = new Date();
  const getFullYear = year.getFullYear();
  const getDayName = year.toLocaleDateString("en-US", { weekday: "long" });
  const getTime = year.toLocaleDateString("en-US", { day: "numeric" });
  const getMonthName = year.toLocaleDateString("en-US", { month: "long" });

  const min = sys?.sunrise; // sunrise
  const max = sys?.sunset; // sunset
  const now = Math.floor(Date.now() / 1000);
  const percentage = Math.floor((now - min) / (max - min));
  function toHoursAndMinutes(totalMinutes) {
    const sunriseDate = new Date(totalMinutes * 1000);
    return sunriseDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const weatherDescription = weatherData?.weather?.[0]?.main ?? "default";

  useEffect(() => {
    // prevent api call show localStorage data
    if (JSON.parse(localStorage.getItem("weather"))?.weather?.length) {
      setWeatherData(JSON.parse(localStorage.getItem("weather")));
    } else {
      getWeather("leipzig");
    }
  }, []);

  return (
    <div className="app-wrap">
      <img
        alt="bg-image"
        className="bgImage"
        src={`./images/${weatherDescription}.jpg`}
      />

      <header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            placeholder="Enter a City Name"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" id="submit" value="Search" />
        </form>
        <div className="error">{error}</div>
      </header>
      {main && (
        <main>
          <section className="location">
            <div className="city">
              {" "}
              {name}, {sys.country}
            </div>
            <div className="date">
              {getDayName} {getTime} {getMonthName} {getFullYear}
            </div>
          </section>
          <div className="current">
            <div className="temp">
              <span className="tempN" id="temp">
                {main.temp.toFixed()}
              </span>
              <span>°</span>
            </div>
            <div className="feelsContainer">
              Feels like{" "}
              <span className="feels">{main.feels_like.toFixed()}</span>
              <span>°</span>
            </div>

            <img
              src={`http://openweathermap.org/img/wn/${weather?.[0].icon}@2x.png`}
              className="icon"
              alt=""
            />

            <div className="weather">{weather?.[0].main}</div>
            <div className="hi-low">
              Max {weatherData.main.temp_min.toFixed()}° / Min{" "}
              {weatherData.main.temp_max.toFixed()}°
            </div>
            <div className="wind">
              <i className="fas fa-wind"></i>
              <div>
                Wind direction: <div className="windDeg">{windDirection}</div>
              </div>
              <div>
                Speed: <span className="windSpeed">{wind.speed}km/h</span>
              </div>
              <div>
                Max-gust: <span className="windGust">{wind.gust}km/h</span>
              </div>
            </div>
            <div className="hum-img">
              <i className="fas fa-water"></i>

              <div className="humidity"> Humidity:{main.humidity}%</div>
            </div>
          </div>
          <div className="sun-position">
            <span className="sun-time">{toHoursAndMinutes(min)}</span>
            <div className="half-circle">
              <span className="sun" style={{ left: percentage + "%" }} />
              <span className="hide-half-circle" />
            </div>
            <span className="circle-line" />
            <span className="sun-time">{toHoursAndMinutes(max)}</span>
          </div>
        </main>
      )}
    </div>
  );
};
export default Weather;
