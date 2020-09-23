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
let episodeBanner;
let allShows;
let shows;
let SHOW_ID;
let bannerName;
let showFoundCounter;
let singleShowDiv;
let searchDiv;
let currentEpisodeHeader;
let showContainer;
let searchedWord = "";
let showLisIndex;

function fetchSelectedShow(showIdNumber) {
	//console.log("got to the fetch function");
	fetch(`https://api.tvmaze.com/shows/${showIdNumber}/episodes`)
		.then(function (response) {
			return response.json();
		})
		.then(function (loadAllEpisodes) {
			const allEpisodes = loadAllEpisodes;
			allCurrentEpisodes = allEpisodes;

			totalNumberOfEpisodes = allEpisodes.length;
			makePageHeader(allEpisodes);
			makePageForEpisodes(allEpisodes);
			let bannerTitle = setBannerTitle(showIdNumber);
			SHOW_ID = showIdNumber;
			currentEpisodeHeader.innerHTML = bannerTitle;
			console.log(bannerTitle);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function setup() {
	loadAllShowList();
	//fetchSelectedShow(82);
}

function makePageHeader(episodeList) {
	if (searchFlag === false) {
		searchFoundCounter = totalNumberOfEpisodes;
	}
	rootElem = document.getElementById("root");
	header = document.createElement("header");
	let showOptions = getAllShows();
	showOptions.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});
	let returnToAllShow = document.createElement("button"); //------------------------------------------1
	let buttonText = document.createTextNode("Return to All Show");
	returnToAllShow.appendChild(buttonText);
	returnToAllShow.setAttribute("id", "returnButton");
	returnToAllShow.style.margin = "5%";
	returnToAllShow.addEventListener("click", function () {
		//===========================working fine
		header.style.display = "none";
		allEpisodeDiv.style.display = "none";
		loadAllShowList();
	});
	header.appendChild(returnToAllShow);
	let showSelector = document.createElement("select"); //---------------------------------------------------2
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
	let episodeSelector = document.createElement("select"); //-----------------------------------------------3
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
	liveSearch = document.createElement("INPUT"); //---------------------------------------------------------4
	liveSearch.setAttribute("type", "search");
	liveSearch.setAttribute("id", "searchEpisode");
	header.appendChild(liveSearch);
	liveSearch.placeholder = "Live Search";
	searchResult = document.createElement("h3"); //----------------------------------------------------------5
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
	header.style.flexWrap = "wrap";
	header.style.border = "none";
	header.style.borderRadius = "0";
	document.body.style.padding = "0";
	document.body.style.margin = "0";
	header.style.position = "fixed";
	//	header.style.border = "0.05px solid #E8E8E8";
	header.style.backgroundColor = "#E8E8E8";

	document
		.getElementById("searchEpisode")
		.addEventListener("search", function () {
			// =============================== TBL@
			console.log(document.getElementById("searchEpisode").value);

			if (document.getElementById("searchEpisode").value === "") {
				searchFoundCounter = totalNumberOfEpisodes;
				refreshHeader();
				refreshPage();
				setup();
				searchMode = false;
				allPagesAreLoaded = true;
			} else {
				searchFunction(episodeList);
				searchMode = true;
			}
		});
	liveSearch.style.maxHeight = "40%";
	liveSearch.style.margin = "2%";
	showSelector.style.maxHeight = "20%";
	showSelector.style.margin = "2%";
	episodeSelector.style.maxHeight = "20%";
	episodeSelector.style.margin = "2%";
	returnToAllShow;
	returnToAllShow.style.maxHeight = "40%";
	returnToAllShow.style.margin = "2%";
	episodeBanner = document.createElement("div");
	header.appendChild(episodeBanner);
	episodeBanner.style.width = "100%";

	episodeBanner.style.backgroundColor = "black";
	episodeBanner.style.color = "white";
	episodeBanner.style.maxHeight = "30%";

	currentEpisodeHeader = document.createElement("h3");

	currentEpisodeHeader.style.textAlign = "center";
	currentEpisodeHeader.innerHTML = setBannerTitle(SHOW_ID);
	episodeBanner.appendChild(currentEpisodeHeader);

	document.getElementById("dropMenu").addEventListener("change", function () {
		//============= working
		let index = document.getElementById("dropMenu").selectedIndex;
		console.log("episodeSearch drop Menu");
		revealEpisodeSearch(episodeList[parseInt(index) - 1]);
	});
	document.getElementById("showMenu").addEventListener("change", function () {
		//===============working
		let showIndex = document.getElementById("showMenu").selectedIndex;
		let currentShowID = showOptions[parseInt(showIndex) - 1].id;

		refreshHeader();
		refreshPage();
		currentEpisodeHeader.innerHTML = setBannerTitle(currentShowID);

		fetchSelectedShow(currentShowID);
	});
}
function setBannerTitle(currentID) {
	let allShow = getAllShows();
	let temp;
	allShow.forEach((element) => {
		if (element.id === currentID) {
			temp = element.name;
		}
	});
	return temp;
}

function getCurrentShowName(currentID) {
	return "Game of Thorn";
}
function updateEpisodeBanner() {}

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
	allEpisodeDiv.style.paddingTop = "0px";
	allEpisodeDiv.innerHTML = "";
	header.style.padding = "0";
}
function refreshHeader() {
	//allEpisodeDiv.style.paddingTop = "0";
	header.style.padding = "0";
	header.innerHTML = "";
	header.style.padding = "0";
}

function revealEpisodeSearch(episode) {
	refreshPage();
	//header.style.padding = "0";
	allEpisodeDiv = document.createElement("div");
	allEpisodeDiv.style.paddingTop = "15%";
	rootElem.appendChild(allEpisodeDiv);
	searchResult.innerText =
		"Displaying 1 / " + totalNumberOfEpisodes + " episodes ";
	episodeDiv = document.createElement("div");
	allEpisodeDiv.appendChild(episodeDiv);
	episodeName = document.createElement("h2");
	episodeName.innerHTML = episode.name + " - " + episodeCode(episode);
	episodeDiv.appendChild(episodeName);
	episodeImage = document.createElement("img");

	if (episode.image === null) {
		episodeImage.setAttribute(
			"src",
			"https://epaper.tarunbharat.net/images/not_found.png"
		);
	} else {
		episodeImage.setAttribute("src", episode.image.medium);
	}
	//episodeImage.setAttribute("src", episode.image.medium);
	episodeImage.style.height = "50%";
	episodeImage.style.width = "50%";
	episodeDiv.appendChild(episodeImage);
	episodeSummary = document.createElement("p");
	episodeSummary.innerHTML = episode.summary;
	episodeSummary.style.fontSize = "20px";
	episodeSummary.style.margin = "0 25%";
	episodeDiv.appendChild(episodeSummary);
	episodeDiv.style.width = "100%";
	episodeDiv.style.display = "flex";
	episodeDiv.style.flexDirection = "column";
	episodeDiv.style.alignItems = "center";
	episodeName.style.borderRadius = "10px";
	episodeName.style.width = "100%";
	episodeName.style.textAlign = "center";
	episodeName.style.boxShadow = "1px 2px 3px grey";
	episodeDiv.style.boxShadow = "1px 2px 3px grey";
	allEpisodeDiv.style.display = "flex";
	allEpisodeDiv.style.flexWrap = "wrap";
	makePageFooter();
}

function searchTheShowList() {
	let showSelector = document.createElement("select");
	showSelector.setAttribute("id", "showMenu");
	header.appendChild(showSelector);
	for (var i = 0; i < showOption.length; i++) {
		let option = document.createElement("option");
		option.value = showSelector[i];
		option.text = showSelector[i].name + " -here";
		episodeSelector.appendChild(option);
	}
}

function searchFunction(allEpisodes) {
	searchFlag = true;
	searchFoundCounter = 0;
	searchWord = document.getElementById("searchEpisode");
	allEpisodes.forEach((element, index) => {
		if (
			element.name.toLowerCase().search(searchWord.value.toLowerCase()) >= 0 ||
			element.summary.toLowerCase().search(searchWord.value.toLowerCase()) >= 0
		) {
			console.log("searchfound");
			searchFoundCounter++;
			episodeFound.push(allEpisodes[index]);
		}
	});
	if (episodeFound.length === 0) {
		currentEpisodeHeader.innerHTML = "No result found";
	}
	console.log(episodeFound.length + " all Episodes length");
	searchResult.innerHTML =
		"Displaying " +
		searchFoundCounter +
		" / " +
		totalNumberOfEpisodes +
		" episodes ";

	//searchResult.style.visibility = "visible";
	refreshPage();
	let currentSearch = searchWord.value.toLowerCase();
	makePageForEpisodes(episodeFound, currentSearch);
}

function makePageForEpisodes(episodeList) {
	allEpisodeDiv = document.createElement("div");
	rootElem.appendChild(allEpisodeDiv);
	allEpisodeDiv.style.paddingTop = "12%";

	if (searchFlag === false) {
		searchFoundCounter = totalNumberOfEpisodes;
	}
	searchResult.innerText =
		"Displaying " +
		searchFoundCounter +
		" / " +
		totalNumberOfEpisodes +
		" episodes ";
	if (episodeList.length === 0) {
		episodeDiv = document.createElement("div");
		allEpisodeDiv.appendChild(episodeDiv);
		episodeImage = document.createElement("img");
		episodeImage.setAttribute(
			"src",
			"https://static.dribbble.com/users/1554526/screenshots/3399669/no_results_found.png"
		);
		allEpisodeDiv.appendChild(episodeImage);
		episodeImage.style.marginLeft = "25%";
		return;
	} else {
		episodeList.forEach((element) => {
			episodeDiv = document.createElement("div");
			allEpisodeDiv.appendChild(episodeDiv);
			episodeName = document.createElement("h3");

			episodeName.innerHTML = element.name + " - " + episodeCode(element);

			episodeImage = document.createElement("img");
			if (element.image === null) {
				episodeImage.setAttribute(
					"src",
					"https://epaper.tarunbharat.net/images/not_found.png"
				);
				episodeImage.style.maxHeight = "50%";
				episodeImage.style.maxWidth = "50%";
			} else {
				episodeImage.setAttribute("src", element.image.medium);
			}

			episodeDiv.appendChild(episodeName);
			episodeDiv.appendChild(episodeImage);

			episodeSummary = document.createElement("p");
			episodeSummary.innerHTML = element.summary;

			episodeDiv.appendChild(episodeSummary);
			episodeDiv.style.backgroundColor = "white";
			episodeDiv.style.margin = "10px";
			episodeDiv.style.marginLeft = "50px";
			//episodeDiv.style.marginTop = "50px";
			episodeDiv.style.border = "2px solid #E8E8E8";

			episodeDiv.style.width = "25%";
			episodeDiv.style.display = "flex";
			episodeDiv.style.flexDirection = "column";
			episodeDiv.style.alignItems = "center";

			episodeName.style.border = "1px solid #BAC9A9";
			episodeName.style.borderRadius = "5px";
			//episodeName.style.paddingTop = "2px";

			episodeName.style.width = "100%";
			episodeName.style.textAlign = "center";
			episodeName.style.boxShadow = "1px 2px 3px grey";
			//episodeImage.style.border = "2px solid green";

			episodeSummary.style.padding = "0 30px";
			episodeSummary.style.fontSize = "large";

			allEpisodeDiv.style.display = "flex";
			allEpisodeDiv.style.flexWrap = "wrap";

			allEpisodeDiv.style.backgroundColor = "#E8E8E8";
			//	episodeDiv.style.marginTop = "50px";
		});
		makePageFooter();
	}
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

	//header.style.justifyContent = "space-around";
}
//|====================================================================================|\\
// | 								SHOW SECTION										  | \\
//  |====================================================================================|  \\

function loadAllShowList() {
	allShows = getAllShows();
	loadShowList(allShows);
}
function refreshShow() {}

function loadShowList(shows) {
	refreshShow();
	let numberOfShowsFound = 0;
	searchDiv = document.createElement("div");
	searchDiv.style.display = "flex";
	searchDiv.style.display = "fixed";
	document.body.style.padding = "0";
	document.body.style.margin = "0";
	searchDiv.style.width = "100%";
	searchDiv.style.backgroundColor = "#E8E8E8";
	searchDiv.style.justifyContent = "space-around";

	searchDiv.style.paddingTop = "0";
	searchDiv.style.position = "fixed";
	//searchDiv.style.padding = "0";

	//searchDiv.style.boxShadow = "1px 2px 3px grey";
	searchDiv.style.border = "0.5px solid #E8E8E8";
	searchDiv.setAttribute("id", "searchSowDiv");
	let filterLabel = document.createElement("h3");
	filterLabel.style.margin = "3% 0 3% 40%";
	filterLabel.innerHTML = "Filtering For:";
	searchDiv.appendChild(filterLabel);
	let showSearch = document.createElement("INPUT");
	showSearch.setAttribute("type", "search");
	showSearch.setAttribute("id", "searchShow");
	showSearch.setAttribute("placeHolder", "Enter Your Search ");
	showSearch.style.margin = "3% 0";
	searchDiv.appendChild(showSearch);
	let foundLabel = document.createElement("h3");
	foundLabel.style.margin = "3% 0";
	let currentSearchedWord = "";
	foundLabel.innerText =
		"Found " + shows.length + " " + currentSearchedWord + " shows";
	showSearch.addEventListener("search", function () {
		searchedWord = currentSearchedWord = document.getElementById("searchShow")
			.value;
		//showSearchMode = true;
		searchShowList();
	});

	searchDiv.appendChild(foundLabel);

	let showSelectorResult = document.createElement("select");
	showSelectorResult.setAttribute("id", "showList");
	showSelectorResult.style.margin = "3% 0";
	searchDiv.appendChild(showSelectorResult);
	shows.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	for (var i = 0; i < shows.length; i++) {
		let options = document.createElement("option");
		options.id = shows[i].id;
		options.value = shows[i];
		options.text = shows[i].name;
		showSelectorResult.appendChild(options);
	}
	//=============================================================================
	showSelectorResult.addEventListener("change", function () {
		showLisIndex = document.getElementById("showList").selectedIndex;
		let selectedShow = shows[parseInt(showLisIndex)].id;

		//	console.log("got to the show list");
		console.log(selectedShow);
		showContainer.style.display = "none";
		searchDiv.style.display = "none";
		fetchSelectedShow(selectedShow);
	});
	//=====================================================================================
	searchDiv.appendChild(showSelectorResult);
	//document.body.appendChild(searchDiv);
	showContainer = document.createElement("div");
	shows.forEach((element) => {
		singleShowDiv = document.createElement("div");

		singleShowDiv.style.boxShadow = "10px 20px 30px grey";
		singleShowDiv.style.border = "1px solid #E8E8E8";
		singleShowDiv.style.backgroundColor = " #E8E8E8";

		showName = document.createElement("A");
		let showLinkName = document.createTextNode(element.name);
		//let showLinkName = document.createTextNode(element.name);
		showName.setAttribute("href", "#");
		showName.appendChild(showLinkName);
		showName.style.textDecoration = "none";
		showName.style.color = "#B0271F";
		showName.style.fontWeight = "700";
		showName.style.fontSize = "25px";

		//	showName.innerHTML = element.name;

		//showName.setAttribute("id", element.id);
		//showName.style.border = "1px solid black";
		showName.style.margin = "5% 20%";
		//singleShowDiv.style.border = "0.5px solid #E8E8E8";
		singleShowDiv.style.borderRadius = "12px";
		singleShowDiv.appendChild(showName);
		singleShowDiv.style.paddingTop = "8%";
		showContainer.style.display = "flex";
		showContainer.style.flexDirection = "column";
		//showContainer.style.backgroundColor = "green";
		showContainer.style.padding = "0";

		showContainer.appendChild(searchDiv);
		showContainer.appendChild(singleShowDiv);

		function fetchShow() {
			showContainer.style.display = "none";
			//searchDiv.style.display = "none";
			console.log(element.id);
			fetchSelectedShow(element.id);
		}
		//================================================================================================
		showName.addEventListener("click", function () {
			showContainer.style.display = "none";
			//searchDiv.style.display = "none";
			console.log(element.id);
			fetchSelectedShow(element.id);
		});
		//==========================================================================================================
		let infoDiv = document.createElement("div");
		singleShowDiv.appendChild(infoDiv);
		infoDiv.style.borderRadius = "15px";
		let showImage = document.createElement("img");
		if (element.image === null) {
			showImage.setAttribute(
				"src",
				"https://epaper.tarunbharat.net/images/not_found.png"
			);
		} else {
			showImage.setAttribute("src", element.image.medium);
		}

		showImage.style.borderRadius = "10px";
		infoDiv.appendChild(showImage);

		let showSummary = document.createElement("p");
		showSummary.innerHTML = element.summary;
		showSummary.style.margin = "0 10%";
		infoDiv.appendChild(showSummary);
		let showInfo = document.createElement("div");
		showInfo.style.width = "150%";
		let showGenres = document.createElement("h4");
		showGenres.innerHTML = "Genres: " + element.genres.join(" | ");
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
		infoDiv.style.margin = "0 20%";
		//	infoDiv.style.border = "1px solid black";

		infoDiv.appendChild(showInfo);
		document.body.appendChild(showContainer);
	});
	function changNameColor() {
		document.getElementsByTagName("h1").style.cursor = "pointer";
	}
	function showTheEpisodes(id) {
		//console.log(id);
		//document.body.style.backgroundColor = "pink";
	}
}

function searchShowList() {
	showFoundCounter = 0;
	let showFound = [];
	let showSearchWord = document.getElementById("searchShow");

	allShows.forEach((element, index) => {
		if (
			element.name.toLowerCase().includes(showSearchWord.value.toLowerCase()) ||
			element.genres.forEach((item) => {
				if (item.toLowerCase().includes(showSearchWord.value.toLowerCase())) {
					showFoundCounter++;
					showFound.push(allShows[index]);
				}
			})
		) {
			showFoundCounter++;
			showFound.push(allShows[index]);
		}
	});
	console.log(showFound.length);

	showContainer.style.display = "none";
	searchDiv.style.display = "none";
	loadShowList(showFound);
}
function loadTheSearchedShow(showList) {}

window.onload = setup;
