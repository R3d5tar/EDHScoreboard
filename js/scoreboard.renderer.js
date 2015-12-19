/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.renderer = {

	_showPoison: false,
	_showCommanderImages: false,
	_showCommanderDamage: true,

	init: function()
	{
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		for(var i=0;i<playerKeys.length;i++)
		{
			this.createRemovePlayerButton(playerKeys[i]);
		}
        
        var commanderKeys = scoreboard.datastore.getCommanderKeys();
		for(var i=0;i<commanderKeys.length;i++)
		{
			this.createRemoveCommanderButton(commanderKeys[i]);
		}
		this.redraw();
	},
	
	togglePoison: function()
	{
		this._showPoison = !this._showPoison;
	},
	
	toggleImages: function()
	{
		this._showCommanderImages = !this._showCommanderImages;
	},
	
	toggleCommanderDamage: function()
	{
		this._showCommanderDamage = !this._showCommanderDamage;
	},
	
	redraw: function()
	{
		$('#mainContainer').html('');

		if(!scoreboard.datastore.hasData()) return;
	
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		var commanderKeys = scoreboard.datastore.getCommanderKeys();

		$('#mainContainer').append('<table class="" />');
		$('#mainContainer table').addClass('table').addClass('table-striped');
		$('#mainContainer table').append('<thead />');
		$('#mainContainer table thead').append('<tr />');
		
		//setup headers. uesd json properties: name (string), iconClass (string), buttons (bool), clickFunction, commanderName (string) 
		var headers = [ {name: 'Player', iconClass: "glyphicon-user" }, 
						{ name: 'Life', iconClass: "glyphicon-tree-deciduous", buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementDamageAll(amount); } } ];
						
		if (this._showPoison) 
		{
			headers.push({ name: 'Poison', iconClass: "glyphicon-tint", buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementPoisonAll(amount); } });		
		}
		
		if(this._showCommanderDamage)
		{
			for(var i=0;i<commanderKeys.length;i++)
			{
				headers.push( { name: scoreboard.datastore.getCommanderName(commanderKeys[i]), commanderName: commanderKeys[i], iconClass: null });
			}
		}
		
		//render headers based on objects
		for(var i=0;i<headers.length;i++)
		{
			$('#mainContainer table thead tr').append('<th />');
			$('#mainContainer table thead tr th:last').addClass('col-md-1');
			
			if(this._showCommanderImages && typeof(headers[i].commanderName)!='undefined')
			{
				$('#mainContainer table thead tr th:last').append('<img />');
				$('#mainContainer table thead tr th:last img:last').addClass('commanderIcon');
				$('#mainContainer table thead tr th:last img:last').attr('id', 'image_' + headers[i].commanderName);
				
				scoreboard.cardinfo.getCardImage(headers[i].name, this._getImageCallback(headers[i].commanderName));
			}
			
			$('#mainContainer table thead tr th:last').append('<h4 />');
			if(typeof(headers[i].iconClass)!='undefined') 
			{
				$('#mainContainer table thead tr th:last h4').append('<span />');
				$('#mainContainer table thead tr th:last h4 span:last').attr('class', "glyphicon " + headers[i].iconClass);
			 	$('#mainContainer table thead tr th:last h4 span:last').attr('aria-hidden', "true");
				 $('#mainContainer table thead tr th:last h4').append("&nbsp;")
			}
			$('#mainContainer table thead tr th:last h4').append(headers[i].name);
			
			if(typeof(headers[i].buttons)!='undefined')
			{
				this._drawButtons(headers[i].clickFunction, '#mainContainer table thead tr th:last');
			}
		}

		$('#mainContainer table').append('<tbody />');
		
		//render player rows
		for(var i=0;i<playerKeys.length;i++)
		{
			$('#mainContainer table tbody').append('<tr />');
			
			$('#mainContainer table tbody tr:last').append('<td />');
			$('#mainContainer table tbody tr:last td:last').append('<h2 />');
			$('#mainContainer table tbody tr:last td:last h2').html(scoreboard.datastore.getPlayerName(playerKeys[i]));

			var columns = [];
			columns.push({
				name: 'life_' + playerKeys[i],
				value: scoreboard.datastore.getDamage(playerKeys[i]),
				min: scoreboard.settings.minLifeDisplay,
				max: scoreboard.settings.maxLifeDisplay,
				descending:  true,
				clickFunction: this._getClickFunction('damage', playerKeys[i]),
				promptFunction:  this._getPromptFunction('damage',  playerKeys[i])
			});
			
			if (this._showPoison) 
			{
				columns.push({
					name: 'poison_' + playerKeys[i],
					value: scoreboard.datastore.getPoison(playerKeys[i]),
					min: scoreboard.settings.minPoisonDisplay,
					max: scoreboard.settings.maxPoisonDisplay,
					descending: false,
					clickFunction: this._getClickFunction('poison',  playerKeys[i]),
					promptFunction: this._getPromptFunction('poison',  playerKeys[i])
				});
			}
			
			if(this._showCommanderDamage)
			{
				for(var j=0;j<commanderKeys.length;j++)
				{
					columns.push({
						name: 'commanderDamage_' + playerKeys[i] + '_' + commanderKeys[j],
						value: scoreboard.datastore.getCommanderDamage(playerKeys[i], commanderKeys[j]),
						min: scoreboard.settings.minCommanderDamageDisplay,
						max: scoreboard.settings.maxCommanderDamageDisplay,
						descending: false,
						clickFunction: this._getClickFunction('commanderDamage', playerKeys[i], commanderKeys[j]),
						promptFunction: this._getPromptFunction('commanderDamage', playerKeys[i], commanderKeys[j])
					});
				}
			}
			
			for(var j=0;j<columns.length;j++)
			{
				$('#mainContainer table tbody tr:last').append('<td />');
				$('#mainContainer table tbody tr:last td:last').append('<h2/>');
				$('#mainContainer table tbody tr:last td:last h2').append('<a />');
				$('#mainContainer table tbody tr:last td:last h2 a').attr( 'id', 'number_'  + columns[j].name);
				$('#mainContainer table tbody tr:last td:last h2 a').html(columns[j].value);
				$('#mainContainer table tbody tr:last td:last h2 a').click(columns[j].promptFunction);
			
				this._drawProgressBar('#mainContainer table tbody tr:last td:last', columns[j].name, columns[j].value, columns[j].min, columns[j].max, columns[j].descending);
				this._drawButtons(columns[j].clickFunction, '#mainContainer table tbody tr:last td:last');
			}
		}
	},
	
	_getImageCallback: function(commanderName)
	{
		return (function(cardInfo)
		{
			$('#image_' + commanderName).css('background-image', 'url(' + cardInfo.imageUrl + ')').removeClass().addClass('commanderIcon').addClass(cardInfo.positioningClass);
		});
	},
	
	_getPromptFunction: function(type, playerName, commanderName)
	{
		var result = function() {};
		if(type=='damage')
		{
			result = function(amount) { scoreboard.functions.setDamage(playerName, amount) };
		}
		if(type=='poison')
		{
			result = function(amount) { scoreboard.functions.setPoison(playerName, amount); };
		}
		if(type=='commanderDamage')
		{
			result = function(amount) { scoreboard.functions.setCommanderDamage(playerName,commanderName, amount); };
		}
		return(function(){ scoreboard.renderer.promptForAmount(result); });
	},
	
	_getClickFunction: function(type, playerName, commanderName)
	{
		var result = function() {};
		if(type=='damage')
		{
			result = function(amount) { scoreboard.functions.incrementDamage(playerName, amount) };
		}
		if(type=='poison')
		{
			result = function(amount) { scoreboard.functions.incrementPoison(playerName, amount); };
		}
		if(type=='commanderDamage')
		{
			result = function(amount) { scoreboard.functions.incrementCommanderDamage(playerName,commanderName, amount); };
		}
		return(result);
	},
	 
	_drawButtons: function(clickFunction, parentElement)
	{
		$(parentElement).append('<button>+1</button>');
		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');
		$(parentElement + ' button:last').click(function(){clickFunction(1);});

		$(parentElement).append('<button>-1</button>');
		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');
		$(parentElement + ' button:last').click(function(){clickFunction(-1);});

		$(parentElement).append('<button>+5</button>');
		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');
		$(parentElement + ' button:last').click(function(){clickFunction(+5);});

		$(parentElement).append('<button>-5</button>');
		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');
		$(parentElement + ' button:last').click(function(){clickFunction(-5);});
	},
	 
	_drawProgressBar: function(destination, name, current, min, max, descending)
	{
		$(destination).append('<div />');
		$(destination + ' div').addClass('progress');
		$(destination + ' div').css('margin-bottom','5px');
		
		$(destination + ' div').append('<div />');

		var width = this._getProgressWidth(current, min, max);
		var className = this._getProgressBarClass(width, descending);
		
		$(destination + ' div.progress div').addClass('progress-bar').addClass(className);
		$(destination + ' div.progress div').attr('id', 'progressBar_' + name);
		$(destination + ' div.progress div').css('width', width + '%');
	},
	
	_getProgressWidth: function(current, min, max)
	{
		var width = 0;
		if(current >= max) width = 100;
		else width = Math.floor(100 * current/max);
		return(width);
	},
	
	_getProgressBarClass: function(width, descending)
	{
		var className = 'progress-bar-info'
		if(descending)
		{			
			if(width>=75) className = 'progress-bar-success';
			else if(width>=50 && width <75) className = 'progress-bar-info';
			else if(width>=25 && width <50) className = 'progress-bar-warning';
			else if(width <25) className = 'progress-bar-danger';
		}
		else
		{
			if(width<25) className = 'progress-bar-success';
			else if(width>=25 && width <50) className = 'progress-bar-info';
			else if(width>=50 && width <75) className = 'progress-bar-warning';
			else if(width >=75) className = 'progress-bar-danger';
		}
		return(className);
	},
	
	redrawDamageAll: function(amount)
	{
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		for(var i=0;i<playerKeys.length;i++)
		{
			this.redrawDamage(playerKeys[i]);
		}
	},

	redrawPoisonAll: function(amount)
	{
		var playerKeys = scoreboard.datastore.getPlayerKeys();
		for(var i=0;i<playerKeys.length;i++)
		{
			this.redrawPoison(playerKeys[i]);
		}
	},
	
	redrawDamage: function(playerKey)
	{
		var current = scoreboard.datastore.getDamage(playerKey);
		var width = this._getProgressWidth(current, scoreboard.settings.minLifeDisplay, scoreboard.settings.maxLifeDisplay);
		var className = this._getProgressBarClass(width, true);
	
		$('#number_life_' + playerKey).html(current);
		$('#progressBar_life_' + playerKey).css('width', width + '%');
		$('#progressBar_life_' + playerKey).removeClass().addClass('progress-bar').addClass(className);
	},

	redrawPoison: function(playerKey)
	{
		var current = scoreboard.datastore.getPoison(playerKey);
		var width = this._getProgressWidth(current, scoreboard.settings.minPoisonDisplay, scoreboard.settings.maxPoisonDisplay);
		var className = this._getProgressBarClass(width, false);
	
		$('#number_poison_' + playerKey).html(current);
		$('#progressBar_poison_' + playerKey).css('width', width + '%');
		$('#progressBar_poison_' + playerKey).removeClass().addClass('progress-bar').addClass(className);
	},
	 
	redrawCommanderDamage: function(playerKey, commanderKey)
	{
		var current = scoreboard.datastore.getCommanderDamage(playerKey, commanderKey);
		var width = this._getProgressWidth(current, scoreboard.settings.minCommanderDamageDisplay, scoreboard.settings.maxCommanderDamageDisplay);
		var className = this._getProgressBarClass(width, false);
	
		$('#number_commanderDamage_' + playerKey + '_' + commanderKey).html(current);
		$('#progressBar_commanderDamage_' + playerKey + '_' + commanderKey).css('width', width + '%');
		$('#progressBar_commanderDamage_' + playerKey + '_' + commanderKey).removeClass().addClass('progress-bar').addClass(className);
	},
	 
	createRemovePlayerButton: function(playerKey)
	{
		$('#managePlayersContainer').append('<button />');
		$('#managePlayersContainer button:last')	
			.attr('id', 'removePlayer_' + playerKey)
			.addClass('btn')
			.addClass('btn-default')
            .append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>')
			.append(' Remove ' + scoreboard.datastore.getPlayerName(playerKey))
			.click(function() { scoreboard.functions.removePlayer(playerKey); });
	},
    
    destroyRemovePlayerButton: function(playerKey)
	{
		$('#removePlayer_' + playerKey).remove();
	},
    
    createRemoveCommanderButton: function(commanderKey)
	{
		$('#manageCommandersContainer').append('<button />');
		$('#manageCommandersContainer button:last')	
			.attr('id', 'removeCommander_' + commanderKey)
			.addClass('btn')
			.addClass('btn-default')
            .append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>')
			.append(' Remove ' + scoreboard.datastore.getCommanderName(commanderKey))
			.click(function() { scoreboard.functions.removeCommander(commanderKey); });
	},
    
    destroyRemoveCommanderButton: function(commanderKey)
	{
		$('#removeCommander_' + commanderKey).remove();
	},
	
	appendToLog: function(message)
	{
		var currentLog = $('#logContainer textArea').html();
		$('#logContainer textArea').html(message + '\n' + currentLog);
	},
	 
	promptForAmount: function(callback)
	{
		bootbox.prompt('Set to which value?', function(result) {                
		  if (result != null && result!='' && !isNaN(result)) {                                             
			callback(parseInt(result));
		  }
		});
	},
	 
	toggleLogDisplay: function()
	{
        var log = $('textarea.logDisplay');
		log.toggleClass('hidden');
        return !log.hasClass('hidden');
 	},
	
    getCommanderFormData: function() {
		var commanderName = $('#inputCommander').val();
		var commanderInfect = $('#inputInfect').is(':checked');
		return ({
             commanderName: commanderName, 
             commanderInfect: commanderInfect
        });
    },
    
    getPlayerFormData: function() {
		var playerName = $('#inputPlayer').val();
		return ({
             playerName: playerName
        });
    },
    
	getAllFormData: function()
	{
 		var playerName = $('#inputPlayer').val();
		var commanderName = $('#inputCommander').val();
		var commanderInfect = $('#inputInfect').is(':checked');
		
		return ({
             playerName: playerName, 
             commanderName: commanderName, 
             commanderInfect: commanderInfect
        });
	},
	
    
    resetPlayerFormData: function()
	{
		$('#inputPlayer').val('');
		$('#inputPlayer').focus();
	},
    
    resetCommanderFormData: function()
	{
		$('#inputCommander').val('');
		if($('#inputInfect').is(':checked')) { 
            $('#inputInfect').bootstrapSwitch('toggleState', false);
        }
		$('#inputCommander').focus();
	},
    
	resetAllFormData: function()
	{
        this.resetCommanderFormData();
        this.resetCommanderFormData();
	},
	 
	showExistingPlayerFormError: function()
	{
		$('#existingPlayerError').removeClass('hidden');
        setTimeout(function () {
            $('#existingPlayerError').addClass('hidden');
        }, 2500);
	},
    
    showExistingCommanderFormError: function ()
    {
        $('#existingCommanderError').removeClass('hidden');
        setTimeout(function () {
            $('#existingCommanderError').addClass('hidden');
        }, 2500);
    },
    showGeneralError: function (message)
    {
        $('#generalError .message').html(message);
        $('#generalError').removeClass('hidden');
        setTimeout(function () {
            $('#generalError').addClass('hidden');
        }, 2500);
    }
    
};

