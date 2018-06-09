using System.Collections.Generic;
using EDHScoreboard.Backend.Model.Internal;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace EDHScoreboard.Backend
{
	public class Startup
    {
		private const string CorsPolicyName = "CorsPolicy";
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
			services.AddCors(options => options.AddPolicy(CorsPolicyName,
				builder => builder
					.AllowAnyMethod()
					.AllowAnyHeader()
					.AllowCredentials()
					.WithOrigins(App.AllowedCorsOrigins))
			);

			// default uri: /swagger
			services.AddSwaggerGen(c => c.SwaggerDoc("v1", 
				new Info { Title = "EDHScoreboard - Backend API", Version = "v1" })
			);

			services.AddSignalR();

			services.AddSingleton<Dictionary<string, GameAdministration>>();
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

			//app.UseHttpsRedirection();
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
    }
}
