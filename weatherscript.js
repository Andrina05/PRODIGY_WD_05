// A JavaScript code to make the app functional

// Get the two weather items
const weatherDisplay = document.getElementById('weather-display');
const weatherForecast = document.getElementById('weather-forecast-info');
const weatherIndicator = document.getElementById('weather-icon')

// URL to be used in final app
const baseURL = "https://api.open-meteo.com/v1/forecast";
const weather_params = "&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max,weather_code,temperature_2m_mean&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover,weather_code&models=best_match&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,apparent_temperature&minutely_15=temperature_2m,precipitation&timezone=auto";

// Path to the JSON file (currently used to test the code)
const jsonFilePath = 'testingdata.json';

// Fetch data from JSON file; to have the app be functional for testing, the Live Server extension for VS Code will be needed.
// To test the code in VS Code once the extension has been installed, click on the 'Go Live' button on the bottom right corner.
fetch(jsonFilePath).then(response => {
    // Give error message if a problem occurs, or else obtain the json file.
    if(!response.ok) {
        throw new Error(`Oops! Something went wrong. HTTP Error ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log("Data fetched successfully!");
    console.log(data);
    updateWeatherUI(data);
})
.catch(error => {
    console.log("Error fetching/parsing JSON data:", error);
});

const updateWeatherUI = data => {
    // Initialize required values
    const weather = data.current;
    const dailyData = data.daily;
    const hourlyData = data.hourly;

    const currentYear = new Date().getFullYear();
    
    const currentMonth = new Date().getMonth() + 1;   // getMonth() gives a value from 0 to 11. So add 1 to get the correct month number.
    const formattedMonth = ((currentMonth < 10) ? '0'+currentMonth : currentMonth);

    const currentDate = new Date().getDate();
    const formattedDate = ((currentDate < 10) ? '0'+currentDate : currentDate);

    const currentHour = new Date().getHours();
    const formattedHour = ((currentHour < 10) ? '0'+currentHour : currentHour);

    // Match the format in the fetched API JSON data.
    const roundedTime = `${currentYear}-${formattedMonth}-${formattedDate}T${formattedHour}:00`;

    // For testing, a time is selected from the JSON file.
    const testingTime = "2025-08-29T22:00";

    const locationInput = document.getElementById('location-input').textContent;

    // Get index of current time from the JSON file for now; also defined a 'new hour' to test rounding the hours past midnight
    const currentTimeIndex = hourlyData.time.indexOf(`${testingTime}`);
    let newHour = 20;
    console.log("New hour:", newHour);

    // Update UI elements in main display

    // Weather Icon
    if ((newHour >= 20 && newHour <= 23) || (newHour >= 0 && newHour <= 5)) {
        if (weather.cloud_cover <= 30 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-moon" title="Clear"></i>`;
        else if (weather.cloud_cover > 30 && weather.cloud_cover <= 80 && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-moon" title="Partly Clear"></i>`;
        else if (weather.cloud_cover > 80  && weather.precipitation >= 0 && weather.precipitation <= 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud" title="Cloudy"></i>`;
        else if (weather.precipitation > 0.4)
            weatherIndicator.innerHTML = `<i class="fas fa-cloud-moon-rain" title="Raining"></i>`;
    }
    else if (newHour > 5 && newHour < 20) {
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
    document.getElementById('location-name').textContent = ((locationInput === '') ? `Lat: ${data.latitude.toFixed(2)}, Lon: ${data.longitude.toFixed(2)}` : locationInput);
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

    if(newHour >= 8 && newHour <= 18) {
        weatherDisplay.classList.remove('dawndusk', 'night');
        weatherDisplay.classList.add('day');
        weatherForecast.classList.remove('dawndusk', 'night');
        weatherForecast.classList.add('day');
    }
    else if ((newHour >= 5 && newHour <= 7) || (newHour >= 18 && newHour <= 20)) {
        weatherDisplay.classList.remove('day', 'night');
        weatherDisplay.classList.add('dawndusk');
        weatherForecast.classList.remove('day', 'night');
        weatherForecast.classList.add('dawndusk');        
    }
    else if ((newHour >= 21 && newHour <= 23) || (newHour >= 0 && newHour <= 4)) {
        weatherDisplay.classList.remove('day', 'dawndusk');
        weatherDisplay.classList.add('night');
        weatherForecast.classList.remove('day', 'dawndusk');
        weatherForecast.classList.add('night');    
    }

    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';

    // Display forecast for five hours after the current time
    for (let i=currentTimeIndex+1; i<=currentTimeIndex+5; i++) {
        newHour = (newHour + 1) % 24;
        let hourDiv = document.createElement('div');

        if (newHour >= 8 && newHour <= 18) {
            hourDiv.classList.add('light');
            hourDiv.classList.remove('dark', 'moderate');
        }
        else if ((newHour >= 5 && newHour <= 7) || (newHour >= 18 && newHour <= 20)) {
            hourDiv.classList.add('moderate');
            hourDiv.classList.remove('dark', 'light');
        }
        else if ((newHour >= 21 && newHour <= 23) || (newHour >= 0 && newHour <= 4)) {
            hourDiv.classList.add('dark');
            hourDiv.classList.remove('moderate', 'light');
        }

        hourDiv.classList.add('hourly-item');

        hourDiv.innerHTML = `
            <div><b>${newHour}:00</b></div> <br>
            <div><i class="fas fa-thermometer-half" title="Avg. Temp."></i> ${hourlyData.temperature_2m[i]}°C</div> <br>
            <div><i class="fas fa-cloud-rain" title="Precip. Chance"></i> ${hourlyData.precipitation_probability[i]}%</div>
        `;
        hourlyForecastContainer.appendChild(hourDiv);
    }
}
