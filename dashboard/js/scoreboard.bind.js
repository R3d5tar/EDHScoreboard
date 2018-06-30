/*
* 	Copyright (c) 2015 R3d5tar
*	License: https://github.com/R3d5tar/EDHScoreboard/blob/master/LICENSE
*
*	Based on:
*		Copyright (c) 2014-2015 Filipe Badaro
*		License: https://github.com/Badaro/EDHScoreboard/blob/master/LICENSE
*/

$(document)
    .ready(function () {
        var datastore = scoreboard.datastore,
            cardinfo = scoreboard.cardinfo,
            renderer = scoreboard.renderer,
            log = scoreboard.log,
            functions = scoreboard.functions,
            backendclient = scoreboard.backendclient,
            hub = scoreboard.backendclient.hub;

        cardinfo.init();
        datastore.init();
        log.init($('#log'));
        renderer.init();
        functions.init();
        backendclient.init(
            datastore.getOnlineGamecode(), 
            datastore.getOnlineSecret()
        );

        $('#addPlayerButton').click(function () {
            functions.addPlayerFromUI();
            return false;
        });

        $('#addCommanderButton').click(function () {
            functions.addCommander();
            return false;
        });

        $('#addPlayerWithCommanderButton').click(function () {
            functions.addPlayerWithCommander();
            return false;
        });

        $('#showHideLogButton').click(function () {
            functions.toggleLogDisplay();
        });

        $('#newGameButton').click(function () {

            functions.newGame();
        });

        $('#showHideImagesButton').click(function () {

            functions.toggleImageDisplay();
        });

        $('#showHideCommanderDamageButton').click(function () {

            functions.toggleCommanderDamageDisplay();
        });

        $('#showHidePoisonButton').click(function () {

            functions.togglePoisonDisplay();
        });

        $('#resetAllButton').click(function () {
            if (confirm('This will remove all registered players, commanders, life totals, etc. Are you s' +
                    'ure to clear this data?')) {
                functions.clearAll();
            }
        });

        $('#goOnlineButton').click(function () {
            functions.goOnline();
        });

        $('#goOfflineButton').click(function () {
            if (confirm('You will lose the active connection and the connection cannot be restored. Are you sure?' )) {
                functions.goOffline();
            }
        });

        hub.on('PlayerConnected', function (name, newPlayer) {
            if (newPlayer)
                functions.addPlayer(name);
            functions.setPlayerConnection(name, true);
        });

        hub.on('PlayerDisconnected', function (name) {
            functions.setPlayerConnection(name, false);
        });

        setupAutoComplete(document.getElementById('inputCommander'), scoreboard.cardinfo.autoComplete);

        $('#inputInfect').bootstrapSwitch();
        log.write('Welcome back. Enjoy your game!');
    });