using System;
using System.Collections.Generic;
using EDHScoreboard.Backend.Model.Internal;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;

namespace EDHScoreboard.Backend
{
	public class Startup
	{
		private const string CorsPolicyName = "CorsPolicy";
		private ILogger<Startup> _logger;
		public IConfiguration Configuration { get; }
		public AppConfiguration App { get; } = new AppConfiguration();

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
			Configuration.GetSection("App").Bind(App);
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

			//add Cors Policy
			var corsOrigins = App.BuildAllowedCorsOrigins();
			services.AddCors(options => options.AddPolicy(CorsPolicyName,
				builder => builder
					.AllowAnyMethod()
					.AllowAnyHeader()
					.AllowCredentials()
					.WithOrigins(corsOrigins))
			);

			// default uri: /swagger
			services.AddSwaggerGen(c => c.SwaggerDoc("v1",
				new Info { Title = "EDHScoreboard - Backend API", Version = "v1" })
			);

			services.AddSignalR();

			services.AddSingleton<Dictionary<string, GameAdministration>>();

			var provider = services.BuildServiceProvider();
			_logger = provider.GetService<ILogger<Startup>>();
			LogCorsConfig(corsOrigins);
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseHsts();
			}

			app.UseCors(CorsPolicyName);
			app.UseSignalR(routes =>
			{
				routes.MapHub<Hubs.MsgHub>("/msgHub");
			});

			app.UseSwagger();
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "EDHScoreboard - Backend API / v1");
			});

			app.UseMvc();
		}

		private void LogCorsConfig(string[] allowedCorsOrigins)
		{
			var values = string.Join(Environment.NewLine, allowedCorsOrigins);
			_logger.LogInformation($"Allowed Cors Origins: {Environment.NewLine}{values}");
		}
	}
}
