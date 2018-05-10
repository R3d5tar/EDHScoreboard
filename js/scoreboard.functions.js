/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

scoreboard.functions = {

    init: function () {},

    addPlayerWithCommander: function () {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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
    },

    addPlayer: function () {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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

    addCommander: function () {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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

    removePlayer: function (playerKey) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        var playerName = datastore.getPlayerName(playerKey);
        datastore.removePlayer(playerKey);
        renderer.destroyRemovePlayerButton(playerKey);
        log.write('{player} left this game.', {player: playerName});
        renderer.redraw();
    },

    removeCommander: function (commanderKey) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        var commanderName = datastore.getCommanderName(commanderKey);
        datastore.removeCommander(commanderKey);
        renderer.destroyRemoveCommanderButton(commanderKey);
        log.write('The <card>{commander}</card>-deck left this game.', {commander: commanderName});
        renderer.redraw();
    },

    incrementDamage: function (playerKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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

    incrementPoison: function (playerKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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

    incrementCommanderDamage: function (playerKey, commanderKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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
    },

    setDamage: function (playerKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        var diff = datastore.setDamage(playerKey, amount);
        if (diff != 0) {

            log.write('{player}\'s life total became {life}.', {
                player: datastore.getPlayerName(playerKey),
                life: Math.abs(amount)
            });

            renderer.redrawDamage(playerKey);
        }
    },

    setPoison: function (playerKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        var diff = datastore.setPoison(playerKey, amount);
        if (diff != 0) {

            log.write('{player} has {poison} poison counters.', {
                player: datastore.getPlayerName(playerKey),
                poison: amount
            });

            renderer.redrawPoison(playerKey);
        }
    },

    setCommanderDamage: function (playerKey, commanderKey, amount) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

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

    newGame: function () {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer,
            log = scoreboard.log;

        datastore.newGame();
        log.write('Restarted the game OR started a new game. (All life totals, poison counters and ' +
                'commander damage have been reset.)');
        renderer.redraw();
    },

    clearAll: function () {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer;

        datastore.clear();
        renderer.reloadPage();
    },

    toggleLogDisplay: function () {
        this._toggleAndRedraw('Log');
    },

    toggleImageDisplay: function () {
        this._toggleAndRedraw('CommanderImages');
    },

    toggleCommanderDamageDisplay: function () {
        this._toggleAndRedraw('CommanderDamage');
    },

    togglePoisonDisplay: function () {
        this._toggleAndRedraw('Poison');
    },

    _toggleAndRedraw: function (name) {
        var datastore = scoreboard.datastore,
            renderer = scoreboard.renderer;

        datastore.toggle(name);
        renderer.redraw();
    }
    
};