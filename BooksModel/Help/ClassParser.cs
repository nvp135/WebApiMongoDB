using System;
using System.Linq;
using Newtonsoft.Json;
using MongoDB.Bson.Serialization.Attributes;

namespace BooksModel.Help
{
    /// <summary>
    /// Парсинг членов класса в json формат
    /// </summary>    
    public class ClassParser
    {
        public string ParseClass(Type type)
        {
            var result = "{";
            var fields = type.GetProperties();
            foreach (var field in fields)
            {
                var fieldName = "";
                var fieldType = "";
                var fieldHide = "";

                if(field.GetCustomAttributesData().Where(a => a.AttributeType == typeof(BsonIdAttribute)).Count() > 0) 
                {
                    fieldHide = "true";
                }
                else
                {
                    fieldHide = "false";
                }

                var nsAttr = field.GetCustomAttributesData()
                                .Where(a => a.AttributeType == typeof(JsonPropertyAttribute))
                                .FirstOrDefault();
                if (nsAttr != null)
                {
                    fieldName = nsAttr.ConstructorArguments[0].Value.ToString();
                }
                else
                {
                    fieldName = field.Name;
                }

                switch (Type.GetTypeCode(field.PropertyType))
                {
                    case TypeCode.Byte:
                    case TypeCode.SByte:
                    case TypeCode.UInt16:
                    case TypeCode.UInt32:
                    case TypeCode.UInt64:
                    case TypeCode.Int16:
                    case TypeCode.Int32:
                    case TypeCode.Int64:
                    case TypeCode.Decimal:
                    case TypeCode.Double:
                    case TypeCode.Single:
                        fieldType = "number";
                        break;
                    case TypeCode.String:
                        fieldType = "text";
                        break;
                    default:
                        fieldType = "";
                        break;
                }

                result += String.Format("{{name:{0}:{{type:{1},hidden:{2}}}}},", fieldName, fieldType, fieldHide);

            }

            return result += "}";
        }
    }
}