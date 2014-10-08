/*
* Copyright (c) 2014 Filipe Badaro
* License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.cardinfo = {
	_databaseUrl: 'http://mtgjson.com/json/AllCards.jsonp',
	_imageUrl: 'http://mtgimage.com/card/{imageName}-crop.jpg',
	_cardImageUrl: 'http://mtgimage.com/card/{imageName}.jpg',

	_cards: {},
	_callback: function() { },
	_loading: false,
	
	init: function()
	{
	},

	load: function(callback)
	{
		if(this._loading) return;
	
		this._loading = true;
		this._callback = callback;

		$.ajax({
			url: scoreboard.cardinfo._databaseUrl,
			dataType: 'jsonp',
		});
	},
	
	_loadCallback: function(data)
	{
		for(var cardName in data)
		{
			if(data[cardName].type.indexOf('Legendary')>=0 && data[cardName].type.indexOf('Creature')>=0 && typeof(data[cardName].manaCost)!='undefined')
			{
				var imageUrl = this._imageUrl.replace('{imageName}',escape(data[cardName].imageName));
				var cardImageUrl = this._cardImageUrl.replace('{imageName}',escape(data[cardName].imageName));
			
				this._cards[cardName] = {
					name: data[cardName].name,
					lowerCaseName: data[cardName].name.toLowerCase(),
					imageUrl: imageUrl,
					cardImageUrl: cardImageUrl
				};
			}
		}
		
		this._callback();
	},
	
	getCard: function(cardName)
	{
		var lowerCaseCardName = cardName.toLowerCase()
		for(var existingCardName in this._cards)
		{
			if(this._cards[existingCardName].lowerCaseName.indexOf(lowerCaseCardName)>=0)
			{
				return(this._cards[existingCardName]);
			}
		}
		return(null);
	}
}

// Fixed callback required by mtgjson
function mtgjsoncallback(data, name)
{
	scoreboard.cardinfo._loadCallback(data);
}