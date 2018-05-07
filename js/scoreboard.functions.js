/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.functions = {

	init: function()
	{
	},
	
	addPlayerWithCommander: function()
	{
		var formData = scoreboard.renderer.getAllFormData();
		console.log(formData);
		
		if(formData.playerName!='' && formData.commanderName!='')
		{
			var result = scoreboard.datastore.addPlayerWithCommander(formData.playerName,formData.commanderName, formData.commanderInfect);
			if(result.success)
			{
				scoreboard.renderer.resetAllFormData();
				scoreboard.renderer.createRemovePlayerButton(result.playerKey);
                scoreboard.renderer.createRemoveCommanderButton(result.commanderKey);
				scoreboard.renderer.appendToLog('Added player ' + formData.playerName + 'with commander ' + formData.commanderName);
				scoreboard.renderer.redraw();
			}
			else
			{
				scoreboard.renderer.showGeneralError(result.message);
			}
		}
	},
    
    addPlayer: function()
	{
		var formData = scoreboard.renderer.getPlayerFormData();
		console.log(formData);
		
		if(formData.playerName != '')
		{
			var result = scoreboard.datastore.addPlayer(formData.playerName);
			if(result.success)
			{
				scoreboard.renderer.resetPlayerFormData();
				scoreboard.renderer.createRemovePlayerButton(result.playerKey);
				scoreboard.renderer.appendToLog('Added player ' + formData.playerName);
				scoreboard.renderer.redraw();
			}
			else
			{
				scoreboard.renderer.showExistingPlayerFormError();
			}
		}
	},
    
    addCommander: function() {
        var formData = scoreboard.renderer.getCommanderFormData();
		console.log(formData);
		
		if(formData.commanderName != '')
		{
			var result = scoreboard.datastore.addCommander(formData.commanderName, formData.commanderInfect);
			if(result.success)
			{
				scoreboard.renderer.resetCommanderFormData();
				scoreboard.renderer.createRemoveCommanderButton(result.commanderKey);
				scoreboard.renderer.appendToLog('Added commander ' + formData.commanderName);
				scoreboard.renderer.redraw();
			}
			else
			{
				scoreboard.renderer.showExistingCommanderFormError();
			}
		}        
    },
	
	removePlayer: function(playerKey)
	{
		var playerName = scoreboard.datastore.getPlayerName(playerKey);
		scoreboard.datastore.removePlayer(playerKey);
		scoreboard.renderer.destroyRemovePlayerButton(playerKey);
		scoreboard.renderer.appendToLog('Removed player ' + playerName);
		scoreboard.renderer.redraw();
	},

    removeCommander: function (commanderKey)
    {
        var commanderName = scoreboard.datastore.getCommanderName(commanderKey);
		scoreboard.datastore.removeCommander(commanderKey);
		scoreboard.renderer.destroyRemoveCommanderButton(commanderKey);
		scoreboard.renderer.appendToLog('Removed commander ' + commanderName);
		scoreboard.renderer.redraw();
    },

	incrementDamageAll: function(amount)
	{
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		for(var i=0;i<playerKeys.length;i++)
		{
			scoreboard.datastore.setDamage(playerKeys[i], scoreboard.datastore.getDamage(playerKeys[i])+amount);
		}
		scoreboard.renderer.appendToLog('Applying ' + amount + ' of life to all players');
		scoreboard.renderer.redrawDamageAll();
	},

	incrementPoisonAll: function(amount)
	{
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		for(var i=0;i<playerKeys.length;i++)
		{
			scoreboard.datastore.setPoison(playerKeys[i], scoreboard.datastore.getPoison(playerKeys[i])+amount);
		}
		scoreboard.renderer.appendToLog('Applying ' + amount + ' of poison to all players');
		scoreboard.renderer.redrawPoisonAll();
	},
	
	incrementDamage: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)+amount)!=0;
		if(diff!=0)
		{
			scoreboard.renderer.appendToLog('Applying ' + amount + ' of life to player ' + scoreboard.datastore.getPlayerName(playerKey));
			scoreboard.renderer.redrawDamage(playerKey);
		}
	},

	incrementPoison: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setPoison(playerKey, scoreboard.datastore.getPoison(playerKey)+amount)!=0;
		if(diff!=0)
		{
			scoreboard.renderer.appendToLog('Applying ' + amount + ' of poison damage to player ' + scoreboard.datastore.getPlayerName(playerKey));
			scoreboard.renderer.redrawPoison(playerKey);
		}
	},
	 
	incrementCommanderDamage: function(playerKey, commanderKey, amount)
	{
		var diff = scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, scoreboard.datastore.getCommanderDamage(playerKey, commanderKey)+amount);
		if(diff!=0)
		{
			scoreboard.renderer.appendToLog('Applying ' + amount + ' of damage from commander ' + scoreboard.datastore.getCommanderName(commanderKey) + ' to player ' + scoreboard.datastore.getPlayerName(playerKey));
			scoreboard.renderer.redrawCommanderDamage(playerKey, commanderKey);

			if(scoreboard.datastore.getCommanderInfect(commanderKey))
			{
				scoreboard.datastore.setPoison(playerKey, scoreboard.datastore.getPoison(playerKey)+diff);
				scoreboard.renderer.redrawPoison(playerKey);
			}
			else
			{
				scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)-diff);
				scoreboard.renderer.redrawDamage(playerKey);
			}
		}
	},
	
	setDamage: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setDamage(playerKey, amount);
		if(diff!=0)
		{
			scoreboard.renderer.appendToLog('Setting of life to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);
			scoreboard.renderer.redrawDamage(playerKey);
		}
	},

	setPoison: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setPoison(playerKey, amount);
		if(diff!=0)
		{
			scoreboard.renderer.appendToLog('Set poison damage to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);
			scoreboard.renderer.redrawPoison(playerKey);
		}
	},
	 
	setCommanderDamage: function(playerKey, commanderKey, amount)
	{
		var diff = scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, amount)
		if(diff!=0)
		{
			scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)-diff);
			scoreboard.renderer.appendToLog('Setting damage from commander ' + scoreboard.datastore.getCommanderName(commanderKey) + ' to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);
			scoreboard.renderer.redrawDamage(playerKey);
			scoreboard.renderer.redrawCommanderDamage(playerKey, commanderKey);
		}
	},
	
	newGame: function()
	{
		scoreboard.datastore.newGame();
		scoreboard.renderer.appendToLog('Starting a new game');
		scoreboard.renderer.redraw();
	},
	
    clearAll: function()
    {
        scoreboard.datastore.clear();
        scoreboard.renderer.reloadPage();
    },
    
	toggleLogDisplay: function()
	{
		return scoreboard.renderer.toggleLogDisplay();
	},
	
	toggleImageDisplay: function()
	{
		scoreboard.renderer.toggleImages();
		scoreboard.renderer.redraw();
	},
	
	toggleCommanderDamageDisplay: function()
	{
		scoreboard.renderer.toggleCommanderDamage();
		scoreboard.renderer.redraw();
	},
	
	togglePoisonDisplay: function()
	{
		scoreboard.renderer.togglePoison();
		scoreboard.renderer.redraw();
	}
}