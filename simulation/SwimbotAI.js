"use strict";

/**
 * SwimbotAI — Manages the brain FSM, goal pursuit, food/mate targeting,
 * and environmental stimuli processing.
 *
 * Operates on the Swimbot instance's AI-related fields.
 */
class SwimbotAI {
    constructor(swimbot) {
        this._swimbot = swimbot;
    }

    /**
     * Main AI tick: update brain, evaluate goal proximity, adjust focus direction.
     */
    tick() {
        const s = this._swimbot;

        // update age
        s._age++;

        if (s._age % BRAIN_SENSORY_UPDATE_PERIOD == 0) {
            s._readyforSensoryInputToBrain = true;
        }

        // update brain
        s._brain.setEnergyLevel(s._energy);
        s._brain.update();

        // I wanna eat my chosen food bit...
        if (s._brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
            if ((s._chosenFoodBit != null) &&
                (s._chosenFoodBit.getAlive())) {
                let xx = s._chosenFoodBit.getPosition().x - s.getMouthPosition().x;
                let yy = s._chosenFoodBit.getPosition().y - s.getMouthPosition().y;
                let distance = Math.sqrt(xx * xx + yy * yy);

                // Abandon if the food is outside perception radius (stale target).
                if (distance > SWIMBOT_VIEW_RADIUS) {
                    s._brain.setFoundFoodBit(false);
                    s._chosenFoodBit = null;
                    s._chosenFoodBitIndex = NULL_INDEX;
                } else if (distance < SWIMBOT_MOUTH_LENGTH) {
                    s._tryingToEat = true;
                }
            }
        }

        // I wanna have sex with my chosen swimbot
        else if (s._brain.getState() === BRAIN_STATE_PURSUING_MATE) {
            if ((s._chosenMate != null) &&
                (s._chosenMate.getAlive())) {
                let xx = s._chosenMate.getGenitalPosition().x - s.getGenitalPosition().x;
                let yy = s._chosenMate.getGenitalPosition().y - s.getGenitalPosition().y;
                let distance = Math.sqrt(xx * xx + yy * yy);

                // Abandon if the mate is outside perception radius (stale target).
                if (distance > SWIMBOT_VIEW_RADIUS) {
                    s._brain.setFoundSwimbot(false);
                    s._chosenMate = null;
                    s._chosenMateIndex = NULL_INDEX;
                } else if (distance < SWIMBOT_GENITAL_LENGTH) {
                    s._tryingToMate = true;
                }
            }
        }

        // determine the direction to the goal...
        if ((s._brain.getState() === BRAIN_STATE_LOOKING_FOR_FOOD) ||
            (s._brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE)) {
            this.wanderFocus();
        } else if (s._brain.getState() == BRAIN_STATE_PURSUING_MATE) {
            if (s._chosenMate != null) {
                s._directionToGoal.set(s._chosenMate.getGenitalPosition());
                s._directionToGoal.subtract(s._phenotype.parts[GENITAL_INDEX].position);
                s._directionToGoal.normalize();
            }
        } else if (s._brain.getState() === BRAIN_STATE_PURSUING_FOOD) {
            if (s._chosenFoodBit != null) {
                s._directionToGoal.set(s._chosenFoodBit.getPosition());
                s._directionToGoal.subtract(s._phenotype.parts[MOUTH_INDEX].position);
                s._directionToGoal.normalize();
            }
        }

        // continually push the focus direction towards the goal
        let previousFocusDirection = new Vector2D();
        previousFocusDirection.set(s._focusDirection);

        s._focusDirection.addScaled(s._directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_STRENGTH);

        s._vectorUtility.setToDifference(s._focusDirection, previousFocusDirection);

        if (s._vectorUtility.getMagnitudeSquared() > BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD * BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD) {
            s._focusDirection.set(previousFocusDirection);
            s._focusDirection.addScaled(s._directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD);
        }

        s._focusDirection.normalize();
    }

    /**
     * Random wander when looking for food or mate.
     */
    wanderFocus() {
        const s = this._swimbot;
        let length = s._directionToGoal.getMagnitude();

        if (length === ZERO) {
            s._directionToGoal.x = -ONE_HALF + Math.random();
            s._directionToGoal.y = -ONE_HALF + Math.random();
            length = s._directionToGoal.getMagnitude();
        }

        s._directionToGoal.x += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);
        s._directionToGoal.y += (-BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT);

        s._directionToGoal.x /= length;
        s._directionToGoal.y /= length;
    }

    /**
     * Process nearby swimbots and food to feed the brain FSM.
     */
    setEnvironmentalStimuli(numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit) {
        const s = this._swimbot;
        const TOO_UGLY_TO_CHOOSE = ZERO;

        // if looking for a food bit, choose the one that was found
        s._chosenFoodBit = null;
        s._chosenFoodBitIndex = NULL_INDEX;

        if ((s._brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD) ||
            (s._brain.getState() == BRAIN_STATE_PURSUING_FOOD)) {
            s._brain.setFoundFoodBit(foodBitWasFound);

            if (foodBitWasFound) {
                assert(theFoodBit != null, "swimbot.js: setEnvironmentalStimuli: theFoodBit != null");
                s._chosenFoodBit = theFoodBit;
                s._chosenFoodBitIndex = s._chosenFoodBit.getIndex();
            }
        }

        // if looking for mate, scan the nearby swimbots and choose the most attractive...
        if (s._brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE) {
            let mostAttractiveFound = new Swimbot;
            let atLeastOneBabeIsVisible = false;
            let highestBabeFactor = -100.0;

            for (let o = 0; o < numNearbySwimbots; o++) {
                let babeFactor = nearbySwimbotArray[o].getAttractiveness(s);

                if ((babeFactor > highestBabeFactor) &&
                    (babeFactor > TOO_UGLY_TO_CHOOSE) &&
                    (nearbySwimbotArray[o].getAge() > YOUNG_AGE_DURATION) &&
                    (nearbySwimbotArray[o].getEnergy() > STARVING)) {
                    highestBabeFactor = babeFactor;
                    mostAttractiveFound = nearbySwimbotArray[o];
                    assert(mostAttractiveFound != null, "mostAttractiveFound != null");
                    atLeastOneBabeIsVisible = true;
                }
            }

            if (atLeastOneBabeIsVisible) {
                s._chosenMate = mostAttractiveFound;
                assert(s._chosenMate != null, "_chosenMate != null");

                s._chosenMateIndex = mostAttractiveFound.getIndex();
                assert(s._chosenMateIndex != NULL_INDEX, "_chosenMateIndex != NULL_INDEX");

                s._brain.setFoundSwimbot(true);
            } else {
                s._brain.setFoundSwimbot(false);
            }
        } else if (s._brain.getState() == BRAIN_STATE_PURSUING_MATE) {
            let ICanStillSeeYou = false;

            for (let o = 0; o < numNearbySwimbots; o++) {
                let index = nearbySwimbotArray[o].getIndex();
                if (index === s._chosenMateIndex) {
                    ICanStillSeeYou = true;
                    s._chosenMate = nearbySwimbotArray[o];
                }
            }

            if (ICanStillSeeYou) {

            } else {
                s._brain.setFoundSwimbot(false);
                s._chosenMate = null;
                s._chosenMateIndex = NULL_INDEX;
            }
        }

        // reset this to false for next time around
        s._readyforSensoryInputToBrain = false;
    }

    /**
     * Attempt to eat the chosen food bit.
     */
    eatChosenFoodBit() {
        const s = this._swimbot;
        assert(s._chosenFoodBit != null, "Swimbot:eatChosenFoodBit: _chosenFoodBit != null");
        assert(s._chosenFoodBit.getAlive(), "Swimbot:eatChosenFoodBit: _chosenFoodBit.getAlive()");

        if ((s._chosenFoodBit != null) &&
            (s._chosenFoodBit.getAlive())) {
            let energyFromFoodBit = s._chosenFoodBit.getEnergy();

            if (globalTweakers.numFoodTypes > 1) {
                // If the type of the chosen food bit is not compatible with the
                // digestible type of the swimbot, then it gets less energy...
                if (s._chosenFoodBit.getType() != s._phenotype.digestibleFoodType) {
                    energyFromFoodBit *= FOOD_TYPE_OFFSET;
                }
            }

            s._energy += energyFromFoodBit;

            s._numFoodBitsEaten++;

            assert(s._chosenFoodBit.getEnergy() >= ZERO, "Swimbot:eatChosenFoodBit: _chosenFoodBit.getEnergy() >= ZERO");

            s._tryingToEat = false;

            s._timerDelta = ZERO;

            assert(s._chosenFoodBitIndex != NULL_INDEX, "Swimbot:eatChosenFoodBit: _chosenFoodBitIndex != NULL_INDEX");

            s._chosenFoodBit.kill();
        }

        return s._chosenFoodBitIndex;
    }

    /**
     * Set the attraction criterion on the brain.
     */
    setAttraction(attraction) {
        this._swimbot._brain.setAttraction(attraction);
    }

    /**
     * Set hunger threshold on the brain.
     */
    setHungerThreshold(t) {
        this._swimbot._brain.setHungerThreshold(t);
    }
}
