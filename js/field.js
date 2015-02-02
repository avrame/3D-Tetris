
function Field() {
	var hexColors = {
		'r':  0xFF3333, // red
		'g':  0x33FF33, // green
		'b':  0x0000FF, // blue
		'y':  0xFFFF33, // yellow
		'pi': 0xFF00FF, // pink
		'c':  0x33FFFF, // cyan
		'pu': 0x660066, // purple
		'gr': 0xAAAAAA	// grey
	}

	var cubeGeometry = new THREE.BoxGeometry(1,1,1);
	var cubeMeshArray = new Array();
	var cubeArray = new Array();
	var nextCubeMeshArray = new Array();

	// Create 2d field arrays cubeMeshArray and cubeArray
	for(x=0; x<10; x++) {
		cubeMeshArray[x] = new Array(20);
		cubeArray[x] = new Array(20);
		for(y=0; y<20; y++) {
			var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x3333FF } );
			cubeMeshArray[x][y] = new THREE.Mesh( cubeGeometry, cubeMaterial );
			cubeMeshArray[x][y].position.set(x, y, 0);
			cubeMeshArray[x][y].scale.set(.95, .95, .95);
			cubeArray[x][y] = 'e';
		}
	}

	// Initialize the next tetrinomino cube array
	for(x=0; x<5; x++) {
		nextCubeMeshArray[x] = new Array(5);
		for(y=0; y<5; y++) {
			nextCubeMeshArray[x][y] = new THREE.Mesh( cubeGeometry, cubeMaterial );
			nextCubeMeshArray[x][y].position.set(x+12, y+12, 0);
			nextCubeMeshArray[x][y].scale.set(.95, .95, .95);
		}
	}


	this.drawCube = function(x, y, color) {
		if (x >= 0 && x < 10 && y >=0 && y < 20) {
			if (color) cubeMeshArray[x][y].material.color.setHex(hexColors[color]);
			cubeMeshArray[x][y].scale.set(.95, .95, .95);
			scene.add( cubeMeshArray[x][y] );
		}

	}
	this.drawNextCube = function(x, y, color) {
		if (x >= 0 && x < 5 && y >=0 && y < 5) {
			if (color) nextCubeMeshArray[x][y].material.color.setHex(hexColors[color]);
			nextCubeMeshArray[x][y].scale.set(.95, .95, .95);
			scene.add( nextCubeMeshArray[x][y] );
		}

	}
	this.clearNextTetField = function() {
		for(x=0; x<5; x++) {
			for(y=0; y<5; y++) {
				scene.remove( nextCubeMeshArray[x][y] );
			}
		}
	}
	this.clear = function() {
		for(x=0; x<10; x++) {
			for(y=0; y<20; y++) {
				scene.remove( cubeMeshArray[x][y] );
				cubeArray[x][y] = 'e';
			}
		}
	}
	this.eraseCube = function(x, y) {
		if (x >= 0 && x < 10 && y >=0 && y < 20) {
			scene.remove( cubeMeshArray[x][y] );
			cubeArray[x][y] = 'e';
		}
	}
	this.freezeCube = function(x, y, color) {
		if (x >= 0 && x < 10 && y >=0 && y < 20) {
			cubeArray[x][y] = color;
		}
	}
	this.isFrozen = function(x, y) {
		if (x >= 0 && x < 10 && y >=0 && y < 20) {
			return cubeArray[x][y] != 'e';
		}
	}
	this.disolveCube = function(x, y) {
		if (x >= 0 && x < 10 && y >=0 && y < 20) {
			var shrinkInterval = setInterval(shrinkCube.bind(this),10);
		}

		var size = 0.9;

		function shrinkCube() {
			cubeMeshArray[x][y].scale.set(size,size,size);
			size-=.05;
			if (size <= 0) {
				clearInterval(shrinkInterval);
				this.eraseCube(x, y);
			}
		}
	}
	this.findAndRemoveCompletedRows = function() {
		// Find rows to remove
		var rowsToRemove = new Array();

		for(y=0; y<20; y++) {
			for(x=0; x<10; x++) {
				if (cubeArray[x][y] == 'e') {
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
			for(i=0; i<numRowsToRemove; i++) {
				for(x=0; x<10; x++) {
					this.disolveCube(x,rowsToRemove[i]);
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
			for(i=rowsToRemove.length-1; i>=0; i--) {
				for (y=rowsToRemove[i]; y<19; y++) {
					for (x=0; x<10; x++) {
						var color = cubeArray[x][y+1];
						if (color !== 'e') {
							this.drawCube(x, y, color);
							this.freezeCube(x, y, color);
							this.eraseCube(x, y+1);
						}
					}
				}
			}

			// Once rows have dropped, create new tet
			createNewTet();
		}
	}
}

var field = new Field();