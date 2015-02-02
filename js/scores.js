var $submit_score_popup = $("#submit_score_popup"),
	$high_scores = $("#high_scores"),
	$high_scores_table = $("#high_scores tbody"),
	$overlay = $("#overlay");

function getHighScores() {
	$.get("scores.php", function(data){
		var player_score = stats.getScore();
		var records = JSON.parse(data);
		records = records.array;
		
		if (records.length > 0) {
			var lowest_score = records[records.length-1].score;
		}

		if (records.length <10 || player_score > lowest_score) {
			// Player got a top ten score, show the submit score popup
			$submit_score_popup.removeClass("hidden");
			$overlay.removeClass("hidden");
		} else {
			// Didn't get a top ten score, just show the high score list
			$("#play_again").show();
			$("#high_scores .resume_game").hide();
			showHighScores();
		}
	});
}

function showHighScores() {
	$.get("scores.php", function(data){
		var records = JSON.parse(data);
		records = records.array;
		$high_scores_table.html("");
		records.forEach(function(record, index) {
			var rank = index+1,
				score = record.score.toLocaleString();
			$high_scores_table.append("<tr><td>"+rank+".</td> <td>"+record.name+"</td> <td>"+record.level+"</td> <td>"+score+"</td></tr>");
		});
		$high_scores.removeClass("hidden");
		$overlay.removeClass("hidden");
	});
}

function submitHighScore(e) {
	var name = $("#score_name").val(),
		level = stats.getLevel();
		score = stats.getScore();

	if (name != "") {
		$.post( "submit_score.php", { name: name, level: level, score: score }, function(){
			$submit_score_popup.addClass("hidden");
			// Show high score list
			$("#play_again").show();
			$("#resume_game").hide();
			showHighScores();
		});
	} else {
		$("#name_required").removeClass("invisible");
	}	
}