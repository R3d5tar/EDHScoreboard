using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;


namespace EDHScoreboard.Backend.Hubs
{
	public static class ClientMethodExtentions
	{
		public static async Task SendPlayerConnected(this IClientProxy clientProxy, string playerName, bool newPlayer,
			CancellationToken cancellationToken = default(CancellationToken))
		{
			await clientProxy.SendAsync("PlayerConnected", playerName, newPlayer, cancellationToken);
		}

		public static async Task SendPlayerDisconnected(this IClientProxy clientProxy, string playerName,
			CancellationToken cancellationToken = default(CancellationToken))
		{
			await clientProxy.SendAsync("PlayerDisconnected", playerName, cancellationToken);
		}

        public static async Task SendError(this IClientProxy clientProxy, string errorMessage,
			CancellationToken cancellationToken = default(CancellationToken))
		{
			await clientProxy.SendAsync("Error", errorMessage, cancellationToken);
		}
	}
}