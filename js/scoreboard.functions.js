/** Copyright (c) 2014 Filipe Badaro* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE*/scoreboard.functions = {	addPlayer: function()	{		var formData = scoreboard.renderer.getFormData();		if(formData.playerName!='' && formData.commanderName!='')		{			var result = scoreboard.datastore.addPlayer(formData.playerName,formData.commanderName);			if(result.success)			{				scoreboard.renderer.resetFormData();				scoreboard.renderer.createRemovePlayerButton(result.playerKey);				scoreboard.renderer.appendToLog('Added player ' + formData.playerName);				scoreboard.renderer.redraw();			}			else			{				scoreboard.renderer.showFormError();			}		}	},		removePlayer: function(playerKey)	{		var playerName = scoreboard.datastore.getPlayerName(playerKey);		scoreboard.datastore.removePlayer(playerKey);		scoreboard.renderer.appendToLog('Removed player player ' + playerName);		scoreboard.renderer.redraw();	},	incrementDamageAll: function(amount)	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			scoreboard.datastore.setDamage(playerKeys[i], scoreboard.datastore.getDamage(playerKeys[i])+amount);		}		scoreboard.renderer.appendToLog('Applying ' + amount + ' of life to all players');		scoreboard.renderer.redraw();	},	incrementPoisonAll: function(amount)	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			scoreboard.datastore.setPoison(playerKeys[i], scoreboard.datastore.getPoison(playerKeys[i])+amount);		}		scoreboard.renderer.appendToLog('Applying ' + amount + ' of poison to all players');		scoreboard.renderer.redraw();	},		incrementDamage: function(playerKey, amount)	{		scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)+amount);		scoreboard.renderer.appendToLog('Applying ' + amount + ' of life to player ' + scoreboard.datastore.getPlayerName(playerKey));		scoreboard.renderer.redraw();	},	incrementPoison: function(playerKey, amount)	{		scoreboard.datastore.setPoison(playerKey, scoreboard.datastore.getPoison(playerKey)+amount);		scoreboard.renderer.appendToLog('Applying ' + amount + ' of poison damage to player ' + scoreboard.datastore.getPlayerName(playerKey));		scoreboard.renderer.redraw();	},	 	incrementCommanderDamage: function(playerKey, commanderKey, amount)	{		scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, scoreboard.datastore.getCommanderDamage(playerKey, commanderKey)+amount);		scoreboard.renderer.appendToLog('Applying ' + amount + ' of damage from commander ' + scoreboard.datastore.getCommanderName(commanderKey) + ' to player ' + scoreboard.datastore.getPlayerName(playerKey));		scoreboard.renderer.redraw();	},		setDamage: function(playerKey, amount)	{		scoreboard.datastore.setDamage(playerKey, amount);		scoreboard.renderer.appendToLog('Setting of life to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);		scoreboard.renderer.redraw();	},	setPoison: function(playerKey, amount)	{		scoreboard.datastore.setPoison(playerKey, amount);		scoreboard.renderer.appendToLog('Set poison damage to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);		scoreboard.renderer.redraw();	},	 	setCommanderDamage: function(playerKey, commanderKey, amount)	{		scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, amount);		scoreboard.renderer.appendToLog('Setting damage from commander ' + scoreboard.datastore.getCommanderName(commanderKey) + ' to player ' + scoreboard.datastore.getPlayerName(playerKey) + ' to value ' + amount);		scoreboard.renderer.redraw();	},		newGame: function()	{		scoreboard.datastore.newGame();		scoreboard.renderer.appendToLog('Starting a new game');		scoreboard.renderer.redraw();	},		toggleLogDisplay: function()	{		scoreboard.renderer.toggleLogDisplay();	}}