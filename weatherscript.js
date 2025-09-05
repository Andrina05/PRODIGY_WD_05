// A JavaScript code to make the app functional
// Tested with Live Server; the HTML file was opened in VS code, followed by clicking on 'Go Live'.

// Get the weather items
const weatherDisplay = document.getElementById('weather-display');
const weatherForecast = document.getElementById('weather-forecast-info');
const weatherIndicator = document.getElementById('weather-icon')

// // Path to the JSON file (no longer used; instead, data fetched from API from line 31.)
// const jsonFilePath = 'testingdata.json';
// // Fetch data from JSON file; to have the app be functional for testing, the Live Server extension for VS Code will be needed.
// // To test the code in VS Code once the extension has been installed, click on the 'Go Live' button on the bottom right corner.
// fetch(jsonFilePath).then(response => {
//     // Give error message if a problem occurs, or else obtain the json file.
//     if(!response.ok) {
//         throw new Error(`Oops! Something went wrong. HTTP Error ${response.status}`);
//     }
//     return response.json();
// })
// .then(data => {
//     console.log("Data fetched successfully!");
//     console.log(data);
//     updateWeatherUI(data);
// })
// .catch(error => {
//     console.log("Error fetching/parsing JSON data:", error);
// });


// URL to be used in final app; Open Meteo API is used here.
const baseURL = "https://api.open-meteo.com/v1/forecast";
const weather_params = "daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,temperature_2m_mean,uv_index_max&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover&timezone=auto";

async function fetchWeatherData(lat, long) {
    const weatherURL = `${baseURL}?latitude=${lat}&longitude=${long}&${weather_params}`;
    fetch(weatherURL).then(response => {
        if(!response.ok) {
            alert("Something went wrong. Please try reloading the page.")
            throw new Error(`Oops! Something went wrong. HTTP Error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateWeatherUI(data);
    })
    .catch(error => {
        alert("Failed to fetch or parse weather data. Please try again later.");
        console.log("Error fetching/parsing JSON data:", error);
    })
}

const updateWeatherUI = data => {
    // Initialize required values
    const locationInput = document.getElementById('location-input').value;
    const weather = data.current;
    const dailyData = data.daily;
    const hourlyData = data.hourly;

    // Obtain the current time and hour.
    const currentTime = weather.time;
    console.log("Fetched Time:", currentTime);
    const displayTime = currentTime.slice(0, 10)+' '+currentTime.slice(11);
    const roundedTime = currentTime.slice(0, 14)+'00';
    const currentTimeIndex = hourlyData.time.indexOf(`${roundedTime}`);
    const currentHour = parseInt(currentTime.slice(11, 13));

    // For testing, a time was selected from the JSON file. It is no longer used.
    // const testingTime = "2025-08-29T22:00";
    // Obtained index of current time from the JSON file during initial test; also defined a 'new hour' to test rounding the hours past midnight
    // const currentTimeIndex = hourlyData.time.indexOf(`${testingTime}`);
    // let newHour = 20;
    // console.log("New hour:", newHour);
    

    // Update UI elements
    // Background colour of the two cards
    if(currentHour >= 8 && currentHour <= 18) {
        weatherDisplay.classList.remove('dawndusk', 'night');
        weatherDisplay.classList.add('day');
        weatherForecast.classList.remove('dawndusk', 'night');
        weatherForecast.classList.add('day');
    }
    else if ((currentHour >= 5 && currentHour <= 7) || (currentHour >= 18 && currentHour <= 20)) {
        weatherDisplay.classList.remove('day', 'night');
        weatherDisplay.classList.add('dawndusk');
        weatherForecast.classList.remove('day', 'night');
        weatherForecast.classList.add('dawndusk');        
    }
    else if ((currentHour >= 21 && currentHour <= 23) || (currentHour >= 0 && currentHour <= 4)) {
        weatherDisplay.classList.remove('day', 'dawndusk');
        weatherDisplay.classList.add('night');
        weatherForecast.classList.remove('day', 'dawndusk');
        weatherForecast.classList.add('night');    
    }

    // Weather Icon
    if ((currentHour >= 20 && currentHour <= 23) || (currentHour >= 0 && currentHour <= 5)) {
        if (weather.cloud_cover <= 30 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-moon" title="Clear"></i>`;
        else if (weather.cloud_cover > 30 && weather.cloud_cover <= 80 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-moon" title="Partly Clear"></i>`;
        else if (weather.cloud_cover > 80  && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud" title="Cloudy"></i>`;
        else if (weather.precipitation > 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-moon-rain" title="Raining"></i>`;
    }
    else if (currentHour > 5 && currentHour < 20) {
        if (weather.cloud_cover <= 30 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-sun" title="Clear"></i>`;
        else if (weather.cloud_cover > 30 && weather.cloud_cover <= 80 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-sun" title="Partly Clear"></i>`;
        else if (weather.cloud_cover > 80  && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud" title="Cloudy"></i>`;
        else if (weather.precipitation > 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-sun-rain" title="Raining"></i>`;        
    }

    // Current Weather
    document.getElementById('location-name').textContent = ((locationInput == '') ? `Lat: ${data.latitude.toFixed(2)}, Lon: ${data.longitude.toFixed(2)}` : locationInput);
    document.getElementById('loc-time').textContent = displayTime;
    document.getElementById('temperature').innerHTML = `<i class="fas fa-thermometer-half"></i> ${weather.temperature_2m} °C`;
    document.getElementById('apparent-temp').innerHTML =  `Feels like <b>${weather.apparent_temperature}</b> °C`;
    
    document.getElementById('min-max-temp').innerHTML = `<i class="fa fa-thermometer-full" aria-hidden="true" title="Max. Temp."></i> <b>${dailyData.temperature_2m_max[0]} °C</b>,
        <i class="fa fa-thermometer-empty" aria-hidden="true" title="Min. Temp."></i> <b>${dailyData.temperature_2m_min[0]} °C</b>`;
    
    document.getElementById('avg-temp').innerHTML = `Avg. Temp: <b>${dailyData.temperature_2m_mean[0]} °C</b>`;
    document.getElementById('uv-index').innerHTML = `Max UV Index: <b>${dailyData.uv_index_max[0]}</b>`;
    document.getElementById('rel-humidity').innerHTML = `<i class="fas fa-water"></i>&nbsp; Humidity: <b>${weather.relative_humidity_2m} %</b>`;
    document.getElementById('precip').innerHTML = `<i class="fas fa-cloud-showers-heavy"></i> &nbsp; Precipitation: <b>${weather.precipitation} mm</b>`;
    document.getElementById('cloud-cover').innerHTML = `Cloud Cover: <b>${weather.cloud_cover} %</b>`;

    // Update sunrise and sunset times
    document.getElementById('sunrise-time').textContent = new Date(dailyData.sunrise[0]).toLocaleTimeString();
    document.getElementById('sunset-time').textContent = new Date(dailyData.sunset[0]).toLocaleTimeString();

    // Update hourly forecast
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';

    // Display forecast for five hours after the current time
    let assignedHour = currentHour;
    for (let i=currentTimeIndex+1; i<=currentTimeIndex+5; i++) {
        assignedHour = (assignedHour + 1) % 24;
        let hourDiv = document.createElement('div');

        if (assignedHour >= 8 && assignedHour <= 18) {
            hourDiv.classList.add('light');
            hourDiv.classList.remove('dark', 'moderate');
        }
        else if ((assignedHour >= 5 && assignedHour <= 7) || (assignedHour >= 18 && assignedHour <= 20)) {
            hourDiv.classList.add('moderate');
            hourDiv.classList.remove('dark', 'light');
        }
        else if ((assignedHour >= 21 && assignedHour <= 23) || (assignedHour >= 0 && assignedHour <= 4)) {
            hourDiv.classList.add('dark');
            hourDiv.classList.remove('moderate', 'light');
        }

        hourDiv.classList.add('hourly-item');

        hourDiv.innerHTML = `
            <div><b>${assignedHour}:00</b></div> <br>
            <div><i class="fas fa-thermometer-half" title="Avg. Temp."></i> ${hourlyData.temperature_2m[i]}°C</div> <br>
            <div><i class="fas fa-cloud-rain" title="Precip. Chance"></i> ${hourlyData.precipitation_probability[i]}%</div>
        `;
        hourlyForecastContainer.appendChild(hourDiv);
    }
}

// Fetch the user's current location
async function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (userPosition) => {
            const lat = userPosition.coords.latitude;
            const long = userPosition.coords.longitude;
            await fetchWeatherData(lat, long);
        }, (error) => {
            alert("Failed to get location.", error);
        });
    } else {
        alert("Geolocation is not supported by the currently used browser.");
    }
}

// Function for the 'Get Weather' button
document.getElementById('weather-fetch-button').addEventListener('click', async () => {
    const locationInput = document.getElementById('location-input').value.trim();
    if (locationInput) {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&language=en&count=1`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const lat = data.results[0].latitude;
            const lon = data.results[0].longitude;
            await fetchWeatherData(lat, lon);
        } else {
            alert('Location not found');
        }
    } else {
        alert("No data found. Please try again with a valid location.");
    }
});

// Upon loading the page, fetch the user's location (the browser may ask permission for the same.)
window.onload = getUserLocation;