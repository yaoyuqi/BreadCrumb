namespace Library.Entities
{
    public class BookBorrow
    {
        public int Id { get; set; }
        public string? BorrowerName { get; set; } = null!;
        public int BookId { get; set; }
        public Book Book { get; set; } = null!;
        public DateTime BorrowedTime { get; set; }
        public DateTime ReturnTime { get; set; }
    }
}
