"use strict";

/**
 * SwimbotPhysics — Manages kinematics, body part animation, fluid forces,
 * wall collisions, and center-of-mass adjustments.
 *
 * Operates on the Swimbot instance's physics-related fields.
 */
class SwimbotPhysics {
    constructor(swimbot) {
        this._swimbot = swimbot;
    }

    // ------------------------------------------------------------------
    // Body part animation
    // ------------------------------------------------------------------

    /**
     * Update all body part positions, angles, and velocities.
     * Handles growth, bending, center-of-mass, and select radius.
     */
    updateBodyParts() {
        const s = this._swimbot;
        let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;

        // swimmer is not old yet
        if (s._age < oldAgeThreshold) {
            if (s._age < YOUNG_AGE_DURATION) {
                // swimmer is still growing
                s._growthScale = s._age / YOUNG_AGE_DURATION;
            } else {
                s._growthScale = ONE;
            }

            assert(s._growthScale >= 0.0, "assert swimbot.js:updateBodyParts: _growthScale >= 0.0")
            assert(s._growthScale <= 1.0, "assert swimbot.js:updateBodyParts: _growthScale <= 1.0")

            // slowing down because starving,
            // but not slowing down to a full stop.
            if (s._energy < STARVING) {
                s._timerDelta = s._energy / STARVING;

                if (s._timerDelta < STARVING_TIMER_DELTA) {
                    s._timerDelta = STARVING_TIMER_DELTA;
                }
            } else {
                s._timerDelta += TIMER_DELTA_INCREASE_RATE;

                if (s._timerDelta > ONE) {
                    s._timerDelta = ONE;
                }
            }
        } else
        // swimmer is past old age threshold
        {
            // dying of old age
            if (s._age > globalTweakers.maximumLifeSpan) {
                s.die();
            } else {
                // slowing down because dying
                s._timerDelta = ONE - (s._age - oldAgeThreshold) / OLD_AGE_DURATION;

                assert(s._timerDelta >= 0.0, "assert swimbot.js:updateBodyParts: _timerDelta >= 0.0")
                assert(s._timerDelta <= 1.0, "assert swimbot.js:updateBodyParts: _timerDelta <= 1.0")
            }
        }

        s._timer += s._timerDelta;

        // calculate the modulators as a function of the dot between the
        // heading and the perpendicular of the direction to the goal
        let radian = s._angle * PI_OVER_180;

        s._heading.x = Math.sin(radian);
        s._heading.y = Math.cos(radian);

        let perpX = s._heading.y;
        let perpY = -s._heading.x;

        let directionDot = s._focusDirection.x * perpX + s._focusDirection.y * perpY;

        // set root position and angle
        s._phenotype.parts[ROOT_PART].position.set(s._position);
        s._phenotype.parts[ROOT_PART].currentAngle = s._angle - this.getMomentAdjustment();

        // loop through parts to determine angle and position
        for (let p = 1; p < s._phenotype.numParts; p++) {
            s._phenotype.parts[p].position.set(s.getPartParentPosition(p));

            // determine current angle
            s._phenotype.parts[p].currentAngle =
                s._phenotype.parts[s._phenotype.parts[p].parent].currentAngle +
                s._phenotype.parts[p].angle;

            // add motion
            if (p > 1) // because part 1 has nothing to 'bend' off of
            {
                let ampModulator = s._phenotype.parts[p].turnAmp * directionDot;
                let phaseModulator = s._phenotype.parts[p].turnPhase * directionDot;

                let radian = s._timer * s._phenotype.frequency + (s._phenotype.parts[p].phase + phaseModulator);
                s._phenotype.parts[p].bendingAngle = (s._phenotype.parts[p].amp + ampModulator) * Math.sin(radian);
                s._phenotype.parts[p].currentAngle += s._phenotype.parts[p].bendingAngle;
            }

            // determine position
            let radian = s._phenotype.parts[p].currentAngle * PI_OVER_180;
            let length = s._phenotype.parts[p].length;

            if (s._age < YOUNG_AGE_DURATION) {
                length *= s._growthScale;
            }

            let x = length * Math.sin(radian);
            let y = length * Math.cos(radian);
            s._phenotype.parts[p].previousMid.setXY(s._phenotype.parts[p].midPosition.x, s._phenotype.parts[p].midPosition.y);
            s._phenotype.parts[p].midPosition.setXY(s._phenotype.parts[p].position.x, s._phenotype.parts[p].position.y);
            s._phenotype.parts[p].position.addXY(x, y);
            s._phenotype.parts[p].midPosition.addXY(x * ONE_HALF, y * ONE_HALF);

            // get part axis
            s._phenotype.parts[p].axis.x = s._phenotype.parts[p].position.x - s._phenotype.parts[s._phenotype.parts[p].parent].position.x;
            s._phenotype.parts[p].axis.y = s._phenotype.parts[p].position.y - s._phenotype.parts[s._phenotype.parts[p].parent].position.y;

            // get perpendicular of part axis
            s._phenotype.parts[p].perpendicular.setXY(s._phenotype.parts[p].axis.y / length, -s._phenotype.parts[p].axis.x / length);

            // calculate part velocity now
            s._phenotype.parts[p].velocity.setToDifference(s._phenotype.parts[p].midPosition, s._phenotype.parts[p].previousMid);
        }

        // calculate center of mass
        this.calculateCenterOfMass();

        // here is where I shift all my body nodes
        // to keep my center of mass in place...
        this.adjustToCenterOfMass();

        // I need to do this again because I
        // just did an adjustToCenterOfMass
        this.calculateCenterOfMass();

        // calculate select radius
        // (this is a weird hacky solution)
        if (s._age % 20 === 0) {
            for (let p = 1; p < s._phenotype.numParts; p++) {
                for (let o = 1; o < s._phenotype.numParts; o++) {
                    if (o != p) {
                        let distance = s._phenotype.parts[p].position.getDistanceTo(s._phenotype.parts[o].position);

                        distance = SWIMBOT_SELECT_RADIUS_SCALAR * Math.sqrt(distance);

                        if (distance > s._selectRadius) {
                            s._selectRadius = distance;
                        }
                    }
                }
            }
        }
    }

    // ------------------------------------------------------------------
    // Moment & center-of-mass helpers
    // ------------------------------------------------------------------

    getMomentAdjustment() {
        const s = this._swimbot;
        let momentAdjustment = ZERO;

        // part 1 is not involved here..
        for (let p = 2; p < s._phenotype.numParts; p++) {
            momentAdjustment += s._phenotype.parts[p].bendingAngle * s._phenotype.parts[p].momentFactor;
        }

        return momentAdjustment;
    }

    /**
     * Calculate center of mass based on part positions and masses.
     */
    calculateCenterOfMass() {
        const s = this._swimbot;
        s._centerOfMass.clear();

        for (let p = 1; p < s._phenotype.numParts; p++) {
            s._centerOfMass.addScaled(s._phenotype.parts[p].midPosition, s._phenotype.parts[p].mass);
        }

        s._centerOfMass.scale(ONE / s._phenotype.mass);
    }

    /**
     * Adjust all body parts so the center of mass stays at the swimbot's position.
     */
    adjustToCenterOfMass() {
        const s = this._swimbot;
        let offsetX = s._position.x - s._centerOfMass.x;
        let offsetY = s._position.y - s._centerOfMass.y;

        for (let p = 0; p < s._phenotype.numParts; p++) {
            s._phenotype.parts[p].position.addXY(offsetX, offsetY);
            s._phenotype.parts[p].midPosition.addXY(offsetX, offsetY);
        }
    }

    /**
     * Precompute moment factors and descendant lists for physics simulation.
     */
    computeMomentFactors() {
        const s = this._swimbot;
        this.determinePartDecendents();

        let oneOverMass = ONE / s._phenotype.mass;

        for (let p = 2; p < s._phenotype.numParts; p++) {
            let moment = s._phenotype.parts[p].mass * oneOverMass;

            for (let d = 1; d <= s._phenotype.parts[p].numDecendents; d++) {
                let decendent = s._phenotype.parts[p].decendent[d];
                moment += s._phenotype.parts[decendent].mass * oneOverMass;
            }

            s._phenotype.parts[p].momentFactor = moment;
        }
    }

    /**
     * Determine all "child" parts that descend from each part.
     */
    determinePartDecendents() {
        const s = this._swimbot;
        // The purpose of this function is to determine all
        // the "child" parts that descend from each part....
        for (let p = 1; p < s._phenotype.numParts; p++) {
            s._phenotype.parts[p].numDecendents = 0;

            // loop through all parts as potential decendents...
            for (let potentialDecendent = 1; potentialDecendent < s._phenotype.numParts; potentialDecendent++) {
                let testing = true;
                let root = potentialDecendent;

                // for each potential_decendent, see if it traces back to the part in question
                while (testing) {
                    root = s._phenotype.parts[root].parent; //trickle the root down the ancestral tree...

                    // we have traced a decendent
                    if (root == p) {
                        s._phenotype.parts[p].numDecendents++;
                        s._phenotype.parts[p].decendent[s._phenotype.parts[p].numDecendents] = potentialDecendent;
                        testing = false;
                    }

                    // quit if you have if traced all the way back to ROOT_PART
                    if (root == ROOT_PART) {
                        testing = false;
                    }
                }
            }
        }
    }

    // ------------------------------------------------------------------
    // Physics tick
    // ------------------------------------------------------------------

    /**
     * Main physics update: fluid forces, energy drain, wall collisions.
     */
    updatePhysics() {
        const s = this._swimbot;
        // a swimbot creates its own linear and angular forces via moving parts
        this.calculateFluidForces();

        if (s._age % ENERGY_EFFICIENCY_MEASUREMENT_PERIOD === 0) {
            this.calculateEnergyEfficiency();
        }

        // energy is always slowly draining
        s._energy -= CONTINUAL_ENERGY_DRAIN;

        // when energy hits zero, that means death
        if (s._energy <= ZERO) {
            s._energy = ZERO;
            s.die();
        }

        // wall collisions
        this.updateWallCollisions();
    }

    /**
     * Calculate propulsion forces generated by moving body parts.
     */
    calculateFluidForces() {
        const s = this._swimbot;
        // clear these out - they will be filled-in below...
        s._acceleration.clear();
        s._torque = ZERO;

        // loop through parts...
        assert(s._phenotype.numParts > 0, "_phenotype.numParts > 0");

        for (let p = 1; p < s._phenotype.numParts; p++) {
            // calculate this part's fraction of the total length
            let fractionOfWhole = s._phenotype.parts[p].length / s._phenotype.sumPartLengths;

            // calculate velocity
            s._phenotype.parts[p].velocity.setToDifference(s._phenotype.parts[p].midPosition, s._phenotype.parts[p].previousMid);

            // get stroke amplitude
            let strokeAmplitude = s._phenotype.parts[p].velocity.dotWith(s._phenotype.parts[p].perpendicular) * fractionOfWhole;

            let strokeForceX = s._phenotype.parts[p].perpendicular.x * strokeAmplitude;
            let strokeForceY = s._phenotype.parts[p].perpendicular.y * strokeAmplitude;

            // calculate energy lost from stroke
            // hey: this might be more accurate to nature if
            // it were something like angle bend times mass.
            s._energy -= Math.abs(strokeAmplitude) * ENERGY_USED_UP_SWIMMING;

            if (s._energy < ZERO) {
                s._energy = ZERO;
            }

            // calculate part vector from center
            let partVectorFromCenterX = s._phenotype.parts[p].midPosition.x - s._position.x;
            let partVectorFromCenterY = s._phenotype.parts[p].midPosition.y - s._position.y;

            // calculate part distance from center
            let xx = partVectorFromCenterX * partVectorFromCenterX;
            let yy = partVectorFromCenterY * partVectorFromCenterY;
            let distance = Math.sqrt(xx * xx + yy * yy);

            if (distance > ZERO) {
                // calculate part direction from center
                let partDirectionFromCenterX = partVectorFromCenterX / distance;
                let partDirectionFromCenterY = partVectorFromCenterY / distance;

                let partAccelerationX = -strokeForceX;
                let partAccelerationY = -strokeForceY;

                // accumulate acceleration
                s._acceleration.x += partAccelerationX;
                s._acceleration.y += partAccelerationY;

                // calculate perpendicular
                let partPerpendicularX = partVectorFromCenterY;
                let partPerpendicularY = -partVectorFromCenterX;

                // get dot of strokeForce with partPerpendicular
                let perpDot = (strokeForceX * partPerpendicularX + strokeForceY * partPerpendicularY) / s._phenotype.sumPartLengths;

                // accumulate torque
                let previousTorque = s._torque;
                s._torque -= perpDot;
            }
        }

        // apply linear and angular forces to velocity and spin
        s._velocity.add(s._acceleration);
        s._spin += s._torque; // * SPIN_SCALAR;

        // update position by velocity, and angle by spin
        s._position.add(s._velocity);
        s._angle += s._spin;
    }

    /**
     * Calculate energy efficiency (speed per energy spent).
     */
    calculateEnergyEfficiency() {
        const s = this._swimbot;
        // measure distance traveled and energy lost
        let distanceTraveled = s._position.getDistanceTo(s._lastPositionForEfficiencyMeasurement);

        let averageSpeed = distanceTraveled / ENERGY_EFFICIENCY_MEASUREMENT_PERIOD;
        let energyLost = s._lastEnergyForEfficiencyMeasurement - s._energy;

        //if swimbot ate food, energy went up, so cancel that....
        if (energyLost < ZERO) {
            energyLost = ZERO;
        }

        // calculate efficiency
        s._energyEfficiency = averageSpeed / (ONE + energyLost);

        // reset these values for the next go-round...
        s._lastPositionForEfficiencyMeasurement.set(s._position);
        s._lastEnergyForEfficiencyMeasurement = s._energy;
    }

    /**
     * Handle boundary collisions (bounce off pool walls).
     */
    updateWallCollisions() {
        const s = this._swimbot;
        // left wall
        if (s._position.x < POOL_LEFT + s._phenotype.sumPartLengths * ONE_HALF) {
            for (let p = 1; p < s._phenotype.numParts; p++) {
                let radius = s._phenotype.parts[p].length + s._phenotype.parts[p].width;
                let limit = POOL_LEFT + radius;

                if (s._phenotype.parts[p].position.x < limit) {
                    let penetration = limit - s._phenotype.parts[p].position.x;

                    s._position.x += penetration * WALL_BOUNCE;
                    s._velocity.x += penetration * WALL_BOUNCE;
                    s._directionToGoal.x += penetration * WALL_BOUNCE;
                    s._directionToGoal.normalize();
                }
            }
        }
        // right wall
        else if (s._position.x > POOL_RIGHT - s._phenotype.sumPartLengths * ONE_HALF) {
            for (let p = 1; p < s._phenotype.numParts; p++) {
                let radius = s._phenotype.parts[p].length + s._phenotype.parts[p].width;
                let limit = POOL_RIGHT - radius;

                if (s._phenotype.parts[p].position.x > limit) {
                    let penetration = limit - s._phenotype.parts[p].position.x;

                    s._position.x += penetration * WALL_BOUNCE;
                    s._velocity.x += penetration * WALL_BOUNCE;
                    s._directionToGoal.x += penetration * WALL_BOUNCE;
                    s._directionToGoal.normalize();
                }
            }
        }

        // top wall
        if (s._position.y < POOL_TOP + s._phenotype.sumPartLengths * ONE_HALF) {
            for (let p = 1; p < s._phenotype.numParts; p++) {
                let radius = s._phenotype.parts[p].length + s._phenotype.parts[p].width;
                let limit = POOL_TOP + radius;

                if (s._phenotype.parts[p].position.y < limit) {
                    let penetration = limit - s._phenotype.parts[p].position.y;

                    s._position.y += penetration * WALL_BOUNCE;
                    s._velocity.y += penetration * WALL_BOUNCE;
                    s._directionToGoal.y += penetration * WALL_BOUNCE;
                    s._directionToGoal.normalize();
                }
            }
        }
        // bottom wall
        else if (s._position.y > POOL_BOTTOM - s._phenotype.sumPartLengths * ONE_HALF) {
            for (let p = 1; p < s._phenotype.numParts; p++) {
                let radius = s._phenotype.parts[p].length + s._phenotype.parts[p].width;
                let limit = POOL_BOTTOM - radius;

                if (s._phenotype.parts[p].position.y > limit) {
                    let penetration = limit - s._phenotype.parts[p].position.y;

                    s._position.y += penetration * WALL_BOUNCE;
                    s._velocity.y += penetration * WALL_BOUNCE;
                    s._directionToGoal.y += penetration * WALL_BOUNCE;
                    s._directionToGoal.normalize();
                }
            }
        }
    }

    // ------------------------------------------------------------------
    // Public setters/delegators (preserved for external callers)
    // ------------------------------------------------------------------

    setPosition(p) {
        const s = this._swimbot;
        s._position.set(p);

        // here is where I shift all my body nodes
        // to keep my center of mass in place...
        this.adjustToCenterOfMass();

        // I need to do this again because I
        // just did an adjustToCenterOfMass
        this.calculateCenterOfMass();
    }

    setVelocity(v) {
        this._swimbot._velocity.set(v);
    }

    addForce(force) {
        this._swimbot._velocity.add(force);
    }
}
