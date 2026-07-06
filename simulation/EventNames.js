"use strict";

/**
 * Central event name constants for the EventBus pub/sub system.
 * Prevents typos and provides a single source of truth for the event vocabulary.
 *
 * Naming convention:
 *   UI_CMD_*       — Commands emitted by the UI layer (consumed by GenePool)
 *   SIM_STATE_*    — State snapshots emitted by GenePool (consumed by UI)
 *   SIM_ACTION_*   — Action confirmations emitted by GenePool (consumed by UI)
 *   SWIMBOT_*      — Domain events (birth, death) emitted by GenePool
 */

// --- UI → Simulation commands ---
const UI_CMD_SET_FOOD_DELAY        = 'UI_CMD_SET_FOOD_DELAY';
const UI_CMD_SET_FOOD_SPREAD       = 'UI_CMD_SET_FOOD_SPREAD';
const UI_CMD_SET_FOOD_ENERGY       = 'UI_CMD_SET_FOOD_ENERGY';
const UI_CMD_SET_HUNGER_THRESHOLD  = 'UI_CMD_SET_HUNGER_THRESHOLD';
const UI_CMD_SET_OFFSPRING_RATIO   = 'UI_CMD_SET_OFFSPRING_RATIO';
const UI_CMD_SET_MAX_AGE           = 'UI_CMD_SET_MAX_AGE';
const UI_CMD_SET_MUTATION_RATE     = 'UI_CMD_SET_MUTATION_RATE';
const UI_CMD_SET_ATTRACTION        = 'UI_CMD_SET_ATTRACTION';
const UI_CMD_SET_ECOSYSTEM_DEFAULTS = 'UI_CMD_SET_ECOSYSTEM_DEFAULTS';
const UI_CMD_TOGGLE_SIMULATION     = 'UI_CMD_TOGGLE_SIMULATION';
const UI_CMD_SET_FAST_RENDERING    = 'UI_CMD_SET_FAST_RENDERING';
const UI_CMD_SET_RENDERING         = 'UI_CMD_SET_RENDERING';
const UI_CMD_TOGGLE_GOAL_OVERLAY   = 'UI_CMD_TOGGLE_GOAL_OVERLAY';
const UI_CMD_SET_VIEW_MODE         = 'UI_CMD_SET_VIEW_MODE';
const UI_CMD_CLEAR_VIEW_MODE       = 'UI_CMD_CLEAR_VIEW_MODE';
const UI_CMD_START_CAMERA_NAV      = 'UI_CMD_START_CAMERA_NAV';
const UI_CMD_STOP_CAMERA_NAV       = 'UI_CMD_STOP_CAMERA_NAV';
const UI_CMD_SET_FOOD_SPECIATION   = 'UI_CMD_SET_FOOD_SPECIATION';
const UI_CMD_MAKE_RANDOM_SWIMBOT   = 'UI_CMD_MAKE_RANDOM_SWIMBOT';
const UI_CMD_ZAP_SWIMBOT           = 'UI_CMD_ZAP_SWIMBOT';
const UI_CMD_RANDOMIZE_SWIMBOT     = 'UI_CMD_RANDOMIZE_SWIMBOT';
const UI_CMD_CLONE_SWIMBOT         = 'UI_CMD_CLONE_SWIMBOT';
const UI_CMD_KILL_SWIMBOT          = 'UI_CMD_KILL_SWIMBOT';
const UI_CMD_CREATE_WITH_GENES     = 'UI_CMD_CREATE_WITH_GENES';
const UI_CMD_TWEAK_GENE            = 'UI_CMD_TWEAK_GENE';
const UI_CMD_START_SIMULATION      = 'UI_CMD_START_SIMULATION';
const UI_CMD_TOUCH_DOWN            = 'UI_CMD_TOUCH_DOWN';
const UI_CMD_TOUCH_MOVE            = 'UI_CMD_TOUCH_MOVE';
const UI_CMD_TOUCH_UP              = 'UI_CMD_TOUCH_UP';
const UI_CMD_TOUCH_OUT             = 'UI_CMD_TOUCH_OUT';
const UI_CMD_SET_CANVAS_DIMENSIONS = 'UI_CMD_SET_CANVAS_DIMENSIONS';
const UI_CMD_SET_FOOD_PLACE_MODE   = 'UI_CMD_SET_FOOD_PLACE_MODE';
const UI_CMD_SET_OBSTACLE_PLACE_MODE = 'UI_CMD_SET_OBSTACLE_PLACE_MODE';
const UI_CMD_TOGGLE_SHOW_GOALS     = 'UI_CMD_TOGGLE_SHOW_GOALS';
const UI_CMD_TOGGLE_SHOW_PERCEPTION = 'UI_CMD_TOGGLE_SHOW_PERCEPTION';

// --- Simulation → UI state ---
const SIM_STATE_UPDATED            = 'SIM_STATE_UPDATED';

// --- Domain events (already in use) ---
const SWIMBOT_DIED                 = 'SWIMBOT_DIED';
const SWIMBOT_BORN                 = 'SWIMBOT_BORN';
const SWIMBOTS_UPDATED             = 'SWIMBOTS_UPDATED';
