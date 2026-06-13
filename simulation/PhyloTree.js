"use strict";

//  constants
const MAX_SPECIES = 200;
const MIN_SWIMBOTS_PER_SPECIES = 10;

class Species {
	constructor() {
		this.ID = NULL_INDEX;
		this.parentID = NULL_INDEX;
		this.mode = [];
		this.numSwimbots = 0;
		this.startTime = 0;
		this.endTime = 0;
	}
}

class PhyloTree {
	constructor() {
		this._numSpecies = 0;
		this._numJunkGenes = 0;
		this._species = new Array(MAX_SPECIES);

		for (let s = 0; s < MAX_SPECIES; s++) {
			this._species[s] = new Species();
		}
	}

	initialize(numJunkGenes) {
		this._numSpecies = 0;

		for (let s = 0; s < MAX_SPECIES; s++) {
			this._species[s].numSwimbots = 0;
			this._species[s].ID = NULL_INDEX;
			this._species[s].parentID = NULL_INDEX;
			this._species[s].startTime = 0;
			this._species[s].endTime = 0;
		}

		this._numJunkGenes = numJunkGenes;
	}

	addJunkDNA(junkDNAArray) {
		for (let g = 0; g < this._numJunkGenes; g++) {}
	}
}
