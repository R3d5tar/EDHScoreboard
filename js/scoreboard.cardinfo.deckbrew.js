/*
* Copyright (c) 2014-2015 Filipe Badaro
* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.cardinfo = {
	_creatureQueryUrl: 'https://api.deckbrew.com/mtg/cards?supertype=legendary&name={cardName}',
	_planeswalkerQueryUrl: 'https://api.deckbrew.com/mtg/cards?type=planeswalker&name={cardName}',
	_imageUrl: 'http://gatherer.wizards.com/Handlers/Image.ashx?name={cardName}&type=card&.jpg',

	init: function()
	{
	},

	getCardImage: function(cardName, callback)
	{
		$.ajax({
			url: scoreboard.cardinfo._creatureQueryUrl.replace('{cardName}',escape(cardName)),
			dataType: 'json',
			success: function(data)
			{
				scoreboard.cardinfo._creatureCallback(cardName, data, callback);
			},
			error : function()
			{
				scoreboard.cardinfo._getGathererCardImage(cardName, false, callback);
			},
			cache: true
		});
	},
	
	_creatureCallback: function(cardName, data, callback)
	{
		if(data.length>0)
		{
			scoreboard.cardinfo._getGathererCardImage(data[0].name, false, callback);
		}
		else
		{
			$.ajax({
				url: scoreboard.cardinfo._planeswalkerQueryUrl.replace('{cardName}',escape(cardName)),
				dataType: 'json',
				success: function(data)
				{
					scoreboard.cardinfo._planeswalkerCallback(cardName, data, callback);
				},
				error : function()
				{
					scoreboard.cardinfo._getGathererCardImage(cardName, false, callback);
				},
				cache: true
			});
		}
	},

	_planeswalkerCallback: function(cardName, data, callback)
	{
		if(data.length>0)
		{
			scoreboard.cardinfo._getGathererCardImage(data[0].name, true, callback);
		}
		else
		{
			scoreboard.cardinfo._getGathererCardImage(cardName, false, callback);
		}
	},
	
	_getGathererCardImage: function(cardName, isPlanesWalker, callback)
	{
		var imageUrl = this._imageUrl.replace('{cardName}',escape(cardName));
		var positioningClass = isPlanesWalker ? 'commanderIconGathererPlaneswalker' : 'commanderIconGathererCreature';
		callback({ imageUrl: imageUrl, positioningClass: positioningClass });
	},
}