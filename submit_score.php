<?php
	try {
		$db = new PDO('mysql:host=localhost;dbname=avrame_tetris_scores;charset=utf8', 'avrame_tetris', 'Chew3acca!');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

		$stmt = $db->prepare("INSERT INTO scores (name, level, score) VALUES (?, ?, ?);");
		$stmt->execute(array($_POST['name'], $_POST['level'], $_POST['score']));

		/*** close the database connection ***/
		$db = null;
	} catch(PDOException $e) {
    	echo $e->getMessage();
    }
?>