/** Copyright (c) 2014-2015 Filipe Badaro* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE*/$(document).ready(){	scoreboard.datastore.init();	scoreboard.renderer.init();	scoreboard.functions.init();	scoreboard.cardinfo.init();	$('#addButton').click(function()	{		scoreboard.functions.addPlayer();		return(false);	});		$('#showHideLogButton').click(function()	{		scoreboard.functions.toggleLogDisplay();		return(false);	});		$('#newGameButton').click(function()	{		scoreboard.functions.newGame();		return(false);	});		$('#showHideImagesButton').click(function()	{		scoreboard.functions.toggleImageDisplay();		return(false);	});		// bootstrap-switch initialization  $('#inputInfect').bootstrapSwitch();  $('#inputInfect').bootstrapSwitch('toggleAnimate', false);}