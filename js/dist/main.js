"use strict";

var audio_hit = document.getElementById("audio_hit"),
    audio_disolve = document.getElementById("audio_disolve"),
    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 1000),
    renderer = undefined,
    heightBorderGeometry = undefined,
    widthBorderGeometry = undefined,
    borderMaterial = undefined,
    leftBorder = undefined,
    rightBorder = undefined,
    bottomBorder = undefined,
    topBorder = undefined,
    mainLight = undefined,
    leftLight = undefined,
    rightLight = undefined,
    textMaterial = undefined,
    textGeom = undefined,
    textMesh = undefined,
    currentTet = undefined,
    nextTet = undefined,
    dropSpeed = 1000,
    gameIsOver = false,
    showHint = true,
    controls = { up: false, down: false, left: false, right: false, space: false },
    stats = new Stats(),
    upLastPressed = 0,
    lastDropped = 0,
    leftLastPressed = 0,
    rightLastPressed = 0,
    spaceLastPressed = 0,
    keyPressInterval = 150,
    stopDropping = false;

camera.position.set(4.5, 9, 17);

renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

// Create an event listener that resizes the renderer with the browser window.
window.addEventListener("resize", function () {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
});

// Create the border
heightBorderGeometry = new THREE.BoxGeometry(0.5, 20, 1), widthBorderGeometry = new THREE.BoxGeometry(11, 0.5, 1), borderMaterial = new THREE.MeshLambertMaterial({ color: 16777215 });

leftBorder = new THREE.Mesh(heightBorderGeometry, borderMaterial);
leftBorder.position.set(-0.75, 9.5, 0);
scene.add(leftBorder);

rightBorder = new THREE.Mesh(heightBorderGeometry, borderMaterial);
rightBorder.position.set(9.75, 9.5, 0);
scene.add(rightBorder);

bottomBorder = new THREE.Mesh(widthBorderGeometry, borderMaterial);
bottomBorder.position.set(4.5, -0.75, 0);
scene.add(bottomBorder);

topBorder = new THREE.Mesh(widthBorderGeometry, borderMaterial);
topBorder.position.set(4.5, 19.75, 0);
scene.add(topBorder);

// Add the lights
mainLight = new THREE.PointLight(16777215, 0.8);
mainLight.position.set(4.5, 9.5, 12);
scene.add(mainLight);

leftLight = new THREE.PointLight(11184895, 0.6);
leftLight.position.set(-2, 9.5, 0);
scene.add(leftLight);

rightLight = new THREE.PointLight(16755370, 0.6);
rightLight.position.set(11, 9.5, 0);
scene.add(rightLight);

// Write out 'Next' above the next field
textMaterial = new THREE.MeshPhongMaterial({
	color: 15658734
});
textGeom = new THREE.TextGeometry("Next", {
	font: "helvetiker",
	size: 1,
	height: 0.25
});
textMesh = new THREE.Mesh(textGeom, textMaterial);
textMesh.position.set(11, 17.5, 0);

scene.add(textMesh);

nextTet = createRandomTet(true);
currentTet = createRandomTet();

window.onkeydown = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;

	if (key == 38) {
		// up
		controls.up = true;
	} else if (key == 40) {
		// down
		controls.down = true;
	} else if (key == 37) {
		// left
		controls.left = true;
	} else if (key == 39) {
		// right
		controls.right = true;
	} else if (key == 32) {
		// quick drop
		controls.space = true;
	}
};

window.onkeyup = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;

	if (key == 38) {
		// up
		controls.up = false;
	} else if (key == 40) {
		// down
		controls.down = false;
	} else if (key == 37) {
		// left
		controls.left = false;
	} else if (key == 39) {
		// right
		controls.right = false;
	} else if (key == 32) {
		// quick drop
		controls.space = false;
	}
};

function createRandomTet(isNextTet) {
	var randNum = Math.floor(Math.random() * 7);

	switch (randNum) {
		case 0:
			return new TypeITet(isNextTet);
			break;
		case 1:
			return new TypeJTet(isNextTet);
			break;
		case 2:
			return new TypeLTet(isNextTet);
			break;
		case 3:
			return new TypeOTet(isNextTet);
			break;
		case 4:
			return new TypeSTet(isNextTet);
			break;
		case 5:
			return new TypeZTet(isNextTet);
			break;
		case 6:
			return new TypeTTet(isNextTet);
			break;
	}
}

function render(time) {
	requestAnimationFrame(render);

	// Handle controls
	if (controls.up && upLastPressed < time - keyPressInterval) {
		currentTet.rotate();
		upLastPressed = time;
	}
	if (controls.down && lastDropped < time - keyPressInterval) {
		currentTet.moveDown();
		lastDropped = time;
	}
	if (controls.left && leftLastPressed < time - keyPressInterval) {
		currentTet.moveLeft();
		leftLastPressed = time;
	}
	if (controls.right && rightLastPressed < time - keyPressInterval) {
		currentTet.moveRight();
		rightLastPressed = time;
	}
	if (controls.space && spaceLastPressed < time - 250) {
		currentTet.quickDrop();
		spaceLastPressed = time;
	}

	dropTet(time);

	renderer.render(scene, camera);
}
render();

function dropTet(time) {
	if (!stopDropping && lastDropped < time - dropSpeed) {
		lastDropped = time;
		if (!currentTet.drop()) {
			stopDropping = true;
			if (gameIsOver) {
				gameOver();
			} else {
				// The tetromino is frozen, remove any completed rows and then add a new one at top
				field.findAndRemoveCompletedRows();
				stats.displayScore();
				stats.calculateLevel();
				dropSpeed = 1000 - stats.getLevel() * 85;
				if (dropSpeed < 100) {
					dropSpeed = 100;
				}
			}
		}
	}
}

function createNewTet() {
	currentTet = nextTet;
	currentTet.init();
	field.clearNextTetField();
	nextTet = createRandomTet(true);
	stopDropping = false;
}

var $message = $("#message");
function displayMessage(text) {
	$message.html(text);
	$message.removeClass("hidden");
	$message.addClass("animate");
	setTimeout(function () {
		$message.html("");
		$message.addClass("hidden");
		$message.removeClass("animate");
	}, 1500);
}

function gameOver() {
	getHighScores();
}

function pauseGame() {
	stopDropping = true;
}

function resumeGame() {
	stopDropping = false;
	render();
}

function restartGame() {
	gameIsOver = false;
	dropSpeed = 1000;

	field.clear();
	field.clearNextTetField();
	stats.reset();

	nextTet = createRandomTet(true);
	currentTet = createRandomTet();

	// Start the blocks dropping!
	resumeGame();
}

/* Popups */
$("#show_high_scores").click(function (e) {
	e.preventDefault();
	pauseGame();
	$("#play_again").hide();
	$("#high_scores .resume_game").show();
	showHighScores();
});

$("#show_controls").click(function (e) {
	e.preventDefault();
	pauseGame();
	$("#controls").removeClass("hidden");
	$overlay.removeClass("hidden");
});

$("#high_scores .resume_game").click(function (e) {
	$high_scores.addClass("hidden");
	$overlay.addClass("hidden");
	resumeGame();
});

$("#controls .resume_game").click(function (e) {
	$("#controls").addClass("hidden");
	$overlay.addClass("hidden");
	resumeGame();
});

$("#play_again").click(function (e) {
	$high_scores.addClass("hidden");
	$overlay.addClass("hidden");
	restartGame();
});

$("#submit_score_btn").click(submitHighScore);

$("#submit_score_form").keypress(function (e) {
	if (e.which == 13) {
		submitHighScore();
		return false;
	}
});

// Mute/unmute music
function toggleMusic() {
	var music = document.getElementById("music");
	if (music.muted) {
		music.muted = false;
		mute_music.innerHTML = "Mute Music";
	} else {
		music.muted = true;
		mute_music.innerHTML = "Unmute Music";
	}
}

// Mute/unmute sound
function toggleSound() {
	if (audio_hit.muted) {
		audio_hit.muted = false;
		audio_disolve.muted = false;
		mute_sound.innerHTML = "Mute Sound";
	} else {
		audio_hit.muted = true;
		audio_disolve.muted = true;
		mute_sound.innerHTML = "Unmute Sound";
	}
}

$("#mute_music").click(toggleMusic);
$("#mute_sound").click(toggleSound);

// Key handler
$(window).keypress(function (e) {
	if (e.which === 109) {
		// Pressed 'M' key
		toggleMusic();
	} else if (e.which === 115) {
		// Pressed 'S' key
		toggleSound();
	} else if (e.which === 104) {
		// Pressed 'H' key
		if (showHint) {
			showHint = false;
			currentTet.erase(true);
		} else {
			showHint = true;
			currentTet.drawHint();
		}
	}
});