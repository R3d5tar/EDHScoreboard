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

	$('#addPlayerButton').click(function()
	{
		scoreboard.functions.addPlayer();
        return false;
	});
    
    $('#addCommanderButton').click(function()
	{
		scoreboard.functions.addCommander();
        return false;
	});
    
    $('#addPlayerWithCommanderButton').click(function()
	{
		scoreboard.functions.addPlayerWithCommander();
        return false;
	});
	
	$('#showHideLogButton').click(function()
	{
		var shown = scoreboard.functions.toggleLogDisplay();
        if (shown) {
            $('#showHideLogButton').html("Hide");
        } else {
            $('#showHideLogButton').html("Show");
        }
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
	
    $('#resetAllButton').click(function() 
    {
        if(confirm("This will remove all registered players, commanders, life totals, etc. Are you sure to clear this data?")) 
        {
            scoreboard.functions.clearAll();
        }
    });
    
    
	// bootstrap-switch initialization
	$('#inputInfect').bootstrapSwitch();
	$('#inputInfect').bootstrapSwitch('toggleAnimate', false);
}