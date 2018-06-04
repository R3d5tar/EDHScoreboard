/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*	
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.cardinfo = {
    
    init: function()
    { },

    autoComplete: function (text, callback, maxResults) 
    {
        var autoCompleteUrl = 'https://api.scryfall.com/cards/autocomplete?q={query}';
        $.ajax({
            url: autoCompleteUrl.replace('{query}', escape(text)),
            dataType: 'json',
            success: function(data)
            {
                var results = data.data.slice(0, maxResults);
                callback(results);
            },
            error : function()
            { 
                callback([]);
            },
            cache: true
        });
    },

    getCardImage: function(searchedCardName, callback) {
        var searchUrl = 'https://api.scryfall.com/cards/search?q={query}';
        var query = escape('order:edhrec ' + searchedCardName);
        $.ajax({
            url: searchUrl.replace('{query}', query),
            dataType: 'json',
            success: function(data)
            {
                if (data.total_cards >= 1)
                {
                    //pick first one.
                    var cardData = data.data[0];
                    var result = {
                        searchedCardName: searchedCardName,
                        cardName: cardData.name,
                        imageUrl: cardData.image_uris.art_crop,
                        artist: cardData.artist,
                        isPlaneswalker: (cardData.type_line) ? cardData.type_line.includes('Planeswalker') : false,
                        isClassic: cardData.frame == '1997'
                    };
                    callback(result);
                }
            },
            error : function()
            {
                //probably we didn't find any thing, lets use Mistform Ultimus as our catch-all.
                var result = {
                    searchedCardName: searchedCardName,
                    cardName: 'Mistform Ultimus',
                    imageUrl: 'https://img.scryfall.com/cards/art_crop/en/tsb/26.jpg',
                    artist: 'Anthony S. Waters',
                    isPlaneswalker: false,
                    isClassic: true
                };
                callback(result);
            },
            cache: true
        });
    }
};