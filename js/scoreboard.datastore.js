/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.datastore = {
	_localStorageVersion: 1,
	_localStorageKey: 'scoreboard_data',
	_store: {},
	
	init: function()
	{
		this.load();
	},
	
	hasData: function()
	{
		return Object.keys(this._store).length>0;
	},
	
	addPlayer: function(playerName, commanderName, commanderInfect)
	{
		var playerKey = playerName.replace(/[^-A-Za-z0-9]+/g, '').toLowerCase() + new Date().getTime();
		var commanderKey = commanderName.replace(/[^-A-Za-z0-9]+/g, '').toLowerCase() + new Date().getTime();

		for(var existingPlayerKey in this._store)
		{
			if(this._store[existingPlayerKey].playerName==playerName) return( {success: false } );
		}

		this._store[playerKey] = {
			playerName: playerName,
			playerKey: playerKey,
			commanderName: commanderName,
			commanderKey: commanderKey,
			commanderInfect: commanderInfect,
			life: scoreboard.settings.startingLife,
			poison: scoreboard.settings.startingPoison,
			commanderDamage: {}
		};
		
		var commanderList = this.getCommanderKeys();
		for(var existingPlayerKey in this._store)
		{
			for(var i=0;i<commanderList.length;i++)
			{
				if(isNaN(this._store[existingPlayerKey].commanderDamage[commanderList[i]]))
				{
					this._store[existingPlayerKey].commanderDamage[commanderList[i]] = scoreboard.settings.startingCommanderDamage;
				}
			}
		}

		this.save();
		return({success: true, playerKey: playerKey});
	},
	
	removePlayer: function(playerKey)
	{
		var commanderKey = this._store[playerKey].commanderKey;
		delete this._store[playerKey];
	
		for(var existingPlayerKey in this._store)
		{
			delete this._store[existingPlayerKey].commanderDamage[commanderKey];
		}

		this.save();
		return(true);
	},
		
	getPlayerKeys: function()
	{
		var result = [];
		for(var playerKey in this._store)
		{
			result.push(this._store[playerKey].playerKey);
		}
		return(result);
	},
	
	getCommanderKeys: function()
	{
		var result = [];
		for(var playerKey in this._store)
		{
			result.push(this._store[playerKey].commanderKey);
		}
		return(result);
	},
	
	getPlayerName: function(playerKey)
	{
		return this._store[playerKey].playerName;
	},
	
	getCommanderName: function(commanderKey)
	{
		for(var playerKey in this._store)
		{
			if(this._store[playerKey].commanderKey==commanderKey)
			{
				return this._store[playerKey].commanderName;
			}
		}
		return(null);
	},
	
	getCommanderInfect: function(commanderKey)
	{
		for(var playerKey in this._store)
		{
			if(this._store[playerKey].commanderKey==commanderKey)
			{
				return this._store[playerKey].commanderInfect;
			}
		}
		return(false);
	},
	
	getDamage: function(playerKey)
	{
		return this._store[playerKey].life;
	},

	getPoison: function(playerKey)
	{
		return this._store[playerKey].poison;
	},
	 
	getCommanderDamage: function(playerKey, commanderKey)
	{
		return this._store[playerKey].commanderDamage[commanderKey];
	},
	
	setDamage: function(playerKey, amount)
	{
		var previous = this._store[playerKey].life;
		this._store[playerKey].life = amount;
		if(scoreboard.settings.minLife!=null && this._store[playerKey].life<scoreboard.settings.minLife) this._store[playerKey].life = scoreboard.settings.minLife;
		if(scoreboard.settings.maxLife!=null && this._store[playerKey].life>scoreboard.settings.maxLife) this._store[playerKey].life = scoreboard.settings.maxLife;
		this.save();
		return this._store[playerKey].life - previous;
	},

	setPoison: function(playerKey, amount)
	{
		var previous = this._store[playerKey].poison;
		this._store[playerKey].poison = amount;
		if(scoreboard.settings.minPoison!=null && this._store[playerKey].poison<scoreboard.settings.minPoison) this._store[playerKey].poison = scoreboard.settings.minPoison;
		if(scoreboard.settings.maxPoison!=null && this._store[playerKey].poison>scoreboard.settings.maxPoison) this._store[playerKey].poison = scoreboard.settings.maxPoison;
		this.save();
		return this._store[playerKey].poison - previous;
	},
	 
	setCommanderDamage: function(playerKey, commanderKey, amount)
	{
		var previous = this._store[playerKey].commanderDamage[commanderKey];
		this._store[playerKey].commanderDamage[commanderKey] = amount;
		if(scoreboard.settings.minCommanderDamage!=null && this._store[playerKey].commanderDamage[commanderKey]<scoreboard.settings.minCommanderDamage) this._store[playerKey].commanderDamage[commanderKey] = scoreboard.settings.minCommanderDamage;
		if(scoreboard.settings.maxCommanderDamage!=null && this._store[playerKey].commanderDamage[commanderKey]>scoreboard.settings.maxCommanderDamage) this._store[playerKey].commanderDamage[commanderKey] = scoreboard.settings.maxCommanderDamage;
		this.save();
		return this._store[playerKey].commanderDamage[commanderKey] - previous;
	},
	
	newGame: function()
	{
		for(var playerKey in this._store)
		{
			this._store[playerKey].life = scoreboard.settings.startingLife;
			this._store[playerKey].poison = scoreboard.settings.startingPoison;
			
			for(var commanderKey in this._store[playerKey].commanderDamage)
			{
				this._store[playerKey].commanderDamage[commanderKey] = scoreboard.settings.startingCommanderDamage;
			}
		}
		this.save();
	},
	
	save: function()
	{
		if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined" ) 
		{
			localStorage.setItem(this._localStorageKey, JSON.stringify({ version: this._localStorageVersion, data: this._store }));
		}
	},
	
	load: function()
	{
		if(typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined" ) 
		{
			var storedObject = JSON.parse(localStorage.getItem(this._localStorageKey));
			if(storedObject!=null && storedObject.data!=null && storedObject.version==this._localStorageVersion)
			{
				this._store = storedObject.data;
			}
		}
	}
}
