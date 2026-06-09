using Library.Entities;
using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Book> Books { get; set; } = null!;
        public DbSet<BookBorrow> BookBorrows { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.HasIndex(e => e.Title);
            });

            modelBuilder.Entity<BookBorrow>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Book).WithMany().HasForeignKey(e => e.BookId);
            });
        }
    }
}
