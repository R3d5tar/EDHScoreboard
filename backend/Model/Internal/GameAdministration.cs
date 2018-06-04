using System;
using System.Collections.Generic;

namespace EDHScoreboard.Backend.Model.Internal
{
	public class GameAdministration
	{
		public List<Player> Players { get; set; }

		public DateTime Created { get; set; } = DateTime.Now;
		
		public string Code { get; set; }	
		public string Secret { get; set; }
	}
}