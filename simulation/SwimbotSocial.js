"use strict";

/**
 * SwimbotSocial — Computes attractiveness scores and similarity metrics
 * used for mate selection.
 *
 * Operates on the Swimbot instance's phenotype and brain.
 */
class SwimbotSocial {
    constructor(swimbot) {
        this._swimbot = swimbot;
    }

    /**
     * Compute attractiveness score based on the judge's attraction criterion.
     */
    getAttractiveness(judge) {
        const s = this._swimbot;
        let attractiveness = Math.random();

        let attractionCriterion = s._brain.getAttractionCriterion();

        if (attractionCriterion === ATTRACTION_COLORFUL) { attractiveness = this.getColorSaturation(); }
        if (attractionCriterion === ATTRACTION_BIG) { attractiveness = this.getCurrentBodyBigness(); }
        if (attractionCriterion === ATTRACTION_HYPER) { attractiveness = this.getCurrentBodyHyperness(); }
        if (attractionCriterion === ATTRACTION_LONG) { attractiveness = this.getCurrentBodyLongness(); }
        if (attractionCriterion === ATTRACTION_STRAIGHT) { attractiveness = this.getCurrentBodyStraightness(); }

        if (attractionCriterion === ATTRACTION_NO_COLOR) { attractiveness = ONE - this.getColorSaturation(); }
        if (attractionCriterion === ATTRACTION_SMALL) { attractiveness = ONE - this.getCurrentBodyBigness(); }
        if (attractionCriterion === ATTRACTION_STILL) { attractiveness = ONE - this.getCurrentBodyHyperness(); }
        if (attractionCriterion === ATTRACTION_SHORT) { attractiveness = ONE - this.getCurrentBodyLongness(); }
        if (attractionCriterion === ATTRACTION_CROOKED) { attractiveness = ONE - this.getCurrentBodyStraightness(); }

        if (attractionCriterion === ATTRACTION_SIMILAR_COLOR) { attractiveness = this.getColorSimilarity(judge); }
        if (attractionCriterion === ATTRACTION_SIMILAR_SIZE) { attractiveness = this.getBignessSimilarity(judge); }
        if (attractionCriterion === ATTRACTION_SIMILAR_HYPER) { attractiveness = this.getHypernessSimilarity(judge); }
        if (attractionCriterion === ATTRACTION_SIMILAR_LENGTH) { attractiveness = this.getLengthSimilarity(judge); }
        if (attractionCriterion === ATTRACTION_SIMILAR_STRAIGHT) { attractiveness = this.getStraightessSimilarity(judge); }

        if (attractionCriterion === ATTRACTION_CLOSEST) { attractiveness = this.getCloseness(judge); }
        if (attractionCriterion === ATTRACTION_RANDOM) { attractiveness = Math.random(); }

        return attractiveness;
    }

    // ------------------------------------------------------------------
    // Individual metrics
    // ------------------------------------------------------------------

    getColorSaturation() {
        const s = this._swimbot;
        let saturation = ZERO;
        let accumulatedMass = ZERO;

        for (let p = 1; p < s._phenotype.numParts; p++) {
            accumulatedMass += s._phenotype.parts[p].mass;

            let rgDiff = Math.abs(s._phenotype.parts[p].red - s._phenotype.parts[p].green);
            let rbDiff = Math.abs(s._phenotype.parts[p].red - s._phenotype.parts[p].blue);
            let gbDiff = Math.abs(s._phenotype.parts[p].green - s._phenotype.parts[p].blue);

            let thisPartSaturation = (rgDiff + rbDiff + gbDiff) / 3;

            assert(thisPartSaturation <= ONE, "thisPartSaturation <= ONE");

            thisPartSaturation *= s._phenotype.parts[p].mass

            saturation += thisPartSaturation;
        }

        assert(accumulatedMass > ZERO, "getColorSaturation: accumulatedMass > ZERO");

        saturation /= accumulatedMass;

        assert(saturation <= ONE, "getColorSaturation: saturation <= ONE");

        return saturation;
    }

    getCloseness(judge) {
        const s = this._swimbot;
        let closest = SWIMBOT_VIEW_RADIUS; //maximum

        let distance = s._position.getDistanceTo(judge.getPosition());

        if (distance < closest) {
            closest = distance;
        }

        return ONE - (closest / SWIMBOT_VIEW_RADIUS);
    }

    getSimilarity(judge) {
        let amount = this.getColorSimilarity(judge) +
            this.getBignessSimilarity(judge) +
            this.getHypernessSimilarity(judge) +
            this.getLengthSimilarity(judge) +
            this.getStraightessSimilarity(judge);

        amount /= 5;

        return amount;
    }

    getColorSimilarity(judge) {
        const s = this._swimbot;
        let amount = ZERO;

        let c1 = judge.getAverageColor();
        let c2 = this.getAverageColor();

        let rDiff = Math.abs(c2.red - c1.red);
        let gDiff = Math.abs(c2.green - c1.green);
        let bDiff = Math.abs(c2.blue - c1.blue);

        amount = ONE - ((rDiff + gDiff + bDiff) * ONE_THIRD);

        return amount;
    }

    getBignessSimilarity(judge) {
        let amount = ZERO;

        let b1 = judge.getCurrentBodyBigness();
        let b2 = this.getCurrentBodyBigness();

        amount = ONE - Math.abs(b1 - b2);

        return amount;
    }

    getHypernessSimilarity(judge) {
        let amount = ZERO;

        let b1 = judge.getCurrentBodyHyperness();
        let b2 = this.getCurrentBodyHyperness();

        amount = ONE - Math.abs(b1 - b2);

        return amount;
    }

    getLengthSimilarity(judge) {
        let amount = ZERO;

        let b1 = judge.getCurrentBodyLongness();
        let b2 = this.getCurrentBodyLongness();

        amount = ONE - Math.abs(b1 - b2);

        return amount;
    }

    getStraightessSimilarity(judge) {
        let amount = ZERO;

        let b1 = judge.getCurrentBodyStraightness();
        let b2 = this.getCurrentBodyStraightness();

        amount = ONE - Math.abs(b1 - b2);

        return amount;
    }

    // ------------------------------------------------------------------
    // Body measurements
    // ------------------------------------------------------------------

    getCurrentBodyBigness() {
        const s = this._swimbot;
        let amount = s._phenotype.mass / GREATEST_POSSIBLE_SWIMBOT_MASS;

        return amount;
    }

    getCurrentBodyLongness() {
        const s = this._swimbot;
        let amount = ZERO;

        for (let p = 1; p < s._phenotype.numParts; p++) {
            for (let pp = 1; pp < s._phenotype.numParts; pp++) {
                if (pp != p) {
                    let d = s._phenotype.parts[p].midPosition.getDistanceTo(s._phenotype.parts[pp].midPosition);

                    if (d > amount) {
                        amount = d;
                    }
                }
            }
        }

        amount /= GREATEST_POSSIBLE_SWIMBOT_LENGTH;

        return amount;
    }

    getCurrentBodyStraightness() {
        const s = this._swimbot;
        let amount = ZERO;

        // normalized vectors for each part axis
        let v = [];
        for (let p = 1; p < s._phenotype.numParts; p++) {
            v[p] = new Vector2D();
            v[p].setXY(s._phenotype.parts[p].axis.x / s._phenotype.parts[p].length, s._phenotype.parts[p].axis.y / s._phenotype.parts[p].length);
        }

        // finding the dot products between each pair of these vectors...
        if (s._phenotype.numParts < 3) {
            amount = ONE;
        } else {
            let numTests = 0;
            for (let p = 1; p < s._phenotype.numParts; p++) {
                for (let pp = p + 1; pp < s._phenotype.numParts; pp++) {
                    numTests++;
                    assert(p != pp, "Swimbot:getCurrentBodyStraightness: p != pp");
                    amount += Math.abs(v[p].dotWith(v[pp]));
                }
            }

            amount /= numTests;
        }

        // let's favor swimbots with more parts....
        amount *= 0.7;
        amount += (s._phenotype.numParts / MAX_PARTS) * 0.3;

        if (amount > ONE) {
            amount = ONE;
        }

        return amount;
    }

    getCurrentBodyHyperness() {
        const s = this._swimbot;
        let amount = ZERO;

        for (let p = 1; p < s._phenotype.numParts; p++) {
            amount += s._phenotype.parts[p].velocity.getMagnitude();
        }

        let FugdeFactorToScaleHyperAttraction = 0.4;

        amount *= FugdeFactorToScaleHyperAttraction;

        if (amount > ONE) {
            amount = ONE;
        }

        return amount;
    }

    /**
     * Get mass-weighted average color of the swimbot's body parts.
     */
    getAverageColor() {
        const s = this._swimbot;
        let r = ZERO;
        let g = ZERO;
        let b = ZERO;
        let accumulatedMass = ZERO;

        for (let p = 1; p < s._phenotype.numParts; p++) {
            accumulatedMass += s._phenotype.parts[p].mass;

            r += s._phenotype.parts[p].red * s._phenotype.parts[p].mass;
            g += s._phenotype.parts[p].green * s._phenotype.parts[p].mass;
            b += s._phenotype.parts[p].blue * s._phenotype.parts[p].mass;
        }

        assert(accumulatedMass > ZERO, "getAverageColor: accumulatedMass > ZERO");

        r /= accumulatedMass;
        g /= accumulatedMass;
        b /= accumulatedMass;

        assert(r <= ONE, "getAverageColor: r <= ONE");
        assert(g <= ONE, "getAverageColor: g <= ONE");
        assert(b <= ONE, "getAverageColor: b <= ONE");

        let c = new Color();
        c.red = r;
        c.green = g;
        c.blue = b;

        return c;
    }
}
