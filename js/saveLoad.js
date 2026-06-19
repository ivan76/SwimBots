"use strict";

const InputMode = {
	NULL: -1,
	LOAD_SWIMBOT_FROM_PRESET: 0,
	SAVE_SWIMBOT: 2,
	LOAD_POOL_FROM_PRESET: 3,
	SAVE_POOL: 5
};

let _inputFilenameString = "";
let _inputMode = InputMode.NULL;
let _chosenPoolToLoad = 0;

function addToFilenameInputString(e) {
	_inputFilenameString = e.currentTarget.value;

	if (e.key === 'Enter') {
		submitFilenameInput();
	}
}

function submitFilenameInput() {
	// File-based save/load is handled through the data display panel.
	// Firebase backend was removed — presets and JSON export/import remain.
	_inputMode = InputMode.NULL;
}

function printFamilyTree() {
	SwimbotsApp.genePool.generatePhyloTree();

	let w = window.open(
		"",
		"swimbot data",
		"left=400, top=100, width=600, height=700, status=0, resizable=0, channelmode=0, menubar=0, toolbar=0, location=0, titlebar=0"
	);

	w.document.title = "Swimbot Data (copy and paste into a text file, then load into Gene Pool Lab)";

	let familyTree = SwimbotsApp.genePool.getFamilyTree();

	let f = "";

	const THROTTLE = 5;

	for (let n = 0; n < familyTree.getNumNodes(); n += THROTTLE) {
		f += "swimbot index: " + n.toString();
		f += "<br>";
		f += "parent 1 index: " + familyTree.getNodeParent1Index(n).toString();
		f += "<br>";
		f += "parent 2 index: " + familyTree.getNodeParent2Index(n).toString();
		f += "<br>";
		f += "birth time: " + familyTree.getNodeBirthTime(n).toString();
		f += "<br>";
		f += "death time: " + familyTree.getNodeDeathTime(n).toString();
		f += "<br>";
		f += "genes: ";
		f += "<br>";

		let genes = familyTree.getNodeGenes(n);

		for (let g = 0; g < genes.length; g++) {
			f += genes[g].toString();
			if (g < genes.length - 1) {
				f += ", ";
			}
		}

		f += "<br>";
		f += "<br>";
	}

	w.document.body.innerHTML = f;
}

function loadPool() {
	switchToChosenPresetPool();
}

function openPopupPanelForInput(text, mode) {
	_inputMode = mode;

	// make sure these are turned off
	document.getElementById('noSavePopUpPanelButton').style.visibility = "hidden";
	document.getElementById('savePopUpPanelButton').style.visibility = "hidden";
	document.getElementById('dataDisplayButton').style.visibility = "hidden";

	// turn these on
	document.getElementById('popUpPanel').style.visibility = "visible";
	document.getElementById('cancelPopUpPanelButton').style.visibility = "visible";
	document.getElementById('popUpPanelInput').style.visibility = "visible";
	document.getElementById('submitFilenameButton').style.visibility = "visible";

	// give focus to the input
	document.getElementById("popUpPanelInput").focus();

	// default case...
	document.getElementById("popUpPanelInput").style.top = "185px";
	document.getElementById("submitFilenameButton").style.top = "185px";

	if (_inputMode === InputMode.SAVE_SWIMBOT) {
		document.getElementById("loadedList").style.visibility = "hidden";

		document.getElementById("PopupText").style.visibility = "visible";
		document.getElementById("PopupText").innerHTML = text +
			"<br>" +
			"<br>" +
			"Name this swimbot...";

		// give user option to display data...
		document.getElementById('dataDisplayButton').style.visibility = "visible";
	}

	// clear-out input string...
	_inputFilenameString = "";
	document.getElementById('popUpPanelInput').value = '';
}

function displayData(filename) {
	if (_inputMode === InputMode.SAVE_SWIMBOT) {
		showSwimbotGenes(SwimbotsApp.genePool.getSelectedSwimbotID());
	} else if (_inputMode === InputMode.SAVE_POOL) {

		let pool = SwimbotsApp.genePool.getPoolData();
		let json = JSON.stringify({ pool });

		document.getElementById('dataDisplay').style.visibility = "visible";
		document.getElementById('closeDataDisplay').style.visibility = "visible";
		document.getElementById('dataDisplay').innerHTML = "Copy the text below, put it in a new text file, and then give" +
			"<br>" +
			"the file a unique name ending in '.json' (example: 'my_pool.json')" +
			"<br>" +
			"<br>" +
			"_________________" +
			"<br>" +
			"<br>" +
			json;
	}
}

function showSwimbotGenes(s) {
	if (s != -1) {
		let genes = SwimbotsApp.genePool.getSwimbotGenes(s);
		let json = JSON.stringify({ genes });

		document.getElementById('dataDisplay').style.visibility = "visible";
		document.getElementById('closeDataDisplay').style.visibility = "visible";
		document.getElementById('dataDisplay').innerHTML = "<br>" +
			"<big><b>Save genes of swimbot " + s.toString() + "</b></big>" +
			"<br>" +
			"<br>" +
			"Please copy the genetic data below and put it in an " +
			"<br>" +
			"empty text file. Give it a cool name and save it." +
			"<br>" +
			"<br>" +
			"This is formatted as JSON, which is required " +
			"<br>" +
			"for it to be loaded back into the pool." +
			"<br>" +
			"<br>" +
			"<br>" +
			"<br>" +
			json;
	}
}

function closeDataDisplay() {
	document.getElementById('dataDisplay').style.visibility = "hidden";
	document.getElementById('closeDataDisplay').style.visibility = "hidden";
}
