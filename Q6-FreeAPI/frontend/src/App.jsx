import { useState } from "react";
import "./App.css";

function App() {

    const [city, setCity] = useState("");

    const [weather, setWeather] = useState(null);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const getWeather = async () => {

        setWeather(null);
        setError("");


        if (!city.trim()) {

            setError("Please enter a city name.");

            return;

        }


        try {

            setLoading(true);


            // Frontend calls our Express backend

            const response = await fetch(
                `http://localhost:3005/api/weather?city=${encodeURIComponent(city)}`
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(data.message);

            }


            setWeather(data);

        }
        catch (error) {

            setError(error.message);

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div className="container">

            <div className="card">

                <h1>Weather Utility</h1>

                <p>
                    Enter a city to get current weather information.
                </p>


                <div className="form">

                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />


                    <button onClick={getWeather}>

                        {loading
                            ? "Loading..."
                            : "Get Weather"}

                    </button>

                </div>


                {error && (

                    <div className="error">

                        {error}

                    </div>

                )}


                {weather && (

                    <div className="weather">

                        <h2>
                            {weather.city}, {weather.country}
                        </h2>


                        <div className="weather-item">

                            <strong>
                                Temperature
                            </strong>

                            <span>
                                {weather.temperature}
                                {weather.temperatureUnit}
                            </span>

                        </div>


                        <div className="weather-item">

                            <strong>
                                Wind Speed
                            </strong>

                            <span>
                                {weather.windSpeed}
                                {" "}
                                {weather.windSpeedUnit}
                            </span>

                        </div>


                        <div className="weather-item">

                            <strong>
                                Weather Code
                            </strong>

                            <span>
                                {weather.weatherCode}
                            </span>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default App;