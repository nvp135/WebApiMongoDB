using System.Collections.Generic;
using System.Threading.Tasks;
using BooksModel.Database;
using BooksModel.Models;
using MongoDB.Driver;
using System.Linq;

namespace BooksModel.Services
{
    public class BookService
    {
        private readonly IMongoCollection<Book> _books;

        public BookService(IBookstoreDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            
            var database = client.GetDatabase(settings.DatabaseName);

            _books = database.GetCollection<Book>(settings.BooksCollectionName);
        }

        public async Task<List<Book>> Get() =>
            await _books.Find(book => true).ToListAsync();

        public async Task<Book> Get(string id) =>
            await _books.Find<Book>(book => book.Id == id).FirstOrDefaultAsync();

        public async Task<Book> Create(Book book)
        {
            book.Id = string.Empty;
            await _books.InsertOneAsync(book);
            return book;
        }

        public async Task Update(string id, Book bookIn) =>
            await _books.ReplaceOneAsync(book => book.Id == id, bookIn);

        public async Task Remove(Book bookIn) =>
            await _books.DeleteOneAsync(book => book.Id == bookIn.Id);

        public async Task Remove(string id) => 
            await _books.DeleteOneAsync(book => book.Id == id);
    }
}