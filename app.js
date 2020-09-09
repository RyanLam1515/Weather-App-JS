const notification = document.querySelector(".notification");
const icon = document.querySelector(".weather-icon");
const temperatureDescription = document.querySelector(".temperature-description p");
const temperatureDegree = document.querySelector(".temperature-value p");
const locationElement = document.querySelector(".temperature-location p");
const submitButton = document.querySelector(".submit");
const inputValue = document.querySelector(".inputValue");
const max = document.querySelector(".temperature-max p");
const min = document.querySelector(".temperature-min p");
const currentLocationButton = document.querySelector(".currentLocationButton");

const weather = {};

const KELVIN = 273; 
const API_key = "3140525c8858784101dd585eb974482e";



function getGeolocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLatAndLong, showError);
    } else {
        notification.style.display = "block";
        notification.innerHTML ="<p>Browser settings are not compatible with Geolocation</p>";
    }
}

window.addEventListener("load", getGeolocation());

function setLatAndLong(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    getWeather(lat,long);
}

function showError(error) {
    notification.style.display = "block";
    notification.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(lat, long){

        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}`;


        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                weather.temperatureDegree = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.icon = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                weather.unit = "Celsius";
                weather.min = Math.floor(data.main.temp_min -KELVIN);
                weather.max = Math.floor(data.main.temp_max -KELVIN);
            })
            .then(function() {
                displayWeather();
            });
    }


function displayWeather() {
    icon.innerHTML = `<img src="icons/${weather.icon}.png"/>`;
    temperatureDegree.innerHTML = `${weather.temperatureDegree}°<span>C</span>`;
    temperatureDescription.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    max.innerHTML = `${weather.max}°<span>C</span>`; 
    min.innerHTML = `${weather.min}°<span>C</span>`; 
}

function convertCelsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

temperatureDegree.addEventListener("click", function(){

    console.log(weather.unit);

    if(weather.temperatureDegree === undefined) return; 


    if(weather.unit == "Celsius") {
        let Fahrenheit = Math.floor(convertCelsiusToFahrenheit(weather.temperatureDegree));
        let Fahrenheit_Min = Math.floor(convertCelsiusToFahrenheit(weather.min));
        let Fahrenheit_Max = Math.floor(convertCelsiusToFahrenheit(weather.max));

        temperatureDegree.innerHTML =`${Fahrenheit}°<span>F</span>`;
        max.innerHTML = `${Fahrenheit_Max}°<span>F</span>`;
        min.innerHTML = `${Fahrenheit_Min}°<span>F</span>`
        weather.unit = "Fahrenheit";
    } else {
        console.log(weather.temperatureDegree);    
        temperatureDegree.innerHTML = `${weather.temperatureDegree}°<span>C</span>`;
        min.innerHTML = `${weather.min}°<span>C</span>`;
        max.innerHTML = `${weather.max}°<span>C</span>`;
        weather.unit = "Celsius";
    }
})

submitButton.addEventListener("click", function() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&appid=${API_key}`)
    .then(response => response.json())
    .then(data => {
        weather.temperatureDegree = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.icon = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        weather.unit = "Celsius";
        displayWeather();
    })

.catch(err => alert("Invalid city name!"));
})

currentLocationButton.addEventListener("click",function() {
    getGeolocation();
});

    


