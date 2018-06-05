/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.backendclient = function () {
    var backendBaseUrl = scoreboard.environment.backendBaseUrl;

    var _self = {};

    _self.init = function() { 
    };
    //curl -X POST "https://localhost:5001/api/Games" -H "accept: application/json" -H "Content-Type: application/json-patch+json"
    //playerNames : ['Adam', 'Baker', 'Charlie']
    _self.registerGame = function (playerNames, succesCallback, errorCallback) 
    {
        var data = _convertplayerNamesToData(playerNames);
        $.ajax({
            method: 'POST',
            url: _getGameUrl(),
            contentType: 'application/json-patch+json',
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            success: succesCallback,
            error : errorCallback,
            cache: false
        });
    };

    _self.unregisterGame = function (code, secret) {
        $.ajax({
            method: 'DELETE',
            url: _getGameUrl(code),
            headers: {
                'Secret': secret
            },
            contentType: 'application/json-patch+json',
            dataType: 'json',
            processData: false,
            cache: false
        });
    };

    function _getGameUrl(code) {
        var result = backendBaseUrl + 'api/Games';
        if (code) {
            result += '/' + code;
        }
        return result;
    }

    //playerNames : ['Adam', 'Baker', 'Charlie']
    //result: { 'players': [{'name': 'Adam'},{'name': 'Baker'},{'name': 'Charlie'}] }
    function _convertplayerNamesToData(playerNames) {
        var game = { players: [] };
        for (var i = 0; i < playerNames.length; i++)
            game.players.push({name: playerNames[i]});
        return game;
    }
    
    return _self;
}();