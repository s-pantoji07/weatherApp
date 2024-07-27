document.addEventListener("DOMContentLoaded", function() {
    const apiKey = 'xlQYbMZaJXUuxBG4KaSZmKcAeu8P7udU';
    const conditionDiv = document.querySelector('.condition');

    fetch(`https://api.windy.com/api/point-forecast/v2?key=${apiKey}&lat=50.4&lon=14.3&model=gfs`)
        .then(response => response.json())
        .then(data => {
            const windSpeed = data.wind.speed;
            const windDirection = data.wind.direction;

            conditionDiv.innerHTML = `
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Wind Direction: ${windDirection}°</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching wind data:', error);
            conditionDiv.innerHTML = '<p>Error fetching wind data.</p>';
        });
});
