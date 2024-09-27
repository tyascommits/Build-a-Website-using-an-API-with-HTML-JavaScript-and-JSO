// 
const cities = [
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
    { name: 'Rome', lat: 41.9028, lon: 12.4964 },
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456 }, 
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 } 
    
];

// Initialize the application
function init() {
    populateCityOptions();
    setupEventListeners();
}

// Populate city options in the select dropdown
function populateCityOptions() {
    const citySelect = document.getElementById('city-select');
    cities.forEach(cityObj => {
        const option = document.createElement('option');
        option.value = cityObj.name;
        option.textContent = cityObj.name;
        citySelect.appendChild(option);
    });
}

// Set up event listeners
function setupEventListeners() {
    const getWeatherBtn = document.getElementById('get-weather-btn');
    getWeatherBtn.addEventListener('click', () => {
        const city = document.getElementById('city-select').value;
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Please select a city.');
        }
    });
}

// Fetch weather data from the API
function fetchWeatherData(city) {
    const coordinates = getCityCoordinates(city);
    if (!coordinates) {
        alert('Coordinates for the selected city are not available.');
        return;
    }

    const weatherResults = document.getElementById('weather-results');
    weatherResults.innerHTML = '<p>Loading...</p>';

    const apiUrl = `https://www.7timer.info/bin/civillight.php?lon=${coordinates.lon}&lat=${coordinates.lat}&ac=0&unit=metric&output=json&tzshift=0`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => displayWeatherData(data, city))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherResults.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
        });
}

// Get coordinates for the selected city
function getCityCoordinates(cityName) {
    const cityObj = cities.find(c => c.name === cityName);
    if (cityObj) {
        return { lat: cityObj.lat, lon: cityObj.lon };
    } else {
        return null;
    }
}

// Display weather data on the page
function displayWeatherData(data) {
    const weatherResults = document.getElementById('weather-results');
    weatherResults.innerHTML = ''; // Clear previous results

    // Loop through the data and create weather cards
    data.dataseries.forEach(day => {
        console.log(day.weather);  // Log the weather code to see what is returned

        const date = formatDate(day.date);
        const weatherCondition = mapWeatherCode(day.weather);
        const weatherIcon = getWeatherIcon(day.weather);  // Get the icon for the weather code

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-day';

        // Include the weather icon in the HTML
        weatherCard.innerHTML = `
            <h3>${date}</h3>
            <p><strong>Condition:</strong> ${weatherCondition}</p>
            <p class="weather-icon">${weatherIcon}</p>  <!-- Insert icon here -->
            <p><strong>Temp:</strong> ${day.temp2m.min}°C - ${day.temp2m.max}°C</p>
            <p><strong>Wind:</strong> ${day.wind10m_max} m/s</p>
        `;

        weatherResults.appendChild(weatherCard);
    });
}



// Format date from YYYYMMDD to a readable format
function formatDate(dateString) {
    const year = dateString.toString().slice(0, 4);
    const month = dateString.toString().slice(4, 6);
    const day = dateString.toString().slice(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    return date.toDateString();
}

// Map weather codes to readable conditions
function mapWeatherCode(code) {
    const weatherCodes = {
        'clearday': 'Clear Day',
        'clearnight': 'Clear Night',
        'pcloudyday': 'Partly Cloudy Day',
        'pcloudynight': 'Partly Cloudy Night',
        'mcloudyday': 'Mostly Cloudy Day',
        'mcloudynight': 'Mostly Cloudy Night',
        'cloudyday': 'Cloudy Day',
        'cloudynight': 'Cloudy Night',
        'rain': 'Rain',
        'snow': 'Snow',
        // Add more mappings as needed
    };
    return weatherCodes[code] || code;
}


function getWeatherIcon(code) {
    const iconMap = {
        'clearday': '☀️',
        'clearnight': '🌕',
        'pcloudyday': '⛅',
        'pcloudynight': '🌥️',
        'pcloudy': '☁️',
        'mcloudynight': '☁️',
        'cloudyday': '☁️',
        'cloudynight': '☁️',
        'lightrain': '🌦️',  
        'rain': '🌧️',
        'snow': '❄️',
        'tsrain': '⛈️',    
        'clear': '☀️',
        'cloudy': '☁️',
        'heavyrain': '🌧️🌧️',    
        'freezingrain': '🌧️❄️',  
        'haze': '🌫️',            
        'smoke': '💨',           
        'blizzard': '🌨️❄️',      
        'drizzle': '🌦️',  
        'oshower': '🌦️',
        'ishower': '🌦️',       
        'showers': '🌦️',         
        'thunderstorm': '⛈️',    
        'isolatedts': '🌩️',      
        'sleet': '🌧️❄️',         
        'wind': '💨',            
        'fog': '🌫️',             
        'dust': '🌪️',            
        'sandstorm': '🏜️',       
        'snowshowers': '🌨️',     
        'hail': '🌨️⚪',          
        'extremecold': '🥶',     
        'extremeheat': '🥵',     
        'tornado': '🌪️',         
        'hurricane': '🌀',        
        
    };
    return iconMap[code] || '❓';  // Return the question mark if the code is unknown
}


// Handle "Book Now" button click
function bookNow(city) {
    // Redirect to the booking page for the selected city
    window.location.href = `/booking?city=${city}`;
}

// Initialize the application when the page loads
window.onload = init;
