const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const moment = require("moment");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AUTHOR = "Patryk Miscisz";
const API_KEY = process.env.WEATHER_API_KEY;

const locations = {
    "Poland": ["Warsaw", "Krakow"],
    "Germany": ["Berlin", "Munich"],
    "USA": ["New York", "Los Angeles"]
};

// Logowanie przy starcie kontenera
console.log(`Start: ${moment().format()}, Author: ${AUTHOR}, Listening on TCP port: ${PORT}`);

// Konfiguracja
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routing
app.get("/", (req, res) => {
    res.render("index", {
        countries: Object.keys(locations),
        cities: locations["Poland"],
        selectedCountry: "Poland",
        selectedCity: "Warsaw",
        weather: null
    });
});

app.post("/", async (req, res) => {
    const selectedCountry = req.body.country;
    const selectedCity = req.body.city;

    let weather = null;

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: selectedCity,
                appid: API_KEY,
                units: "metric"
            }
        });
        weather = response.data;
    } catch (err) {
        console.error("Błąd pobierania pogody:", err.message);
    }

    res.render("index", {
        countries: Object.keys(locations),
        cities: locations[selectedCountry],
        selectedCountry,
        selectedCity,
        weather
    });
});

app.listen(5000);
