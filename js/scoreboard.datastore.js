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
	_store: { 
        players: {},
        commanders: {}
    },
	
	init: function()
	{
		this.load();
        this.upgrade();
	},
	
	hasData: function()
	{
		return Object.keys(this._store).length>0;
	},
	
	addPlayerWithCommander: function(playerName, commanderName, hasInfect)
	{
        var playerResult = this.addPlayer(playerName);
        if (!playerResult.succes)
            return playerResult;
            
        var commanderResult = this.addCommander(commanderName, hasInfect);
        if (!commanderResult.succes)
            return commanderResult;
            
        var newPlayer = this._store.players[playerResult.playerKey];
        newPlayer.commanderKey = commanderResult.commanderKey;
        
        return {
          succes: true,
          playerKey: playerResult.playerKey,
          commanderKey: playerResult.commanderKey
        };
	},
    
    addCommander: function (commanderName, hasInfect) 
    {
		var commanderKey = commanderName.replace(/[^-A-Za-z0-9]+/g, '').toLowerCase() + new Date().getTime();

		for(var existingCommanderKey in this._store.commanders)
		{
			if(this._store.commanders[existingCommanderKey].commanderName == commanderName) 
                return( {success: false, message: "Commander '" + commanderName + "' already exists", commanderKey: null } );
		}

        var commander = {
            commanderName: commanderName,
            commanderKey: commanderKey,
            commanderInfect: hasInfect
        }
        this._store.commanders[commanderKey] = commander;
        
        //ensure base commander damage for all players
		for(var existingPlayerKey in this._store.players)
		{
            var player = this._store.players[existingPlayerKey];
            if(isNaN(player.commanderDamage[commanderKey]))
            {
                player.commanderDamage[commanderKey] = scoreboard.settings.startingCommanderDamage;
            }
		}

		this.save();
		return({success: true, commanderKey: commanderKey});
        
    },
    
    addPlayer: function(playerName)
	{
		var playerKey = playerName.replace(/[^-A-Za-z0-9]+/g, '').toLowerCase() + new Date().getTime();
        
        //check for duplicates
		for(var existingPlayerKey in this._store.players)
		{
			if(this._store.players[existingPlayerKey].playerName == playerName) 
                return ( {success: false, message: "Player '" + playerName + "' already exists", playerKey: null } );
		}
        
        var player = {
			playerName: playerName,
			playerKey: playerKey,
            commanderKey: null,
			life: scoreboard.settings.startingLife,
			poison: scoreboard.settings.startingPoison,
			commanderDamage: {}
		};
        this._store.players[playerKey] = player;
        
        //ensure starting commander damage for the new player
        for(var commanderKey in this._store.commanders)
        {
            if(isNaN(player.commanderDamage[commanderKey]))
            {
                player.commanderDamage[commanderKey] = scoreboard.settings.startingCommanderDamage;
            }
        }

		this.save();
		return ({success: true, playerKey: playerKey});
	},
	
	removePlayer: function(playerKey)
	{
		var commanderKey = this._store.players[playerKey].commanderKey;
		delete this._store.players[playerKey];
	
        if (commanderKey != null) {
            this.removeCommander(commanderKey);
        }
        
		this.save();
		return true;
	},
    
    removeCommander: function(commanderKey)
	{
        //clean up commander damage, and commander reference
        for(var playerKey in this._store.players)
        {
            var player = this._store.players[playerKey];
            delete player.commanderDamage[commanderKey];
            if (player.commanderKey == commanderKey) {
                player.commanderKey = null;
            }
        }
        delete this._store.commanders[commanderKey];
        
		this.save();
		return true;
	},
		
	getPlayerKeys: function()
	{
		var result = [];
		for(var playerKey in this._store.players)
		{
			result.push(this._store.players[playerKey].playerKey);
		}
		return result;
	},
	
	getCommanderKeys: function()
	{
		var result = [];
		for(var commanderKey in this._store.commanders)
		{
             result.push(this._store.commanders[commanderKey].commanderKey);
		}
		return result;
	},
	
	getPlayerName: function(playerKey)
	{
		return this._store.players[playerKey].playerName;
	},
	
	getCommanderName: function(commanderKey)
	{
        return this._store.commanders[commanderKey].commanderName;
	},
	
	getCommanderInfect: function(commanderKey)
	{
        return this._store.commanders[commanderKey].commanderInfect;
	},
	
	getDamage: function(playerKey)
	{
		return this._store.players[playerKey].life;
	},

	getPoison: function(playerKey)
	{
		return this._store.players[playerKey].poison;
	},
	 
	getCommanderDamage: function(playerKey, commanderKey)
	{
		return this._store.players[playerKey].commanderDamage[commanderKey];
	},
	
	setDamage: function(playerKey, amount)
	{
        var player = this._store.players[playerKey];
		var previous = player.life;
		player.life = amount;
		if (scoreboard.settings.minLife != null && player.life < scoreboard.settings.minLife) 
            player.life = scoreboard.settings.minLife;
		if (scoreboard.settings.maxLife != null && player.life > scoreboard.settings.maxLife) 
            player.life = scoreboard.settings.maxLife;
            
		this.save();
		return player.life - previous;
	},

	setPoison: function(playerKey, amount)
	{
        var player = this._store.players[playerKey];
		var previous = player.poison;
		player.poison = amount;
		if (scoreboard.settings.minPoison != null && player.poison < scoreboard.settings.minPoison) 
            player.poison = scoreboard.settings.minPoison;
		if (scoreboard.settings.maxPoison != null && player.poison > scoreboard.settings.maxPoison) 
            player.poison = scoreboard.settings.maxPoison;
            
		this.save();
		return player.poison - previous;
	},
	 
	setCommanderDamage: function(playerKey, commanderKey, amount)
	{
        var player = this._store.players[playerKey];
		var previous = player.commanderDamage[commanderKey];
		player.commanderDamage[commanderKey] = amount;
		if(scoreboard.settings.minCommanderDamage != null && player.commanderDamage[commanderKey] < scoreboard.settings.minCommanderDamage) 
            player.commanderDamage[commanderKey] = scoreboard.settings.minCommanderDamage;
		if(scoreboard.settings.maxCommanderDamage != null && player.commanderDamage[commanderKey] > scoreboard.settings.maxCommanderDamage)
            player.commanderDamage[commanderKey] = scoreboard.settings.maxCommanderDamage;
            
		this.save();
		return player.commanderDamage[commanderKey] - previous;
	},
	
	newGame: function()
	{
		for(var playerKey in this._store.players)
		{
            var player = this._store.players[playerKey];
			player.life = scoreboard.settings.startingLife;
			player.poison = scoreboard.settings.startingPoison;
			
			for(var commanderKey in player.commanderDamage)
			{
				player.commanderDamage[commanderKey] = scoreboard.settings.startingCommanderDamage;
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
	},
    
    upgrade: function() {
        if (this.hasData())
        {
            if (this._store == null || this._store.players == null || this._store.commanders == null)
            {
                var newStore = { players: {}, commanders: {}};
                var oldStore = this._store;
                for(var playerKey in oldStore)
                {
                    var playerObject = oldStore[playerKey];
                    newStore.players[playerKey] = playerObject;
                    newStore.commanders[playerObject.commanderKey] = playerObject;
                }
                this._store = newStore;
                this.save();
            }
        }
    }
}
