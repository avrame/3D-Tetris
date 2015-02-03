"use strict";

function Field() {
	var hexColors = {
		r: 16724787, // red
		g: 3407667, // green
		b: 255, // blue
		y: 16777011, // yellow
		pi: 16711935, // pink
		c: 3407871, // cyan
		pu: 6684774, // purple
		gr: 11184810 // grey
	},
	    cubeGeometry = new THREE.BoxGeometry(1, 1, 1),
	    cubeMeshArray = new Array(),
	    cubeArray = new Array(),
	    nextCubeMeshArray = new Array();

	// Create 2d field arrays cubeMeshArray and cubeArray
	for (var x = 0; x < 10; x++) {
		cubeMeshArray[x] = new Array(20);
		cubeArray[x] = new Array(20);
		for (var y = 0; y < 20; y++) {
			var cubeMaterial = new THREE.MeshLambertMaterial({ color: 3355647 });
			cubeMeshArray[x][y] = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cubeMeshArray[x][y].position.set(x, y, 0);
			cubeMeshArray[x][y].scale.set(0.95, 0.95, 0.95);
			cubeArray[x][y] = "e";
		}
	}

	// Initialize the next tetrinomino cube array
	for (var x = 0; x < 5; x++) {
		nextCubeMeshArray[x] = new Array(5);
		for (var y = 0; y < 5; y++) {
			var cubeMaterial = new THREE.MeshLambertMaterial({ color: 3355647 });
			nextCubeMeshArray[x][y] = new THREE.Mesh(cubeGeometry, cubeMaterial);
			nextCubeMeshArray[x][y].position.set(x + 12, y + 12, 0);
			nextCubeMeshArray[x][y].scale.set(0.95, 0.95, 0.95);
		}
	}


	this.drawCube = function (x, y, color) {
		if (x >= 0 && x < 10 && y >= 0 && y < 20) {
			if (color) cubeMeshArray[x][y].material.color.setHex(hexColors[color]);
			cubeMeshArray[x][y].scale.set(0.95, 0.95, 0.95);
			scene.add(cubeMeshArray[x][y]);
		}
	};
	this.drawNextCube = function (x, y, color) {
		if (x >= 0 && x < 5 && y >= 0 && y < 5) {
			if (color) nextCubeMeshArray[x][y].material.color.setHex(hexColors[color]);
			nextCubeMeshArray[x][y].scale.set(0.95, 0.95, 0.95);
			scene.add(nextCubeMeshArray[x][y]);
		}
	};
	this.clearNextTetField = function () {
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				scene.remove(nextCubeMeshArray[x][y]);
			}
		}
	};
	this.clear = function () {
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < 20; y++) {
				scene.remove(cubeMeshArray[x][y]);
				cubeArray[x][y] = "e";
			}
		}
	};
	this.eraseCube = function (x, y) {
		if (x >= 0 && x < 10 && y >= 0 && y < 20) {
			scene.remove(cubeMeshArray[x][y]);
			cubeArray[x][y] = "e";
		}
	};
	this.freezeCube = function (x, y, color) {
		if (x >= 0 && x < 10 && y >= 0 && y < 20) {
			cubeArray[x][y] = color;
		}
	};
	this.isFrozen = function (x, y) {
		if (x >= 0 && x < 10 && y >= 0 && y < 20) {
			return cubeArray[x][y] != "e";
		}
	};
	this.disolveCube = function (x, y) {
		var shrinkInterval = undefined;
		if (x >= 0 && x < 10 && y >= 0 && y < 20) {
			shrinkInterval = setInterval(shrinkCube.bind(this), 10);
		}

		var size = 0.9;

		function shrinkCube() {
			cubeMeshArray[x][y].scale.set(size, size, size);
			size -= 0.05;
			if (size <= 0) {
				clearInterval(shrinkInterval);
				this.eraseCube(x, y);
			}
		}
	};
	this.findAndRemoveCompletedRows = function () {
		// Find rows to remove
		var rowsToRemove = new Array();

		for (var y = 0; y < 20; y++) {
			for (var x = 0; x < 10; x++) {
				if (cubeArray[x][y] == "e") {
					break;
				} else {
					if (x === 9) {
						// The row is completed
						rowsToRemove.push(y);
					}
				}
			}
		}

		var numRowsToRemove = rowsToRemove.length;

		if (numRowsToRemove > 0) {
			audio_disolve.play();

			// Remove any completed rows
			for (var i = 0; i < numRowsToRemove; i++) {
				for (var x = 0; x < 10; x++) {
					this.disolveCube(x, rowsToRemove[i]);
				}
			}
			// Increase the total cleared lines
			stats.increaseLines(numRowsToRemove);
			stats.increaseScoreFromLines(numRowsToRemove);
			var dropRowsTimer = setTimeout(dropRows.bind(this), 400);
		} else {
			createNewTet();
		}

		function dropRows() {
			// Drop the rows above each removed row
			for (var i = rowsToRemove.length - 1; i >= 0; i--) {
				for (var y = rowsToRemove[i]; y < 19; y++) {
					for (var x = 0; x < 10; x++) {
						var color = cubeArray[x][y + 1];
						if (color !== "e") {
							this.drawCube(x, y, color);
							this.freezeCube(x, y, color);
							this.eraseCube(x, y + 1);
						}
					}
				}
			}

			// Once rows have dropped, create new tet
			createNewTet();
		}
	};
}

var field = new Field();