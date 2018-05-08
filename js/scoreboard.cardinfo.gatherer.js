/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.cardinfo = {
	_imageUrl: 'http://gatherer.wizards.com/Handlers/Image.ashx?name={cardName}&type=card&.jpg',

	init: function()
	{
	},

	getCardImage: function(cardName, callback)
	{
		scoreboard.cardinfo._getGathererCardImage(cardName, callback);
	},
	
	_getGathererCardImage: function(cardName, callback)
	{
		var imageUrl = this._imageUrl.replace('{cardName}',escape(cardName));
		callback({ imageUrl: imageUrl });
	},
}