// Define the API key as a constant
const weatherAPI = "653e218dbd1d8afab739e45d098b3222";
let savedLatitude, savedLongitude;

// Initial API call with dynamic latitude and longitude
const getWeather = async () => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${savedLatitude}&lon=${savedLongitude}&appid=${weatherAPI}&units=metric`);
    if (!res.ok) {
        throw new Error("Failed to fetch weather data");
    }
    const weather = await res.json();
    return weather;
};

// Function to check weather condition
const conditionChecker = async () => {
    const weather = await getWeather();
    return weather.weather[0].id.toString()[0];
};

// Function to get coordinates
const coords = () => {
    return new Promise((resolve, reject) => {
        savedLatitude = localStorage.getItem('latitude');
        savedLongitude = localStorage.getItem('longitude');

        if (savedLatitude && savedLongitude) {
            resolve();
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                savedLatitude = position.coords.latitude;
                savedLongitude = position.coords.longitude;

                localStorage.setItem('latitude', String(savedLatitude));
                localStorage.setItem('longitude', String(savedLongitude));
                resolve(); // Resolve the promise when coordinates are set
            }, (error) => {
                console.error("Geolocation error: ", error);
                reject(error);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            reject(new Error("Geolocation not supported"));
        }
    });
};

// Function to display weather
const displayWeather = async () => {
    try {
        await coords();
        const weather = await getWeather();
        const weatherCondition = await conditionChecker();
        const date = new Date();
        const hours = date.getHours();

        const weatherElement = document.getElementsByClassName("weather")[0];

        if (hours >= 18 || hours < 6) {
            weatherElement.innerHTML = `<i class="fa-solid fa-moon"></i> <span>${weather.main.temp}°</span>`;
            if (weatherCondition == 2 || weatherCondition == 3 || weatherCondition == 5) {
                weatherElement.innerHTML = `<i class="fa-solid fa-cloud-moon-rain"></i> <span>${weather.main.temp}°</span>`;
            }
        } else {
            weatherElement.innerHTML = `<i class="fa-solid fa-sun"></i> <span>${weather.main.temp}°</span>`;
            if (weatherCondition == 2 || weatherCondition == 3 || weatherCondition == 5) {
                weatherElement.innerHTML = `<i class="fa-solid fa-cloud-sun-rain"></i> <span>${weather.main.temp}°</span>`;
            }
        }
    } catch (error) {
        console.error("Error fetching the weather data: ", error);
    }
};

// Start the weather display
displayWeather();
