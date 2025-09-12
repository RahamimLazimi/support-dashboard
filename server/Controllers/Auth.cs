using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SupportDashboard.Api.Dtos;
using SupportDashboard.Api.Models;
using SupportDashboard.Api.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SupportDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _config;

    public AuthController(UserService userService, JwtService jwtService, IConfiguration config)
    {
        _userService = userService;
        _jwtService = jwtService;
        _config = config;
    }

    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { error = "Invalid email or password" });

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Email,
                user.Name,
                user.Gender,
                user.Roles
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existing = await _userService.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            return BadRequest(new { error = "User already exists" });
        }

        var user = new User
        {
            Email = request.Email,
            Name = request.Name,
            Gender = request.Gender,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Roles = new List<string> { "User" }
        };

        await _userService.CreateAsync(user);

        return Ok(new { message = "Registration successful" });
    }
}
       
