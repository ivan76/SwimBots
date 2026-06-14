"use strict";

const FIRST_INFO_PAGE = 1;
const LAST_INFO_PAGE = 28;

const DEFAULT_BASIC_PANEL_COLOR = "#caccc2";
const DEFAULT_BASIC_BUTTON_COLOR = "#dadad0";
const DEFAULT_BASIC_BUTTON_BORDER_COLOR = "#7f7f77";
const ACTIVE_BORDER_COLOR = '#ffffff';

const UI_UPDATE_PERIOD = 500;

let _currentInfoPage = FIRST_INFO_PAGE;
let _graph = new Graph();
let _tweakGenesCategory = 0;
let _runningFast = false;

// Global simulation instance (used by inline HTML handlers)
var genePool; // alias - will point to SwimbotsApp.genePool

function setupNavigationButtons() {
	const navButtons = [
		{ id: "leftNav", action: CameraNavigationAction.LEFT },
		{ id: "rightNav", action: CameraNavigationAction.RIGHT },
		{ id: "upNav", action: CameraNavigationAction.UP },
		{ id: "downNav", action: CameraNavigationAction.DOWN },
		{ id: "inNav", action: CameraNavigationAction.IN },
		{ id: "outNav", action: CameraNavigationAction.OUT }
	];

	for (let i = 0; i < navButtons.length; i++) {
		let btn = document.getElementById(navButtons[i].id);
		if (!btn) continue;

		btn.addEventListener("mousedown", function() {
			genePool.startCameraNavigation(navButtons[i].action);
			clearViewModeButtons();
		});

		btn.addEventListener("mouseup", function() {
			genePool.stopCameraNavigation(navButtons[i].action);
		});

		btn.addEventListener("mouseleave", function() {
			genePool.stopCameraNavigation(navButtons[i].action);
		});
	}
}

//----------------------------
function initGenePool() {
	SwimbotsApp.genePool = new GenePool();
	genePool = SwimbotsApp.genePool; // alias for legacy compatibility
	genePool.setCanvas(SwimbotsApp.canvas);
	resize();
	genePool.setCanvasDimensions(SwimbotsApp.canvasID.width, SwimbotsApp.canvasID.height);
	genePool.initialize();
	setupNavigationButtons();
	initializeUI();
}

document.addEventListener("DOMContentLoaded", initGenePool);
window.addEventListener("resize", resize);


//----------------------------
function initializeUI() {
	initializeEcosystemUI();

	_graph.initialize();

	attachEventListeners();

	// This starts an update loop that is called
	// periodically to adjust UI states and stuff.
	_lastUIUpdateTime = 0;
	updateUI();
}

function chooseAttraction() {
	let radioButtons = document.getElementsByName('attractionRadioButton');

	for (let i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].type === 'radio') {
			if (radioButtons[i].checked) {
				let value = radioButtons[i].value;
				let attraction = ATTRACTION_SIMILAR_COLOR;

				if (value === "colorful") { attraction = ATTRACTION_COLORFUL; } else if (value === "big") { attraction = ATTRACTION_BIG; } else if (value === "hyper") { attraction = ATTRACTION_HYPER; } else if (value === "long") { attraction = ATTRACTION_LONG; } else if (value === "straight") { attraction = ATTRACTION_STRAIGHT; } else if (value === "noColor") { attraction = ATTRACTION_NO_COLOR; } else if (value === "small") { attraction = ATTRACTION_SMALL; } else if (value === "still") { attraction = ATTRACTION_STILL; } else if (value === "short") { attraction = ATTRACTION_SHORT; } else if (value === "crooked") { attraction = ATTRACTION_CROOKED; } else if (value === "similarColor") { attraction = ATTRACTION_SIMILAR_COLOR; } else if (value === "similarSize") { attraction = ATTRACTION_SIMILAR_SIZE; } else if (value === "similarHyper") { attraction = ATTRACTION_SIMILAR_HYPER; } else if (value === "similarLength") { attraction = ATTRACTION_SIMILAR_LENGTH; } else if (value === "similarStraight") { attraction = ATTRACTION_SIMILAR_STRAIGHT; } else if (value === "random") { attraction = ATTRACTION_RANDOM; } else if (value === "closest") { attraction = ATTRACTION_CLOSEST; }

				genePool.setAttraction(attraction);
			}
		}
	}
}

function openTweakPanel() {
	document.getElementById('tweakPanel').style.visibility = 'visible';
	document.getElementById('tweakDefaultButton').style.visibility = 'visible';
	updateEcosystemUI();
}

function setEcosystemValue(id) {
	let input = document.getElementById(id);

	if (id === "foodGrowthDelaySlider") { genePool.setFoodGrowthDelay(input.value); } else if (id === "foodSpreadSlider") { genePool.setFoodSpread(input.value); } else if (id === "foodBitEnergySlider") { genePool.setFoodBitEnergy(input.value); } else if (id === "hungerThresholdSlider") { genePool.setHungerThreshold(input.value); } else if (id === "energyToOffspringSlider") { genePool.setOffspringEnergyRatio(input.value); } else if (id === "maxAgeSlider") { genePool.setMaximumSwimbotAge(input.value); }

	updateEcosystemUI();
}

function setEcosystemToDefaults() {
	genePool.setFoodGrowthDelay(DEFAULT_FOOD_REGENERATION_PERIOD);
	genePool.setFoodSpread(DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS);
	genePool.setFoodBitEnergy(DEFAULT_FOOD_BIT_ENERGY);
	genePool.setHungerThreshold(DEFAULT_SWIMBOT_HUNGER_THRESHOLD);
	genePool.setOffspringEnergyRatio(DEFAULT_CHILD_ENERGY_RATIO);
	genePool.setMaximumSwimbotAge(DEFAULT_MAXIMUM_LIFESPAN);

	updateEcosystemUI();
}

function initializeEcosystemUI() {
	document.getElementById('foodGrowthDelaySlider').min = MIN_FOOD_REGENERATION_PERIOD;
	document.getElementById('foodGrowthDelaySlider').max = MAX_FOOD_REGENERATION_PERIOD;

	document.getElementById('foodSpreadSlider').min = MIN_FOOD_BIT_MAX_SPAWN_RADIUS;
	document.getElementById('foodSpreadSlider').max = MAX_FOOD_BIT_MAX_SPAWN_RADIUS;

	document.getElementById('foodBitEnergySlider').min = MIN_FOOD_BIT_ENERGY;
	document.getElementById('foodBitEnergySlider').max = MAX_FOOD_BIT_ENERGY;

	document.getElementById('hungerThresholdSlider').min = MIN_SWIMBOT_HUNGER_THRESHOLD;
	document.getElementById('hungerThresholdSlider').max = MAX_SWIMBOT_HUNGER_THRESHOLD;

	document.getElementById('energyToOffspringSlider').min = MIN_CHILD_ENERGY_RATIO;
	document.getElementById('energyToOffspringSlider').max = MAX_CHILD_ENERGY_RATIO;

	document.getElementById('maxAgeSlider').min = MIN_MAXIMUM_AGE;
	document.getElementById('maxAgeSlider').max = MAX_MAXIMUM_AGE;

	updateEcosystemUI();
}

function updateEcosystemUI() {
	if (typeof genePool != "undefined") {
		document.getElementById("foodGrowthDelaySlider").value = genePool.getFoodGrowthDelay();
		document.getElementById("foodGrowthDelayValue").innerHTML = genePool.getFoodGrowthDelay();

		document.getElementById("foodSpreadSlider").value = genePool.getFoodSpread();
		document.getElementById("foodSpreadValue").innerHTML = genePool.getFoodSpread();

		document.getElementById("foodBitEnergySlider").value = genePool.getFoodBitEnergy();
		document.getElementById("foodBitEnergyValue").innerHTML = genePool.getFoodBitEnergy();

		document.getElementById("hungerThresholdSlider").value = genePool.getHungerThreshold();
		document.getElementById("hungerThresholdValue").innerHTML = genePool.getHungerThreshold();

		document.getElementById("energyToOffspringSlider").value = genePool.getEnergyToOffspring();
		document.getElementById("energyToOffspringValue").innerHTML = genePool.getEnergyToOffspring();

		document.getElementById("maxAgeSlider").value = genePool.getMaximumSwimbotAge();
		document.getElementById("maxAgeValue").innerHTML = genePool.getMaximumSwimbotAge();


		// the radio buttons need to be reset to reflect any changes in attraction       
		let radioButtons = document.getElementsByName('attractionRadioButton');

		for (let i = 0; i < radioButtons.length; i++) {
			assert(i < NUM_ATTRACTIONS, "ui.js: updateEcosystemUI: i < NUM_ATTRACTIONS");

			if (radioButtons[i].type === 'radio') {
				if (genePool.getAttraction() === i) {
					radioButtons[i].checked = true;
				} else {
					radioButtons[i].checked = false;
				}
			}
		}
	}
}

function closeAllPanels() {
	document.getElementById('poolPanel').style.visibility = 'hidden';
	document.getElementById('swimbotPanel').style.visibility = 'hidden';
	document.getElementById('graphPanel').style.visibility = 'hidden';
	document.getElementById('tweakPanel').style.visibility = 'hidden';
	document.getElementById('infoPanel').style.visibility = 'hidden';
	document.getElementById('infoText').style.visibility = 'hidden';

	document.getElementById('prevInfoButton').style.visibility = 'hidden';
	document.getElementById('nextInfoButton').style.visibility = 'hidden';

	document.getElementById('noSelectedSwimbotPanel').style.visibility = 'hidden';
	document.getElementById('selectedSwimbotPanel').style.visibility = 'hidden';

	document.getElementById('menuPoolButton').style.top = 0;
	document.getElementById('menuSwimbotButton').style.top = 0;
	document.getElementById('menuTweakButton').style.top = 0;
	document.getElementById('menuInfoButton').style.top = 0;
	document.getElementById('menuGraphButton').style.top = 0;

	document.getElementById('menuPoolButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	document.getElementById('menuSwimbotButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	document.getElementById('menuTweakButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	document.getElementById('menuInfoButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	document.getElementById('menuGraphButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"

	closePopupPanel();

	_graph.clear();
}

function openPanel(buttonID) {
	closeAllPanels();

	let panelID = 'poolPanel';

	if (buttonID === 'menuPoolButton') { panelID = 'poolPanel';
		openPoolPanel(); }
	if (buttonID === 'menuSwimbotButton') { panelID = 'swimbotPanel';
		openSwimbotPanel(); }
	if (buttonID === 'menuTweakButton') { panelID = 'tweakPanel';
		openTweakPanel(); }
	if (buttonID === 'menuInfoButton') { panelID = 'infoPanel';
		openInfoPanel(); }
	if (buttonID === 'menuGraphButton') { panelID = 'graphPanel';
		openGraphPanel() }

	document.getElementById(buttonID).style = "border-bottom-width: 0; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;"

	document.getElementById(buttonID).style.backgroundColor = DEFAULT_BASIC_PANEL_COLOR;

	document.getElementById(buttonID).style.top = 3;
}

function openPoolPanel() {
	document.getElementById('poolPanel').style.visibility = 'visible';
}

function openGraphPanel() {
	document.getElementById('graphPanel').style.visibility = 'visible';
}

function openSwimbotPanel() {
	document.getElementById('swimbotPanel').style.visibility = 'visible';

	if (genePool.getASwimbotIsSelected()) {
		document.getElementById('selectedSwimbotPanel').style.visibility = 'visible';
		document.getElementById('noSelectedSwimbotPanel').style.visibility = 'hidden';
	} else {
		document.getElementById('selectedSwimbotPanel').style.visibility = 'hidden';
		document.getElementById('noSelectedSwimbotPanel').style.visibility = 'visible';
	}
}

function openTweakGenesPanel(selectedSwimbotID) {
	if (selectedSwimbotID != NULL_INDEX) {
		document.getElementById('tweakGenesPanel').style.visibility = 'visible';
		document.getElementById('closeTweakGenesPanel').style.visibility = "visible";

		document.getElementById('tweakGenesPanel').innerHTML = "<div id = 'tweakGenesTitle' >Tweak the genes of swimbot " + selectedSwimbotID + "</div>";
		document.getElementById('tweakGenesPanel').innerHTML += "<div id = 'tweakGenesCategoryNote' >(choose which limb type to tweak)</div>";

		let numCategories = genePool.getNumGeneCategories();
		for (let c = 0; c < numCategories; c++) {
			document.getElementById('tweakGenesPanel').innerHTML += "<div id = 'category" + (c + 1) + "' >" + (c + 1) +
				"<input " +
				"type         = 'radio' " +
				"id           = 'geneTweakerCategory" + c + "'" +
				"name         = 'geneTweakerCategory'" +
				"oninput      = 'setGeneTweakCategory(" + selectedSwimbotID + ", " + c + ")' " +
				"onchange     = 'setGeneTweakCategory(" + selectedSwimbotID + ", " + c + ")' " +
				"></div>";
		}

		let num = genePool.getNumGenesPerCategory();
		num += 2; //add the two first (global: non-category) genes

		let width = 150;

		for (let g = 0; g < num; g++) {
			let geneTweakerName = genePool.getGeneName(g);
			let geneTweakerValue = genePool.getGeneValue(selectedSwimbotID, g);

			let top = 60 + g * 20;
			if (g > 1) //skip the two first (global: non-category) genes
			{
				top += 80.0;
			}

			// construct the gene value display
			document.getElementById('tweakGenesPanel').innerHTML += "<div class = 'geneTweakerValue' id = 'gene" + g + "Value' style = 'top:" + top + "px;'>" + geneTweakerValue + "</div>";

			// construct the slider
			document.getElementById('tweakGenesPanel').innerHTML += "<input " +
				"style        = 'top:" + (top - 3) + "px; width:" + width + "px;'" +
				"type         = 'range' " +
				"class        = 'geneTweakerSlider' " +
				"min          = '0'" +
				"max          = '255'" +
				"value        = '" + geneTweakerValue + "'" +
				"id           = 'geneTweaker" + g + "'" +
				"name         = 'geneTweaker" +
				"step         = 1 " +
				"autocomplete = 'off' " +
				"oninput      = 'tweakGene(" + selectedSwimbotID + ", " + g + ")' " +
				">";

			// construct the gene name
			document.getElementById('tweakGenesPanel').innerHTML += "<div class = 'geneTweakerName' style = 'top:" + top + "px;'>" + geneTweakerName + "</div>";
		}

		// initialize tweak category
		_tweakGenesCategory = 0;

		// set radio button check status
		let radioButtons = document.getElementsByName('geneTweakerCategory');

		for (let i = 0; i < radioButtons.length; i++) {
			if (i === _tweakGenesCategory) {
				radioButtons[i].checked = true;
			} else {
				radioButtons[i].checked = false;
			}
		}
	} else {
		document.getElementById('tweakGenesPanel').style.visibility = 'hidden';
		document.getElementById('closeTweakGenesPanel').style.visibility = "hidden";
	}
}

function closeTweakGenesPanel() {
	document.getElementById('tweakGenesPanel').style.visibility = "hidden";
	document.getElementById('closeTweakGenesPanel').style.visibility = "hidden";
}

function updateGeneSliders(selectedSwimbotID) {
	let num = genePool.getNumGenesPerCategory();
	num += 2; //add the two first (global: non-category) genes

	for (let g = 0; g < num; g++) {
		let geneIndex = g;

		if (g > 1) {
			geneIndex += genePool.getNumGenesPerCategory() * _tweakGenesCategory;
		}

		let geneTweakerValue = genePool.getGeneValue(selectedSwimbotID, geneIndex);

		let id = "geneTweaker" + g;
		let slider = document.getElementById(id);
		slider.value = geneTweakerValue;

		id = "gene" + g + "Value";
		document.getElementById(id).innerHTML = geneTweakerValue;
	}
}

function closePopupPanel() {
	document.getElementById('popUpPanel').style.visibility = 'hidden';
	document.getElementById('cancelPopUpPanelButton').style.visibility = 'hidden';
	//document.getElementById('PopUpPanelError'        ).style.visibility = 'hidden';
	//document.getElementById('cancelErrorButton'      ).style.visibility = 'hidden';  
	//document.getElementById('popUpPanelInput'        ).style.visibility = 'hidden';
	//document.getElementById('savePopUpPanelButton'   ).style.visibility = 'hidden';
	//document.getElementById('noSavePopUpPanelButton' ).style.visibility = 'hidden';
	document.getElementById('tweakDefaultButton').style.visibility = 'hidden';
	//document.getElementById('submitFilenameButton'   ).style.visibility = 'hidden';
	document.getElementById('dataDisplayButton').style.visibility = "hidden";

	// I don't know why these are popping an error that they don't exist.... ??     
	//document.getElementById("PopupText"              ).style.visibility = "hidden";   
	//document.getElementById("loadedList"             ).style.visibility = "hidden";   

	// move focus to the canvas in case it had been on the popup input   
	document.getElementById("Canvas").focus();
}

function closeAccountPanel() {
	document.getElementById('cancelAccountPanelButton').style.visibility = "hidden";
	document.getElementById('accountPanel').style.visibility = "hidden";
	document.getElementById('accountEmailInput').style.visibility = "hidden";
	document.getElementById('accountPasswordInput').style.visibility = "hidden";
	document.getElementById('submitAccountButton').style.visibility = 'hidden';
	document.getElementById('accountButton').style.visibility = "visible";
	document.getElementById('loginButton').style.visibility = "visible";
}

function closeErrorPanel() {
	document.getElementById('PopUpPanelError').style.visibility = "hidden";
	document.getElementById('cancelErrorButton').style.visibility = "hidden";
}

function toggleSimulationRunning() {
	if (genePool.getSimulationRunning()) {
		genePool.setSimulationRunning(false);
		document.getElementById("freezeButton").style.borderColor = ACTIVE_BORDER_COLOR;
		document.getElementById("freezeButton").style.borderWidth = "3px";
	} else {
		genePool.setSimulationRunning(true);
		document.getElementById("freezeButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	}
}

function toggleFastRendering() {
	if (_runningFast) {
		_runningFast = false;
		genePool.setMillisecondsPerUpdate(20);
		document.getElementById("fastButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR
	} else {
		_runningFast = true;
		genePool.setMillisecondsPerUpdate(0);
		document.getElementById("fastButton").style.borderColor = ACTIVE_BORDER_COLOR;
		document.getElementById("fastButton").style.borderWidth = "3px";
	}
}

function toggleRendering() {
	if (genePool.getRendering()) {
		setRendering(false);
	} else {
		setRendering(true);
	}
}

function setRendering(r) {
	if (r) {
		genePool.setRendering(true);

		canvasID.style.visibility = 'visible';
		document.getElementById("noRenderPanel").style.visibility = 'hidden';
	} else {
		genePool.setRendering(false);
		canvasID.style.visibility = 'hidden';
		document.getElementById("noRenderPanel").style.visibility = 'visible';
	}
}

function toggleGoalOverlay() {
	genePool.toggleGoalOverlay();

	if (genePool.getRenderingGoals()) {
		document.getElementById("viewGoalButton").style = "border-color: " + ACTIVE_BORDER_COLOR
		document.getElementById("viewGoalButton").style.borderWidth = "3px";
	} else {
		document.getElementById("viewGoalButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	}
}

function clearViewMode() {
	genePool.clearViewMode();
	clearViewModeButtons();
}

function clearViewModeButtons() {
	document.getElementById('viewWholePoolButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewAutoTrackButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewSelectedButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewMutualButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewProlificButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewEfficientButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewVirginButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	document.getElementById('viewGluttonButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;

	document.getElementById('viewWholePoolButton').style.borderWidth = "1px";
	document.getElementById('viewAutoTrackButton').style.borderWidth = "1px";
	document.getElementById('viewSelectedButton').style.borderWidth = "1px";
	document.getElementById('viewMutualButton').style.borderWidth = "1px";
	document.getElementById('viewProlificButton').style.borderWidth = "1px";
	document.getElementById('viewEfficientButton').style.borderWidth = "1px";
	document.getElementById('viewVirginButton').style.borderWidth = "1px";
	document.getElementById('viewGluttonButton').style.borderWidth = "1px";

	document.getElementById('viewWholePoolButton').style.borderBottomWidth = "4px";
	document.getElementById('viewAutoTrackButton').style.borderBottomWidth = "4px";
	document.getElementById('viewSelectedButton').style.borderBottomWidth = "4px";
	document.getElementById('viewMutualButton').style.borderBottomWidth = "4px";
	document.getElementById('viewProlificButton').style.borderBottomWidth = "4px";
	document.getElementById('viewEfficientButton').style.borderBottomWidth = "4px";
	document.getElementById('viewVirginButton').style.borderBottomWidth = "4px";
	document.getElementById('viewGluttonButton').style.borderBottomWidth = "4px";
}

function setViewMode(buttonID, viewMode) {
	// clear out the buttons...
	clearViewModeButtons();

	genePool.setViewMode(viewMode);

	closePopupPanel();

	if (buttonID === 'viewSelectedButton') {
		if (genePool.getSelectedSwimbotID() != -1) {
			document.getElementById(buttonID).style = "border-color: " + ACTIVE_BORDER_COLOR
			document.getElementById(buttonID).style.borderWidth = "3px";
		}
	} else {
		document.getElementById(buttonID).style = "border-color: " + ACTIVE_BORDER_COLOR
		document.getElementById(buttonID).style.borderWidth = "3px";
	}
}

function choosePoolToLoad(pool) {
	_chosenPoolToLoad = pool;
}

function requestToLoadPoolFromFile() {}

function requestToLoadPoolFromPreset() {
	// get the name of the pool to load...
	let poolText = "(ERROR)";

	if (_chosenPoolToLoad === SimulationStartMode.RANDOM) { poolText = "'random'"; } else if (_chosenPoolToLoad === SimulationStartMode.NEIGHBORHOOD) { poolText = "'neighborhood'"; } else if (_chosenPoolToLoad === SimulationStartMode.FROGGIES) { poolText = "'froggies'"; } else if (_chosenPoolToLoad === SimulationStartMode.TANGO) { poolText = "'tango'"; } else if (_chosenPoolToLoad === SimulationStartMode.RACE) { poolText = "'race'"; } else if (_chosenPoolToLoad === SimulationStartMode.BIG_BANG) { poolText = "'big bang'"; } else if (_chosenPoolToLoad === SimulationStartMode.BAD_PARENTS) { poolText = "'bad parents'"; } else if (_chosenPoolToLoad === SimulationStartMode.EMPTY) { poolText = "'empty'"; }
	//else if (_chosenPoolToLoad === SimulationStartMode.FILE       ) { poolText = "from file";       }

	// this overrides the UI asking the user to save the current pool first...
	switchToChosenPresetPool();
}

function switchToChosenPresetPool() {
	closePopupPanel();
	genePool.startSimulation(_chosenPoolToLoad);
	clearViewMode();
	updateEcosystemUI();
	_graph.initialize();
	setRendering(true);
}

function loadSwimbotFromPreset(p) {
	let genes = genePool.getPresetGenotype(p);
	genePool.createNewSwimbotWithGenes(genes);
}

function setGeneTweakCategory(selectedSwimbotID, c) {
	_tweakGenesCategory = c;
	updateGeneSliders(selectedSwimbotID); //
}

function tweakGene(swimbotIndex, sliderIndex) {
	let geneIndex = sliderIndex;

	if (sliderIndex > 1) {
		geneIndex += genePool.getNumGenesPerCategory() * _tweakGenesCategory;
	}

	// get the gene value...
	let id = "geneTweaker" + sliderIndex;

	let input = document.getElementById(id);

	let geneValue = input.value;

	// update the gene value in the simulation...
	genePool.tweakGene(swimbotIndex, geneIndex, geneValue);

	// update the html that displays the value...
	id = "gene" + sliderIndex + "Value";
	document.getElementById(id).innerHTML = geneValue;
}

function openInfoPanel() {
	document.getElementById('infoPanel').style.visibility = 'visible';
	document.getElementById('infoText').style.visibility = 'visible';

	//let the current page load up
	setInfoPage(_currentInfoPage);
}

function advanceInfoPage(increment) {
	_currentInfoPage += increment;

	if (_currentInfoPage < FIRST_INFO_PAGE) {
		_currentInfoPage = FIRST_INFO_PAGE;
	}

	if (_currentInfoPage > LAST_INFO_PAGE) {
		_currentInfoPage = LAST_INFO_PAGE;
	}

	setInfoPage(_currentInfoPage);
}

function setInfoPage(pageNumber) {
	document.getElementById('pageNumberLabel').innerHTML = "page " + _currentInfoPage + " of 28";
	document.getElementById("infoText").innerHTML = getInfoText(_currentInfoPage);

	if (_currentInfoPage === FIRST_INFO_PAGE) {
		document.getElementById('prevInfoButton').style.visibility = 'hidden'
	} else {
		document.getElementById('prevInfoButton').style.visibility = 'visible'
	}

	if (_currentInfoPage === LAST_INFO_PAGE) {
		document.getElementById('nextInfoButton').style.visibility = 'hidden'
	} else {
		document.getElementById('nextInfoButton').style.visibility = 'visible'
	}
}

function updateUI() {
	// check that we have a genePool......
	let genePoolIsDefined = typeof genePool != 'undefined';

	if (genePoolIsDefined) {
		// update the view buttons...
		if (genePool.getViewMode() === ViewTrackingMode.NULL) {
			clearViewModeButtons();
		}

		// update the swimbot panel....
		if (document.getElementById('swimbotPanel').style.visibility === 'visible') {
			let selectedSwimbot = genePool.getSelectedSwimbotID();

			if (selectedSwimbot === NULL_INDEX) {
				document.getElementById('selectedSwimbotPanel').style.visibility = 'hidden';
				document.getElementById('noSelectedSwimbotPanel').style.visibility = 'visible';
			} else {
				document.getElementById('selectedSwimbotPanel').style.visibility = 'visible';
				document.getElementById('noSelectedSwimbotPanel').style.visibility = 'hidden';

				let brainState = genePool.getSwimbotBrainState(selectedSwimbot);
				let mateString = genePool.getSwimbotChosenMate(selectedSwimbot).toString();
				let goalDescription = "";

				if (brainState === BRAIN_STATE_RESTING) { goalDescription = "resting"; } else if (brainState === BRAIN_STATE_LOOKING_FOR_MATE) { goalDescription = "looking for mate"; } else if (brainState === BRAIN_STATE_PURSUING_MATE) { goalDescription = "pursuing mate " + mateString; } else if (brainState === BRAIN_STATE_LOOKING_FOR_FOOD) { goalDescription = "looking for food bit"; } else if (brainState === BRAIN_STATE_PURSUING_FOOD) { goalDescription = "pursuing food bit"; }

				let foodPreferenceText = "green";
				let foodTypeText = "green";

				if (genePool.getSwimbotPreferredFoodType(selectedSwimbot) === 1) { foodPreferenceText = "blue"; }
				if (genePool.getSwimbotDigestibleFoodType(selectedSwimbot) === 1) { foodTypeText = "blue"; }

				document.getElementById('swimbotDataPanel').innerHTML = "<b>Info about the selected swimbot:</b>" +
					"<br>" +
					"<br>" +
					"ID = " + genePool.getSwimbotIndex(selectedSwimbot).toString() +
					"<br>" +
					"age = " + genePool.getSwimbotAge(selectedSwimbot).toString() +
					"<br>" +
					"goal = " + goalDescription +
					"<br>" +
					"<br>" +
					"food type preference = " + foodPreferenceText +
					"<br>" +
					"best-digested food type = " + foodTypeText +
					"<br>" +
					"number of food bits eaten = " + Math.floor(genePool.getSwimbotNumFoodBitsEaten(selectedSwimbot).toString()) +
					"<br>" +
					"energy = " + Math.floor(genePool.getSwimbotEnergy(selectedSwimbot).toString()) +
					"<br>" +
					"<br>" +
					"sexual attraction = " + genePool.getSwimbotAttractionDescription(selectedSwimbot) +
					"<br>" +
					"number of offspring = " + Math.floor(genePool.getSwimbotNumOffspring(selectedSwimbot).toString());
			}
		}

		// always update the graph....
		if (genePoolIsDefined) {
			_graph.update(
				genePool.getTimeStep(),
				genePool.getNumSwimbots(),
				genePool.getNumSwimbotsPreferringType(0),
				genePool.getNumSwimbotsPreferringType(1),
				genePool.getNumFoodBits(),
				genePool.getNumFoodBits1()
			);
		}

		// render the graph....
		if (document.getElementById('graphPanel').style.visibility === 'visible') {
			document.getElementById('graphData').innerHTML = "time step: " + genePool.getTimeStep() +
				"<br>" +
				"swimbots: " + genePool.getNumSwimbots() +
				"<br>" +
				"green pref: " + genePool.getNumSwimbotsPreferringType(0) +
				"<br>" +
				"blue pref: " + genePool.getNumSwimbotsPreferringType(1) +
				"<br>" +
				"food bits: " + genePool.getNumFoodBits() +
				"<br>" +
				"food bits 1: " + genePool.getNumFoodBits1();

			_graph.render();
		}
	}

	// trigger next update... (throttled to UI_UPDATE_PERIOD via rAF)
	_scheduleNextUIUpdate();
}

let _lastUIUpdateTime = 0;
function _scheduleNextUIUpdate() {
	requestAnimationFrame((ts) => {
		if (ts - _lastUIUpdateTime >= UI_UPDATE_PERIOD) {
			_lastUIUpdateTime = ts;
			updateUI();
		} else {
			_scheduleNextUIUpdate();
		}
	});
}

function notifyGeneTweakPanelMouseDown() {
	let selectedSwimbotID = genePool.getSelectedSwimbotID();

	if (selectedSwimbotID === -1) {
		closeTweakGenesPanel();
	} else {
		if (document.getElementById('tweakGenesPanel').style.visibility === 'visible') {
			openTweakGenesPanel(selectedSwimbotID);
		}
	}
}

// under construction
function resize() {
	let rightMargin = 400;
	let width = window.innerWidth - rightMargin;
	let height = window.innerHeight;

	canvasID.width = width;
	canvasID.height = height - 15;

	let genePoolIsDefined = typeof genePool != 'undefined';
	if (genePoolIsDefined) {
		genePool.setCanvasDimensions(canvasID.width, canvasID.height);
	}
}

function attachEventListeners() {
	// View mode buttons
	document.querySelectorAll('[data-view-mode]').forEach(function(btn) {
		btn.addEventListener('mousedown', function() {
			let mode = ViewTrackingMode[this.getAttribute('data-view-mode')];
			setViewMode(this.id, mode);
		});
	});

	// View options
	document.getElementById('viewGoalButton').addEventListener('click', toggleGoalOverlay);
	document.getElementById('freezeButton').addEventListener('click', toggleSimulationRunning);
	document.getElementById('noRenderButton').addEventListener('click', toggleRendering);
	document.getElementById('fastButton').addEventListener('click', toggleFastRendering);

	// Menu buttons
	document.querySelectorAll('[data-panel]').forEach(function(btn) {
		btn.addEventListener('mousedown', function() {
			openPanel(this.getAttribute('data-panel'));
		});
	});

	// Ecosystem sliders
	document.querySelectorAll('.EcoSlider').forEach(function(slider) {
		slider.addEventListener('input', function() {
			setEcosystemValue(this.id);
		});
	});

	// Tweak default
	document.getElementById('tweakDefaultButton').addEventListener('click', setEcosystemToDefaults);

	// Attraction radios
	document.querySelectorAll('input[name="attractionRadioButton"]').forEach(function(radio) {
		radio.addEventListener('change', chooseAttraction);
	});

	// Pool presets
	document.querySelectorAll('[data-pool-preset]').forEach(function(btn) {
		btn.addEventListener('click', function() {
			let mode = SimulationStartMode[this.getAttribute('data-pool-preset')];
			choosePoolToLoad(mode);
			requestToLoadPoolFromPreset();
		});
	});

	// Food speciation toggle
	document.getElementById('foodSpeciationCheckbox').addEventListener('change', function() {
		genePool.setFoodSpeciationEnabled(this.checked);
	});

	// Family tree
	document.getElementById('familyTreeButton').addEventListener('click', function() {
		printFamilyTree();
	});

	// Swimbot creation
	document.getElementById('createRandomSwimbotButton').addEventListener('click', function() {
		genePool.makeNewRandomSwimbot();
	});

	// Swimbot presets
	document.querySelectorAll('[data-swimbot-preset]').forEach(function(btn) {
		btn.addEventListener('click', function() {
			loadSwimbotFromPreset(parseInt(this.getAttribute('data-swimbot-preset')));
		});
	});

	// Selected swimbot actions
	document.getElementById('zapSwimbotButton').addEventListener('click', function() {
		genePool.zapSwimbot(genePool.getSelectedSwimbotID(), 0.2);
	});
	document.getElementById('randomizeSwimbotButton').addEventListener('click', function() {
		genePool.randomizeSwimbot(genePool.getSelectedSwimbotID());
	});
	document.getElementById('cloneSwimbotButton').addEventListener('click', function() {
		genePool.cloneSwimbot(genePool.getSelectedSwimbotID());
	});
	document.getElementById('killSwimbotButton').addEventListener('click', function() {
		genePool.killSwimbot(genePool.getSelectedSwimbotID());
	});
	document.getElementById('showGenesButton').addEventListener('click', function() {
		showSwimbotGenes(genePool.getSelectedSwimbotID());
	});
	document.getElementById('tweakGenesButton').addEventListener('click', function() {
		openTweakGenesPanel(genePool.getSelectedSwimbotID());
		genePool.setViewMode(ViewTrackingMode.SELECTED);
	});

	// Info panel
	document.getElementById('prevInfoButton').addEventListener('click', function() { advanceInfoPage(-1); });
	document.getElementById('nextInfoButton').addEventListener('click', function() { advanceInfoPage(1); });

	// Popup/display
	document.getElementById('cancelPopUpPanelButton').addEventListener('click', closePopupPanel);
	document.getElementById('dataDisplayButton').addEventListener('click', displayData);
	document.getElementById('closeDataDisplay').addEventListener('click', closeDataDisplay);
	document.getElementById('closeTweakGenesPanel').addEventListener('click', closeTweakGenesPanel);
	document.getElementById('noRenderPanel').addEventListener('click', function() { setRendering(true); });
}

document.getElementById('Canvas').onmousedown = function(e) {
	clearViewMode();

	if (typeof genePool != "undefined") {
		genePool.touchDown(e.pageX - document.getElementById('Canvas').offsetLeft, e.pageY - document.getElementById('Canvas').offsetTop);
	}

	notifyGeneTweakPanelMouseDown();
}

document.getElementById('Canvas').onmousemove = function(e) {
	if (typeof genePool != "undefined") {
		genePool.touchMove(e.pageX - document.getElementById('Canvas').offsetLeft, e.pageY - document.getElementById('Canvas').offsetTop);
	}
}

document.getElementById('Canvas').onmouseup = function(e) {
	if (typeof genePool != "undefined") {
		genePool.touchUp(e.pageX - document.getElementById('Canvas').offsetLeft, e.pageY - document.getElementById('Canvas').offsetTop);
	}
}

document.getElementById('Canvas').onmouseout = function(e) {
	if (typeof genePool != "undefined") {
		genePool.touchOut(e.pageX - document.getElementById('Canvas').offsetLeft, e.pageY - document.getElementById('Canvas').offsetTop);
	}
}

// key down
document.onkeydown = function(e) {
	e = e || window.event;

	// keys for camera navigation
	let cameraNavAction = -1;

	if (e.keyCode === 37) // left arrow key
	{
		cameraNavAction = CameraNavigationAction.LEFT;
	}

	if (e.keyCode === 39) { cameraNavAction = CameraNavigationAction.RIGHT; } // right arrow key
	if (e.keyCode === 38) { cameraNavAction = CameraNavigationAction.UP; } // up arrow key
	if (e.keyCode === 40) { cameraNavAction = CameraNavigationAction.DOWN; } // down arrow key
	if (e.keyCode === 61) { cameraNavAction = CameraNavigationAction.IN; } // plus key
	if (e.keyCode === 173) { cameraNavAction = CameraNavigationAction.OUT; } // minus key
	if (e.keyCode === 187) { cameraNavAction = CameraNavigationAction.IN; } // plus key
	if (e.keyCode === 189) { cameraNavAction = CameraNavigationAction.OUT; } // minus key

	if (cameraNavAction != -1) {
		if (!genePool.getCameraNavigationActive(cameraNavAction)) {
			genePool.startCameraNavigation(cameraNavAction);
			clearViewMode();
		}
	}
}

//------------------------------
document.onkeyup = function(e) {
	genePool.stopCameraNavigation(CameraNavigationAction.LEFT);
	genePool.stopCameraNavigation(CameraNavigationAction.RIGHT);
	genePool.stopCameraNavigation(CameraNavigationAction.UP);
	genePool.stopCameraNavigation(CameraNavigationAction.DOWN);
	genePool.stopCameraNavigation(CameraNavigationAction.IN);
	genePool.stopCameraNavigation(CameraNavigationAction.LEFT);
};