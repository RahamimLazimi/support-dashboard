using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportDashboard.Api.Services;
using System.Security.Claims;

namespace SupportDashboard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get the currently logged-in user from the token.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;

        if (email == null)
            return Unauthorized();

        var user = await _userService.GetByEmailAsync(email);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Name,
            user.Gender,
            user.Roles
        });
    }


    [Authorize(Roles = "Admin")]
    [HttpGet("agents")]
    public async Task<IActionResult> GetAllAgents()
    {
        var agents = await _userService.GetAllAgentsAsync(); // פונקציה חדשה בשירות
        return Ok(agents.Select(a => new
        {
            a.Email,
            a.Name
        }));
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users.Select(u => new
        {
            u.Id,
            u.Email,
            u.Name,
            u.Gender,
            u.Roles
        }));
    }

    /// <summary>
    /// Update user role (Admin only)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleUpdateRequest request)
    {
        var currentUserId = User.FindFirst("id")?.Value;

        if (currentUserId == id)
            return BadRequest(new { message = "You cannot change your own role." });

        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        user.Roles = new List<string> { request.Role };
        await _userService.UpdateAsync(user);

        return Ok(new { message = "Role updated successfully" });
    }
}

public class RoleUpdateRequest
{
    public string Role { get; set; } = string.Empty;
}
