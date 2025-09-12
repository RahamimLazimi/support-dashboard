using HealthChecks.MongoDb;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SupportDashboard.Api.Services;
using SupportDashboard.Api.Settings;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
var allowedClient = builder.Configuration["AllowedClient"];

// ========== CORS ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedClient!) // כתובת ה-React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ========== Controllers ==========
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        opts.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ========== Authentication ==========
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AgentOnly", policy => policy.RequireRole("Agent", "Admin"));
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});
// ========== Swagger ==========
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ========== MongoDB ==========
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

var mongoSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
var mongoClient = new MongoClient(mongoSettings?.ConnectionString);
var mongoDatabase = mongoClient.GetDatabase(mongoSettings?.DatabaseName);

try
{
    var collections = await mongoDatabase.ListCollectionNames().ToListAsync();
    Console.WriteLine($"✅ Connected to MongoDB. Collections: {string.Join(", ", collections)}");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Failed to connect to MongoDB: {ex.Message}");
}

// ========== HealthChecks ==========
builder.Services.AddHealthChecks()
    .AddMongoDb(
        sp => new MongoClient(builder.Configuration["MongoDbSettings:ConnectionString"]!),
        name: "mongodb",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db", "mongodb" }
    );

// ========== Services ==========
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<TicketService>();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .Select(e => new
            {
                Field = e.Key,
                Errors = e.Value?.Errors.Select(x => x.ErrorMessage)
            });

        return new BadRequestObjectResult(new
        {
            message = "Validation failed",
            errors
        });
    };
});

var app = builder.Build();

// ========== Middlewares ==========
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend"); // חשוב לפני auth

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
