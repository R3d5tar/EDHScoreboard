using System;
using System.Linq;

namespace EDHScoreboard.Backend
{
	public class AppConfiguration
	{
		public string[] AllowedCorsOrigins { get; set; }

		public string [] BuildAllowedCorsOrigins() {
			string[] EMPTY_ARRAY = new string[0];
			var envVar = Environment.GetEnvironmentVariable("Allowed_Cors_Origins");
			var origins = envVar?.Split(',',StringSplitOptions.RemoveEmptyEntries) ?? EMPTY_ARRAY;
			
			return origins.AsEnumerable().Concat(AllowedCorsOrigins ?? EMPTY_ARRAY).ToArray();

		}
	}
}