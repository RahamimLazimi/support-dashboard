using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SupportDashboard.Api.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; } = null!;
        [BsonElement("name")]
        public string Name { get; set; } = null!;
        [BsonElement("gender")]
        public string Gender { get; set; } = null!;
        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;
        [BsonElement("roles")]
        public List<string> Roles { get; set; } = new List<string>();
    }
}
