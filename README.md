A weather app created using HTML, CSS, JavaScript, Font Awesome and Bootstrap. Key features:
1) Uses the Open Meteo API, specifically:

   (a) The geocoding API to fetch the user's current location.
   
   (b) The forecast API to fetch weather data in a location.   
2) Requires the user's current location to fetch weather data from their area. This is activated when the page is loaded.
3) When the user enters a city in the input field, weather data for that city is fetched. Also, should the user erase the field and try fetching the weather, the app returns to displaying the weather at the user's location.
4) The background of different elements changes depending on the time at the location. The weather indicator icon changes based on the fetched conditions.

Data displayed:
1) Date and time at the location
2) Temperature
3) Different weather conditions like min and max temperatures, humidity and precipitation.
4) Sunrise and sunset times
5) Hourly forecast: displays forecast for five hours after the current hour.
