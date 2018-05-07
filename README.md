Browser-based EDH (Commander) scoreboard written with JS and Bootstrap (http://getbootstrap.com/). Works entirely offline on any modern browser.

Forked from Badaro. My local EDH playgroup uses it often and likes the basic scoreboard very much, but are missing some features that would improve the scoreboard for our houserules and EDH variations.

## Pending changes for R3d5tar's local playgroup:
- Support for tracking a 2HG EDH match:
  This requires that teams can be registerd and that a team will have a shared life total/commander damage/poison, but that the number of commanders in the match is doubled.
  Expected approach for development: splitting the registration of Players/Teams and Commanders. In a 2HG game a team will have 2 commanders, managing a relation betweeen players and commanders seams optional for score keeping.
  Nice to haves:
  - Override team life total (default 60)
- Support for respawning and tracking deads/kills:
  In our playgroup we often play a continuous EDH matches, in these matches players that die, have gain the ability to respawn in the active game with a new Commander deck. This player will get 5 turns in a private bubble without interactions with the rest of the game and players. After that they join the game based on turn order and all creatures will have summoning sickness in that turn. 
  During this continuous game, we like to keep track of how many kills a player has made and how often he died.
  The game stops when the evening is over or whenever we feel like stop playing magic for that day.
  Required modifications for this:
  - Tracking kills/deads for a player
  - Swapping/changing commanders during a game (resetting commander damage, when commander changes)
  - Resetting life totals (after a player died)
- Support for tracking Experience counters
  Implementation should be like poison but without a maximum.

## Pending improvements:
- Improve resposiveness, the layout of some buttons is strange on smaller screens. 
- Add remove buttons into score table next to player name.
- Add Footer with Copyright and Contact Info
- Remember toggle states, after refesh or revisit.

## Ideas from reddit, under consideration:
- Add a counter for the number of times the commander re-entered the battlefield
- Add a configuration to allow life going negative (when using Platinum Angel or similar effects)
- Add a configuration for maximum poison counters (for playgroups that prefer to use 15 or 20)
- Add Mana Counters
- Add Turn Counters
- Add Game Timer