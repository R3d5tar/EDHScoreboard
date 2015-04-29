/** Copyright (c) 2014 Filipe Badaro* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE*/scoreboard.renderer = {	_images: false,	init: function()	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			this.createRemovePlayerButton(playerKeys[i]);		}		this.redraw();	},		setImages: function(state)	{		this._images = state;	},		redraw: function()	{		$('#mainContainer').html('');		if(!scoreboard.datastore.hasData()) return;			var playerKeys = scoreboard.datastore.getPlayerKeys();		var commanderKeys = scoreboard.datastore.getCommanderKeys();		$('#mainContainer').append('<table class="" />');		$('#mainContainer table').addClass('table').addClass('table-striped');		$('#mainContainer table').append('<thead />');		$('#mainContainer table thead').append('<tr />');				var headers = [ {name: 'Player' }, { name: 'Life', buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementDamageAll(amount); } }, { name: 'Poison', buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementPoisonAll(amount); } }];		for(var i=0;i<commanderKeys.length;i++)		{			headers.push( { name: scoreboard.datastore.getCommanderName(commanderKeys[i]), commanderName: commanderKeys[i] });		}				for(var i=0;i<headers.length;i++)		{			$('#mainContainer table thead tr').append('<th />');			$('#mainContainer table thead tr th:last').addClass('col-md-1');						if(typeof(headers[i].commanderName)!='undefined' && this._images)			{				$('#mainContainer table thead tr th:last').append('<img />');				$('#mainContainer table thead tr th:last img:last').addClass('commanderIcon');				$('#mainContainer table thead tr th:last img:last').attr('id', 'image_' + headers[i].commanderName);								scoreboard.cardinfo.getCardImage(headers[i].name, this._getImageCallback(headers[i].commanderName));			}						if(typeof(headers[i].icons)!='undefined')			{				for(var j=0;j<headers[i].icons.length;j++)				{					$('#mainContainer table thead tr th:last').append('<img />');					$('#mainContainer table thead tr th:last img:last').attr('src', headers[i].icons[j]);				}			}						$('#mainContainer table thead tr th:last').append('<h4 />');			$('#mainContainer table thead tr th:last h4').html(headers[i].name);						if(typeof(headers[i].buttons)!='undefined')			{				this._drawButtons(headers[i].clickFunction, '#mainContainer table thead tr th:last');			}		}		$('#mainContainer table').append('<tbody />');				for(var i=0;i<playerKeys.length;i++)		{			$('#mainContainer table tbody').append('<tr />');						$('#mainContainer table tbody tr:last').append('<td />');			$('#mainContainer table tbody tr:last td:last').append('<h2 />');			$('#mainContainer table tbody tr:last td:last h2').html(scoreboard.datastore.getPlayerName(playerKeys[i]));			var columns = [];			columns.push({				name: 'life_' + playerKeys[i],				value: scoreboard.datastore.getDamage(playerKeys[i]),				min: scoreboard.settings.minLifeDisplay,				max: scoreboard.settings.maxLifeDisplay,				descending:  true,				clickFunction: this._getClickFunction('damage', playerKeys[i]),				promptFunction:  this._getPromptFunction('damage',  playerKeys[i])			});			columns.push({				name: 'poison_' + playerKeys[i],				value: scoreboard.datastore.getPoison(playerKeys[i]),				min: scoreboard.settings.minPoisonDisplay,				max: scoreboard.settings.maxPoisonDisplay,				descending: false,				clickFunction: this._getClickFunction('poison',  playerKeys[i]),				promptFunction: this._getPromptFunction('poison',  playerKeys[i])			});						for(var j=0;j<commanderKeys.length;j++)			{				columns.push({					name: 'commanderDamage_' + playerKeys[i] + '_' + commanderKeys[j],					value: scoreboard.datastore.getCommanderDamage(playerKeys[i], commanderKeys[j]),					min: scoreboard.settings.minCommanderDamageDisplay,					max: scoreboard.settings.maxCommanderDamageDisplay,					descending: false,					clickFunction: this._getClickFunction('commanderDamage', playerKeys[i], commanderKeys[j]),					promptFunction: this._getPromptFunction('commanderDamage', playerKeys[i], commanderKeys[j])				});			}						for(var j=0;j<columns.length;j++)			{				$('#mainContainer table tbody tr:last').append('<td />');				$('#mainContainer table tbody tr:last td:last').append('<h2/>');				$('#mainContainer table tbody tr:last td:last h2').append('<a />');				$('#mainContainer table tbody tr:last td:last h2 a').attr( 'id', 'number_'  + columns[j].name);				$('#mainContainer table tbody tr:last td:last h2 a').html(columns[j].value);				$('#mainContainer table tbody tr:last td:last h2 a').click(columns[j].promptFunction);							this._drawProgressBar('#mainContainer table tbody tr:last td:last', columns[j].name, columns[j].value, columns[j].min, columns[j].max, columns[j].descending);				this._drawButtons(columns[j].clickFunction, '#mainContainer table tbody tr:last td:last');			}		}	},		_getImageCallback: function(commanderName)	{		return (function(cardInfo)		{			$('#image_' + commanderName).css('background-image', 'url(' + cardInfo.imageUrl + ')').removeClass().addClass('commanderIcon').addClass(cardInfo.positioningClass);		});	},		_getPromptFunction: function(type, playerName, commanderName)	{		var result = function() {};		if(type=='damage')		{			result = function(amount) { scoreboard.functions.setDamage(playerName, amount) };		}		if(type=='poison')		{			result = function(amount) { scoreboard.functions.setPoison(playerName, amount); };		}		if(type=='commanderDamage')		{			result = function(amount) { scoreboard.functions.setCommanderDamage(playerName,commanderName, amount); };		}		return(function(){ scoreboard.renderer.promptForAmount(result); });	},		_getClickFunction: function(type, playerName, commanderName)	{		var result = function() {};		if(type=='damage')		{			result = function(amount) { scoreboard.functions.incrementDamage(playerName, amount) };		}		if(type=='poison')		{			result = function(amount) { scoreboard.functions.incrementPoison(playerName, amount); };		}		if(type=='commanderDamage')		{			result = function(amount) { scoreboard.functions.incrementCommanderDamage(playerName,commanderName, amount); };		}		return(result);	},	 	_drawButtons: function(clickFunction, parentElement)	{		$(parentElement).append('<button>+1</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(1);});		$(parentElement).append('<button>-1</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(-1);});		$(parentElement).append('<button>+5</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(+5);});		$(parentElement).append('<button>-5</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(-5);});	},	 	_drawProgressBar: function(destination, name, current, min, max, descending)	{		$(destination).append('<div />');		$(destination + ' div').addClass('progress');		$(destination + ' div').css('margin-bottom','5px');				$(destination + ' div').append('<div />');		var width = this._getProgressWidth(current, min, max);		var className = this._getProgressBarClass(width, descending);				$(destination + ' div.progress div').addClass('progress-bar').addClass(className);		$(destination + ' div.progress div').attr('id', 'progressBar_' + name);		$(destination + ' div.progress div').css('width', width + '%');	},		_getProgressWidth: function(current, min, max)	{		var width = 0;		if(current >= max) width = 100;		else width = Math.floor(100 * current/max);		return(width);	},		_getProgressBarClass: function(width, descending)	{		var className = 'progress-bar-info'		if(descending)		{						if(width>=75) className = 'progress-bar-success';			else if(width>=50 && width <75) className = 'progress-bar-info';			else if(width>=25 && width <50) className = 'progress-bar-warning';			else if(width <25) className = 'progress-bar-danger';		}		else		{			if(width<25) className = 'progress-bar-success';			else if(width>=25 && width <50) className = 'progress-bar-info';			else if(width>=50 && width <75) className = 'progress-bar-warning';			else if(width >=75) className = 'progress-bar-danger';		}		return(className);	},		redrawDamageAll: function(amount)	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			this.redrawDamage(playerKeys[i]);		}	},	redrawPoisonAll: function(amount)	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			this.redrawPoison(playerKeys[i]);		}	},		redrawDamage: function(playerKey)	{		var current = scoreboard.datastore.getDamage(playerKey);		var width = this._getProgressWidth(current, scoreboard.settings.minLifeDisplay, scoreboard.settings.maxLifeDisplay);		var className = this._getProgressBarClass(width, true);			$('#number_life_' + playerKey).html(current);		$('#progressBar_life_' + playerKey).css('width', width + '%');		$('#progressBar_life_' + playerKey).removeClass().addClass('progress-bar').addClass(className);	},	redrawPoison: function(playerKey)	{		var current = scoreboard.datastore.getPoison(playerKey);		var width = this._getProgressWidth(current, scoreboard.settings.minPoisonDisplay, scoreboard.settings.maxPoisonDisplay);		var className = this._getProgressBarClass(width, false);			$('#number_poison_' + playerKey).html(current);		$('#progressBar_poison_' + playerKey).css('width', width + '%');		$('#progressBar_poison_' + playerKey).removeClass().addClass('progress-bar').addClass(className);	},	 	redrawCommanderDamage: function(playerKey, commanderKey)	{		var current = scoreboard.datastore.getCommanderDamage(playerKey, commanderKey);		var width = this._getProgressWidth(current, scoreboard.settings.minCommanderDamageDisplay, scoreboard.settings.maxCommanderDamageDisplay);		var className = this._getProgressBarClass(width, false);			$('#number_commanderDamage_' + playerKey + '_' + commanderKey).html(current);		$('#progressBar_commanderDamage_' + playerKey + '_' + commanderKey).css('width', width + '%');		$('#progressBar_commanderDamage_' + playerKey + '_' + commanderKey).removeClass().addClass('progress-bar').addClass(className);	},	 	createRemovePlayerButton: function(playerKey)	{		$('#toolsContainer h4').append('<button>');		$('#toolsContainer h4 button:last').attr('id', 'removePlayer_' + playerKey);		$('#toolsContainer h4 button:last').addClass('btn').addClass('btn-default').addClass('removeButton');		$('#toolsContainer h4 button:last').html('Remove ' + scoreboard.datastore.getPlayerName(playerKey));		$('#toolsContainer h4 button:last').click(function() { scoreboard.functions.removePlayer(playerKey); return(false); } );	},	 	destroyRemovePlayerButton: function(playerKey)	{		$('#removePlayer_' + playerKey).remove();	},		changeLoadImagesButtonText: function(text)	{		$('#loadImagesButton').html(text);	},	 	destroyLoadImagesButton: function()	{		$('#loadImagesButton').remove();	},	 	appendToLog: function(message)	{		var currentLog = $('#logContainer textArea').html();		$('#logContainer textArea').html(message + '\n' + currentLog);	},	 	promptForAmount: function(callback)	{		bootbox.prompt('Set to which value?', function(result) {                		  if (result != null && result!='' && !isNaN(result)) {                                             			callback(parseInt(result));		  }		});	},	 	toggleLogDisplay: function()	{		$('textarea.logDisplay').toggle(); 	},	 	getFormData: function()	{ 		var playerName = $('#inputPlayer').val();		var commanderName = $('#inputCommander').val();		var commanderInfect = $('#inputInfect').is(':checked');				return({playerName: playerName, commanderName: commanderName, commanderInfect: commanderInfect});	},	 	resetFormData: function()	{		$('#inputPlayer').val('');		$('#inputCommander').val('');		if($('#inputInfect').is(':checked')) $('#inputInfect').bootstrapSwitch('toggleState', false);		$('#inputPlayer').focus();	},	 	showFormError: function()	{		$('#exitingUserError').show().delay(2500).fadeOut();	}};