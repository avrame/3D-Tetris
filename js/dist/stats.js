"use strict";

function Stats() {
	var lines = 0,
	    level = 1,
	    dropScore = 0,
	    score = 0;

	return {
		getLines: function () {
			return lines;
		},
		getLevel: function () {
			return level;
		},
		getScore: function () {
			return score;
		},
		incrementDropScore: function () {
			dropScore += 1;
		},
		resetDropScore: function () {
			dropScore = 0;
		},
		includeDropScore: function () {
			score += dropScore;
		},
		increaseLines: function (removedLines) {
			lines += removedLines;
			// Display the message "Tetris!" if 4 lines are cleared
			if (removedLines === 4) {
				displayMessage("Tetris!");
			}
			document.getElementById("lines").innerHTML = lines;
		},
		calculateLevel: function () {
			var tempLevel = Math.floor(lines / 10) + 1;
			if (tempLevel !== level) {
				level = tempLevel;
				displayMessage("Level " + level);
				document.getElementById("level").innerHTML = level;
			}
		},
		increaseScore: function (points) {
			score += points;
		},
		increaseScoreFromLines: function (removedLines) {
			var multiplier;

			switch (removedLines) {
				case 1:
					multiplier = 40;
					break;
				case 2:
					multiplier = 100;
					break;
				case 3:
					multiplier = 300;
					break;
				case 4:
					multiplier = 1200;
					break;
			}

			score += level * multiplier;
		},
		displayScore: function () {
			document.getElementById("score").innerHTML = score.toLocaleString();
		},
		reset: function () {
			lines = 0;
			level = 1;
			dropScore = 0;
			score = 0;
			document.getElementById("lines").innerHTML = 0;
			document.getElementById("level").innerHTML = 1;
			document.getElementById("score").innerHTML = 0;
		}
	};
}