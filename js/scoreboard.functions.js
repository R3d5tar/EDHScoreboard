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
		if(formData.playerName!='' && formData.commanderName!='')
		{
			var result = scoreboard.datastore.addPlayerWithCommander(formData.playerName,formData.commanderName, formData.commanderInfect);
			if(result.success)
			{
				scoreboard.renderer.resetAllFormData();
				scoreboard.renderer.createRemovePlayerButton(result.playerKey);
                scoreboard.renderer.createRemoveCommanderButton(result.commanderKey);
				scoreboard.log.write(
					'{player} joined and plays a <card>{commander}</card>-deck.',
					{ player: formData.playerName, commander: formData.commanderName }
				);
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
		if(formData.playerName != '')
		{
			var result = scoreboard.datastore.addPlayer(formData.playerName);
			if(result.success)
			{
				scoreboard.renderer.resetPlayerFormData();
				scoreboard.renderer.createRemovePlayerButton(result.playerKey);
				scoreboard.log.write('{player} joined this game.', 
					{ player: formData.playerName });
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
		if(formData.commanderName != '')
		{
			var result = scoreboard.datastore.addCommander(formData.commanderName, formData.commanderInfect);
			if(result.success)
			{
				scoreboard.renderer.resetCommanderFormData();
				scoreboard.renderer.createRemoveCommanderButton(result.commanderKey);
				scoreboard.log.write('Some-player plays a <card>{commander}</card>-deck.', 
					{ commander: formData.commanderName }
				);
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
		scoreboard.log.write('{player} left this game.', { player: playerName });
		scoreboard.renderer.redraw();
	},

    removeCommander: function (commanderKey)
    {
        var commanderName = scoreboard.datastore.getCommanderName(commanderKey);
		scoreboard.datastore.removeCommander(commanderKey);
		scoreboard.renderer.destroyRemoveCommanderButton(commanderKey);
		scoreboard.log.write('The <card>{commander}</card>-deck left this game.', 
			{ commander: commanderName }
		);
		scoreboard.renderer.redraw();
    },
	
	incrementDamage: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)+amount)!=0;
		if(diff!=0)
		{
			scoreboard.log.write('{player} {event} {x} life.', { 
					player: scoreboard.datastore.getPlayerName(playerKey),
					event: (amount < 0) ? "lost" : "gained",
					x: Math.abs(amount)
				 });
			scoreboard.renderer.redrawDamage(playerKey);
		}
	},

	incrementPoison: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setPoison(playerKey, scoreboard.datastore.getPoison(playerKey)+amount)!=0;
		if(diff!=0)
		{
			scoreboard.log.write('{player} {event} {x} poison counter(s).', { 
					player: scoreboard.datastore.getPlayerName(playerKey),
					event: (amount < 0) ? "lost" : "got",
					x: Math.abs(amount)
				 });
			scoreboard.renderer.redrawPoison(playerKey);
		}
	},
	 
	incrementCommanderDamage: function(playerKey, commanderKey, amount)
	{
		var diff = scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, scoreboard.datastore.getCommanderDamage(playerKey, commanderKey)+amount);
		if(diff!=0)
		{
			scoreboard.renderer.redrawCommanderDamage(playerKey, commanderKey);

			if(scoreboard.datastore.getCommanderInfect(commanderKey))
			{
				scoreboard.datastore.setPoison(playerKey, scoreboard.datastore.getPoison(playerKey)+diff);
				
				if (amount > 0) {
					scoreboard.log.write(
						'<card>{commander}</card> dealt {x} damage to {player} in the form of poison counters.', { 
							player: scoreboard.datastore.getPlayerName(playerKey),
							commander: scoreboard.datastore.getCommanderName(commanderKey),
							x: Math.abs(amount)
						});
				} else {
					scoreboard.log.write(
						'Corrected {x} damage dealt by <card>{commander}</card> to {player} in the form of poison counters.', { 
							player: scoreboard.datastore.getPlayerName(playerKey),
							commander: scoreboard.datastore.getCommanderName(commanderKey),
							x: Math.abs(amount)
						});
				}

				scoreboard.renderer.redrawPoison(playerKey);
			}
			else
			{
				scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)-diff);

				if (amount > 0) {
					scoreboard.log.write(
						'<card>{commander}</card> dealt {x} damage to {player}', { 
							player: scoreboard.datastore.getPlayerName(playerKey),
							commander: scoreboard.datastore.getCommanderName(commanderKey),
							x: Math.abs(amount)
						});
				} else {
					scoreboard.log.write(
						'Corrected {x} damage dealt by <card>{commander}</card> to {player}', { 
							player: scoreboard.datastore.getPlayerName(playerKey),
							commander: scoreboard.datastore.getCommanderName(commanderKey),
							x: Math.abs(amount)
						});
				}
				scoreboard.renderer.redrawDamage(playerKey);
			}
		}
	},
	
	setDamage: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setDamage(playerKey, amount);
		if(diff!=0)
		{
			scoreboard.log.write('{player}\'s life total became {life}.', { 
					player: scoreboard.datastore.getPlayerName(playerKey),
					life: Math.abs(amount)
				});
			scoreboard.renderer.redrawDamage(playerKey);
		}
	},

	setPoison: function(playerKey, amount)
	{
		var diff = scoreboard.datastore.setPoison(playerKey, amount);
		if(diff!=0)
		{
			scoreboard.log.write('{player} has {poison} poison counters.', { 
					player: scoreboard.datastore.getPlayerName(playerKey),
					poison: amount
				});
			scoreboard.renderer.redrawPoison(playerKey);
		}
	},
	 
	setCommanderDamage: function(playerKey, commanderKey, amount)
	{
		var diff = scoreboard.datastore.setCommanderDamage(playerKey, commanderKey, amount)
		if(diff!=0)
		{
			scoreboard.datastore.setDamage(playerKey, scoreboard.datastore.getDamage(playerKey)-diff);
			scoreboard.log.write(
				'<card>{commander}</card> has dealt {x} damage to {player} in total.', { 
					player: scoreboard.datastore.getPlayerName(playerKey),
					commander: scoreboard.datastore.getCommanderName(commanderKey),
					x: amount
				});
			scoreboard.renderer.redrawDamage(playerKey);
			scoreboard.renderer.redrawCommanderDamage(playerKey, commanderKey);
		}
	},
	
	newGame: function()
	{
		scoreboard.datastore.newGame();
		scoreboard.log.write('Restarted the game OR started a new game. (All life totals, poison counters and commander damage have been reset.)');
		scoreboard.renderer.redraw();
	},
	
    clearAll: function()
    {
		scoreboard.datastore.clear();
        scoreboard.renderer.reloadPage();
    },
    
	toggleLogDisplay: function()
	{
		scoreboard.datastore.toggle("Log");
		scoreboard.renderer.redraw();
	},
	
	toggleImageDisplay: function()
	{
		scoreboard.datastore.toggle("CommanderImages");
		scoreboard.renderer.redraw();
	},
	
	toggleCommanderDamageDisplay: function()
	{
		scoreboard.datastore.toggle("CommanderDamage");
		scoreboard.renderer.redraw();
	},
	
	togglePoisonDisplay: function()
	{
		scoreboard.datastore.toggle("Poison");
		scoreboard.renderer.redraw();
	}
}