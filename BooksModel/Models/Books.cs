using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace BooksModel.Models
{
    /// <summary>
    /// Класс книга.
    /// </summary>
    public class Book : BaseEntity
    {
        /// <summary>
        /// Наименование книги.
        /// </summary>
        /// <value></value>
        [BsonElement("Name")]
        [JsonProperty("Name")]
        public string BookName { get; set; }

        /// <summary>
        /// Цена книги.
        /// </summary>
        /// <value></value>
        public decimal Price { get; set; }

        /// <summary>
        /// Категория книги.
        /// </summary>
        /// <value></value>
        public string Category { get; set; }

        /// <summary>
        /// Автор книги.
        /// </summary>
        /// <value></value>
        public string Author { get; set; }
    }
}