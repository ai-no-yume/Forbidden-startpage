// Define the API key as a constant
const weatherAPI = "";

// Get the user's geolocation
function getPosition() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    resolve({ lat, lon });
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            reject("Geolocation not supported");
        }
    });
}

// Initial API call with dynamic latitude and longitude
const getWeather = async (lat, lon) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}&units=metric`);
    const weather = await res.json();
    return weather;
};

// Regex to return the first number from the API's weather condition ID
const conditionChecker = async (lat, lon) => {
    const weather = await getWeather(lat, lon);
    const re = new RegExp(/\d/);
    const weatherCondition = weather.weather[0].id.toString();
    const firstInt = weatherCondition.match(re)[0]; // Extract the first match
    return firstInt;
};

// Displays a different FontAwesome Icon on night/day rain/shine
const displayWeather = async () => {
    try {
        const { lat, lon } = await getPosition();  // Get user's current position dynamically
        const weather = await getWeather(lat, lon);
        const weatherCondition = await conditionChecker(lat, lon);
        const date = new Date();
        const hours = date.getHours();

        if (hours >= 18 || hours <= 6) {
            document.getElementsByClassName("weather")[0].innerHTML = `<i class="fa-solid fa-moon"></i> <span>${weather.main.temp}°</span>`;

            if (weatherCondition == 2 || weatherCondition == 3 || weatherCondition == 5) {
                document.getElementsByClassName("weather")[0].innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i> <span>${weather.main.temp}°</span>`;
            }
        } else {
            document.getElementsByClassName("weather")[0].innerHTML = `<i class="fa-solid fa-sun"></i> <span>${weather.main.temp}°</span>`;

            if (weatherCondition == 2 || weatherCondition == 3 || weatherCondition == 5) {
                document.getElementsByClassName("weather")[0].innerHTML = `<i class="fa-solid fa-cloud-sun-rain"></i> <span>${weather.main.temp}°</span>`;
            }
        }
    } catch (error) {
        console.error("Error fetching the weather data: ", error);
    }
};

displayWeather();
