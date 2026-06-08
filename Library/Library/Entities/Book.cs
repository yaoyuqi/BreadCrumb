namespace Library.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public string Isbn { get; set; } = null!;

        public bool IsAvailable { get; set; } = true;
        public DateTime? PublishedDate { get; set; }
    }
}
