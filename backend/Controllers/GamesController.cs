using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EDHScoreboard.Backend.Model;
using EDHScoreboard.Backend.Model.Internal;
using System.Text;

namespace EDHScoreboard.Backend.Controllers
{
	[Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
		public Dictionary<string, GameAdministration> _games;

		public GamesController(Dictionary<string, GameAdministration> games)
		{
			_games= games;
		}

        [HttpPost]
		[ProducesResponseType(typeof(GameResult), 201)]
        public ActionResult<GameResult> Create([FromBody] Game game)
        {
			GameAdministration internalGame = ToAdministation(game);
			_games.Add(internalGame.Code, internalGame);
			return Created($"api/games/{internalGame.Code}", ToGameRegistration(internalGame));
        }

        [HttpGet("{code}")]
		[ProducesResponseType(typeof(Game), 200)]
		[ProducesResponseType(404)]
        public ActionResult<Game> Read(string code, [FromHeader] string secret = null)
        {
			if (!_games.TryGetValue(code, out var foundGame)) {
				return NotFound();
			}

			if (secret == null || foundGame.Secret != secret)
			{
				return Ok();
			}
			else
			{
				return Ok(ToGame(foundGame));
			}
        }

        [HttpDelete("{code}")]
		[ProducesResponseType(204)]
		[ProducesResponseType(404)]
        public ActionResult Delete(string code, [FromHeader] string secret)
        {
			if (!_games.TryGetValue(code, out var foundGame)) {
				return NotFound();
			}

			if (secret == null || foundGame.Secret != secret)
			{
				return NotFound();
			}
			else
			{
				_games.Remove(code);
				return NoContent();
			}
        }

		private GameAdministration ToAdministation(Game game)
			=> new GameAdministration () 
			{
				Players = game.Players.ToList(),
				Code = GenerateCode(),
				Secret = GenerateSecret()
			};

		private GameResult ToGameRegistration(GameAdministration internalGame) 
			=> new GameResult() 
			{
				Code = internalGame.Code,
				Secret = internalGame.Secret
			};

		private Game ToGame(GameAdministration internalGame) 
			=> new Game() {
				Players = internalGame.Players
			};

		private string GenerateCode(int length = 5) {
			const string characterSet = "ABCEFHJKMNPRSTUVWXYZ2345678";
			var codeBuilder = new StringBuilder(length);
			var randomizer = new Random();
			for (int i = 0; i < length; i++) {
				int randomized = randomizer.Next(characterSet.Length);
				codeBuilder.Append(characterSet[randomized]);
			}

			var result = codeBuilder.ToString();
			if (_games.ContainsKey(result))
				return GenerateCode(length + 1); //let's try again (but use a longer code to minimize the chance on a clash.)
			else
				return result;
		}

		private string GenerateSecret() {
			return Guid.NewGuid().ToString("N");
		}

    }
}
