namespace Library.Dto
{
    public sealed record AddBookRequest(string title, string owner, string? author, string? isbn, DateTime? publishedDate)
    {
    }
}
