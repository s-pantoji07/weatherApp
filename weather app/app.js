document.addEventListener('DOMContentLoaded', () => {
    let location = {
        lat: 20.5937, // Default latitude
        lon: 78.9629  
    };

 
    document.getElementById('searchForm').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const city = document.getElementById('searchInput').value;
        const apiKey = '8332832aa258d1c4b920960642c32a0f';
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`;

        try {
            const weatherResponse = await fetch(weatherApiUrl);
            if (!weatherResponse.ok) {
                throw new Error(`HTTP error! status: ${weatherResponse.status}`);
            }
            const weatherData = await weatherResponse.json();
            updateWeatherDisplay(weatherData);
            
            location.lat = weatherData.coord.lat;
            location.lon = weatherData.coord.lon;
            initializeWindyMap();

          
            const forecastResponse = await fetch(forecastApiUrl);
            if (!forecastResponse.ok) {
                throw new Error(`HTTP error! status: ${forecastResponse.status}`);
            }
            const forecastData = await forecastResponse.json();
            updateForecastDisplay(forecastData);

          
            document.querySelector('.display').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

   
    function updateBackgroundImage(weatherCondition) {
        const unsplashAccessKey = 'K3ezsgZjjh-izaHLvBy1ci8zq1h2iZeBpHib1KnbnNY';
        let query;

        switch (weatherCondition) {
            case 'clear sky': query = 'clear sky'; break;
            case 'few clouds': query = 'few clouds'; break;
            case 'scattered clouds': query = 'scattered clouds'; break;
            case 'broken clouds': query = 'broken clouds'; break;
            case 'overcast clouds': query = 'overcast clouds'; break;
            case 'light rain': query = 'light rain'; break;
            case 'moderate rain': query = 'moderate rain'; break;
            case 'heavy rain': query = 'heavy rain'; break;
            case 'snow': query = 'snow'; break;
            case 'mist': query = 'mist'; break;
            default: query = 'weather'; break;
        }

        fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAccessKey}&orientation=landscape`)
            .then(response => response.json())
            .then(imageData => {
                if (imageData.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * imageData.results.length);
                    const imageUrl = imageData.results[randomIndex].urls.regular;
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                } else {
                    console.log('No image found for weather condition:', weatherCondition);
                }
            })
            .catch(error => {
                console.error('Error fetching background image:', error);
            });
    }

    
    function updateWeatherDisplay(data) {
        const cityName = document.querySelector('.cityName');
        const cityImage = document.querySelector('.cityImage');
        const constraint = document.querySelector('.constraint');

        if (cityName) cityName.textContent = `City: ${data.name}`;

        if (constraint) {
            const tempCelsius = Math.round(data.main.temp - 273.15);
            const feelsLikeCelsius = Math.round(data.main.feels_like - 273.15);
            const tempMinCelsius = Math.round(data.main.temp_min - 273.15);
            const tempMaxCelsius = Math.round(data.main.temp_max - 273.15);
            const windSpeed = data.wind.speed;
            const windDirection = data.wind.deg;
            const windGust = data.wind.gust;
            const weatherDescription = data.weather[0].description;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const visibility = data.visibility;
            const rainVolume = data.rain ? data.rain["1h"] : 0;
            const cloudiness = data.clouds.all;
            const formattedTime = new Date(data.dt * 1000).toLocaleTimeString();
            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            constraint.innerHTML = `
                <b>Temperature:</b> ${tempCelsius}°C (Feels like: ${feelsLikeCelsius}°C)<br>
                <b>Min Temperature:</b> ${tempMinCelsius}°C<br>
                <b>Max Temperature:</b> ${tempMaxCelsius}°C<br>
                <b>Wind Speed:</b> ${windSpeed} m/s<br>
                <b>Wind Direction:</b> ${windDirection}°<br>
                <b>Wind Gust:</b> ${windGust} m/s<br>
                <b>Weather:</b> ${weatherDescription}<br>
                <b>Humidity:</b> ${humidity}%<br>
                <b>Pressure:</b> ${pressure} hPa<br>
                <b>Visibility:</b> ${visibility} meters<br>
                <b>Rain Volume (last hour):</b> ${rainVolume} mm<br>
                <b>Cloudiness:</b> ${cloudiness}%<br>
                 `;

            updateBackgroundImage(data.weather[0].description);
        }

        const unsplashAccessKey = 'K3ezsgZjjh-izaHLvBy1ci8zq1h2iZeBpHib1KnbnNY';
        const cityQuery = data.name;
        const randomPage = Math.floor(Math.random() * 10) + 1;

        fetch(`https://api.unsplash.com/search/photos?query=${cityQuery}&page=${randomPage}&client_id=${unsplashAccessKey}`)
            .then(response => response.json())
            .then(imageData => {
                if (imageData.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * imageData.results.length);
                    const imageUrl = imageData.results[randomIndex].urls.regular;
                    cityImage.style.backgroundImage = `url(${imageUrl})`;
                } else {
                    console.log('No image found');
                }
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    }

    function updateForecastDisplay(data) {
        const forecastDiv = document.querySelector('.forecast');
        if (!forecastDiv) return;
        
        let forecastHTML = '<h2>Forecast</h2><div class="forecast-container">';
        
        // Determine the number of days to show the forecast for
        const daysToShow = 3;
        const msInDay = 86400000; // Number of milliseconds in a day
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + daysToShow * msInDay);
    
        let count = 0;
        data.list.forEach((entry) => {
            const entryDate = new Date(entry.dt * 1000);
            
            // Check if the entry's date is within the desired range
            if (entryDate >= startDate && entryDate <= endDate) {
                if (count % 4 === 0 && count > 0) {
                    forecastHTML += '</div><div class="forecast-container">';
                }
        
                const dateString = entryDate.toLocaleDateString();
                const timeString = entryDate.toLocaleTimeString();
                const tempCelsius = Math.round(entry.main.temp - 273.15);
                const weatherDescription = entry.weather[0].description;
        
                forecastHTML += `
                    <div class="forecast-item">
                        <b>Date:</b> ${dateString} <br>
                        <b>Time:</b> ${timeString} <br>
                        <b>Temperature:</b> ${tempCelsius}°C <br>
                        <b>Weather:</b> ${weatherDescription}
                    </div>
                `;
        
                count++;
            }
        });
    
        // Close the last container
        forecastHTML += '</div>';
        forecastDiv.innerHTML = forecastHTML;
    }
    
    

    
    function initializeWindyMap() {
        const mapContainer = document.getElementById('windy');

        if (mapContainer) {
            windyInit({
                key: 'xlQYbMZaJXUuxBG4KaSZmKcAeu8P7udU',
                lat: location.lat,
                lon: location.lon,
                zoom: 5, 
                container: 'windy', 
            });
        }
    }

 
    window.onload = function() {
        initializeWindyMap();
    };
});
