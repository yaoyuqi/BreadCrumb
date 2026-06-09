using Library.Entities;

namespace Library.Infrastructure.Seeder;

public static class LibrarySeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Books.Any())
        {
            return;
        }

        var books = new List<Book>
        {
            new() { Title = "Atomic Habits", Author = "James Clear", Isbn = "9780735211292", Owner = "Jeff", PublishedDate = new DateTime(2018, 10, 16), IsAvailable = true },
            new() { Title = "Deep Work", Author = "Cal Newport", Isbn = "9781455586691", Owner = "Jeff", PublishedDate = new DateTime(2016, 1, 5), IsAvailable = true },
            new() { Title = "Clean Code", Author = "Robert C. Martin", Isbn = "9780132350884", Owner = "Mia", PublishedDate = new DateTime(2008, 8, 1), IsAvailable = true },
            new() { Title = "The Pragmatic Programmer", Author = "Andrew Hunt", Isbn = "9780135957059", Owner = "Mia", PublishedDate = new DateTime(2019, 9, 13), IsAvailable = true },
            new() { Title = "Refactoring", Author = "Martin Fowler", Isbn = "9780134757599", Owner = "Ethan", PublishedDate = new DateTime(2018, 11, 19), IsAvailable = true },
            new() { Title = "Code Complete", Author = "Steve McConnell", Isbn = "9780735619678", Owner = "Ethan", PublishedDate = new DateTime(2004, 6, 9), IsAvailable = true },
            new() { Title = "Design Patterns", Author = "Erich Gamma", Isbn = "9780201633610", Owner = "Olivia", PublishedDate = new DateTime(1994, 10, 21), IsAvailable = true },
            new() { Title = "Domain-Driven Design", Author = "Eric Evans", Isbn = "9780321125217", Owner = "Olivia", PublishedDate = new DateTime(2003, 8, 30), IsAvailable = true },
            new() { Title = "Head First Design Patterns", Author = "Eric Freeman", Isbn = "9781492078005", Owner = "Lucas", PublishedDate = new DateTime(2020, 12, 25), IsAvailable = true },
            new() { Title = "Working Effectively with Legacy Code", Author = "Michael Feathers", Isbn = "9780131177055", Owner = "Lucas", PublishedDate = new DateTime(2004, 9, 22), IsAvailable = true },
            new() { Title = "Test Driven Development", Author = "Kent Beck", Isbn = "9780321146533", Owner = "Harper", PublishedDate = new DateTime(2002, 11, 8), IsAvailable = true },
            new() { Title = "Continuous Delivery", Author = "Jez Humble", Isbn = "9780321601919", Owner = "Harper", PublishedDate = new DateTime(2010, 7, 27), IsAvailable = true },
            new() { Title = "Accelerate", Author = "Nicole Forsgren", Isbn = "9781942788331", Owner = "Noah", PublishedDate = new DateTime(2018, 3, 27), IsAvailable = true },
            new() { Title = "The Phoenix Project", Author = "Gene Kim", Isbn = "9780988262591", Owner = "Noah", PublishedDate = new DateTime(2018, 4, 16), IsAvailable = true },
            new() { Title = "The DevOps Handbook", Author = "Gene Kim", Isbn = "9781950508402", Owner = "Sophia", PublishedDate = new DateTime(2021, 11, 16), IsAvailable = true },
            new() { Title = "Designing Data-Intensive Applications", Author = "Martin Kleppmann", Isbn = "9781449373320", Owner = "Sophia", PublishedDate = new DateTime(2017, 3, 16), IsAvailable = true },
            new() { Title = "Patterns of Enterprise Application Architecture", Author = "Martin Fowler", Isbn = "9780321127426", Owner = "Ava", PublishedDate = new DateTime(2002, 11, 5), IsAvailable = true },
            new() { Title = "Release It!", Author = "Michael T. Nygard", Isbn = "9781680502398", Owner = "Ava", PublishedDate = new DateTime(2018, 1, 30), IsAvailable = true },
            new() { Title = "Site Reliability Engineering", Author = "Betsy Beyer", Isbn = "9781491929124", Owner = "Jack", PublishedDate = new DateTime(2016, 3, 23), IsAvailable = true },
            new() { Title = "Fundamentals of Software Architecture", Author = "Mark Richards", Isbn = "9781492043454", Owner = "Jack", PublishedDate = new DateTime(2020, 2, 25), IsAvailable = true },
            new() { Title = "Soft Skills", Author = "John Sonmez", Isbn = "9781617292392", Owner = "Emily", PublishedDate = new DateTime(2014, 11, 11), IsAvailable = true },
            new() { Title = "Peopleware", Author = "Tom DeMarco", Isbn = "9780932633439", Owner = "Emily", PublishedDate = new DateTime(2013, 8, 10), IsAvailable = true },
            new() { Title = "Cracking the Coding Interview", Author = "Gayle Laakmann McDowell", Isbn = "9780984782857", Owner = "Daniel", PublishedDate = new DateTime(2015, 7, 1), IsAvailable = true },
            new() { Title = "Grokking Algorithms", Author = "Aditya Bhargava", Isbn = "9781617292231", Owner = "Daniel", PublishedDate = new DateTime(2016, 5, 1), IsAvailable = true },
            new() { Title = "Introduction to Algorithms", Author = "Thomas H. Cormen", Isbn = "9780262046305", Owner = "Grace", PublishedDate = new DateTime(2022, 4, 5), IsAvailable = true },
            new() { Title = "Programming Pearls", Author = "Jon Bentley", Isbn = "9780201657883", Owner = "Grace", PublishedDate = new DateTime(1999, 9, 7), IsAvailable = true }
        };

        db.Books.AddRange(books);
        await db.SaveChangesAsync();
    }
}
