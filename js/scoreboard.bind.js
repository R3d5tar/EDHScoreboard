/** Copyright (c) 2014 Filipe Badaro* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE)*/$(document).ready(){	$('#addButton').click(function()	{		scoreboard.functions.addPlayer();		return(false);	});		$('#showHideLogButton').click(function()	{		scoreboard.functions.toggleLogDisplay();		return(false);	});		$('#newGameButton').click(function()	{		scoreboard.functions.newGame();		return(false);	});}