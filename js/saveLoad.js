"use strict";

// -----------------------------------------------------------------------
// Save / Load via JSON .txt files (no backend)
// -----------------------------------------------------------------------

let _chosenPoolToLoad = 0;

// ---------------------
// Pool export / import
// ---------------------

function requestToSavePool() {
	exportPoolToFile();
}

function requestToLoadPoolFromFile() {
	document.getElementById('fileInput').click();
}

function exportPoolToFile() {
	let pool = SwimbotsApp.genePool.getPoolData();
	let data = JSON.stringify({ type: "pool", pool: pool }, null, 2);
	downloadFile(data, "pool_" + _getTimestampFilename() + ".txt", "text/plain");
}

function readLocalFile(event) {
	let file = event.target.files[0];
	if (!file) return;

	let reader = new FileReader();
	reader.onload = function (e) {
		try {
			let parsed = JSON.parse(e.target.result);
			if (parsed.type !== "pool") {
				alert("This file does not contain pool data.");
				return;
			}
			SwimbotsApp.genePool.setPoolData(parsed.pool);
		} catch (err) {
			alert("Error parsing pool file: " + err.message);
		}
	};
	reader.readAsText(file);

	// Reset so the same file can be re-selected
	event.target.value = "";
}

// -----------------------
// Swimbot export / import
// -----------------------

function requestToSaveSwimbot() {
	let state = _getSimState();
	if (state) {
		exportSwimbotToFile(state.selectedSwimbotID);
	}
}

function requestToLoadSwimbotFromFile() {
	document.getElementById('swimbotFileInput').click();
}

function exportSwimbotToFile(swimbotID) {
	if (swimbotID == -1) return;

	let genes = Array.from(SwimbotsApp.genePool.getSwimbotGenes(swimbotID));
	let data = JSON.stringify({ type: "swimbot", genes: genes }, null, 2);
	downloadFile(data, "swimbot_genes_" + _getTimestampFilename() + ".txt", "text/plain");
}

function readSwimbotFile(event) {
	let file = event.target.files[0];
	if (!file) return;

	let reader = new FileReader();
	reader.onload = function (e) {
		try {
			let parsed = JSON.parse(e.target.result);
			if (parsed.type !== "swimbot" || !Array.isArray(parsed.genes)) {
				alert("This file does not contain valid swimbot gene data.");
				return;
			}
			SwimbotsApp.genePool.createNewSwimbotWithGenes(parsed.genes);
		} catch (err) {
			alert("Error parsing swimbot gene file: " + err.message);
		}
	};
	reader.readAsText(file);

	// Reset so the same file can be re-selected
	event.target.value = "";
}

// ---------------------
// Utility: trigger download
// ---------------------

function downloadFile(content, filename, mimeType) {
	let blob = new Blob([content], { type: mimeType });
	let url = URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
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

function showSwimbotGenes(s) {
	if (s != -1) {
		exportSwimbotToFile(s);
	}
}

function closeDataDisplay() {
	document.getElementById('dataDisplay').style.visibility = "hidden";
	document.getElementById('closeDataDisplay').style.visibility = "hidden";
}