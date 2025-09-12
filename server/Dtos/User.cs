using SupportDashboard.Api.Models.Enums;

namespace SupportDashboard.Api.Dtos
{
    public class RegisterRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string Name { get; set; } = null!;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class CreateTicketRequest
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public TicketPriority Priority { get; set; } = TicketPriority.Medium; // אפשר להרחיב לבדיקות
    }
}
