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



searchBtn.addEventListener("click", startSearch);
