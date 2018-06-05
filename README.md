Browser-based EDH (Commander) scoreboard written with JS and Bootstrap (http://getbootstrap.com/). Works entirely offline on any modern browser.

Forked from Badaro. My local EDH playgroup uses it often and likes the basic scoreboard very much, but are missing some features that would improve the scoreboard for our houserules and EDH variations.

## Features:

* Tracking life totals.
* Tracking poison counters.
* Tracking commander damage.
* Gamestate is remembered in your browser, so you won't lose it, when closing your tab/browser OR when a BSOD occurs.
* Support for tracking a 2HG EDH match:
  When playing 2HG EDH you enter a team name and add both commanders. This is a 3 step process, but it works. After change the team life total to something apropriate. Commander damage is still the same.
* Auto completing cardnames (when choosing a commander)
* [WIP] Multi-device score keeping

## Pending changes for R3d5tar's local playgroup:

* Support for respawning and tracking deads/kills:
  In our playgroup we often play a continuous EDH matches, in these matches players that die, have gain the ability to respawn in the active game with a new Commander deck. This player will get 5 turns in a private bubble without interactions with the rest of the game and players. After that they join the game based on turn order and all creatures will have summoning sickness in that turn.
  During this continuous game, we like to keep track of how many kills a player has made and how often he died.
  The game stops when the evening is over or whenever we feel like stop playing magic for that day.
  Required modifications for this:
  * Tracking kills/deads for a player
  * Swapping/changing commanders during a game (resetting commander damage, when commander changes)
  * Resetting life totals (after a player died)
* Support for tracking Experience counters
  Implementation should be like poison but without a maximum.

## Pending improvements:

* refactor: setDamage => setLife.
* Improve resposiveness, the layout of some buttons is strange on smaller screens.
* Add Footer with Copyright and Contact Info

## Ideas from reddit, under consideration:

* Add a counter for the number of times the commander re-entered the battlefield
* Add a configuration to allow life going negative (when using Platinum Angel or similar effects)
* Add a configuration for maximum poison counters (for playgroups that prefer to use 15 or 20)
* Add Mana Counters
* Add Turn Counters
* Add Game Timer

# Build & Run

Note that this project uses various different technoligies. Most of it is client side code, and the project started from a no compilation standpoint. Each component has it's own manual for now.

## Dashboard

Compilation is not needed. Just host in simple webserver and you are ready to go.

If you have NPM installed (5.2.0 or newer):
```cmd
npx http-server
```
Navigate to https://127.0.0.1:8080/dashboard

--OR--

Use [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) and choose your EDHScoreboard folder. Navigate to http://127.0.0.1:8887/dashboard

Configuration settings can be found in EDHScoreboard/dashboard/js/scoreboard.settings.js.

NB. The Go Online feature requires the backend.

## Backend

The backend is a ASP.Net Core 2.1 application. It requires that you have installed [Microsoft .Net Core SDK 2.1.x](https://www.microsoft.com/net/download).

Running the application using CLI:
```cmd
cd backend
dotnet run backend
```

Navigate to http://localhost:5000/swagger or https://localhost:5001/swagger to get to the Swagger UI.

This includes building use `dotnet build` to compile but not run/host the project.

Using Visual Studio Code, hitting `F5` should be enough to start a debugging session.