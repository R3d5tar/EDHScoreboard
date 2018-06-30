/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.functions = function () {

    var datastore = scoreboard.datastore,
        renderer = scoreboard.renderer,
        log = scoreboard.log,
        backendclient = scoreboard.backendclient,
        _self = {};

    _self.init = function () {};

    _self.addPlayerWithCommander = function () {

        var formData = renderer.getAllFormData();
        if (formData.playerName != '' && formData.commanderName != '') {
            var result = datastore.addPlayerWithCommander(formData.playerName, formData.commanderName, formData.commanderInfect);
            if (result.success) {
                renderer.resetAllFormData();
                renderer.createRemovePlayerButton(result.playerKey);
                renderer.createRemoveCommanderButton(result.commanderKey);
                log.write('{player} joined and plays a <card>{commander}</card>-deck.', {
                    player: formData.playerName,
                    commander: formData.commanderName
                });
                renderer.redraw();
            } else {
                renderer.showGeneralError(result.message);
            }
        }
    };

    _self.addPlayer = function () {

        var formData = renderer.getPlayerFormData();
        if (formData.playerName != '') {
            var result = datastore.addPlayer(formData.playerName);
            if (result.success) {
                renderer.resetPlayerFormData();
                renderer.createRemovePlayerButton(result.playerKey);
                log.write('{player} joined this game.', {player: formData.playerName});
                renderer.redraw();
            } else {
                renderer.showExistingPlayerFormError();
            }
        }
    },

    _self.addPlayer = function (name) {
        var result = datastore.addPlayer(name);
        if (result.success) {
            renderer.createRemovePlayerButton(result.playerKey);
            log.write('{player} joined this game.', {player: name});
            renderer.redraw();
        } else {
            log.write('Error when registering {player}', {player: name});
        }
    },

    _self.addCommander = function () {

        var formData = renderer.getCommanderFormData();
        if (formData.commanderName != '') {
            var result = datastore.addCommander(formData.commanderName, formData.commanderInfect);
            if (result.success) {
                renderer.resetCommanderFormData();
                renderer.createRemoveCommanderButton(result.commanderKey);
                log.write('Some-player plays a <card>{commander}</card>-deck.', {commander: formData.commanderName});
                renderer.redraw();
            } else {
                renderer.showExistingCommanderFormError();
            }
        }
    },

    _self.removePlayer = function (playerKey) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        var playerName = datastore.getPlayerName(playerKey);
        datastore.removePlayer(playerKey);
        renderer.destroyRemovePlayerButton(playerKey);
        log.write('{player} left this game.', {player: playerName});
        renderer.redraw();
    },

    _self.removeCommander = function (commanderKey) {

        var commanderName = datastore.getCommanderName(commanderKey);
        datastore.removeCommander(commanderKey);
        renderer.destroyRemoveCommanderButton(commanderKey);
        log.write('The <card>{commander}</card>-deck left this game.', {commander: commanderName});
        renderer.redraw();
    },

    _self.incrementDamage = function (playerKey, amount) {

        var diff = datastore.setDamage(playerKey, datastore.getDamage(playerKey) + amount) != 0;
        if (diff != 0) {

            log.write('{player} {event} {x} life.', {
                player: datastore.getPlayerName(playerKey),
                event: (amount < 0)
                    ? 'lost'
                    : 'gained',
                x: Math.abs(amount)
            });

            renderer.redrawDamage(playerKey);
        }
    },

    _self.incrementPoison = function (playerKey, amount) {

        var diff = datastore.setPoison(playerKey, datastore.getPoison(playerKey) + amount) != 0;
        if (diff != 0) {

            log.write('{player} {event} {x} poison counter(s).', {
                player: datastore.getPlayerName(playerKey),
                event: (amount < 0)
                    ? 'lost'
                    : 'got',
                x: Math.abs(amount)
            });

            renderer.redrawPoison(playerKey);
        }
    },

    _self.incrementCommanderDamage = function (playerKey, commanderKey, amount) {

        var diff = datastore.setCommanderDamage(playerKey, commanderKey, datastore.getCommanderDamage(playerKey, commanderKey) + amount);
        if (diff != 0) {
            renderer.redrawCommanderDamage(playerKey, commanderKey);

            var params = {
                player: datastore.getPlayerName(playerKey),
                commander: datastore.getCommanderName(commanderKey),
                x: Math.abs(amount)
            };

            if (datastore.getCommanderInfect(commanderKey)) {
                datastore.setPoison(playerKey, datastore.getPoison(playerKey) + diff);

                if (amount > 0) {
                    log.write('<card>{commander}</card> dealt {x} damage to {player} in the form of poison coun' +
                            'ters.',
                    params);
                } else {
                    log.write('Corrected {x} damage dealt by <card>{commander}</card> to {player} in the form o' +
                            'f poison counters.',
                    params);
                }

                renderer.redrawPoison(playerKey);
            } else {
                datastore.setDamage(playerKey, datastore.getDamage(playerKey) - diff);

                if (amount > 0) {
                    log.write('<card>{commander}</card> dealt {x} damage to {player}', params);
                } else {
                    log.write('Corrected {x} damage dealt by <card>{commander}</card> to {player}', params);
                }
                renderer.redrawDamage(playerKey);
            }
        }
    };

    _self.setDamage = function (playerKey, amount) {

        var diff = datastore.setDamage(playerKey, amount);
        if (diff != 0) {

            log.write('{player}\'s life total became {life}.', {
                player: datastore.getPlayerName(playerKey),
                life: Math.abs(amount)
            });

            renderer.redrawDamage(playerKey);
        }
    };

    _self.setPoison = function (playerKey, amount) {

        var diff = datastore.setPoison(playerKey, amount);
        if (diff != 0) {

            log.write('{player} has {poison} poison counters.', {
                player: datastore.getPlayerName(playerKey),
                poison: amount
            });

            renderer.redrawPoison(playerKey);
        }
    };

    _self.setCommanderDamage = function (playerKey, commanderKey, amount) {

        var diff = datastore.setCommanderDamage(playerKey, commanderKey, amount);
        if (diff != 0) {

            datastore.setDamage(playerKey, datastore.getDamage(playerKey) - diff);

            log.write('<card>{commander}</card> has dealt {x} damage to {player} in total.', {
                player: datastore.getPlayerName(playerKey),
                commander: datastore.getCommanderName(commanderKey),
                x: amount
            });

            renderer.redrawDamage(playerKey);
            renderer.redrawCommanderDamage(playerKey, commanderKey);
        }
    },

    _self.newGame = function () {

        datastore.newGame();
        log.write('Restarted the game OR started a new game. (All life totals, poison counters and ' +
                'commander damage have been reset.)');
        renderer.redraw();
    };

    _self.clearAll = function () {

        datastore.clear();
        renderer.reloadPage();
    };

    _self.toggleLogDisplay = function () {
        _toggleAndRedraw('Log');
    };

    _self.toggleImageDisplay = function () {
        _toggleAndRedraw('CommanderImages');
    };

    _self.toggleCommanderDamageDisplay = function () {
        _toggleAndRedraw('CommanderDamage');
    };

    _self.togglePoisonDisplay = function () {
        _toggleAndRedraw('Poison');
    };

    function _toggleAndRedraw(name) {
        datastore.toggle(name);
        renderer.redraw();
    }

    _self.goOnline = function () {
        backendclient
            .registerGame(datastore.getPlayerNames(), function (response) {
                datastore.setOnlineConnection(response.code, response.secret);
                log.write('Registered game online. Players can join by browsing to {url} or using code {code}.', {
                    code: response.code,
                    url: scoreboard.environment.hudBaseUrl + '#' + response.code
                });
                renderer.ensureOnlineState();
            }, function (error) {
                log.write('Failed registering the game online. Details: {code}: {msg}', {
                    code: error.status,
                    msg: error.responseText
                });
            });
    };

    _self.goOffline = function () {
        if (datastore.isOnline()) {
            // the client just asume that this succeeds (if not that's a problem for the
            // server, not the client).
            backendclient.unregisterGame(datastore.getOnlineGamecode(), datastore.getOnlineSecret());
            datastore.clearOnlineConnection();
            log.write('Disconnected from online synchronization');
            renderer.ensureOnlineState();
        }
    };

    _self.setPlayerConnection = function (playerName, connected) {
        var playerKey = datastore.findPlayerKey(playerName);
        datastore.setPlayerConnection(playerKey, connected);
        log.write('{player} is now {state}', {
            player: playerName,
            state: connected
                ? 'online'
                : 'offline'
        });
        renderer.redraw();
    };

    return _self;
}();