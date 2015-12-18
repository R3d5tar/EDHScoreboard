/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

$(document).ready()
{
	scoreboard.datastore.init();
	scoreboard.renderer.init();
	scoreboard.functions.init();
	scoreboard.cardinfo.init();

	$('#addButton').click(function()
	{
		scoreboard.functions.addPlayer();
	});
	
	$('#showHideLogButton').click(function()
	{
		scoreboard.functions.toggleLogDisplay();
	});
	
	$('#newGameButton').click(function()
	{
		scoreboard.functions.newGame();
	});
	
	$('#showHideImagesButton').click(function()
	{
		scoreboard.functions.toggleImageDisplay();
	});
	
	$('#showHideCommanderDamageButton').click(function()
	{
		scoreboard.functions.toggleCommanderDamageDisplay();
	});
	
	$('#showHidePoisonButton').click(function()
	{
		scoreboard.functions.togglePoisonDisplay();
	});
	
	// bootstrap-switch initialization
	$('#inputInfect').bootstrapSwitch();
	$('#inputInfect').bootstrapSwitch('toggleAnimate', false);
}