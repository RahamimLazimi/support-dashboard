using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SupportDashboard.Api.Models;
using SupportDashboard.Api.Settings;

namespace SupportDashboard.Api.Services
{
    public class UserService
    {
    private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>("Users");
        }


        public async Task<User?> GetByIdAsync(string id)
        {
            return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetAllAgentsAsync()
        {
            var roles = new[] { "Agent" };
            return await _usersCollection.Find(u => u.Roles.Any(r => roles.Contains(r))).ToListAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        public async Task UpdateAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
            await _usersCollection.ReplaceOneAsync(filter, user);
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        } 

        public async Task CreateAsync(User user)
        {
            await _usersCollection.InsertOneAsync(user);
        }
    }
}
