var searchInput = document.querySelector(".search-input");
var searchBtn = document.querySelector(".search-btn");
var historySearch = document.querySelector(".history");
var cardsHolder = document.querySelector(".cards");
var todayCard = document.querySelector(".today");
var uviColor = document.querySelector(".uv-color");

// This variable prevents adding already searched cities to history
var notInHistory = false;

var latitude = 0;
var longitude = 0;

if (localStorage.getItem("citiesSearch") != null) {
	var citiesSearched = JSON.parse(localStorage.getItem("citiesSearch"));
	for (var i = 0; i < citiesSearched.length; i++) {
		addToHistory(citiesSearched[i]);
	}
}else{
	var citiesSearched = [];
}

function kelvinToFahrenheit(kelvin){
	let total = 1.8*(kelvin-273.15)+32; 
	return total.toFixed(2);
}

//This function will add a search to history
function startSearch(event) {
	event.preventDefault();
	var location = searchInput.value;
	notInHistory = true;
	getLatLon(location);
}

//This function will NOT add a search to history (because the instruction came from the history)
function startButtonSearch(event) {
	event.preventDefault();
	var location = event.target.textContent;
	notInHistory = false;
	getLatLon(location);
}

function addToHistory(city){
	newBtn = document.createElement("button");
	newBtn.setAttribute("type","button");
	newBtn.textContent = capitalize(city);
	historySearch.prepend(newBtn);
	newBtn.addEventListener("click",startButtonSearch)
}

//localstorages the history
function saveHistory(city){
	citiesSearched.push(capitalize(city));
	localStorage.setItem("citiesSearch",JSON.stringify(citiesSearched))
	console.log(localStorage.getItem("citiesSearch"))
}

//Uses Open Weather Map API to get weather information
async function getWeatherInfo(lat,long) {
	let weatherObj = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly&appid=25290662f09e415ae65ed4015f527868");
	let weatherText = await weatherObj.text();
	let	weatherJSON = JSON.parse(weatherText);
	console.log(weatherJSON);
	setNextFiveCards(weatherJSON);
	setCurrentWeather(weatherJSON);
}

function setNextFiveCards(json){
	for (i = 0; i < 5; i++) {
		cardsHolder.children[i].children[0].textContent = moment().add(i+1,'days').format("M/D/YYYY"); //Fecha
		cardsHolder.children[i].children[1].setAttribute("src","http://openweathermap.org/img/w/" + json.daily[i+1].weather[0].icon + ".png"); //Icono
		cardsHolder.children[i].children[2].textContent = "Temp: " + kelvinToFahrenheit(json.daily[i+1].temp.day) + " °F"; //Temp
		cardsHolder.children[i].children[3].textContent = "Wind: " + json.daily[i+1].wind_speed + " MPH"; //Viento
		cardsHolder.children[i].children[4].textContent = "Humidity: " + json.daily[i+1].humidity + "%"; //Humedad
	}
}

function setCurrentWeather(json){
	todayCard.children[0].children[1].setAttribute("src","http://openweathermap.org/img/w/" + json.daily[0].weather[0].icon + ".png");
	todayCard.children[1].textContent = "Temp: " + kelvinToFahrenheit(json.daily[0].temp.day)  + " °F";
	todayCard.children[2].textContent = "Wind: " + json.daily[0].wind_speed + " MPH"; //Viento
	todayCard.children[3].textContent = "Humidity: " + json.daily[0].humidity + "%"; //Humedad
	todayCard.children[4].children[0].textContent = json.daily[0].uvi; //Humedad
	checkUVI(json.daily[0].uvi)
}

function checkUVI(uvi){
	if(uvi < 3){
		uviColor.style.backgroundColor = "green";
	}else if(3 < uvi && uvi < 6){
		uviColor.style.backgroundColor = "goldenrod";
	}else if(6 < uvi && uvi < 8){
		uviColor.style.backgroundColor = "orange";
	}else if(8 < uvi && uvi < 10){
		uviColor.style.backgroundColor = "red";
	}else{
		uviColor.style.backgroundColor = "purple";
	}
}

//Gets latitud and longitud of a city
async function getLatLon(city) {
	let locationObj = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=25290662f09e415ae65ed4015f527868");
	let locationText = await locationObj.text();
	let	locationJSON = JSON.parse(locationText);

	if (locationText.length > 3) {
		latitude = locationJSON[0].lat;
		longitude = locationJSON[0].lon;

		todayCard.children[0].children[0].textContent = capitalize(city) + " (" + moment().format("M/D/YYYY") + ")";
		getWeatherInfo(latitude,longitude);
		if (notInHistory) {
			addToHistory(city);
			saveHistory(city);
		}

	}else{
		alert("City not Found");
	}
}

function capitalize(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

searchBtn.addEventListener("click", startSearch);
