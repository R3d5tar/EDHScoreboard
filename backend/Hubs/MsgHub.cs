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
			
			var newPlayer = false;
			if (player == null) {
				player = new Model.Player() {
					Name = playerName
				};
				game.Players.Add(player);
				newPlayer = true;
			}

			player.ConnectionId = this.Context.ConnectionId;
			await Groups.AddToGroupAsync(player.ConnectionId, gameCode);

			var nowait = Clients.Group(gameCode).SendPlayerConnected(playerName, newPlayer);
		}

		public async Task DashboardConnect(string gameCode, string gameSecret)
		{
			if (!_games.ContainsKey(gameCode))
			{
				await ReturnErrorToCaller("Gamecode is unkown", true);
				return;
			}
			
			var game = _games[gameCode];
			if (game.Secret != gameSecret) {
				await ReturnErrorToCaller("Gamecode is unkown", true);
				return;
			}
			
			await Groups.AddToGroupAsync(this.Context.ConnectionId, gameCode);

			var nowait = game.Players.Where(p => p.IsConnected).Select(
				p => Clients.Caller.SendPlayerConnected(p.Name, false)
			).ToArray();
		} 

		public async override Task OnDisconnectedAsync(Exception exception) {
			var connectionId = this.Context.ConnectionId;
			var playerGameCombo = _games.Values.SelectMany(g => g.Players.Select(p => new {Player = p, Game = g}))
				.SingleOrDefault(pg => pg.Player.ConnectionId == connectionId);

			if (playerGameCombo != null) {
				playerGameCombo.Player.ConnectionId = null;
				
				await Groups.RemoveFromGroupAsync(connectionId, playerGameCombo.Game.Code);
				var nowait = Clients.OthersInGroup(playerGameCombo.Game.Code)
					.SendPlayerDisconnected(playerGameCombo.Player.Name);
			}
		}

		private async Task ReturnErrorToCaller(string errorMessage, bool forceDisconnect = false)
		{
			var task = Clients.Caller.SendError(errorMessage);

			if (forceDisconnect) {
				await task;
				this.Context.Abort();
			}
		}
	}
}