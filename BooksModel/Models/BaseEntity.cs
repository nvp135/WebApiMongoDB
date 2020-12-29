using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BooksModel.Models
{
    /// <summary>
    /// Базовый класс для сущностей
    /// </summary>
    public class BaseEntity
    {
        /// <summary>
        /// Идентификатор
        /// </summary>
        /// <value></value>
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
    }
}