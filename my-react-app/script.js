
const API_KEY = 'dc471bf6be5fc55150a290ac51c4f39e';

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function setDefaultCity() {
  const defaultCity = "Chisinau";
  fetchWeatherInformation(defaultCity);
}
window.addEventListener('load', setDefaultCity);
function getWeatherForecast(cityName) {
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

  fetch(forecastApiUrl)
    .then(response => {
      return response.json();
    })
    .then(forecastData => {
      const dailyForecasts = forecastData.list.filter(entry => entry.dt_txt.includes('12:00:00'));

      const weekContainer = document.querySelector(".week");

      dailyForecasts.forEach((day, index) => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temperature = Math.round(day.main.temp - 273.15);
        const description = day.weather[0].description;

        const dayElement = weekContainer.children[index];

        const imgElement = document.createElement("img");

        dayElement.innerHTML = `${date}: ${temperature}°C`;
        dayElement.appendChild(imgElement);

        if (description === "few clouds" || description === "broken clouds" || description === "overcast clouds") {
          imgElement.src = 'img/suncloud.svg';
        } else if (description === "rain") {
          imgElement.src = 'img/rain.svg';
        } else if (description === "clear sky") {
          imgElement.src = 'img/sun.svg';
        } else {
          imgElement.src = 'img/cloud.svg';
        }
      });
    })
}




function fetchWeatherInformation(cityName) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  const sunriseSunsetApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

  const locate = document.querySelector(".locate");

  fetch(weatherApiUrl)
    .then(response => response.json())
    .then(weatherData => {
      const temperatureKelvin = weatherData.main.temp;
      const temperatureCelsius = temperatureKelvin - 273.15;
      const description = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;

      const timeElement = document.querySelector(".time");
      const Hum = document.querySelector(".hum");
      const wind = document.querySelector(".wind");
      const UV = document.querySelector(".UV");
      const cels = document.querySelector(".cels");
      const img = document.querySelector(".img");

      const timeZoneOffsetSeconds = weatherData.timezone;
      const localTime = new Date(new Date().getTime() + (timeZoneOffsetSeconds - 7200) * 1000); // Adjusted by subtracting 2 hours
      const currentTime = localTime.toLocaleTimeString();

      timeElement.innerHTML = currentTime;
      locate.innerHTML = `${cityName} <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.66667 8.33333C7.125 8.33333 7.5175 8.17 7.84417 7.84333C8.17028 7.51722 8.33333 7.125 8.33333 6.66667C8.33333 6.20833 8.17028 5.81583 7.84417 5.48917C7.5175 5.16306 7.125 5 6.66667 5C6.20833 5 5.81611 5.16306 5.49 5.48917C5.16333 5.81583 5 6.20833 5 6.66667C5 7.125 5.16333 7.51722 5.49 7.84333C5.81611 8.17 6.20833 8.33333 6.66667 8.33333ZM6.66667 14.4583C8.36111 12.9028 9.61806 11.4894 10.4375 10.2183C11.2569 8.94778 11.6667 7.81944 11.6667 6.83333C11.6667 5.31944 11.1839 4.07972 10.2183 3.11417C9.25333 2.14917 8.06944 1.66667 6.66667 1.66667C5.26389 1.66667 4.07972 2.14917 3.11417 3.11417C2.14917 4.07972 1.66667 5.31944 1.66667 6.83333C1.66667 7.81944 2.07639 8.94778 2.89583 10.2183C3.71528 11.4894 4.97222 12.9028 6.66667 14.4583ZM6.66667 16.6667C4.43056 14.7639 2.76056 12.9964 1.65667 11.3642C0.552222 9.7325 0 8.22222 0 6.83333C0 4.75 0.670278 3.09028 2.01083 1.85417C3.35083 0.618055 4.90278 0 6.66667 0C8.43056 0 9.9825 0.618055 11.3225 1.85417C12.6631 3.09028 13.3333 4.75 13.3333 6.83333C13.3333 8.22222 12.7814 9.7325 11.6775 11.3642C10.5731 12.9964 8.90278 14.7639 6.66667 16.6667Z" fill="white"/></svg>`;
      cels.innerHTML = `${Math.round(temperatureCelsius)}°`;
      UV.innerHTML = `Low`;
      wind.innerHTML = `${windSpeed} m/s`;
      Hum.innerHTML = `${humidity}%`;

      if (description === "few clouds" || description === "broken clouds" || description === "overcast clouds") {
        img.style.backgroundImage = 'url("img/suncloud.svg")';
      } else if (description === "rain") {
        img.style.backgroundImage = 'url("img/rain.svg")';
      } else if (description === "clear sky") {
        img.style.backgroundImage = 'url("img/sun.svg")';
      } else {
        img.style.backgroundImage = 'url("img/cloud.svg")';
      }
    });

  getWeatherForecast(cityName);

  fetch(sunriseSunsetApiUrl)
    .then(response => response.json())
    .then(sunriseSunsetData => {
      const sunriseTime = new Date(sunriseSunsetData.city.sunrise * 1000).toLocaleTimeString();
      const sunsetTime = new Date(sunriseSunsetData.city.sunset * 1000).toLocaleTimeString();
      const sunset = document.querySelector("#sunset");
      const sunrise = document.querySelector("#sunrise");

      sunrise.innerHTML = sunriseTime;
      sunset.innerHTML = sunsetTime;
    });
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
      const cityName = removeDiacritics(document.querySelector('.input3').value);
      fetchWeatherInformation(cityName.toUpperCase());
  }
}

document.querySelector('.but3').addEventListener('click', function() {
  const cityName = removeDiacritics(document.querySelector('.input3').value);
  fetchWeatherInformation(cityName.toUpperCase());
});

const oras2 = document.querySelectorAll("path");
oras2.forEach(path => {
  path.addEventListener("click", function() {
    const cityNameWithDiacritics = this.getAttribute("name");
    const cityName = removeDiacritics(cityNameWithDiacritics);
    fetchWeatherInformation(cityName.toUpperCase());
  });
});

