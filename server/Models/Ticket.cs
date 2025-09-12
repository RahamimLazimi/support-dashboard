using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SupportDashboard.Api.Models.Enums;

namespace SupportDashboard.Api.Models
{
    public class UserCreate
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;
    }

    public class Comment
    {
        [BsonElement("text")]
        public string Text { get; set; } = string.Empty;
        [BsonElement("userEmail")]
        public string UserEmail { get; set; } = string.Empty;
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }

    public class Ticket
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonElement("priority")]
        [BsonRepresentation(BsonType.String)]
        public TicketPriority Priority { get; set; }

        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public TicketStatus Status { get; set; } = TicketStatus.Open;

        public DateTime? InProgressTimestamp { get; set; }
        [BsonElement("comments")]
        public List<Comment> Comments { get; set; } = new();
        [BsonElement("assignedAgentEmail")]
        public string? AssignedAgentEmail { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
        [BsonElement("createdBy")]
        public UserCreate CreatedBy { get; set; } = null!; 

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
}
