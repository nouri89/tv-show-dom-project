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
let allCurrentEpisodes;
let showName;
let showNameText;

function fetchSelectedShow(SHOW_ID) {
	fetch("https://api.tvmaze.com/shows/" + SHOW_ID + "/episodes")
		.then(function (response) {
			return response.json();
		})
		.then(function (loadAllEpisodes) {
			const allEpisodes = loadAllEpisodes;
			allCurrentEpisodes = allEpisodes;

			totalNumberOfEpisodes = allEpisodes.length;
			makePageHeader(allEpisodes);
			makePageForEpisodes(allEpisodes);
		})
		.catch(function (error) {
			console.log("could not fetch");
		});
}

function setup() {
	fetchSelectedShow(83);
	//	loadShowList();
}

function makePageHeader(episodeList) {
	//body.style.padding = "0";
	//body.style.margin = "0";
	if (searchFlag === false) {
		searchFoundCounter = totalNumberOfEpisodes;
	}
	rootElem = document.getElementById("root");
	header = document.createElement("header");

	let showOptions = getAllShows();
	showOptions.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	let returnToAllShow = document.createElement("button");
	let buttonText = document.createTextNode("Return to All Show");
	returnToAllShow.appendChild(buttonText);
	returnToAllShow.setAttribute("id", "returnButton");
	returnToAllShow.addEventListener("click", function () {
		refreshHeader();
		refreshPage();
		loadShowList();
	});

	header.appendChild(returnToAllShow);
	let showSelector = document.createElement("select");
	showSelector.setAttribute("id", "showMenu");
	header.appendChild(showSelector);

	let showOptionPrompt = document.createElement("option");
	showOptionPrompt.id = "noShowSelected";
	showOptionPrompt.value = "";
	showOptionPrompt.text = "Select a Show";
	showSelector.appendChild(showOptionPrompt);
	for (var k = 0; k < showOptions.length; k++) {
		let showOption = document.createElement("option");
		showOption.id = showOptions[k].id;
		showOption.value = showOptions[k].name;
		showOption.text = showOptions[k].name;
		showSelector.appendChild(showOption);
	}

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
	//liveSearch.style.margin = "1% 1%";
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
	//header.style.height = "100%";
	header.style.width = "100%";
	header.style.display = "flex";
	header.style.border = "none";
	header.style.borderRadius = "0";
	header.style.position = "fixed";
	header.style.border = "0.05px solid #E8E8E8";

	//header.style.marginBottom = "100px";
	header.style.backgroundColor = "#E8E8E8";
	searchResult.style.padding = "0";
	document.body.style.padding = "0";
	document.body.style.margin = "0";

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
	showSelector.style.maxHeight = "20%";
	showSelector.style.margin = "2%";
	episodeSelector.style.maxHeight = "20%";
	episodeSelector.style.margin = "2%";

	document.getElementById("dropMenu").addEventListener("change", function () {
		let index = document.getElementById("dropMenu").selectedIndex;

		revealDropDownSearch(episodeList[parseInt(index) - 1]);

		/*  if (parseInt(index) === 0) {
            console.log("got Here");

            allEpisodeDiv.innerHTML = "";
            makePageHeader(allCurrentEpisodes);
            makePageForEpisodes(allCurrentEpisodes);
        } else {
            revealDropDownSearch(episodeList[parseInt(index) - 1]);
        }*/
	});

	document.getElementById("showMenu").addEventListener("change", function () {
		let showIndex = document.getElementById("showMenu").selectedIndex;
		let SHOW_ID = showOptions[parseInt(showIndex) - 1].id;

		refreshHeader();
		refreshPage();
		fetchSelectedShow(SHOW_ID);
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
	allEpisodeDiv.style.paddingTop = "0";
	allEpisodeDiv.innerHTML = "";
	header.style.padding = "0";
}
function refreshHeader() {
	allEpisodeDiv.style.paddingTop = "0";
	header.style.padding = "0";
	header.innerHTML = "";
	header.style.padding = "0";
}

function revealDropDownSearch(episode) {
	//refreshHeader();
	refreshPage();

	header.style.padding = "0";

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

	//.style.backgroundColor = "green";

	episodeDiv.style.width = "25%";
	episodeDiv.style.display = "flex";
	episodeDiv.style.flexDirection = "column";
	episodeDiv.style.alignItems = "center";
	episodeDiv.style.border = "2px solid grey	";

	episodeName.style.border = "2px solid #BAC9A9";
	episodeName.style.borderRadius = "10px";
	episodeName.style.padding = "25px 0";

	episodeName.style.width = "100%";
	episodeName.style.textAlign = "center";
	episodeName.style.boxShadow = "1px 2px 3px grey";
	episodeImage.style.border = "2px solid grey";

	episodeSummary.style.padding = "0 30px";

	allEpisodeDiv.style.display = "flex";
	allEpisodeDiv.style.flexWrap = "wrap";
	allEpisodeDiv.style.backgroundColor = "#E8E8E8";
	allEpisodeDiv.style.border = "2px solid #E8E8E8";

	//allEpisodeDiv.style.backgroundColor = "#E8E8E8";
	makePageFooter();
}

function searchTheShowList() {
	let showSelector = document.createElement("select");
	showSelector.setAttribute("id", "showMenu");
	header.appendChild(showSelector);
	for (var i = 0; i < showOption.length; i++) {
		let option = document.createElement("option");
		option.value = showSelector[i];
		option.text = showSelector[i].name;
		episodeSelector.appendChild(option);
	}
}
/*
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
}*/
/*
function loadAllEpisodes() {
    const allEpisodes = getAllEpisodes();
    totalNumberOfEpisodes = allEpisodes.length;
    makePageHeader(allEpisodes);
    makePageForEpisodes(allEpisodes);
}
*/
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

		episodeImage = document.createElement("img");
		episodeImage.setAttribute("src", element.image.medium);
		episodeDiv.appendChild(episodeName);
		episodeDiv.appendChild(episodeImage);

		episodeSummary = document.createElement("p");
		episodeSummary.innerHTML = element.summary;

		episodeDiv.appendChild(episodeSummary);
		episodeDiv.style.backgroundColor = "white";
		episodeDiv.style.margin = "10px";
		episodeDiv.style.marginLeft = "50px";
		episodeDiv.style.marginTop = "50px";
		episodeDiv.style.border = "2px solid #E8E8E8";

		episodeDiv.style.width = "25%";
		episodeDiv.style.display = "flex";
		episodeDiv.style.flexDirection = "column";
		episodeDiv.style.alignItems = "center";

		episodeName.style.border = "1px solid #BAC9A9";
		episodeName.style.borderRadius = "5px";
		episodeName.style.paddingTop = "2px";

		episodeName.style.width = "100%";
		episodeName.style.textAlign = "center";
		episodeName.style.boxShadow = "1px 2px 3px grey";
		episodeImage.style.border = "2px solid green";

		episodeSummary.style.padding = "0 30px";

		allEpisodeDiv.style.display = "flex";
		allEpisodeDiv.style.flexWrap = "wrap";
		allEpisodeDiv.style.border = "0.05px solid black";
		allEpisodeDiv.style.paddingTop = "30px";

		allEpisodeDiv.style.backgroundColor = "#E8E8E8";
		episodeDiv.style.marginTop = "50px";
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

	//liveSearch.style.maxHeight = "40%";
	//liveSearch.style.marginTop = "2%";
	//episodeSelector.style.maxHeight = "40%";
	//episodeSelector.style.marginTop = "2%";

	//searchResult.style.marginRight = "25%";
}

function loadShowList() {
	//document.body.innerHTML = "";

	let numberOfShowsFound = 0;
	let allShows = getAllShows();
	let searchDiv = document.createElement("div");

	searchDiv.style.display = "flex";
	searchDiv.style.width = "100%";
	searchDiv.style.backgroundColor = "#E8E8E8";
	searchDiv.style.justifyContent = "space-around";
	searchDiv.style.padding = "5% 5%";
	//searchDiv.style.boxShadow = "1px 2px 3px grey";
	searchDiv.style.border = "0.5px solid #E8E8E8";

	searchDiv.setAttribute("id", "searchSowDiv");
	let filterLabel = document.createElement("h3");
	filterLabel.innerHTML = "Filtering For:";
	searchDiv.appendChild(filterLabel);

	let showSearch = document.createElement("INPUT");
	showSearch.setAttribute("type", "search");
	showSearch.setAttribute("id", "searchEpisode");
	showSearch.setAttribute("placeHolder", "Enter Your Search ");
	searchDiv.appendChild(showSearch);

	let foundLabel = document.createElement("p5");
	foundLabel.innerHTML = "found " + numberOfShowsFound + " shows";
	foundLabel.style.display = "none";
	searchDiv.appendChild(foundLabel);

	let showSelectorResult = document.createElement("select");
	showSelectorResult.setAttribute("id", "showList");
	searchDiv.appendChild(showSelectorResult);
	for (var i = 0; i < allShows.length; i++) {
		let options = document.createElement("option");
		options.id = allShows[i].id;
		options.value = allShows[i];
		options.text = allShows[i].name;
		showSelectorResult.appendChild(options);
	}
	searchDiv.appendChild(showSelectorResult);
	document.body.appendChild(searchDiv);

	allShows.forEach((element) => {
		let singleShowDiv = document.createElement("div");

		singleShowDiv.style.boxShadow = "10px 20px 30px grey";
		singleShowDiv.style.border = "1px solid #E8E8E8";
		singleShowDiv.style.backgroundColor = " #E8E8E8";
		showName = document.createElement("h1");

		showName.innerHTML = element.name;

		showName.setAttribute("id", element.id);
		//showName.setAttribute("value", element);

		singleShowDiv.appendChild(showName);
		showName.addEventListener("click", function () {
			showTheEpisodes(element.id);
		});
		showName.addEventListener("mouseover", function () {
			changNameColor();
		});
		showName.addEventListener("click", function () {
			showTheEpisodes(element.id);
		});

		//document.getElementById("h1").addEventListener("change", function () {
		//fetchSelectedShow(167);
		//});

		let infoDiv = document.createElement("div");
		singleShowDiv.appendChild(infoDiv);

		let showImage = document.createElement("img");
		showImage.setAttribute("src", element.image.medium);
		showImage.style.padding = "3%";
		infoDiv.appendChild(showImage);

		let showSummary = document.createElement("p");
		showSummary.innerHTML = element.summary;
		showSummary.style.padding = "2%";
		infoDiv.appendChild(showSummary);
		let showInfo = document.createElement("div");
		showInfo.style.display = "flex";
		showInfo.style.flexDirection = "column";
		showInfo.style.padding = "2%";
		showInfo.style.border = "0.5px solid #E8E8E8";
		let showGenres = document.createElement("h3");
		showGenres.innerHTML = "Genres: " + element.genres.join("|");
		showInfo.appendChild(showGenres);
		let showStatus = document.createElement("h3");
		showStatus.innerHTML = "status: " + element.status;
		showInfo.appendChild(showStatus);
		let showRating = document.createElement("h3");
		showRating.innerHTML = "Rating: " + element.rating.average;
		showInfo.appendChild(showRating);
		let showRuntime = document.createElement("h3");
		showRuntime.innerHTML = "Run Time: " + element.runtime;
		showInfo.appendChild(showRuntime);
		infoDiv.style.display = "flex";
		infoDiv.style.justifyContent = "space-around";
		infoDiv.style.boxShadow = "1px 2px 3px grey";

		infoDiv.appendChild(showInfo);
		document.body.appendChild(singleShowDiv);
		/*
		showName.addEventListener("onmouseover", function () {
			singleShowDiv.style.color = "red";
		});
		showName.addEventListener("click", function () {
			//singleShowDiv.style.color = "yellow";
			//document.body.innerHTML = "";
			//fetchSelectedShow(167);
			//singleShowDiv.style.backgroundColor = " yellow";
		});*/
	});
	function changNameColor() {
		document.getElementsByTagName("h1").style.cursor = "pointer";
	}
	function showTheEpisodes(id) {
		fetchSelectedShow(id);
		//console.log(id);
		//document.body.style.backgroundColor = "pink";
	}
	document.getElementById(82).style.color = "pink";
}

window.onload = setup;
