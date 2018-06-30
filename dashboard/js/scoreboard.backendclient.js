/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.backendclient = function () {
    var backendBaseUrl = scoreboard.environment.backendBaseUrl;

    var _self = {};

    _self.init = function (code, secret) {
        if (code && secret) {
            connect(code, secret);
        }
    };
    
    // curl -X POST "https://localhost:5001/api/Games" -H "accept: application/json"
    // -H "Content-Type: application/json-patch+json" playerNames : ['Adam',
    // 'Baker', 'Charlie']
    _self.registerGame = function (playerNames, succesCallback, errorCallback) {
        var data = _convertplayerNamesToData(playerNames);
        $.ajax({
            method: 'POST',
            url: _getGameUrl(),
            contentType: 'application/json-patch+json',
            dataType: 'json',
            data: JSON.stringify(data),
            processData: false,
            success: function (response) { 
                return _self.connect(response.code, response.secret)
                    .then(function () {
                        succesCallback(response);
                    });
            },
            error: errorCallback,
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
        _self.hub.disconnect();
    };

    function connect(code, secret) {
        return _self
            .hub
            .connect()
            .then(function () {
                return _self
                    .hub
                    .invoke('DashboardConnect', code, secret);
            });
    }
    _self.connect = connect;

    function _getGameUrl(code) {
        var result = backendBaseUrl + '/api/Games';
        if (code) {
            result += '/' + code;
        }
        return result;
    }

    // playerNames : ['Adam', 'Baker', 'Charlie'] result: { 'players': [{'name':
    // 'Adam'},{'name': 'Baker'},{'name': 'Charlie'}] }
    function _convertplayerNamesToData(playerNames) {
        var game = {
            players: []
        };
        for (var i = 0; i < playerNames.length; i++) 
            game.players.push({name: playerNames[i]});
        return game;
    }

    return _self;
}();

scoreboard.backendclient.hub = function () {
    var backendBaseUrl = scoreboard.environment.backendBaseUrl;

    this.stateChangeFunctions = [];
    this.msgHubState = 'build';
    this.connection = new signalR
        .HubConnectionBuilder()
        .withUrl(backendBaseUrl + '/msgHub')
        .build();

    this.connect = function () {
        return this
            .connection
            .start()
            .then(function () {
                this.internalSetState('connected');
            }.bind(this))
            .catch(function (err) {
                this.handleError(err);
            }.bind(this));
    }.bind(this);

    this.disconnect = function () {
        return this
            .connection
            .stop()
            .then(function () {
                this.internalSetState('disconnected');
            }.bind(this))
            .catch(function (err) {
                this.handleError(err);
            }.bind(this));
    }.bind(this);

    this.invoke = function () {
        this
            .connection
            .invoke
            .apply(this.connection, arguments)
            .catch(function (err) {
                this.handleError(err);
            }.bind(this));
    }.bind(this);

    this.on = function (actionName, delegateFunction) {
        this
            .connection
            .on(actionName, delegateFunction);
    }.bind(this);

    this.onStateChange = function (delegateFunction) {
        this
            .stateChangeFunctions
            .push(delegateFunction);
    }.bind(this);

    this.internalSetState = function (msgHubState) {
        this.msgHubState = msgHubState;
        this.triggerStateChange(msgHubState);
    }.bind(this);

    this.triggerStateChange = function (msgHubState) {
        for (var i = 0; i < this.stateChangeFunctions.length; i++) {
            this.stateChangeFunctions[i](msgHubState);
        }
    }.bind(this);

    this.handleError = function (err) {
        this.internalSetState('error: ' + err);
        throw err;
    }.bind(this);

    return this;
}.apply({});