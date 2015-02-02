<?php
	try {
		$db = new PDO('mysql:host=localhost;dbname=avrame_tetris_scores;charset=utf8', 'avrame_tetris', 'Chew3acca!');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

		$stmt = $db->prepare("SELECT * FROM scores ORDER BY score DESC LIMIT 10");
		$stmt->execute();

		$first = true;
		echo "{\"array\":[";
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			if (!$first) echo ",";
			echo "{\"name\":\"$row[name]\",\"level\":$row[level],\"score\":$row[score]}";
			$first = false;
		}
		echo "]}";

		/*** close the database connection ***/
		$db = null;
	} catch(PDOException $e) {
    	echo $e->getMessage();
    }
?>