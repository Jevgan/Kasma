"use strict";

import { fetchWeather } from "./modules/openMeteoAPI.js";

let userForm = document.getElementById("user-form"),
  gallery = document.querySelector(".gallery_list"),
  addImageBtn = document.querySelector(".add"),
  removeImageBtn = document.querySelector(".remove"),
  logo = document.querySelector("picture"),
  weatherForm = document.querySelector("#weather_form"),
  weatherOutput = document.querySelector("#weather_output");

function getGalleryLength() {
  return gallery.querySelectorAll("li").length;
}

function getImagesCount() {
  const imagesCount = parseInt(localStorage.getItem("imageCount"));
  if (imagesCount && imagesCount < 10 && imagesCount > 0) {
    return imagesCount;
  }

  return 10;
}

function updateImageCount(newCount) {
  if (newCount <= 10) {
    let imageCount = newCount;
    localStorage.setItem("imageCount", imageCount);
  }
}

addEventListeners();

function isValidByInputRole(inputText, role) {
  if (!role) return "Invalid role";

  if (role === "username") return isNameValid(inputText);
  else if (role === "age") return isAgeValid(inputText);
  else if (role === "email") return isEmailValid(inputText);
}

function isNameValid(name) {
  return (
    name && name.trim().length != 0 && name.length >= 3 && name.length <= 20
  );
}

function isAgeValid(age) {
  return age && typeof +age == "number" && age >= 18 && age < 100;
}

function isEmailValid(email) {
  if (!email && email.trim().length == 0) {
    return false;
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
  const isValid = regex.test(email);

  return isValid;
}

function insertImgInGallery(imageNumber) {
  const imageLi = document.createElement("li");
  const image = document.createElement("img");

  image.alt = `Image ${imageNumber}`;
  image.src = `../img/gallery/${imageNumber}.jpg`;

  imageLi.appendChild(image);
  gallery.appendChild(imageLi);
}

function capitalizeFirstChar(str) {
  if (!str || typeof str !== "string") return str;
  return str[0].toUpperCase() + str.slice(1);
}

async function getWeather(e) {
  e.preventDefault();
  const cities = {
    kyiv: {
      latitude: 50.4547,
      longitude: 30.5238,
    },
    rivne: {
      latitude: 50.6231,
      longitude: 26.2274,
    },
    poltava: {
      latitude: 49.5892,
      longitude: 34.5537,
    },
    odessa: {
      latitude: 46.4857,
      longitude: 30.7438,
    },
    kharkiv: {
      latitude: 49.9808,
      longitude: 36.2527,
    },
    ternopil: {
      latitude: 49.554,
      longitude: 25.5907,
    },
  };

  const weatherOutputProps = [
    "temperature",
    "windspeed",
    "winddirection",
    "weathercode",
  ];

  weatherOutput.style.display = "flex";

  const weatherInfo = document.querySelector("#weather_info");
  weatherInfo.innerHTML = "";

  const city = this.querySelector("#city").value;
  weatherOutput.querySelector("#weather_city_name").textContent =
    capitalizeFirstChar(city);

  //Adding the current weather property to each city
  Object.keys(cities).forEach(
    (city) => (cities[city]["current_weather"] = true)
  );

  //Fetched info
  const fetchedWeather = await fetchWeather(cities[city]);

  weatherOutputProps.forEach((property) => {
    const weatherPropKey = fetchedWeather["current_weather"];
    const weatherUnits = fetchedWeather["current_weather_units"];

    const div = document.createElement("div");
    div.classList.add("glass_card");
    div.innerHTML = `
        <h2>${capitalizeFirstChar(property)}</h2>
        <p>${weatherPropKey[property]} ${weatherUnits[property]}</p>
    `;
    weatherInfo.append(div);
  });
  weatherOutput.append(weatherInfo);
}

function addErrorMessage(insertInEl, message) {
  let errorElement = insertInEl.querySelector(".error_message");

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.classList.add("error_message");
  }

  if (!insertInEl.contains(errorElement)) {
    errorElement.textContent = message;
    insertInEl.insertAdjacentElement("beforeend", errorElement);
  }
}
function deleteErrorMessage(insertInEl) {
  let errorElement = insertInEl.querySelector(".error_message");

  if (insertInEl.contains(errorElement)) errorElement.remove();
}

function addEventListeners() {
  logo.addEventListener("click", () => location["reload"]());

  userForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      const condition = isValidByInputRole(this.value, this.name);
      if (!condition) {
        addErrorMessage(this.parentElement, `${input.name} is not valid!`);
      } else {
        deleteErrorMessage(this.parentElement);
      }
    });
  });

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const submitBtn = document.querySelector('button[type="submit"]');
    const errorMessages = this.querySelectorAll(".error_message");
    if (errorMessages.length == 0) {
      setTimeout(() => {
        this.submit();
      }, 1000);
    } else {
      errorMessages.forEach((message) => {
        submitBtn.insertAdjacentElement("beforebegin", message);
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    weatherOutput.style.display = "none";

    for (let i = 1; i <= getImagesCount(); i++) {
      insertImgInGallery(i);
    }
  });

  addImageBtn.addEventListener("click", () => {
    if (getGalleryLength() < 10) {
      insertImgInGallery(getGalleryLength() + 1);
      updateImageCount(getGalleryLength());
    }
  });

  removeImageBtn.addEventListener("click", () => {
    if (getGalleryLength() > 0) {
      gallery.lastElementChild?.remove();
      updateImageCount(getGalleryLength());
    }
  });

  weatherForm.addEventListener("submit", getWeather);
}
