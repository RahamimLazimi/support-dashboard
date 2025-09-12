using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportDashboard.Api.Dtos;
using SupportDashboard.Api.Models;
using SupportDashboard.Api.Models.Enums;
using SupportDashboard.Api.Services;

namespace SupportDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketsController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        // מקבל את כל הקריאות
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> Get()
        {
            try
            {
                var fullName = User.FindFirst(ClaimTypes.Name)?.Value;
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                var roles = User.Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList();

                List<Ticket> tickets;

                if (roles.Contains("Admin") || roles.Contains("Agent"))
                {
                    tickets = await _ticketService.GetAllAsync(); // ✅ Admin/Agent רואים הכל
                }
                else
                {
                    tickets = await _ticketService.GetByUserAsync(email!, fullName!);
                }

                var dtos = tickets.Select(t => new TicketDto(t)).ToList();
                return Ok(dtos);
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequest request)
        {
            var userRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            if (userRoles.Contains("Agent") || userRoles.Contains("Admin"))
            {
                return Forbid("Only regular users can create tickets.");
            }

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(name))
                return Unauthorized();

            var ticket = new Ticket
            {
                Title = request.Title,
                Description = request.Description,
                CreatedBy = new UserCreate
                {
                    Email = email,
                    Name = name
                },
                Priority = request.Priority,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            await _ticketService.CreateAsync(ticket);
            return Ok(ticket);
        }

        [Authorize(Roles = "Agent,Admin")]
        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment([FromRoute] string id, [FromBody] CommentDto comment)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrWhiteSpace(userEmail))
                return Unauthorized();

            var (success, error) = await _ticketService.AddCommentAsync(id, userEmail, comment.Text);
            if (!success)
                return BadRequest(new { message = error });

            return Ok(new { message = "Comment added successfully" });
        }

        // מקבל קריאה לפי id
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetById(string id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null)
                return NotFound();

            return Ok(new TicketDto(ticket));
        }

        // עדכון סטטוס הקריאה
        [Authorize(Roles = "Agent,Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTicketStatus(string id, [FromBody] UpdateTicketStatusDto dto)
        {
            var currentUserEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(currentUserEmail))
                return Unauthorized();

            var (success, error) = await _ticketService.UpdateStatusAsync(id, dto.Status, currentUserEmail, dto.Comment);

            if (!success)
                return BadRequest(new { message = error });

            return Ok(new { message = "Ticket status updated successfully" });
        }

        // הקצאת הקריאה לסוכן
        [HttpPatch("{id}/assign")]
        public async Task<IActionResult> AssignToAgent(string id, [FromBody] AssignAgentDto assignDto)
        {
            var updated = await _ticketService.AssignToAgentAsync(id, assignDto.AgentEmail);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [Authorize(Policy = "AgentOnly")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTicketsForAgents()
        {
            var tickets = await _ticketService.GetAllAsync();
            return Ok(tickets.Select(t => new TicketDto(t)));
        }

    }
}
