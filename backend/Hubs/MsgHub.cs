using EDHScoreboard.Backend.Model.Internal;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EDHScoreboard.Backend.Hubs
{
	public class MsgHub : Hub
	{
		public Dictionary<string, GameAdministration> _games;

		public MsgHub(Dictionary<string, GameAdministration> games)
		{
			_games= games;
		}

		public async Task PlayerConnect(string playerName, string gameCode)
		{
			if (!_games.ContainsKey(gameCode))
			{
				await ReturnErrorToCaller("Gamecode is unkown", true);
				return;
			}
			
			var game = _games[gameCode];
			var player = game.Players.SingleOrDefault(p => p.Name == playerName);
			if (player?.IsConnected ?? false) {
				await ReturnErrorToCaller("Player already connected", true);
				return;
			}

			if (player == null) {
				player = new Model.Player() {
					Name = playerName
				};
				game.Players.Add(player);
			}

			player.ConnectionId = this.Context.ConnectionId;
			await Groups.AddToGroupAsync(player.ConnectionId, gameCode);

			await Clients.Group(gameCode).SendAsync("PlayerConnected", playerName);
		}

		public async override Task OnDisconnectedAsync(Exception exception) {
			var connectionId = this.Context.ConnectionId;
			var playerGameCombo = _games.Values.SelectMany(g => g.Players.Select(p => new {Player = p, Game = g}))
				.SingleOrDefault(pg => pg.Player.ConnectionId == connectionId);

			if (playerGameCombo != null) {
				playerGameCombo.Player.ConnectionId = null;
				await Groups.RemoveFromGroupAsync(connectionId, playerGameCombo.Game.Code);
				//todo: send a PlayerDisconnected signal?
			}
		}

		private async Task ReturnErrorToCaller(string errorMessage, bool forceDisconnect = false)
		{
			await Clients.Caller.SendAsync("Error", errorMessage);

			if (forceDisconnect) {
				this.Context.Abort();
			}
		}
	}
}