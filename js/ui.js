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

// Cached simulation state, populated by SIM_STATE_UPDATED events from GenePool.
// This eliminates the need for the UI to call getters on the simulation directly.
let _simState = {};

//----------------------------
function initGenePool() {
	SwimbotsApp.genePool = new GenePool();
	SwimbotsApp.genePool.setCanvas(SwimbotsApp.canvas);
	resize();
	SwimbotsApp.genePool.setCanvasDimensions(SwimbotsApp.canvasID.width, SwimbotsApp.canvasID.height);
	SwimbotsApp.genePool.initialize();
	setupNavigationButtons();
	_setupStateSubscription();
	initializeUI();
}

document.addEventListener("DOMContentLoaded", initGenePool);
window.addEventListener("resize", resize);


//----------------------------
/**
 * Subscribe to simulation state events.
 * Replaces the old pattern of calling getters on genePool.
 */
function _setupStateSubscription() {
	eventBus.on(SIM_STATE_UPDATED, function(state) {
		_simState = state;
	});
}

//----------------------------
function _getSimState() {
	return _simState;
}

//----------------------------
function _getSwimbotState() {
	return _simState.selectedSwimbot || null;
}

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
			eventBus.emit(UI_CMD_START_CAMERA_NAV, navButtons[i].action);
			clearViewModeButtons();
		});

		btn.addEventListener("mouseup", function() {
			eventBus.emit(UI_CMD_STOP_CAMERA_NAV, navButtons[i].action);
		});

		btn.addEventListener("mouseleave", function() {
			eventBus.emit(UI_CMD_STOP_CAMERA_NAV, navButtons[i].action);
		});
	}
}

//----------------------------
function _attractionValueToConstant(value) {
	if (value === "colorful") return ATTRACTION_COLORFUL;
	if (value === "big") return ATTRACTION_BIG;
	if (value === "hyper") return ATTRACTION_HYPER;
	if (value === "long") return ATTRACTION_LONG;
	if (value === "straight") return ATTRACTION_STRAIGHT;
	if (value === "noColor") return ATTRACTION_NO_COLOR;
	if (value === "small") return ATTRACTION_SMALL;
	if (value === "still") return ATTRACTION_STILL;
	if (value === "short") return ATTRACTION_SHORT;
	if (value === "crooked") return ATTRACTION_CROOKED;
	if (value === "similarColor") return ATTRACTION_SIMILAR_COLOR;
	if (value === "similarSize") return ATTRACTION_SIMILAR_SIZE;
	if (value === "similarHyper") return ATTRACTION_SIMILAR_HYPER;
	if (value === "similarLength") return ATTRACTION_SIMILAR_LENGTH;
	if (value === "similarStraight") return ATTRACTION_SIMILAR_STRAIGHT;
	if (value === "random") return ATTRACTION_RANDOM;
	if (value === "closest") return ATTRACTION_CLOSEST;
	return ATTRACTION_SIMILAR_COLOR; // default
}

function chooseAttraction() {
	let radioButtons = document.getElementsByName('attractionRadioButton');

	for (let i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].type === 'radio' && radioButtons[i].checked) {
			let attraction = _attractionValueToConstant(radioButtons[i].value);
			eventBus.emit(UI_CMD_SET_ATTRACTION, attraction);
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

	if (id === "foodGrowthDelaySlider") { eventBus.emit(UI_CMD_SET_FOOD_DELAY, input.value); }
	else if (id === "foodSpreadSlider") { eventBus.emit(UI_CMD_SET_FOOD_SPREAD, input.value); }
	else if (id === "foodBitEnergySlider") { eventBus.emit(UI_CMD_SET_FOOD_ENERGY, input.value); }
	else if (id === "hungerThresholdSlider") { eventBus.emit(UI_CMD_SET_HUNGER_THRESHOLD, input.value); }
	else if (id === "energyToOffspringSlider") { eventBus.emit(UI_CMD_SET_OFFSPRING_RATIO, input.value); }
	else if (id === "maxAgeSlider") { eventBus.emit(UI_CMD_SET_MAX_AGE, input.value); }

	updateEcosystemUI();
}

function setEcosystemToDefaults() {
	eventBus.emit(UI_CMD_SET_ECOSYSTEM_DEFAULTS);
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
	let state = _getSimState();
	if (!state || !state.foodGrowthDelay && state.foodGrowthDelay !== 0) {
		// State not yet populated; skip this frame
		return;
	}

	document.getElementById("foodGrowthDelaySlider").value = state.foodGrowthDelay;
	document.getElementById("foodGrowthDelayValue").innerHTML = state.foodGrowthDelay;

	document.getElementById("foodSpreadSlider").value = state.foodSpread;
	document.getElementById("foodSpreadValue").innerHTML = state.foodSpread;

	document.getElementById("foodBitEnergySlider").value = state.foodBitEnergy;
	document.getElementById("foodBitEnergyValue").innerHTML = state.foodBitEnergy;

	document.getElementById("hungerThresholdSlider").value = state.hungerThreshold;
	document.getElementById("hungerThresholdValue").innerHTML = state.hungerThreshold;

	document.getElementById("energyToOffspringSlider").value = state.energyToOffspring;
	document.getElementById("energyToOffspringValue").innerHTML = state.energyToOffspring;

	document.getElementById("maxAgeSlider").value = state.maximumSwimbotAge;
	document.getElementById("maxAgeValue").innerHTML = state.maximumSwimbotAge;

	// the radio buttons need to be reset to reflect any changes in attraction
	let radioButtons = document.getElementsByName('attractionRadioButton');

	for (let i = 0; i < radioButtons.length; i++) {
		assert(i < NUM_ATTRACTIONS, "ui.js: updateEcosystemUI: i < NUM_ATTRACTIONS");

		if (radioButtons[i].type === 'radio') {
			if (state.attraction === i) {
				radioButtons[i].checked = true;
			} else {
				radioButtons[i].checked = false;
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

	let state = _getSimState();
	if (state && state.aSwimbotIsSelected) {
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

		let numCategories = SwimbotsApp.genePool.getNumGeneCategories();
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

		let num = SwimbotsApp.genePool.getNumGenesPerCategory();
		num += 2; //add the two first (global: non-category) genes

		let width = 150;

		for (let g = 0; g < num; g++) {
			let geneTweakerName = SwimbotsApp.genePool.getGeneName(g);
			let geneTweakerValue = SwimbotsApp.genePool.getGeneValue(selectedSwimbotID, g);

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
	let num = SwimbotsApp.genePool.getNumGenesPerCategory();
	num += 2; //add the two first (global: non-category) genes

	for (let g = 0; g < num; g++) {
		let geneIndex = g;

		if (g > 1) {
			geneIndex += SwimbotsApp.genePool.getNumGenesPerCategory() * _tweakGenesCategory;
		}

		let geneTweakerValue = SwimbotsApp.genePool.getGeneValue(selectedSwimbotID, geneIndex);

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
	eventBus.emit(UI_CMD_TOGGLE_SIMULATION);

	let state = _getSimState();
	if (state && !state.simulationRunning) {
		document.getElementById("freezeButton").style.borderColor = ACTIVE_BORDER_COLOR;
		document.getElementById("freezeButton").style.borderWidth = "3px";
	} else {
		document.getElementById("freezeButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	}
}

function toggleFastRendering() {
	if (_runningFast) {
		_runningFast = false;
		eventBus.emit(UI_CMD_SET_FAST_RENDERING, false);
		document.getElementById("fastButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR
	} else {
		_runningFast = true;
		eventBus.emit(UI_CMD_SET_FAST_RENDERING, true);
		document.getElementById("fastButton").style.borderColor = ACTIVE_BORDER_COLOR;
		document.getElementById("fastButton").style.borderWidth = "3px";
	}
}

function toggleRendering() {
	let state = _getSimState();
	if (state && state.rendering) {
		setRendering(false);
	} else {
		setRendering(true);
	}
}

function setRendering(r) {
	if (r) {
		eventBus.emit(UI_CMD_SET_RENDERING, true);

		canvasID.style.visibility = 'visible';
		document.getElementById("noRenderPanel").style.visibility = 'hidden';
	} else {
		eventBus.emit(UI_CMD_SET_RENDERING, false);
		canvasID.style.visibility = 'hidden';
		document.getElementById("noRenderPanel").style.visibility = 'visible';
	}
}

function toggleGoalOverlay() {
	eventBus.emit(UI_CMD_TOGGLE_GOAL_OVERLAY);

	let state = _getSimState();
	if (state && state.renderingGoals) {
		document.getElementById("viewGoalButton").style = "border-color: " + ACTIVE_BORDER_COLOR
		document.getElementById("viewGoalButton").style.borderWidth = "3px";
	} else {
		document.getElementById("viewGoalButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	}
}

function clearViewMode() {
	eventBus.emit(UI_CMD_CLEAR_VIEW_MODE);
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

	eventBus.emit(UI_CMD_SET_VIEW_MODE, viewMode);

	closePopupPanel();

	if (buttonID === 'viewSelectedButton') {
		let state = _getSimState();
		if (state && state.selectedSwimbotID != -1) {
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
	eventBus.emit(UI_CMD_START_SIMULATION, _chosenPoolToLoad);
	clearViewMode();
	updateEcosystemUI();
	_graph.initialize();
	setRendering(true);
}

function loadSwimbotFromPreset(p) {
	let genes = SwimbotsApp.genePool.getPresetGenotype(p);
	eventBus.emit(UI_CMD_CREATE_WITH_GENES, genes);
}

function setGeneTweakCategory(selectedSwimbotID, c) {
	_tweakGenesCategory = c;
	updateGeneSliders(selectedSwimbotID); //
}

function tweakGene(swimbotIndex, sliderIndex) {
	let geneIndex = sliderIndex;

	if (sliderIndex > 1) {
		geneIndex += SwimbotsApp.genePool.getNumGenesPerCategory() * _tweakGenesCategory;
	}

	// get the gene value...
	let id = "geneTweaker" + sliderIndex;

	let input = document.getElementById(id);

	let geneValue = input.value;

	// update the gene value in the simulation...
	eventBus.emit(UI_CMD_TWEAK_GENE, {
		swimbotIndex: swimbotIndex,
		geneIndex: geneIndex,
		geneValue: geneValue
	});

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

function _brainStateDescription(state, mateIndex) {
	if (state === BRAIN_STATE_RESTING) return "resting";
	if (state === BRAIN_STATE_LOOKING_FOR_MATE) return "looking for mate";
	if (state === BRAIN_STATE_PURSUING_MATE) return "pursuing mate " + mateIndex.toString();
	if (state === BRAIN_STATE_LOOKING_FOR_FOOD) return "looking for food bit";
	if (state === BRAIN_STATE_PURSUING_FOOD) return "pursuing food bit";
	return "unknown";
}

function updateUI() {
	let state = _getSimState();
	if (!state || !state.clock && state.clock !== 0) {
		// State not yet populated; schedule next check
		_scheduleNextUIUpdate();
		return;
	}

	// update the view buttons...
	if (state.viewMode === ViewTrackingMode.NULL) {
		clearViewModeButtons();
	}

	// update the swimbot panel....
	if (document.getElementById('swimbotPanel').style.visibility === 'visible') {
		let selectedSwimbot = state.selectedSwimbotID;

		if (selectedSwimbot === NULL_INDEX) {
			document.getElementById('selectedSwimbotPanel').style.visibility = 'hidden';
			document.getElementById('noSelectedSwimbotPanel').style.visibility = 'visible';
		} else {
			document.getElementById('selectedSwimbotPanel').style.visibility = 'visible';
			document.getElementById('noSelectedSwimbotPanel').style.visibility = 'hidden';

			let sb = _getSwimbotState();
			if (sb) {
				let goalDescription = _brainStateDescription(sb.brainState, sb.chosenMateIndex);

				let foodPreferenceText = sb.preferredFoodType === 1 ? "blue" : "green";
				let foodTypeText = sb.digestibleFoodType === 1 ? "blue" : "green";

				document.getElementById('swimbotDataPanel').innerHTML = "<b>Info about the selected swimbot:</b>" +
					"<br>" +
					"<br>" +
					"ID = " + sb.index.toString() +
					"<br>" +
					"age = " + sb.age.toString() +
					"<br>" +
					"goal = " + goalDescription +
					"<br>" +
					"<br>" +
					"food type preference = " + foodPreferenceText +
					"<br>" +
					"best-digested food type = " + foodTypeText +
					"<br>" +
					"number of food bits eaten = " + Math.floor(sb.numFoodBitsEaten.toString()) +
					"<br>" +
					"energy = " + Math.floor(sb.energy.toString()) +
					"<br>" +
					"<br>" +
					"sexual attraction = " + sb.attractionDescription +
					"<br>" +
					"number of offspring = " + Math.floor(sb.numOffspring.toString());
			}
		}
	}

	// always update the graph....
	_graph.update(
		state.clock,
		state.numSwimbots,
		state.numSwimbotsPreferringType0,
		state.numSwimbotsPreferringType1,
		state.numFoodBits,
		state.numFoodBits1
	);

	// render the graph....
	if (document.getElementById('graphPanel').style.visibility === 'visible') {
		document.getElementById('graphData').innerHTML = "time step: " + state.clock +
			"<br>" +
			"swimbots: " + state.numSwimbots +
			"<br>" +
			"green pref: " + state.numSwimbotsPreferringType0 +
			"<br>" +
			"blue pref: " + state.numSwimbotsPreferringType1 +
			"<br>" +
			"food bits: " + state.numFoodBits +
			"<br>" +
			"food bits 1: " + state.numFoodBits1;

		_graph.render();
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
	let state = _getSimState();
	let selectedSwimbotID = state ? state.selectedSwimbotID : -1;

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

	if (SwimbotsApp.genePool) {
		eventBus.emit(UI_CMD_SET_CANVAS_DIMENSIONS, {
			width: canvasID.width,
			height: canvasID.height
		});
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
		eventBus.emit(UI_CMD_SET_FOOD_SPECIATION, this.checked);
	});

	// Family tree
	document.getElementById('familyTreeButton').addEventListener('click', function() {
		printFamilyTree();
	});

	// Swimbot creation
	document.getElementById('createRandomSwimbotButton').addEventListener('click', function() {
		eventBus.emit(UI_CMD_MAKE_RANDOM_SWIMBOT);
	});

	// Swimbot presets
	document.querySelectorAll('[data-swimbot-preset]').forEach(function(btn) {
		btn.addEventListener('click', function() {
			loadSwimbotFromPreset(parseInt(this.getAttribute('data-swimbot-preset')));
		});
	});

	// Selected swimbot actions
	document.getElementById('zapSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_ZAP_SWIMBOT, { id: state.selectedSwimbotID, amount: 0.2 });
		}
	});
	document.getElementById('randomizeSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_RANDOMIZE_SWIMBOT, state.selectedSwimbotID);
		}
	});
	document.getElementById('cloneSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_CLONE_SWIMBOT, state.selectedSwimbotID);
		}
	});
	document.getElementById('killSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_KILL_SWIMBOT, state.selectedSwimbotID);
		}
	});
	document.getElementById('showGenesButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			showSwimbotGenes(state.selectedSwimbotID);
		}
	});
	document.getElementById('tweakGenesButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			openTweakGenesPanel(state.selectedSwimbotID);
			eventBus.emit(UI_CMD_SET_VIEW_MODE, ViewTrackingMode.SELECTED);
		}
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

	eventBus.emit(UI_CMD_TOUCH_DOWN, {
		x: e.pageX - document.getElementById('Canvas').offsetLeft,
		y: e.pageY - document.getElementById('Canvas').offsetTop
	});

	notifyGeneTweakPanelMouseDown();
}

document.getElementById('Canvas').onmousemove = function(e) {
	eventBus.emit(UI_CMD_TOUCH_MOVE, {
		x: e.pageX - document.getElementById('Canvas').offsetLeft,
		y: e.pageY - document.getElementById('Canvas').offsetTop
	});
}

document.getElementById('Canvas').onmouseup = function(e) {
	eventBus.emit(UI_CMD_TOUCH_UP, {
		x: e.pageX - document.getElementById('Canvas').offsetLeft,
		y: e.pageY - document.getElementById('Canvas').offsetTop
	});
}

document.getElementById('Canvas').onmouseout = function(e) {
	eventBus.emit(UI_CMD_TOUCH_OUT, {
		x: e.pageX - document.getElementById('Canvas').offsetLeft,
		y: e.pageY - document.getElementById('Canvas').offsetTop
	});
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
		eventBus.emit(UI_CMD_START_CAMERA_NAV, cameraNavAction);
		clearViewMode();
	}
}

//------------------------------
document.onkeyup = function(e) {
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.LEFT);
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.RIGHT);
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.UP);
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.DOWN);
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.IN);
	eventBus.emit(UI_CMD_STOP_CAMERA_NAV, CameraNavigationAction.LEFT);
};
