/** Copyright (c) 2014 Filipe Badaro* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE*/scoreboard.renderer = {	init: function()	{		var playerKeys = scoreboard.datastore.getPlayerKeys();		for(var i=0;i<playerKeys.length;i++)		{			this.createRemovePlayerButton(playerKeys[i]);		}		this.redraw();	},		redraw: function()	{		$('#mainContainer').html('');		if(!scoreboard.datastore.hasData()) return;			var playerKeys = scoreboard.datastore.getPlayerKeys();		var commanderKeys = scoreboard.datastore.getCommanderKeys();		$('#mainContainer').append('<table class="" />');		$('#mainContainer table').addClass('table').addClass('table-striped');		$('#mainContainer table').append('<thead />');		$('#mainContainer table thead').append('<tr />');				var headers = [ {name: 'Player' }, { name: 'Life', buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementDamageAll(amount); } }, { name: 'Poison', buttons: true, clickFunction: function(amount){ scoreboard.functions.incrementPoisonAll(amount); } }];		for(var i=0;i<commanderKeys.length;i++)		{			headers.push( { name: 'From<br />' + scoreboard.datastore.getCommanderName(commanderKeys[i]) });		}				for(var i=0;i<headers.length;i++)		{			$('#mainContainer table thead tr').append('<th />');			$('#mainContainer table thead tr th:last').addClass('col-md-1');			$('#mainContainer table thead tr th:last').append('<h4 />');			$('#mainContainer table thead tr th:last h4').html(headers[i].name);						if(headers[i].buttons)			{				this._drawButtons(headers[i].clickFunction, '#mainContainer table thead tr th:last');			}		}		$('#mainContainer table').append('<tbody />');				for(var i=0;i<playerKeys.length;i++)		{			$('#mainContainer table tbody').append('<tr />');						$('#mainContainer table tbody tr:last').append('<td />');			$('#mainContainer table tbody tr:last td:last').append('<h2 />');			$('#mainContainer table tbody tr:last td:last h2').html(scoreboard.datastore.getPlayerName(playerKeys[i]));			var columns = [];			columns.push({				value: scoreboard.datastore.getDamage(playerKeys[i]),				min: scoreboard.settings.minLifeDisplay,				max: scoreboard.settings.maxLifeDisplay,				descending:  true,				clickFunction: this._getClickFunction('damage', playerKeys[i]),				promptFunction:  this._getPromptFunction('damage',  playerKeys[i])			});			columns.push({				value: scoreboard.datastore.getPoison(playerKeys[i]),				min: scoreboard.settings.minPoisonDisplay,				max: scoreboard.settings.maxPoisonDisplay,				descending: false,				clickFunction: this._getClickFunction('poison',  playerKeys[i]),				promptFunction: this._getPromptFunction('poison',  playerKeys[i])			});						for(var j=0;j<commanderKeys.length;j++)			{				columns.push({					value: scoreboard.datastore.getCommanderDamage(playerKeys[i], commanderKeys[j]),					min: scoreboard.settings.minCommanderDamageDisplay,					max: scoreboard.settings.maxCommanderDamageDisplay,					descending: false,					clickFunction: this._getClickFunction('commanderDamage', playerKeys[i], commanderKeys[j]),					promptFunction: this._getPromptFunction('commanderDamage', playerKeys[i], commanderKeys[j])				});			}						for(var j=0;j<columns.length;j++)			{				$('#mainContainer table tbody tr:last').append('<td />');				$('#mainContainer table tbody tr:last td:last').append('<h2/>');				$('#mainContainer table tbody tr:last td:last h2').append('<a />');				$('#mainContainer table tbody tr:last td:last h2 a').html(columns[j].value);				$('#mainContainer table tbody tr:last td:last h2 a').click(columns[j].promptFunction);							this._drawProgressBar('#mainContainer table tbody tr:last td:last', columns[j].value, columns[j].min, columns[j].max, columns[j].descending);				this._drawButtons(columns[j].clickFunction, '#mainContainer table tbody tr:last td:last');			}		}	},		_getPromptFunction: function(type, playerName, commanderName)	{		var result = function() {};		if(type=='damage')		{			result = function(amount) { scoreboard.functions.setDamage(playerName, amount) };		}		if(type=='poison')		{			result = function(amount) { scoreboard.functions.setPoison(playerName, amount); };		}		if(type=='commanderDamage')		{			result = function(amount) { scoreboard.functions.setCommanderDamage(playerName,commanderName, amount); };		}		return(function(){ scoreboard.renderer.promptForAmount(result); });	},		_getClickFunction: function(type, playerName, commanderName)	{		var result = function() {};		if(type=='damage')		{			result = function(amount) { scoreboard.functions.incrementDamage(playerName, amount) };		}		if(type=='poison')		{			result = function(amount) { scoreboard.functions.incrementPoison(playerName, amount); };		}		if(type=='commanderDamage')		{			result = function(amount) { scoreboard.functions.incrementCommanderDamage(playerName,commanderName, amount); };		}		return(result);	},	 	_drawButtons: function(clickFunction, parentElement)	{		$(parentElement).append('<button>+1</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(1);});		$(parentElement).append('<button>-1</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(-1);});		$(parentElement).append('<button>+5</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(+5);});		$(parentElement).append('<button>-5</button>');		$(parentElement + ' button:last').addClass('btn').addClass('btn-default').addClass('btn-xs').addClass('lifeButton');		$(parentElement + ' button:last').click(function(){clickFunction(-5);});	},	 	_drawProgressBar: function(destination, current, min, max, descending)	{		$(destination).append('<div />');		$(destination + ' div').addClass('progress');		$(destination + ' div').css('margin-bottom','5px');				$(destination + ' div').append('<div />');		var width = 0;		if(current >= max) width = 100;		else width = Math.floor(100 * current/max);				var className = 'progress-bar-info'		if(descending)		{						if(width>=75) className = 'progress-bar-success';			else if(width>=50 && width <75) className = 'progress-bar-info';			else if(width>=25 && width <50) className = 'progress-bar-warning';			else if(width <25) className = 'progress-bar-danger';		}		else		{			if(width<25) className = 'progress-bar-success';			else if(width>=25 && width <50) className = 'progress-bar-info';			else if(width>=50 && width <75) className = 'progress-bar-warning';			else if(width >=75) className = 'progress-bar-danger';		}				$(destination + ' div.progress div').addClass('progress-bar').addClass(className);		$(destination + ' div.progress div').css('width', width + '%');	 },	 	 createRemovePlayerButton: function(playerKey)	 {		$('#toolsContainer h4').append('<button>');		$('#toolsContainer h4 button:last').addClass('btn').addClass('btn-default').addClass('removeButton');		$('#toolsContainer h4 button:last').html('Remove ' + scoreboard.datastore.getPlayerName(playerKey));		$('#toolsContainer h4 button:last').click(function() { scoreboard.functions.removePlayer(playerKey); $(this).remove(); return(false); } );	 },	 	 appendToLog: function(message)	 {		var currentLog = $('#logContainer textArea').html();		$('#logContainer textArea').html(message + '\n' + currentLog);	 },	 	 promptForAmount: function(callback)	 {		bootbox.prompt('Set to which value?', function(result) {                		  if (result != null && result!='' && !isNaN(result)) {                                             			callback(parseInt(result));		  }		});	 },	 	 toggleLogDisplay: function()	 {		$('textarea.logDisplay').toggle(); 	 },	 	 getFormData: function()	 { 		var playerName = $('#inputPlayer').val();		var commanderName = $('#inputCommander').val();				return({playerName: playerName, commanderName: commanderName});	 },	 	 resetFormData: function()	 {		$('#inputPlayer').val('');		$('#inputCommander').val('');		$('#inputPlayer').focus();	 },	 	 showFormError: function()	 {		$('#exitingUserError').show().delay(2500).fadeOut();	 }};