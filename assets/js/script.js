var searchInput = document.querySelector(".search-input");
var searchBtn = document.querySelector(".search-btn");
var historySearch = document.querySelector(".history");
var cardsHolder = document.querySelector(".cards");
var todayCard = document.querySelector(".today");
var uviColor = document.querySelector(".uv-color");

var latitude = 0;
var longitude = 0;

function startSearch(event) {
	event.preventDefault();
	var location = searchInput.value;
	getLatLon(location);
	addToHistory(location);
}

function startButtonSearch(event) {
	event.preventDefault();
	var location = event.target.textContent;
	getLatLon(location);
}

function addToHistory(city){
	newBtn = document.createElement("button");
	newBtn.setAttribute("type","button");
	newBtn.textContent = capitalize(city);
	historySearch.prepend(newBtn);
	newBtn.addEventListener("click",startButtonSearch)
}

async function getWeatherInfo(lat,long) {
	let weatherObj = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly&appid=25290662f09e415ae65ed4015f527868");
	let weatherText = await weatherObj.text();
	let	weatherJSON = JSON.parse(weatherText);
	console.log(weatherJSON);
	setNextFiveCards(weatherJSON);
	setCurrentWeather(weatherJSON);
}


searchBtn.addEventListener("click", startSearch);
