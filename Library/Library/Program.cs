using Library.Entities;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services for Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"),
    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)
    ));

var app = builder.Build();

// Migrate the database on startup. Must be done before any endpoints are accessed.
var scoped = app.Services.CreateScope();
var context = scoped.ServiceProvider.GetRequiredService<AppDbContext>();
await context.Database.MigrateAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("api/books", async (int? page, int? pageSize, string? name, AppDbContext db) =>
{
    var query = db.Books.AsQueryable();


    int currentPage = page ?? 1;
    int currentPageSize = pageSize ?? 10;
    if (currentPage < 1 || currentPageSize < 1)
    {
        return Results.BadRequest("Page and pageSize must be greater than 0.");
    }

    if (!string.IsNullOrEmpty(name))
    {
        query = query.Where(b => b.Title.Contains(name));
    }

    var total = await query
    .AsNoTracking()
    .CountAsync();

    var books = await query
        .AsNoTracking()
        .Skip((currentPage - 1) * currentPageSize)
        .Take(currentPageSize)
        .ToListAsync();

    return Results.Ok(new
    {
        Items = books.Select(b => new { b.Id, b.Title, b.Owner, b.IsAvailable }),
        Total = total,
        TotalPage = total == 0 ? 0 : (int)Math.Ceiling(total / (double)currentPageSize),
        CurrentPage = currentPage,
        PageSize = currentPageSize
    });

}).WithName("GetBooks").WithTags("Books");

app.MapPost("api/books", async (string title, string owner, string? author, string? isbn, DateTime? publishedDate, AppDbContext db) =>
{
    var existingBook = await db.Books.FirstOrDefaultAsync(b => b.Title == title && b.Owner == owner);

    if (existingBook != null)
    {
        return Results.Conflict("A book with the same title and owner already exists.");
    }


    var book = new Book
    {
        Title = title,
        Owner = owner,
        Author = author,
        Isbn = isbn,
        PublishedDate = publishedDate,
        IsAvailable = true
    };

    db.Books.Add(book);
    await db.SaveChangesAsync();

    return Results.Created($"api/books/{book.Id}", book);
});


app.MapPost("api/books/{id}", async (int id, string operation, string? borrowerName, AppDbContext db) =>
{
    if (operation != "borrow" && operation != "return")
    {
        return Results.BadRequest("Invalid operation. Use 'borrow' or 'return'.");
    }

    if (operation == "borrow" && string.IsNullOrEmpty(borrowerName))
    {
        return Results.BadRequest("Borrower name is required for borrowing a book.");
    }

    var book = await db.Books.FindAsync(id);
    if (book == null)
    {
        return Results.NotFound("Book not found.");
    }

    if (operation == "borrow")
    {
        if (!book.IsAvailable)
        {
            return Results.BadRequest("Book is already borrowed.");
        }
        book.IsAvailable = false;
        var borrowRecord = new BookBorrow
        {
            BookId = book.Id,
            BorrowerName = borrowerName!,
            BorrowedTime = DateTime.UtcNow
        };

        db.BookBorrows.Add(borrowRecord);
    }
    else if (operation == "return")
    {
        if (book.IsAvailable)
        {
            return Results.BadRequest("Book is not currently borrowed.");
        }
        book.IsAvailable = true;
        var borrowRecord = await db.BookBorrows
            .Where(bb => bb.BookId == book.Id && bb.ReturnTime == default)
            .FirstOrDefaultAsync();

        if (borrowRecord != null)
        {
            borrowRecord.ReturnTime = DateTime.UtcNow;
        }
    }

    await db.SaveChangesAsync();

    return Results.Ok();
});


app.Run();
