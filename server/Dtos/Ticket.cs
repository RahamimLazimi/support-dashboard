using SupportDashboard.Api.Models;
using SupportDashboard.Api.Models.Enums;

namespace SupportDashboard.Api.Dtos
{
    public class TicketDto
    {
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string? AssignedAgentEmail { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedByName { get; set; }
        public string CreatedByEmail { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<CommentDto> Comments { get; set; }

        public TicketDto() { }

        public TicketDto(Ticket t)
        {
            Id = t.Id;
            Title = t.Title;
            Description = t.Description;
            Priority = t.Priority.ToString();
            Status = t.Status.ToString();
            AssignedAgentEmail = t.AssignedAgentEmail;
            CreatedAt = t.CreatedAt;
            CreatedByName = t.CreatedBy.Name;
            CreatedByEmail = t.CreatedBy.Email;
            UpdatedAt = t.UpdatedAt;
            Comments = t.Comments?.Select(c => new CommentDto(c)).ToList() ?? new();
        }
    }

    public class CreateTicketDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public TicketPriority Priority { get; set; }
    }

    public class UpdateTicketStatusDto
    {
        public TicketStatus Status { get; set; }
        public string? Comment { get; set; }
        public UpdateTicketStatusDto(){}
    }


    public class AssignAgentDto
    {
        public string AgentEmail { get; set; } = null!;
    }
    public class CommentDto
    {
        public string UserEmail { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }

        public CommentDto() { }
        public CommentDto(Comment comment)
        {
            UserEmail = comment.UserEmail;
            Text = comment.Text;
            CreatedAt = comment.CreatedAt;
        }
    }
}
