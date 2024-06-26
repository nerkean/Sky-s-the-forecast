document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "21f0deee27ae40598dd114515242306";
    const langSwitcher = {
        ru: {
            lang: "ru",
            placeholder: "Введите название города...",
            weather: "Погода в вашем городе",
            temperature: "Температура",
            description: "Описание",
            fromTo: "от",
            to: "до",
            wind: "Ветер",
            km: "км/ч",
            moreDetails: "Подробнее",
            settings: "⚙️ Настройки",
            hideDetails: "Скрыть",
            closeSettings: "Закрыть",
                        feelsLike: "Ощущается как:",
            capitalButton: "Столицы",
            settingsHeader: "Настройки",  // Добавлено: заголовок настроек
            enableGeo: "Включить геолокацию" // Добавлено: опция геолокации
            
        },
        ua: { 
            lang: "ua",
            placeholder: "Введіть назву міста...",
            weather: "Погода у вашому місті",
            temperature: "Температура",
            description: "Опис",
            fromTo: "Від",
            to: "до",
            wind: "Вітер",
            km: "км/г",
            moreDetails: "Більше деталів", 
            settings: "⚙️ Налаштування", 
            hideDetails: "Приховати деталі",
            closeSettings: "Закрити",
                        feelsLike: "Відчувається як:",
            capitalButton: "Столиці",
            settingsHeader: "Налаштування", // Added: Settings header
            enableGeo: "Увімкнути геолокацію" // Added: Geolocation option
        },
        en: { 
            lang: "en",
            placeholder: "Enter city name...",
            weather: "Weather in your city",
            temperature: "Temperature",
            description: "Description",
            fromTo: "From",
            to: "to",
            wind: "Wind",
            km: "km/h",
            moreDetails: "More Details", 
            settings: "⚙️ Settings", 
            hideDetails: "Hide Details",
            closeSettings: "Close",
            settingsHeader: "Settings", // Added: Settings header
            enableGeo: "Enable Geolocation", // Added: Geolocation option
                        feelsLike: "Feels like:",
            capitalButton: "Capitals",
        }
    };
    const languages = ["ru", "ua", "en"];
    let currentLang = localStorage.getItem("currentLang") || "ru";
    let currentLangIndex = languages.indexOf(currentLang); 
    let currentUnit = localStorage.getItem("currentUnit") || "C"; 

    document.getElementById("lang-toggle").textContent = languages[currentLangIndex].toUpperCase();
    updateLanguage(languages[currentLangIndex]); 

    function updateLanguage(lang) {
        currentLangIndex = languages.indexOf(lang); 
        localStorage.setItem("currentLang", lang); 
        document.getElementById("city-input").placeholder = langSwitcher[lang].placeholder;
        document.getElementById("city-name").textContent = langSwitcher[lang].weather;
        document.getElementById("temperature").textContent = "--°" + currentUnit;
        document.getElementById("weather-icon").style.display = 'none';
        document.getElementById("lang-toggle").textContent = lang.toUpperCase();
        document.getElementById("toggle-details").textContent = langSwitcher[lang].moreDetails;
        document.getElementById("settings-button").textContent = langSwitcher[lang].settings;
        document.getElementById("close-settings").textContent = langSwitcher[lang].closeSettings;
        document.querySelector("#settings-menu label").textContent = langSwitcher[lang].enableGeo;
        document.querySelector("#settings-menu h3").textContent = langSwitcher[lang].settingsHeader;

        // Исправленный код для обновления лейбла чекбокса
        const geolocationLabel = document.querySelector("#settings-menu label");
        geolocationLabel.textContent = langSwitcher[lang].enableGeo;
        
        document.getElementById("capital-button").textContent = langSwitcher[lang].capitalButton;
        
        // Обновляем "Ощущается как" в элементе #temperature
        const feelsLikeText = document.querySelector("#temperature .feels-like");
        if (feelsLikeText) {
            feelsLikeText.textContent = langSwitcher[lang].feelsLike;
        }

        // Восстанавливаем чекбокс, если он был удален
        if (!geolocationLabel.querySelector("input[type='checkbox']")) {
            const geolocationToggle = document.createElement("input");
            geolocationToggle.type = "checkbox";
            geolocationToggle.id = "geolocation-toggle";
            geolocationLabel.prepend(geolocationToggle); // Вставляем чекбокс в начало лейбла
        }
    }

    function updateUnit(unit) {
        currentUnit = unit;
        localStorage.setItem("currentUnit", unit);
        document.getElementById("toggle-unit").textContent = unit === "C" ? "°F" : "°C";

        const currentCity = localStorage.getItem("currentCity");
        if (currentCity) {
            fetchWeather(currentCity);
        }
    }

    document.getElementById("lang-toggle").addEventListener("click", () => {
        currentLangIndex = (currentLangIndex + 1) % languages.length;
        const newLang = languages[currentLangIndex];
        document.getElementById("lang-toggle").textContent = newLang.toUpperCase();
        updateLanguage(newLang);
    });

    document.getElementById("toggle-unit").addEventListener("click", () => {
        const newUnit = currentUnit === "C" ? "F" : "C";
        updateUnit(newUnit);
    });

    document.getElementById("city-input").addEventListener("keyup", (event) => {
        if (event.keyCode === 13) { 
          const cityInput = document.getElementById("city-input").value;
          fetchWeather(cityInput);
          document.getElementById("suggestions-list").innerHTML = ""; 
        }
      });

    function fetchWeather(city) {
        if (!city) { 
            return; 
          }
          localStorage.setItem("currentCity", city);
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=${langSwitcher[currentLang].lang}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Город не найден");
            }
            return response.json();
        })
            .then(data => {
                document.getElementById("error-message").textContent = ""; 
                document.getElementById("city-name").textContent = `${data.location.name}`;
                const tempC = data.current.temp_c;
                const tempF = data.current.temp_f;
                const temp = currentUnit === "C" ? tempC : tempF;
                const feelsLikeC = data.current.feelslike_c;
                const feelsLikeF = data.current.feelslike_f;
                const currentLang = localStorage.getItem("currentLang") || "ru";
                const feelsLike = currentUnit === "C" ? feelsLikeC : feelsLikeF;
                document.getElementById("temperature").innerHTML = `
                <span class="main-temp">${temp}°${currentUnit}</span><br>
                <span class="feels-like">${langSwitcher[currentLang].feelsLike} ${feelsLike}°${currentUnit}</span>
            `;
                
                const condition = data.current.condition.text.toLowerCase();
                const weatherIcon = document.getElementById("weather-icon");
                const weatherDescription = document.getElementById("weather-description");
            
                if (condition.includes("дождь") || condition.includes("rain")) {
                    weatherIcon.className = "fa-solid fa-cloud-rain";
                    weatherIcon.style.display = 'block';
                    weatherDescription.textContent = condition;
                } else if (condition.includes("морось") || condition.includes("дымка") || condition.includes("туман")) {
                    weatherIcon.className = "fa-solid fa-smog";
                    weatherIcon.style.display = 'block';
                    weatherDescription.textContent = condition;
                } else if (condition.includes("облачность") || condition.includes("облачно") || condition.includes("cloudy")) {
                    weatherIcon.className = "fa-solid fa-cloud";
                    weatherIcon.style.display = 'block';
                    weatherDescription.textContent = condition;
                } else if (condition.includes("ясно") || condition.includes("солнечно") || condition.includes("sunny") || condition.includes("clear")) {
                    weatherIcon.className = "fa-solid fa-sun";
                    weatherIcon.style.display = 'block';
                    weatherDescription.textContent = condition; 
                } else if (condition.includes("снег")) {
                    weatherIcon.className = "fa-solid fa-snowflake";
                    weatherIcon.style.display = 'block';
                    weatherDescription.textContent = condition; 
                } else {
                    weatherIcon.style.display = 'none';
                    weatherDescription.textContent = condition;
                }

                const gradientBg = document.getElementById("gradient-bg");
                gradientBg.className = ''; 

                if (condition.includes("дождь") || condition.includes("rain")) {
                    gradientBg.classList.add("rainy");
                } else if (condition.includes("ясно") || condition.includes("солнечно") || condition.includes("sunny") || condition.includes("clear")) {
                    gradientBg.classList.add("clear-sky");
                } else if (condition.includes("облачно") || condition.includes("пасмурно") || condition.includes("cloudy")) {
                    gradientBg.classList.add("cloudy");
                } else if (condition.includes("снег")) {
                    gradientBg.classList.add("snowy");
                } else if (condition.includes("гроза")) {
                    gradientBg.classList.add("thunderstorm");
                } else if (condition.includes("морось")) {
                    gradientBg.classList.add("drizzle");
                }

                if (weatherDetailsSection.classList.contains("shown")) { 
                    fetchWeatherDetails(city);
                }
            })
            .catch(error => {
                showErrorModal("Ошибка: " + error.message);
            });
            
    }

    

    function fetchWeatherDetails(city) {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=14&lang=${langSwitcher[currentLang].lang}`)
            .then(response => response.json())
            .then(data => {
                const forecastContainer = document.querySelector("#weather-details .forecast-container");
                forecastContainer.innerHTML = "";

                data.forecast.forecastday.forEach(day => {
                    const date = new Date(day.date);
                const options = { month: 'long', day: 'numeric' }; // month: 'long' для полного названия месяца
                const formattedDate = date.toLocaleDateString(currentLang, options); // Используем currentLang для локализации
                const maxTempC = day.day.maxtemp_c;
                const minTempC = day.day.mintemp_c;
                const maxTempF = day.day.maxtemp_f;
                const minTempF = day.day.mintemp_f;
                const maxTemp = currentUnit === "C" ? maxTempC : maxTempF;
                const minTemp = currentUnit === "C" ? minTempC : minTempF;
                const condition = day.day.condition.text;
                const windSpeed = day.day.maxwind_kph;

                const dayElement = document.createElement("div");
                dayElement.classList.add("forecast-item");
                dayElement.innerHTML = `
                    <p>${formattedDate}</p>
                    <div class="weather-container">
                        <i class="${getWeatherIconClass(condition)}" style="font-size: 24px;"></i>
                        <p>${condition}</p>
                    </div>
                    <p>${langSwitcher[currentLang].fromTo} ${minTemp}°${currentUnit} ${langSwitcher[currentLang].to} ${maxTemp}°${currentUnit}</p>
                    <p>${langSwitcher[currentLang].wind}: ${windSpeed} ${langSwitcher[currentLang].km}</p>
                `;
                forecastContainer.appendChild(dayElement);
            });
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function getWeatherIconClass(condition) {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes("дождь") || conditionLower.includes("rain")) {
            return "fas fa-cloud-rain"; 
        } else if (conditionLower.includes("ясно") || conditionLower.includes("солнечно") || conditionLower.includes("sunny") || conditionLower.includes("clear")) {
            return "fas fa-sun";      
        } else if (conditionLower.includes("облачность") || conditionLower.includes("пасмурно") || conditionLower.includes("cloudy")){
            return "fas fa-cloud";    
        } else if (conditionLower.includes("туман")){
            return "fas fa-smog";    
        } else if (conditionLower.includes("снег")){
            return "fas fa-snowflake";    
        }
        else {
            return ""; 
        }
    }

    const toggleDetailsButton = document.getElementById("toggle-details");
    const weatherDetailsSection = document.getElementById("weather-details");

    toggleDetailsButton.addEventListener("click", () => {
        weatherDetailsSection.classList.toggle("shown");

        if (weatherDetailsSection.classList.contains("shown")) {
            toggleDetailsButton.textContent = langSwitcher[currentLang].hideDetails; 
            const currentCity = localStorage.getItem("currentCity");
            if (currentCity) {
                fetchWeatherDetails(currentCity);
            }
        } else {
            toggleDetailsButton.textContent = langSwitcher[currentLang].moreDetails;
            document.querySelector("#weather-details .forecast-container").innerHTML = ""; 
        }
    });
    

    function fetchCitySuggestions(query) {
        if (query.length < 2) return;
        fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
            .then(response => response.json())
            .then(data => {
                const suggestionsList = document.getElementById("suggestions-list");
                suggestionsList.innerHTML = "";
                data.forEach(city => {
                    const listItem = document.createElement("li");
                    listItem.textContent = city.name;
                    listItem.addEventListener("click", () => {
                        document.getElementById("city-input").value = city.name;
                        suggestionsList.innerHTML = ""; 
                        fetchWeather(city.name); 
                    });
                    suggestionsList.appendChild(listItem);
                });
            })
            .catch(error => console.error("Ошибка при получении данных:", error));
    }

    const settingsButton = document.getElementById("settings-button");
    const settingsMenu = document.getElementById("settings-menu");
    const closeSettingsButton = document.getElementById("close-settings");
    const blurContainer = document.createElement('div');
    blurContainer.classList.add('blur-container');

    settingsButton.addEventListener("click", () => {
        settingsMenu.style.display = "block";
        document.body.appendChild(blurContainer); 
        settingsMenu.classList.add("animate__animated", "animate__fadeIn"); 
    });

    closeSettingsButton.addEventListener("click", () => {
        settingsMenu.style.display = "none";
        document.body.removeChild(blurContainer);
        settingsMenu.classList.remove("animate__animated", "animate__fadeIn");
    });

    document.getElementById("city-input").addEventListener("input", (event) => {
        const query = event.target.value;
        const suggestionsList = document.getElementById("suggestions-list");
        
        if (query.length >= 2) {  
          suggestionsList.style.display = "block"; 
          fetchCitySuggestions(query);
        } else {
          suggestionsList.style.display = "none"; 
        }
      });

    

    document.getElementById("settings-button").addEventListener("click", () => {
        const settingsMenu = document.getElementById("settings-menu");
        settingsMenu.classList.toggle("hidden");
    });

    document.getElementById("geolocation-toggle").addEventListener("change", (event) => {
        if (event.target.checked) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const coords = `${position.coords.latitude},${position.coords.longitude}`;
                    localStorage.setItem("geolocationEnabled", "true");
                    localStorage.setItem("geolocationCoords", coords);
                    fetchWeather(coords);
                });
            } else {
                alert("Геолокация не поддерживается вашим браузером.");
            }
        } else {
            localStorage.removeItem("geolocationEnabled");
            localStorage.removeItem("geolocationCoords");
        }
    });

    if (localStorage.getItem("geolocationEnabled") === "true") {
        const coords = localStorage.getItem("geolocationCoords");
        if (coords) {
            fetchWeather(coords);
            document.getElementById("geolocation-toggle").checked = true;
            document.getElementById("city-input").value = ''; // Очищаем поле ввода
        }
    } else {
        // Если геолокация отключена, пытаемся загрузить погоду из сохраненного города
        const currentCity = localStorage.getItem("currentCity");
        if (currentCity) {
            document.getElementById("city-input").value = currentCity;
            fetchWeather(currentCity);
        }
    }
    

    function showErrorModal(message) {
        document.getElementById("error-message").textContent = message;
    }

    const capitalButton = document.getElementById("capital-button");
const cityInput = document.getElementById("city-input");
let capitalsListOpen = false;

capitalButton.addEventListener("click", () => {
    const suggestionsList = document.getElementById("suggestions-list");

    if (capitalsListOpen) {
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none"; // Скрываем список
        capitalsListOpen = false; // Обновляем состояние
    } else {
        const capitals = [ "Киев", "Варшава", "Вашингтон", "Лондон", "Париж", "Берлин", "Рим", "Токио", "Пекин"];

        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "block";

    capitals.forEach(capital => {
        const listItem = document.createElement("li");
        listItem.textContent = capital;
        listItem.addEventListener("click", () => {
            cityInput.value = capital;
            suggestionsList.innerHTML = "";
            suggestionsList.style.display = "none"; // Скрываем список
            fetchWeather(capital);
        });
        suggestionsList.appendChild(listItem);
    });

    capitalsListOpen = true; // Обновляем состояние
}
});




});
