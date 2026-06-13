"use strict";

const MAX_FAMILY_TREE_NODES = 5000;

class FamilyTreeNode {
	constructor() {
		//based on the index of the swimbot in the pool at the time the node was created
		this.poolIndex = NULL_INDEX;
		this.parent1PoolIndex = NULL_INDEX;
		this.parent2PoolIndex = NULL_INDEX;

		// consistent with the indeces in the node array
		this.parent1Index = NULL_INDEX;
		this.parent2Index = NULL_INDEX;

		this.birthTime = 0;
		this.deathTime = 0;
		this.genes = [];
	}
}

class FamilyTree {
	constructor() {
		this._nodes = [];
		this._numNodes = 0;
	}

	reset() {
		this._numNodes = 0;
		this._nodes = [];
		this._nodes.length = 0;
	}

	setDeathTime(poolIndex, deathTime) {
		assert(poolIndex != NULL_INDEX, "FamilyTree.js: this.setDeathTime: poolIndex != NULL_INDEX")

		let index = this._getIndexFromPoolIndex(poolIndex);

		if (index > NULL_INDEX) {
			this._nodes[index].deathTime = deathTime;
		}
	}


	//-------------------------------------------------------------------------------------------
	addNode(poolIndex, parent1PoolIndex, parent2PoolIndex, birthTime, genes) {
		// Circular buffer: evict oldest nodes when limit is reached
		if (this._numNodes >= MAX_FAMILY_TREE_NODES) {
			const REMOVE_COUNT = Math.floor(MAX_FAMILY_TREE_NODES * 0.1);
			this._nodes.splice(0, REMOVE_COUNT);
			this._numNodes -= REMOVE_COUNT;
		}

		// calculate the proper parent indices based on.....
		this._nodes[this._numNodes] = new FamilyTreeNode();
		this._nodes[this._numNodes].poolIndex = poolIndex;
		this._nodes[this._numNodes].parent1PoolIndex = parent1PoolIndex;
		this._nodes[this._numNodes].parent2PoolIndex = parent2PoolIndex;
		this._nodes[this._numNodes].parent1Index = this._getIndexFromPoolIndex(parent1PoolIndex);
		this._nodes[this._numNodes].parent2Index = this._getIndexFromPoolIndex(parent2PoolIndex);
		this._nodes[this._numNodes].birthTime = birthTime;
		this._nodes[this._numNodes].deathTime = 0;
		this._nodes[this._numNodes].genes = genes.slice();

		this._numNodes++;
	}

	_getIndexFromPoolIndex(poolIndex) {
		// important to loop backwards...because pool index values
		// can reoccur as a result of pool swimbot reincarnation.
		for (let n = this._numNodes - 1; n >= 0; n--) {
			if (poolIndex === this._nodes[n].poolIndex) {
				return n;
			}
		}

		return NULL_INDEX;
	}

	getNumNodes() { return this._numNodes; }
	getNodeParent1Index(index) { return this._nodes[index].parent1Index; }
	getNodeParent2Index(index) { return this._nodes[index].parent2Index; }
	getNodePoolIndex(index) { return this._nodes[index].poolIndex; }
	getNodeParent1PoolIndex(index) { return this._nodes[index].parent1PoolIndex; }
	getNodeParent2PoolIndex(index) { return this._nodes[index].parent2PoolIndex; }
	getNodeBirthTime(index) { return this._nodes[index].birthTime; }
	getNodeDeathTime(index) { return this._nodes[index].deathTime; }
	getNodeGenes(index) { return this._nodes[index].genes; }
}
