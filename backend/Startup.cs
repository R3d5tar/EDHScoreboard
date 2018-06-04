using System.Collections.Generic;
using EDHScoreboard.Backend.Model.Internal;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace EDHScoreboard.Backend
{
	public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services
				.AddMvc()
				.SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

			// default uri: /swagger
			services.AddSwaggerGen(c => c.SwaggerDoc("v1", 
				new Info { Title = "EDHScoreboard - Backend API", Version = "v1" })
			);

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

			app.UseHttpsRedirection();

			app.UseSwagger();
			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "EDHScoreboard - Backend API / V1");
			});

            app.UseMvc();			
        }
    }
}
