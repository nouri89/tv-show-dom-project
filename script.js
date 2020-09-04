//const allEpisodes
let rootElem;
let episodeDiv;
let allEpisodeDiv;
let episodeName;
let episodeImage;
let episodeSummary;
let searchFoundCounter = 0;
let searchWord;
let episodeFound = [];
let liveSearch;
let searchResult;
let totalNumberOfEpisodes;
let str;
let res;
let searchFlag = false;
let option;
let header;
let searchMode = false;
let allPagesAreLoaded = false;

function setup() {
	loadAllEpisodes();
}

function makePageHeader(episodeList) {
	if (searchFlag === false) {
		searchFoundCounter = totalNumberOfEpisodes;
	}
	rootElem = document.getElementById("root");
	header = document.createElement("header");

	let episodeSelector = document.createElement("select");
	episodeSelector.setAttribute("id", "dropMenu");
	header.appendChild(episodeSelector);
	let optionPrompt = document.createElement("option");
	optionPrompt.id = "noThingSelected";
	optionPrompt.value = "";
	optionPrompt.text = "Select an Episode";
	episodeSelector.appendChild(optionPrompt);
	for (var i = 0; i < episodeList.length; i++) {
		let option = document.createElement("option");
		option.id = i + "";
		option.value = episodeList[i];
		option.text = episodeCode(episodeList[i]) + " - " + episodeList[i].name;
		episodeSelector.appendChild(option);
	}

	liveSearch = document.createElement("INPUT");
	liveSearch.setAttribute("type", "search");
	liveSearch.setAttribute("id", "searchEpisode");
	header.appendChild(liveSearch);
	liveSearch.style.margin = "1% 1%";
	liveSearch.placeholder = "Live Search";
	searchResult = document.createElement("h3");

	searchResult.innerText =
		"Displaying " +
		searchFoundCounter +
		" / " +
		totalNumberOfEpisodes +
		" episodes ";
	header.appendChild(searchResult);

	rootElem.appendChild(header);

	header.style.width = "100%";
	header.style.display = "flex";
	header.style.border = "none";
	header.style.position = "fixed";
	header.style.backgroundColor = "#E8E8E8";
	searchResult.style.padding = "1% 1%";

	document
		.getElementById("searchEpisode")
		.addEventListener("search", function () {
			if (document.getElementById("searchEpisode").value === "") {
				if (!allPagesAreLoaded) {
					searchFoundCounter = totalNumberOfEpisodes;
					refreshHeader();
					refreshPage();
					loadAllEpisodes();
					searchMode = false;
					allPagesAreLoaded = true;
				} else {
					allPagesAreLoaded = false;
				}
			} else {
				if (!searchMode) {
					searchFunction(episodeList);
					searchMode = true;
				}
			}
		});

	header.style.justifyContent = "space-around";
	liveSearch.style.maxHeight = "40%";
	liveSearch.style.margin = "2%";
	episodeSelector.style.maxHeight = "20%";
	episodeSelector.style.margin = "2%";
	searchResult.style.marginRight = "25%";

	document.getElementById("dropMenu").addEventListener("change", function () {
		let index = document.getElementById("dropMenu").selectedIndex;

		revealDropDownSearch(episodeList[parseInt(index) - 1]);
	});
}
function episodeCode(currentEpisode) {
	if (currentEpisode.season >= 10 && currentEpisode.number >= 10)
		return `S${currentEpisode.season}E${currentEpisode.number}`;
	else if (currentEpisode.season < 10 && currentEpisode.number < 10)
		return `S0${currentEpisode.season}E0${currentEpisode.number}`;
	else if (currentEpisode.season < 10 && currentEpisode.number >= 10)
		return `S0${currentEpisode.season}E${currentEpisode.number}`;
	else if (currentEpisode.season >= 10 && currentEpisode.number < 10)
		return `S${currentEpisode.season}E0${currentEpisode.number}`;
}
function refreshPage() {
	allEpisodeDiv.innerHTML = "";
}
function refreshHeader() {
	header.innerHTML = "";
}

function revealDropDownSearch(episode) {
	refreshPage();
	allEpisodeDiv = document.createElement("div");
	rootElem.appendChild(allEpisodeDiv);

	searchResult.innerText =
		"Displaying 1 / " + totalNumberOfEpisodes + " episodes ";

	episodeDiv = document.createElement("div");
	allEpisodeDiv.appendChild(episodeDiv);
	episodeName = document.createElement("h3");

	episodeName.innerHTML = episode.name + " - " + episodeCode(episode);

	episodeDiv.appendChild(episodeName);
	episodeImage = document.createElement("img");
	episodeImage.setAttribute("src", episode.image.medium);
	episodeDiv.appendChild(episodeImage);

	episodeSummary = document.createElement("p");
	episodeSummary.innerHTML = episode.summary;

	episodeDiv.appendChild(episodeSummary);
	episodeDiv.style.backgroundColor = "white";
	episodeDiv.style.margin = "10px";
	episodeDiv.style.marginLeft = "50px";
	episodeDiv.style.marginTop = "70px";

	episodeDiv.style.width = "25%";
	episodeDiv.style.display = "flex";
	episodeDiv.style.flexDirection = "column";
	episodeDiv.style.alignItems = "center";

	episodeName.style.border = "2px solid #BAC9A9";
	episodeName.style.borderRadius = "10px";
	episodeName.style.padding = "25px 0";

	episodeName.style.width = "100%";
	episodeName.style.textAlign = "center";
	episodeName.style.boxShadow = "1px 2px 3px grey";
	episodeImage.style.border = "5px";

	episodeSummary.style.padding = "0 30px";

	allEpisodeDiv.style.display = "flex";
	allEpisodeDiv.style.flexWrap = "wrap";
	allEpisodeDiv.style.paddingTop = "1%";

	allEpisodeDiv.style.backgroundColor = "#E8E8E8";
	makePageFooter();
}

function searchTheDropList() {
	let episodeSelector = document.createElement("select");
	episodeSelector.setAttribute("id", "dropMenu");
	header.appendChild(episodeSelector);
	for (var i = 0; i < episodeList.length; i++) {
		let option = document.createElement("option");
		option.value = episodeList[i];
		option.text = episodeCode(episodeList[i]) + " - " + episodeList[i].name;
		episodeSelector.appendChild(option);
	}
}
function loadAllEpisodes() {
	const allEpisodes = getAllEpisodes();
	totalNumberOfEpisodes = allEpisodes.length;
	makePageHeader(allEpisodes);
	makePageForEpisodes(allEpisodes);
}

function searchFunction(allEpisodes) {
	searchFlag = true;
	searchFoundCounter = 0;
	searchWord = document.getElementById("searchEpisode");
	allEpisodes.forEach((element, index) => {
		if (
			element.name.toLowerCase().includes(searchWord.value.toLowerCase()) ||
			element.summary.toLowerCase().includes(searchWord.value.toLowerCase())
		) {
			searchFoundCounter++;
			episodeFound.push(allEpisodes[index]);
		}
	});
	searchResult.innerHTML =
		"Displaying " +
		searchFoundCounter +
		" / " +
		totalNumberOfEpisodes +
		" episodes ";

	searchResult.style.visibility = "visible";
	refreshPage();
	let currentSearch = searchWord.value.toLowerCase();
	makePageForEpisodes(episodeFound, currentSearch);
}

function makePageForEpisodes(episodeList, keyWord) {
	allEpisodeDiv = document.createElement("div");
	rootElem.appendChild(allEpisodeDiv);
	if (searchFlag === false) {
		searchFoundCounter = totalNumberOfEpisodes;
	}
	searchResult.innerText =
		"Displaying " +
		searchFoundCounter +
		" / " +
		totalNumberOfEpisodes +
		" episodes ";

	episodeList.forEach((element) => {
		episodeDiv = document.createElement("div");
		allEpisodeDiv.appendChild(episodeDiv);
		episodeName = document.createElement("h3");

		episodeName.innerHTML = element.name + " - " + episodeCode(element);

		episodeDiv.appendChild(episodeName);
		episodeImage = document.createElement("img");
		episodeImage.setAttribute("src", element.image.medium);
		episodeDiv.appendChild(episodeImage);

		episodeSummary = document.createElement("p");
		episodeSummary.innerHTML = element.summary;

		episodeDiv.appendChild(episodeSummary);
		episodeDiv.style.backgroundColor = "white";
		episodeDiv.style.margin = "10px";
		episodeDiv.style.marginLeft = "50px";
		episodeDiv.style.marginTop = "70px";

		episodeDiv.style.width = "25%";
		episodeDiv.style.display = "flex";
		episodeDiv.style.flexDirection = "column";
		episodeDiv.style.alignItems = "center";

		episodeName.style.border = "2px solid #BAC9A9";
		episodeName.style.borderRadius = "10px";
		episodeName.style.padding = "25px 0";

		episodeName.style.width = "100%";
		episodeName.style.textAlign = "center";
		episodeName.style.boxShadow = "1px 2px 3px grey";
		episodeImage.style.border = "5px";

		episodeSummary.style.padding = "0 30px";

		allEpisodeDiv.style.display = "flex";
		allEpisodeDiv.style.flexWrap = "wrap";
		allEpisodeDiv.style.paddingTop = "1%";

		allEpisodeDiv.style.backgroundColor = "#E8E8E8";
	});
	makePageFooter();
}

function makePageFooter() {
	let pageFooter = document.createElement("footer");

	let dataOrigin = document.createElement("A");
	let originWeb = document.createTextNode("TVMaze.com");
	dataOrigin.setAttribute("href", "https://www.tvmaze.com/");
	dataOrigin.appendChild(originWeb);

	pageFooter.innerText = "The data has (originally) come from ";
	pageFooter.appendChild(dataOrigin);
	allEpisodeDiv.appendChild(pageFooter);

	pageFooter.style.margin = "0 30%  5% ";
	pageFooter.style.fontStyle = "italic";
	pageFooter.style.fontWeight = "900";
	pageFooter.style.fontSize = "25px";
	pageFooter.style.backgroundColor = "grey";
	pageFooter.style.color = "white";

	header.style.justifyContent = "space-around";

	liveSearch.style.maxHeight = "40%";
	liveSearch.style.marginTop = "2%";
	//episodeSelector.style.maxHeight = "40%";
	//episodeSelector.style.marginTop = "2%";

	searchResult.style.marginRight = "25%";
}

window.onload = setup;
