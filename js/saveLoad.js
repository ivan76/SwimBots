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
	$('fileInput').click();
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
	$('swimbotFileInput').click();
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

function showSwimbotGenes(s) {
	if (s != -1) {
		exportSwimbotToFile(s);
	}
}

function closeDataDisplay() {
	$('dataDisplay').style.visibility = "hidden";
	$('closeDataDisplay').style.visibility = "hidden";
}