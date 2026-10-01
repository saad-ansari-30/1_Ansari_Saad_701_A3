const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3005;

app.use(cors());
app.use(express.json());


// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Q6 Weather API Backend is Running"
    });

});


// ========================================
// Q6 - Weather API
// ========================================

app.get("/api/weather", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {

            return res.status(400).json({
                message: "Please enter city name."
            });

        }


        // ----------------------------------------
        // Step 1: Get latitude and longitude
        // ----------------------------------------

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        const locationData = await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            return res.status(404).json({
                message: "City not found."
            });

        }


        const location = locationData.results[0];


        const latitude = location.latitude;
        const longitude = location.longitude;


        // ----------------------------------------
        // Step 2: Call Weather API
        // ----------------------------------------

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        const weatherData = await weatherResponse.json();


        // ----------------------------------------
        // Step 3: Send result to frontend
        // ----------------------------------------

        res.json({

            city: location.name,

            country: location.country,

            temperature:
                weatherData.current.temperature_2m,

            temperatureUnit:
                weatherData.current_units.temperature_2m,

            windSpeed:
                weatherData.current.wind_speed_10m,

            windSpeedUnit:
                weatherData.current_units.wind_speed_10m,

            weatherCode:
                weatherData.current.weather_code

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Unable to get weather information."

        });

    }

});


// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Q6 Backend running at http://localhost:${PORT}`
    );

});