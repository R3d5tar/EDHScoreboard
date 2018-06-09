namespace EDHScoreboard.Backend.Model
{
	public class Player
	{
		public string Name { get; set; }
		public bool IsConnected => ConnectionId != null;

		public string ConnectionId { get; set; }
	}
}