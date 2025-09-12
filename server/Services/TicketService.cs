using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SupportDashboard.Api.Models;
using SupportDashboard.Api.Models.Enums;
using SupportDashboard.Api.Settings;

namespace SupportDashboard.Api.Services
{
    public class TicketService
    {
        private readonly IMongoCollection<Ticket> _tickets;
        private readonly ILogger<TicketService> _logger;
        public TicketService(IOptions<MongoDbSettings> options, ILogger<TicketService> logger)
        {
            var settings = options.Value;
            _logger = logger;
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _tickets = database.GetCollection<Ticket>("Tickets");
        }

       public async Task<List<Ticket>> GetAllAsync()
        {
            try
            {
                return await _tickets.Find(_ => true).ToListAsync();
            }
            catch (FormatException ex)
            {
                _logger.LogError(ex, "Format exception while fetching tickets from MongoDB");
                throw new ApplicationException("שגיאה בעת קבלת קריאות השירות. אנא נסה שוב מאוחר יותר.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "General exception while fetching tickets from MongoDB");
                throw new ApplicationException("התרחשה שגיאה כללית בשרת.");
            }
        }


        public async Task<List<Ticket>> GetByUserAsync(string email, string fullName) =>
            await _tickets.Find(t => t.CreatedBy.Email == email && t.CreatedBy.Name == fullName).ToListAsync();

        public async Task<Ticket?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;

            return await _tickets.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Ticket ticket) =>
            await _tickets.InsertOneAsync(ticket);

        public async Task<(bool Success, string? Error)> AddCommentAsync(string ticketId, string userEmail, string text)
        {
            var ticket = await GetByIdAsync(ticketId);
            if (ticket == null)
                return (false, "Ticket not found.");

            var comment = new Comment
            {
                Text = text,
                UserEmail = userEmail,
                CreatedAt = DateTime.UtcNow
            };

            var update = Builders<Ticket>.Update
                .Push(t => t.Comments, comment)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var result = await _tickets.UpdateOneAsync(t => t.Id == ticketId, update);
            return (result.ModifiedCount > 0, result.ModifiedCount == 0 ? "Failed to add comment." : null);
        }

        public async Task<(bool success, string? error)> UpdateStatusAsync(
            string ticketId, TicketStatus newStatus, string userEmail, string? comment = null)
        {
            var ticket = await GetByIdAsync(ticketId);
            if (ticket == null)
                return (false, "Ticket not found.");

            var update = Builders<Ticket>.Update.Set(t => t.UpdatedAt, DateTime.UtcNow);

            if (newStatus == TicketStatus.InProgress)
            {
                if (string.IsNullOrWhiteSpace(comment))
                    return (false, "A comment is required when setting to InProgress.");

                update = update
                    .Set(t => t.Status, TicketStatus.InProgress)
                    .Set(t => t.InProgressTimestamp, DateTime.UtcNow)
                    .Push(t => t.Comments, new Comment
                    {
                        Text = comment,
                        UserEmail = userEmail,
                        CreatedAt = DateTime.UtcNow
                    });
            }
            else if (newStatus == TicketStatus.Resolved)
            {
                if (ticket.Status != TicketStatus.InProgress)
                    return (false, "Cannot resolve — ticket is not InProgress.");

                if (ticket.InProgressTimestamp == null
                    || (DateTime.UtcNow - ticket.InProgressTimestamp.Value).TotalMinutes < 30)
                    return (false, "Ticket must be in progress for at least 30 minutes to resolve.");

                update = update.Set(t => t.Status, TicketStatus.Resolved);

                if (!string.IsNullOrWhiteSpace(comment))
                {
                    update = update.Push(t => t.Comments, new Comment
                    {
                        Text = comment,
                        UserEmail = userEmail,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
            else
            {
                update = update.Set(t => t.Status, newStatus);
            }

            var result = await _tickets.UpdateOneAsync(t => t.Id == ticketId, update);
            return (result.ModifiedCount > 0, result.ModifiedCount == 0 ? "Update failed." : null);
        }

        public async Task<bool> AssignToAgentAsync(string id, string agentEmail)
        {
            var update = Builders<Ticket>.Update.Set(t => t.AssignedAgentEmail, agentEmail).Set(t => t.UpdatedAt, DateTime.UtcNow);
            var result = await _tickets.UpdateOneAsync(t => t.Id == id, update);
            return result.ModifiedCount > 0;
        }
    }
}
