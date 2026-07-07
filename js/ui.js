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

	initFloatingPanel();
	initGraphPanel();

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
		let btn = $(navButtons[i].id);
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
	$('tweakPanel').style.visibility = 'visible';
	$('tweakDefaultButton').style.visibility = 'visible';
	updateEcosystemUI();
}

function setEcosystemValue(id) {
	let input = $(id);

	setEcosystemValueFromInput(id, input.value);
}

function setEcosystemValueFromInput(id, value) {

	if (id === "foodGrowthDelaySlider") { eventBus.emit(UI_CMD_SET_FOOD_DELAY, value); }
	else if (id === "foodSpreadSlider") { eventBus.emit(UI_CMD_SET_FOOD_SPREAD, value); }
	else if (id === "foodBitEnergySlider") { eventBus.emit(UI_CMD_SET_FOOD_ENERGY, value); }
	else if (id === "hungerThresholdSlider") { eventBus.emit(UI_CMD_SET_HUNGER_THRESHOLD, value); }
	else if (id === "energyToOffspringSlider") { eventBus.emit(UI_CMD_SET_OFFSPRING_RATIO, value); }
	else if (id === "maxAgeSlider") { eventBus.emit(UI_CMD_SET_MAX_AGE, value); }
	else if (id === "mutationRateSlider") { eventBus.emit(UI_CMD_SET_MUTATION_RATE, value); }

	// Pas de updateEcosystemUI() ici : _simState est mis à jour asynchrone via SIM_STATE_UPDATED.
	// Le prochain appel à updateEcosystemUI() (depuis updateUI) syncera les champs.
}

function setEcosystemToDefaults() {
	eventBus.emit(UI_CMD_SET_ECOSYSTEM_DEFAULTS);
	updateEcosystemUI();
}

function initializeEcosystemUI() {
	$('foodGrowthDelaySlider').min = MIN_FOOD_REGENERATION_PERIOD;
	$('foodGrowthDelaySlider').max = MAX_FOOD_REGENERATION_PERIOD;

	$('foodSpreadSlider').min = MIN_FOOD_BIT_MAX_SPAWN_RADIUS;
	$('foodSpreadSlider').max = MAX_FOOD_BIT_MAX_SPAWN_RADIUS;

	$('foodBitEnergySlider').min = MIN_FOOD_BIT_ENERGY;
	$('foodBitEnergySlider').max = MAX_FOOD_BIT_ENERGY;

	$('hungerThresholdSlider').min = MIN_SWIMBOT_HUNGER_THRESHOLD;
	$('hungerThresholdSlider').max = MAX_SWIMBOT_HUNGER_THRESHOLD;

	$('energyToOffspringSlider').min = MIN_CHILD_ENERGY_RATIO;
	$('energyToOffspringSlider').max = MAX_CHILD_ENERGY_RATIO;

	$('maxAgeSlider').min = MIN_MAXIMUM_AGE;
	$('maxAgeSlider').max = MAX_MAXIMUM_AGE;

	$('mutationRateSlider').min = MIN_MUTATION_RATE;
	$('mutationRateSlider').max = MAX_MUTATION_RATE;

	updateEcosystemUI();
}

function updateEcosystemUI() {
	let state = _getSimState();
	if (!state || !state.foodGrowthDelay && state.foodGrowthDelay !== 0) {
		// State not yet populated; skip this frame
		return;
	}

	$("foodGrowthDelaySlider").value = state.foodGrowthDelay;
	$("foodGrowthDelayValue").value = state.foodGrowthDelay;

	$("foodSpreadSlider").value = state.foodSpread;
	$("foodSpreadValue").value = state.foodSpread;

	$("foodBitEnergySlider").value = state.foodBitEnergy;
	$("foodBitEnergyValue").value = state.foodBitEnergy;

	$("hungerThresholdSlider").value = state.hungerThreshold;
	$("hungerThresholdValue").value = state.hungerThreshold;

	$("energyToOffspringSlider").value = state.energyToOffspring;
	$("energyToOffspringValue").value = state.energyToOffspring;

	$("maxAgeSlider").value = state.maximumSwimbotAge;
	$("maxAgeValue").value = state.maximumSwimbotAge;

	$("mutationRateSlider").value = state.mutationRate;
	$("mutationRateValue").value = state.mutationRate;

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
	$('poolPanel').style.visibility = 'hidden';
	$('swimbotPanel').style.visibility = 'hidden';
	$('tweakPanel').style.visibility = 'hidden';
	$('infoPanel').style.visibility = 'hidden';
	$('infoText').style.visibility = 'hidden';

	$('prevInfoButton').style.visibility = 'hidden';
	$('nextInfoButton').style.visibility = 'hidden';

	$('noSelectedSwimbotPanel').style.visibility = 'hidden';
	$('selectedSwimbotPanel').style.visibility = 'hidden';

	$('menuPoolButton').style.top = 0;
	$('menuSwimbotButton').style.top = 0;
	$('menuTweakButton').style.top = 0;
	$('menuInfoButton').style.top = 0;

	$('menuPoolButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	$('menuSwimbotButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	$('menuTweakButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
	$('menuInfoButton').style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"

	closePopupPanel();
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

	$(buttonID).style.backgroundColor = DEFAULT_BASIC_PANEL_COLOR;

	$(buttonID).style.top = 3;
}

function openPoolPanel() {
	$('poolPanel').style.visibility = 'visible';
	_updateFoodPlaceButtons();
}

function openSwimbotPanel() {
	$('swimbotPanel').style.visibility = 'visible';

	let state = _getSimState();
	if (state && state.aSwimbotIsSelected) {
		$('selectedSwimbotPanel').style.visibility = 'visible';
		$('noSelectedSwimbotPanel').style.visibility = 'hidden';
	} else {
		$('selectedSwimbotPanel').style.visibility = 'hidden';
		$('noSelectedSwimbotPanel').style.visibility = 'visible';
	}
}

function openTweakGenesPanel(selectedSwimbotID) {
	if (selectedSwimbotID != NULL_INDEX) {
		$('tweakGenesPanel').style.visibility = 'visible';
		$('closeTweakGenesPanel').style.visibility = "visible";

		$('tweakGenesPanel').innerHTML = "<div id = 'tweakGenesTitle' >Tweak the genes of swimbot " + selectedSwimbotID + "</div>";
		$('tweakGenesPanel').innerHTML += "<div id = 'tweakGenesCategoryNote' >(choose which limb type to tweak)</div>";

		let numCategories = SwimbotsApp.genePool.getNumGeneCategories();
		for (let c = 0; c < numCategories; c++) {
			$('tweakGenesPanel').innerHTML += "<div id = 'category" + (c + 1) + "' >" + (c + 1) +
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
			$('tweakGenesPanel').innerHTML += "<div class = 'geneTweakerValue' id = 'gene" + g + "Value' style = 'top:" + top + "px;'>" + geneTweakerValue + "</div>";

			// construct the slider
			$('tweakGenesPanel').innerHTML += "<input " +
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
			$('tweakGenesPanel').innerHTML += "<div class = 'geneTweakerName' style = 'top:" + top + "px;'>" + geneTweakerName + "</div>";
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
		$('tweakGenesPanel').style.visibility = 'hidden';
		$('closeTweakGenesPanel').style.visibility = "hidden";
	}
}

function closeTweakGenesPanel() {
	$('tweakGenesPanel').style.visibility = "hidden";
	$('closeTweakGenesPanel').style.visibility = "hidden";
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
		let slider = $(id);
		slider.value = geneTweakerValue;

		id = "gene" + g + "Value";
		$(id).innerHTML = geneTweakerValue;
	}
}

function closePopupPanel() {
	$('popUpPanel').style.visibility = 'hidden';
	$('cancelPopUpPanelButton').style.visibility = 'hidden';
	$('tweakDefaultButton').style.visibility = 'hidden';

	// move focus to the canvas in case it had been on the popup input
	$("Canvas").focus();
}

function closeAccountPanel() {
	$('cancelAccountPanelButton').style.visibility = "hidden";
	$('accountPanel').style.visibility = "hidden";
	$('accountEmailInput').style.visibility = "hidden";
	$('accountPasswordInput').style.visibility = "hidden";
	$('submitAccountButton').style.visibility = 'hidden';
	$('accountButton').style.visibility = "visible";
	$('loginButton').style.visibility = "visible";
}

function closeErrorPanel() {
	$('PopUpPanelError').style.visibility = "hidden";
	$('cancelErrorButton').style.visibility = "hidden";
}

function toggleSimulationRunning() {
	eventBus.emit(UI_CMD_TOGGLE_SIMULATION);

	let state = _getSimState();
	if (state && !state.simulationRunning) {
		$("freezeButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	} else {
		$("freezeButton").style.borderColor = ACTIVE_BORDER_COLOR;
		$("freezeButton").style.borderWidth = "3px";
	}
}

function toggleFastRendering() {
	if (_runningFast) {
		_runningFast = false;
		eventBus.emit(UI_CMD_SET_FAST_RENDERING, false);
		$("fastButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR
	} else {
		_runningFast = true;
		eventBus.emit(UI_CMD_SET_FAST_RENDERING, true);
		$("fastButton").style.borderColor = ACTIVE_BORDER_COLOR;
		$("fastButton").style.borderWidth = "3px";
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
		$("noRenderPanel").style.visibility = 'hidden';
	} else {
		eventBus.emit(UI_CMD_SET_RENDERING, false);
		canvasID.style.visibility = 'hidden';
		$("noRenderPanel").style.visibility = 'visible';
	}
}

function toggleGoalOverlay() {
	eventBus.emit(UI_CMD_TOGGLE_GOAL_OVERLAY);

	let state = _getSimState();
	if (state && state.renderingGoals) {
		$("viewGoalButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	} else {
		$("viewGoalButton").style = "border-color: " + ACTIVE_BORDER_COLOR
		$("viewGoalButton").style.borderWidth = "3px";
	}
}

function toggleShowGoals() {
	eventBus.emit(UI_CMD_TOGGLE_SHOW_GOALS);

	let state = _getSimState();
	if (state && state.showGoalsLines) {
		$("showGoalsButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	} else {
		$("showGoalsButton").style = "border-color: " + ACTIVE_BORDER_COLOR
		$("showGoalsButton").style.borderWidth = "3px";
	}
}

function toggleShowPerception() {
	eventBus.emit(UI_CMD_TOGGLE_SHOW_PERCEPTION);

	let state = _getSimState();
	if (state && state.showPerception) {
		$("showPerceptionButton").style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	} else {
		$("showPerceptionButton").style = "border-color: " + ACTIVE_BORDER_COLOR;
		$("showPerceptionButton").style.borderWidth = "3px";
	}
}

function clearViewMode() {
	eventBus.emit(UI_CMD_CLEAR_VIEW_MODE);
	clearViewModeButtons();
}

function clearViewModeButtons() {
	$('viewWholePoolButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewAutoTrackButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewSelectedButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewMutualButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewProlificButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewEfficientButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewVirginButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;
	$('viewGluttonButton').style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;

	$('viewWholePoolButton').style.borderWidth = "1px";
	$('viewAutoTrackButton').style.borderWidth = "1px";
	$('viewSelectedButton').style.borderWidth = "1px";
	$('viewMutualButton').style.borderWidth = "1px";
	$('viewProlificButton').style.borderWidth = "1px";
	$('viewEfficientButton').style.borderWidth = "1px";
	$('viewVirginButton').style.borderWidth = "1px";
	$('viewGluttonButton').style.borderWidth = "1px";

	$('viewWholePoolButton').style.borderBottomWidth = "4px";
	$('viewAutoTrackButton').style.borderBottomWidth = "4px";
	$('viewSelectedButton').style.borderBottomWidth = "4px";
	$('viewMutualButton').style.borderBottomWidth = "4px";
	$('viewProlificButton').style.borderBottomWidth = "4px";
	$('viewEfficientButton').style.borderBottomWidth = "4px";
	$('viewVirginButton').style.borderBottomWidth = "4px";
	$('viewGluttonButton').style.borderBottomWidth = "4px";
}

function setViewMode(buttonID, viewMode) {
	// clear out the buttons...
	clearViewModeButtons();

	eventBus.emit(UI_CMD_SET_VIEW_MODE, viewMode);

	closePopupPanel();

	if (buttonID === 'viewSelectedButton') {
		let state = _getSimState();
		if (state && state.selectedSwimbotID != -1) {
			$(buttonID).style = "border-color: " + ACTIVE_BORDER_COLOR
			$(buttonID).style.borderWidth = "3px";
		}
	} else {
		$(buttonID).style = "border-color: " + ACTIVE_BORDER_COLOR
		$(buttonID).style.borderWidth = "3px";
	}
}

function switchToChosenPresetPool() {
	closePopupPanel();
	// reset obstacle mode if active when starting a new simulation
	if (SwimbotsApp.genePool.getObstaclePlaceMode()) {
		eventBus.emit(UI_CMD_SET_OBSTACLE_PLACE_MODE, false);
		$('obstacleCheckbox').checked = false;
	}
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

	let input = $(id);

	let geneValue = input.value;

	// update the gene value in the simulation...
	eventBus.emit(UI_CMD_TWEAK_GENE, {
		swimbotIndex: swimbotIndex,
		geneIndex: geneIndex,
		geneValue: geneValue
	});

	// update the html that displays the value...
	id = "gene" + sliderIndex + "Value";
	$(id).innerHTML = geneValue;
}

function openInfoPanel() {
	$('infoPanel').style.visibility = 'visible';
	$('infoText').style.visibility = 'visible';

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
	$('pageNumberLabel').innerHTML = "page " + _currentInfoPage + " of 28";
	$("infoText").innerHTML = getInfoText(_currentInfoPage);

	if (_currentInfoPage === FIRST_INFO_PAGE) {
		$('prevInfoButton').style.visibility = 'hidden'
	} else {
		$('prevInfoButton').style.visibility = 'visible'
	}

	if (_currentInfoPage === LAST_INFO_PAGE) {
		$('nextInfoButton').style.visibility = 'hidden'
	} else {
		$('nextInfoButton').style.visibility = 'visible'
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

let _simRunning = false;

/**
 * Enable/disable pool panel buttons based on whether a simulation is running.
 */
function _updatePoolPanelState() {
	var running = SwimbotsApp.genePool.isSimulationRunning();
	if (running === _simRunning) return;
	_simRunning = running;

	var presetBtns = document.querySelectorAll('[data-pool-preset]');
	var endPoolBtn = $('pool8Button');
	var foodSpecToggle = $('foodSpeciationToggle');
	var foodSpecCheckbox = $('foodSpeciationCheckbox');
	var title = $('startPoolTitle');

	if (running) {
		// Disable all preset buttons except "end pool"
		presetBtns.forEach(function(btn) {
			if (btn !== endPoolBtn) btn.disabled = true;
		});
		// Lock food speciation toggle (obstacle toggle stays always active)
		foodSpecToggle.classList.add('disabled');
		// Sync food speciation checkbox with actual simulation state
		foodSpecCheckbox.checked = SwimbotsApp.genePool.getFoodSpeciationEnabled();
		_updateFoodPlaceButtons();
		// Update title
		title.textContent = 'click "end pool" to stop';
	} else {
		// Re-enable everything
		presetBtns.forEach(function(btn) {
			btn.disabled = false;
		});
		foodSpecToggle.classList.remove('disabled');
		_updateFoodPlaceButtons();
		// Restore title
		title.textContent = 'start a new pool with one of these presets...';
	}
}

function updateUI() {
	let state = _getSimState();
	if (!state || !state.clock && state.clock !== 0) {
		// State not yet populated; schedule next check
		_scheduleNextUIUpdate();
		return;
	}

	// Update pool panel button state when simulation starts/stops
	_updatePoolPanelState();

	// update the view buttons...
	if (state.viewMode === ViewTrackingMode.NULL) {
		clearViewModeButtons();
	}

	// update the swimbot panel....
	if ($('swimbotPanel').style.visibility === 'visible') {
		let selectedSwimbot = state.selectedSwimbotID;

		if (selectedSwimbot === NULL_INDEX) {
			$('selectedSwimbotPanel').style.visibility = 'hidden';
			$('noSelectedSwimbotPanel').style.visibility = 'visible';
		} else {
			$('selectedSwimbotPanel').style.visibility = 'visible';
			$('noSelectedSwimbotPanel').style.visibility = 'hidden';

			let sb = _getSwimbotState();
			if (sb) {
				let goalDescription = _brainStateDescription(sb.brainState, sb.chosenMateIndex);

				let foodPreferenceText = sb.preferredFoodType === 1 ? "blue" : "green";
				let foodTypeText = sb.digestibleFoodType === 1 ? "blue" : "green";

				$('swimbotDataPanel').innerHTML = "<b>Info about the selected swimbot:</b>" +
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
		state.numFoodBits0,
		state.numFoodBits1,
		state.numFoodTypes > 1
	);

	// render the graph (always, panel is standalone)
	_graph.render();

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
		if ($('tweakGenesPanel').style.visibility === 'visible') {
			openTweakGenesPanel(selectedSwimbotID);
		}
	}
}

// under construction
function resize() {
	canvasID.width = window.innerWidth;
	canvasID.height = window.innerHeight;

	if (SwimbotsApp.genePool) {
		eventBus.emit(UI_CMD_SET_CANVAS_DIMENSIONS, {
			width: canvasID.width,
			height: canvasID.height
		});
	}
}

/**
 * Switch visibility of food place buttons based on food speciation state.
 */
function _updateFoodPlaceButtons() {
	var speciationOn = $('foodSpeciationCheckbox').checked;

	var singleBtn = $('addFoodBitButton');
	var greenBtn  = $('addGreenFoodBitButton');
	var blueBtn   = $('addBlueFoodBitButton');

	if (speciationOn) {
		singleBtn.style.display = 'none';
		greenBtn.style.display  = '';
		blueBtn.style.display   = '';
	} else {
		singleBtn.style.display = '';
		greenBtn.style.display  = 'none';
		blueBtn.style.display   = 'none';
	}
}

/**
 * Clear the active highlight from all food place buttons and reset simulation mode.
 */
function _clearFoodPlaceActive() {
	$('addFoodBitButton').classList.remove('foodPlaceActive');
	$('addGreenFoodBitButton').classList.remove('foodPlaceActive');
	$('addBlueFoodBitButton').classList.remove('foodPlaceActive');
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
	$('viewGoalButton').addEventListener('click', toggleGoalOverlay);
	$('showGoalsButton').addEventListener('click', toggleShowGoals);
	$('showPerceptionButton').addEventListener('click', toggleShowPerception);
	$('freezeButton').addEventListener('click', toggleSimulationRunning);
	$('noRenderButton').addEventListener('click', toggleRendering);
	$('fastButton').addEventListener('click', toggleFastRendering);

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

	// Ecosystem number inputs (saisie directe)
	document.querySelectorAll('.EcoSliderValueDisplay').forEach(function(input) {
		input.addEventListener('change', function() {
			let sliderId = this.id.replace('Value', 'Slider');
			let slider = $(sliderId);
			if (slider) {
				slider.value = this.value;
			}
			setEcosystemValueFromInput(sliderId, this.value);
		});
	});

	// Tweak default
	$('tweakDefaultButton').addEventListener('click', setEcosystemToDefaults);

	// Attraction radios
	document.querySelectorAll('input[name="attractionRadioButton"]').forEach(function(radio) {
		radio.addEventListener('change', chooseAttraction);
	});

	// Pool presets
	document.querySelectorAll('[data-pool-preset]').forEach(function(btn) {
		btn.addEventListener('click', function() {
			let pool = SimulationStartMode[this.getAttribute('data-pool-preset')];
			_chosenPoolToLoad = pool;

			// this overrides the UI asking the user to save the current pool first...
			switchToChosenPresetPool();
		});
	});

	// Food speciation toggle
	$('foodSpeciationCheckbox').addEventListener('change', function() {
		eventBus.emit(UI_CMD_SET_FOOD_SPECIATION, this.checked);
		_updateFoodPlaceButtons();
	});

	// Obstacle placement toggle
	$('obstacleCheckbox').addEventListener('change', function() {
		eventBus.emit(UI_CMD_SET_OBSTACLE_PLACE_MODE, this.checked);
	});

	// Food place buttons
	$('addFoodBitButton').addEventListener('click', function() {
		if (this.classList.contains('foodPlaceActive')) {
			this.classList.remove('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, -1);
		} else {
			_clearFoodPlaceActive();
			this.classList.add('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, 0);
		}
	});
	$('addGreenFoodBitButton').addEventListener('click', function() {
		if (this.classList.contains('foodPlaceActive')) {
			this.classList.remove('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, -1);
		} else {
			_clearFoodPlaceActive();
			this.classList.add('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, 0);
		}
	});
	$('addBlueFoodBitButton').addEventListener('click', function() {
		if (this.classList.contains('foodPlaceActive')) {
			this.classList.remove('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, -1);
		} else {
			_clearFoodPlaceActive();
			this.classList.add('foodPlaceActive');
			eventBus.emit(UI_CMD_SET_FOOD_PLACE_MODE, 1);
		}
	});

	// Pool save / load
	$('saveButton').addEventListener('click', requestToSavePool);
	$('loadButton').addEventListener('click', function() {
		requestToLoadPoolFromFile();
	});
	$('fileInput').addEventListener('change', readLocalFile);

	// Swimbot gene save / load
	$('loadGenesButton').addEventListener('click', requestToLoadSwimbotFromFile);
	$('swimbotFileInput').addEventListener('change', readSwimbotFile);

	// Swimbot creation
	$('createRandomSwimbotButton').addEventListener('click', function() {
		eventBus.emit(UI_CMD_MAKE_RANDOM_SWIMBOT);
	});

	// Swimbot presets
	document.querySelectorAll('[data-swimbot-preset]').forEach(function(btn) {
		btn.addEventListener('click', function() {
			loadSwimbotFromPreset(parseInt(this.getAttribute('data-swimbot-preset')));
		});
	});

	// Selected swimbot actions
	$('zapSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_ZAP_SWIMBOT, { id: state.selectedSwimbotID, amount: 0.2 });
		}
	});
	$('randomizeSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_RANDOMIZE_SWIMBOT, state.selectedSwimbotID);
		}
	});
	$('cloneSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_CLONE_SWIMBOT, state.selectedSwimbotID);
		}
	});
	$('killSwimbotButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			eventBus.emit(UI_CMD_KILL_SWIMBOT, state.selectedSwimbotID);
		}
	});
	$('showGenesButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			showSwimbotGenes(state.selectedSwimbotID);
		}
	});
	$('tweakGenesButton').addEventListener('click', function() {
		let state = _getSimState();
		if (state) {
			openTweakGenesPanel(state.selectedSwimbotID);
			eventBus.emit(UI_CMD_SET_VIEW_MODE, ViewTrackingMode.SELECTED);
		}
	});

	// Info panel
	$('prevInfoButton').addEventListener('click', function() { advanceInfoPage(-1); });
	$('nextInfoButton').addEventListener('click', function() { advanceInfoPage(1); });

	// Popup/display
	$('cancelPopUpPanelButton').addEventListener('click', closePopupPanel);
	$('closeDataDisplay').addEventListener('click', closeDataDisplay);
	$('closeTweakGenesPanel').addEventListener('click', closeTweakGenesPanel);
	$('noRenderPanel').addEventListener('click', function() { setRendering(true); });

	// Graph controls
	$('samplesPerTickInput').addEventListener('change', function() {
		var val = parseInt(this.value);
		if (isNaN(val)) val = 1;
		_graph.setSamplesPerTick(val);
	});
}

$('Canvas').onmousedown = function(e) {
	clearViewMode();

	eventBus.emit(UI_CMD_TOUCH_DOWN, {
		x: e.pageX - $('Canvas').offsetLeft,
		y: e.pageY - $('Canvas').offsetTop
	});

	notifyGeneTweakPanelMouseDown();
}

$('Canvas').onmousemove = function(e) {
	eventBus.emit(UI_CMD_TOUCH_MOVE, {
		x: e.pageX - $('Canvas').offsetLeft,
		y: e.pageY - $('Canvas').offsetTop
	});
}

$('Canvas').onmouseup = function(e) {
	eventBus.emit(UI_CMD_TOUCH_UP, {
		x: e.pageX - $('Canvas').offsetLeft,
		y: e.pageY - $('Canvas').offsetTop
	});
}

$('Canvas').onmouseout = function(e) {
	eventBus.emit(UI_CMD_TOUCH_OUT, {
		x: e.pageX - $('Canvas').offsetLeft,
		y: e.pageY - $('Canvas').offsetTop
	});
}
// mouse wheel for camera zoom
$('Canvas').onwheel = function(e) {
	e.preventDefault();

	let cameraNavAction = (e.deltaY < 0)
		? CameraNavigationAction.IN
		: CameraNavigationAction.OUT;

	eventBus.emit(UI_CMD_START_CAMERA_NAV, cameraNavAction);

	// Small delay so the render loop has time to process the zoom before we stop
	setTimeout(function() {
		eventBus.emit(UI_CMD_STOP_CAMERA_NAV, cameraNavAction);
	}, 50);

	clearViewMode();
}

document.onkeydown = function(e) {
	// keys for camera navigation
	let cameraNavAction = -1;

	if (e.key === "ArrowLeft"){cameraNavAction = CameraNavigationAction.LEFT;}
	if (e.key === "ArrowRight"){cameraNavAction = CameraNavigationAction.RIGHT;}
	if (e.key === "ArrowUp"){ cameraNavAction = CameraNavigationAction.UP;}
	if (e.key === "ArrowDown"){ cameraNavAction = CameraNavigationAction.DOWN;}
	if (e.key === "-"){ cameraNavAction = CameraNavigationAction.IN;} // plus key
	if (e.key === "+"){ cameraNavAction = CameraNavigationAction.OUT;} // minus key

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

//------------------------------
/**
 * Floating panel: drag & drop + expand / collapse.
 */
function initFloatingPanel() {
	const panel = $("masterPanel");
	const header = $("masterPanelHeader");
	const content = $("masterPanelContent");
	const toggleBtn = $("toggleMasterPanel");

	if (!panel || !header || !content || !toggleBtn) return;

	// 1. Expand / Collapse
	let collapsed = false;
	toggleBtn.addEventListener("click", function(e) {
		e.stopPropagation();
		collapsed = !collapsed;
		if (collapsed) {
			content.style.display = "none";
			panel.style.minHeight = "0";
			toggleBtn.innerText = "+";
		} else {
			content.style.display = "flex";
			panel.style.minHeight = "";
			toggleBtn.innerText = "−";
		}
	});

	// 2. Drag & Drop
	let dragOffsetX = 0, dragOffsetY = 0;

	header.addEventListener("mousedown", function(e) {
		if (e.target === toggleBtn) return;
		e.preventDefault();
		dragOffsetX = e.clientX - panel.offsetLeft;
		dragOffsetY = e.clientY - panel.offsetTop;

		// Switch from CSS `right` to explicit `left` so the drag math works cleanly.
		panel.style.right = "auto";

		document.addEventListener("mousemove", elementDrag);
		document.addEventListener("mouseup", closeDragElement);
	});

	function elementDrag(e) {
		e.preventDefault();
		panel.style.left = (e.clientX - dragOffsetX) + "px";
		panel.style.top = (e.clientY - dragOffsetY) + "px";
	}

	function closeDragElement() {
		document.removeEventListener("mousemove", elementDrag);
		document.removeEventListener("mouseup", closeDragElement);
	}
}

//------------------------------
/**
 * Graph panel: drag & drop + expand / collapse + resize.
 * Mirrors initFloatingPanel() for the master panel.
 */
function initGraphPanel() {
	const panel = $("graphPanel");
	const header = $("graphPanelHeader");
	const content = $("graphPanelContent");
	const toggleBtn = $("toggleGraphPanel");
	const resizeHandle = $("graphPanelResize");
	const canvas = $("graphCanvas");

	if (!panel || !header || !content || !toggleBtn) return;

	// 1. Expand / Collapse
	let collapsed = false;
	toggleBtn.addEventListener("click", function(e) {
		e.stopPropagation();
		collapsed = !collapsed;
		if (collapsed) {
			content.style.display = "none";
			panel.style.minHeight = "0";
			toggleBtn.innerText = "+";
		} else {
			content.style.display = "flex";
			panel.style.minHeight = "";
			toggleBtn.innerText = "−";
		}
	});

	// 2. Drag & Drop
	let dragOffsetX = 0, dragOffsetY = 0;

	header.addEventListener("mousedown", function(e) {
		if (e.target === toggleBtn) return;
		e.preventDefault();
		dragOffsetX = e.clientX - panel.offsetLeft;
		dragOffsetY = e.clientY - panel.offsetTop;

		// Switch from CSS `right` to explicit `left` so the drag math works cleanly.
		panel.style.right = "auto";

		document.addEventListener("mousemove", elementDrag);
		document.addEventListener("mouseup", closeDragElement);
	});

	function elementDrag(e) {
		e.preventDefault();
		panel.style.left = (e.clientX - dragOffsetX) + "px";
		panel.style.top = (e.clientY - dragOffsetY) + "px";
	}

	function closeDragElement() {
		document.removeEventListener("mousemove", elementDrag);
		document.removeEventListener("mouseup", closeDragElement);
	}

	// 3. Resize via bottom-right handle
	var resizeStartX = 0, resizeStartY = 0, resizeStartW = 0, resizeStartH = 0;

	if (resizeHandle) {
		resizeHandle.addEventListener("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			resizeStartX = e.clientX;
			resizeStartY = e.clientY;
			resizeStartW = panel.offsetWidth;
			resizeStartH = panel.offsetHeight;
			document.addEventListener("mousemove", onResize);
			document.addEventListener("mouseup", onResizeEnd);
		});

		function onResize(e) {
			e.preventDefault();
			var dx = e.clientX - resizeStartX;
			var dy = e.clientY - resizeStartY;
			var newW = Math.max(300, resizeStartW + dx);
			var newH = Math.max(200, resizeStartH + dy);
			panel.style.width = newW + "px";
			panel.style.height = newH + "px";

			// Resize the canvas to fit the new panel width
			var canvasNewW = Math.max(200, newW - 20); // 20px padding
			canvas.width = canvasNewW;
			canvas.style.width = canvasNewW + "px";
		}

		function onResizeEnd() {
			document.removeEventListener("mousemove", onResize);
			document.removeEventListener("mouseup", onResizeEnd);
		}
	}
}

//------------------------------
