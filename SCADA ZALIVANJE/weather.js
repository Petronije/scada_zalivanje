const todayTemp = document.querySelector(".today-temp");
const tempUnit = document.querySelectorAll(".temp-unit");
const clouds = document.querySelector(".today-clouds");

const bigIcons = document.querySelectorAll(".icon-big");
const sunIcon = document.querySelector(".ph-sun");
const cloudIcon = document.querySelector(".ph-cloud");
const cloudRainIcon = document.querySelector(".ph-cloud-rain");
const cloudSnowIcon = document.querySelector(".ph-cloud-snow");
const cloudSunIcon = document.querySelector(".ph-cloud-sun");

const wind = document.querySelector(".wind");
const windUnit = document.querySelector(".wind-unit");
const humidity = document.querySelector(".humidity");
const humidityUnit = document.querySelector(".humidity-unit");
const pressure = document.querySelector(".pressure");
const pressureUnit = document.querySelector(".pressure-unit");

const day = document.querySelectorAll(".weather-week-day");

const weatherData = {};
const weatherUnits = {};
let weekDaysUp = [];
let weekDaysDown = [];

// remove all visibility from all icons
const removeVisibleAll = function (icons) {
  icons.forEach((icon) => {
    icon.classList.remove("icon-visible");
  });
};

// add visibility to passed icon element
const addVisible = function (icon) {
  icon.classList.add("icon-visible");
};

const dayInfo = function (dayPlus) {
  const now = new Date();
  const future = now.getTime() + dayPlus * 24 * 60 * 60 * 1000;
  const options = { weekday: "long" };
  const locale = "en-US";
  const day = new Intl.DateTimeFormat(locale, options).format(future);
  return day;
};

// function for filling widget from API data
const fillWidget = function () {
  todayTemp.firstChild.nodeValue = weatherData.temperature;
  tempUnit.forEach((unit) => {
    unit.textContent = weatherUnits.tempUnit;
  });
  wind.firstChild.nodeValue = weatherData.wind;
  windUnit.textContent = weatherUnits.windUnit;
  humidity.firstChild.nodeValue = weatherData.humidity;
  humidityUnit.textContent = weatherUnits.humidityUnit;
  pressure.firstChild.nodeValue = weatherData.pressure;
  pressureUnit.textContent = weatherUnits.pressureUnit;

  if (
    weatherData.clouds <= 10 &&
    weatherData.rain <= 25 &&
    weatherData.snow < 25
  ) {
    removeVisibleAll(bigIcons);
    addVisible(sunIcon);
    clouds.textContent = "clear sky";
  } else if (
    weatherData.clouds > 20 &&
    weatherData.clouds < 45 &&
    weatherData.rain < 25 &&
    weatherData.snow < 25
  ) {
    removeVisibleAll(bigIcons);
    addVisible(cloudSunIcon);
    clouds.textContent = "sun & clouds";
  } else if (
    weatherData.clouds >= 45 &&
    weatherData.rain < 25 &&
    weatherData.snow < 25
  ) {
    removeVisibleAll(bigIcons);
    addVisible(cloudIcon);
    clouds.textContent = "cloudy";
  } else if (weatherData.rain >= 25 && weatherData.snow < 25) {
    removeVisibleAll(bigIcons);
    addVisible(cloudRainIcon);
    clouds.textContent = "rain";
  } else if (weatherData.snow >= 25) {
    removeVisibleAll(bigIcons);
    addVisible(cloudSnowIcon);
    clouds.textContent = "snow";
  }

  weekDaysUp.forEach(function (el, i) {
    const dayUp = document.querySelector(`.day-${i}`);
    dayUp.querySelector(".temp-up").firstChild.nodeValue = el;
  });

  weekDaysDown.forEach(function (el, i) {
    const dayDown = document.querySelector(`.day-${i}`);
    dayDown.querySelector(".temp-down").firstChild.nodeValue = el;
  });

  day.forEach(function (el, i) {
    const weekDay = el.querySelector(".day");
    if (i === 0) {
      weekDay.textContent = "Tommorrow";
    } else {
      weekDay.textContent = dayInfo(i + 1);
    }
  });
};

const getWeatherData = async function () {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=44.82&longitude=20.68&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,surface_pressure,cloud_cover,snowfall&wind_speed_unit=ms"
    );
    if (!res.ok) {
      throw new Error("HTTP Error");
    }
    const data = await res.json();
    console.log(data);
    weatherData.rain = data.current.rain;

    weatherData.snow = data.current.snowfall;
    weatherData.humidity = data.current.relative_humidity_2m;
    weatherData.pressure = data.current.surface_pressure;
    weatherData.wind = data.current.wind_speed_10m;
    weatherData.temperature = data.current.temperature_2m;
    weatherData.clouds = data.current.cloud_cover;

    weekDaysUp = data.daily.temperature_2m_max;
    weekDaysDown = data.daily.temperature_2m_min;

    weatherUnits.humidityUnit = data.current_units.relative_humidity_2m;
    weatherUnits.pressureUnit = data.current_units.surface_pressure;
    weatherUnits.windUnit = data.current_units.wind_speed_10m;
    weatherUnits.tempUnit = data.current_units.temperature_2m;

    fillWidget();
  } catch (err) {
    console.error(err);
  }
};

getWeatherData();
console.log(weatherData);
console.log(weatherUnits);
