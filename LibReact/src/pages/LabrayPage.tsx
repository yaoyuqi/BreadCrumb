import { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import "./LabrayPage.css";

type Book = {
  id: number;
  title: string;
  owner: string;
  isAvailable: boolean;
};

type BookResponse = {
  items: Book[];
  currentPage: number;
  pageSize: number;
  total: number;
  totalPage: number;
};

function LabrayPage() {
  return (
    <div className="library-desktop">
      <Container fluid="xl" className="library-shell">
        <Card className="library-window border-0 shadow-lg">
          <Card.Body className="library-window__body">
            <div className="library-window__masthead">
              <span className="window-dot window-dot--brick" />
              <span className="window-dot window-dot--amber" />
              <span className="window-dot window-dot--sage" />
            </div>

            <header className="library-header">
              <div>
                <h1 className="library-title">Library</h1>
              </div>
            </header>
            <Library />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default LabrayPage;

async function fetchBooks(
  page: number,
  searchTerm: string,
): Promise<BookResponse | null> {
  const response = await fetch(
    `/api/books?${searchTerm ? `name=${searchTerm}&` : ""}page=${page}&pageSize=10`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data as BookResponse;
}

type Operation = "borrow" | "return";

function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    async function loadBooks() {
      const data = await fetchBooks(1, "");
      setBooks(data?.items ?? []);
      setTotalPage(data?.totalPage ?? 0);
    }
    loadBooks();
  }, []);

  async function handleSearchChange(newTerm: string) {
    setPage(1);
    setSearchTerm(newTerm);
    const data = await fetchBooks(1, newTerm);
    setBooks(data?.items ?? []);
    setTotalPage(data?.totalPage ?? 0);
  }

  async function handlePageChange(newPage: number) {
    setPage(newPage);
    const data = await fetchBooks(newPage, searchTerm);
    setBooks(data?.items ?? []);
    setTotalPage(data?.totalPage ?? 0);
  }

  async function handleOperation(id: number, operation: Operation) {
    const response = await fetch(`api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation }),
    });

    if (!response.ok) {
      alert(`Operation failed: ${response.text()}`);
    } else {
      setBooks(
        books.map((b) => {
          if (b.id === id) {
            b.isAvailable = operation === "borrow" ? false : true;
          }
          return b;
        }),
      );
    }
  }

  return (
    <>
      <Row className="library-toolbar align-items-end gy-3">
        <Col lg={7}>
          <BookSearch val={searchTerm} onChange={handleSearchChange} />
        </Col>

        <Col lg={5}>
          <PaginationControls
            page={page}
            totalPage={totalPage}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>

      <Card className="library-table-card border-0">
        <div className="table-responsive">
          <BookTable books={books} handleOperation={handleOperation} />
        </div>
      </Card>

      <AddBookModal />
    </>
  );
}

type BookSearchProps = {
  val: string;
  onChange: (newVal: string) => void;
};
function BookSearch({ val, onChange }: BookSearchProps) {
  return (
    <Form.Group controlId="bookSearch">
      <Form.Label className="library-label">Book Search</Form.Label>
      <Form.Control
        type="search"
        placeholder="Search or filter by book title"
        aria-label="Search books"
        value={val}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Group>
  );
}

type PaginationControlsProps = {
  page: number;
  totalPage: number;
  onPageChange: (newPage: number) => void;
};

function PaginationControls({
  page,
  totalPage,
  onPageChange,
}: PaginationControlsProps) {
  const items = Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
    <Pagination.Item
      key={p}
      active={p === page}
      onClick={() => onPageChange(p)}
    >
      {p}
    </Pagination.Item>
  ));

  return (
    <div className="library-pagination-wrap">
      <span className="library-label">Page</span>
      <Pagination className="library-pagination mb-0">
        <Pagination.Prev />
        {items}
        <Pagination.Next />
      </Pagination>
    </div>
  );
}

type BookTableProps = {
  books: Book[];
  handleOperation: (id: number, operation: Operation) => void;
};
function BookTable({ books, handleOperation }: BookTableProps) {
  return (
    <Table hover className="library-table align-middle mb-0">
      <thead>
        <tr>
          <th>Book Name</th>
          <th>Owner</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => {
          return (
            <tr key={book.id}>
              <td>
                <div className="book-name">{book.title}</div>
              </td>
              <td>{book.owner}</td>
              <td>
                <div className="availability-cell">
                  <Badge
                    bg={book.isAvailable ? "success" : "secondary"}
                    className="availability-badge"
                  >
                    {book.isAvailable ? "Available" : "Unavailable"}
                  </Badge>

                  <div className="availability-actions">
                    <Button
                      disabled={!book.isAvailable}
                      variant={book.isAvailable ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => handleOperation(book.id, "borrow")}
                    >
                      Borrow
                    </Button>
                    <Button
                      disabled={book.isAvailable}
                      variant={book.isAvailable ? "outline-warning" : "warning"}
                      size="sm"
                      onClick={() => handleOperation(book.id, "return")}
                    >
                      Return
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function AddBookModal() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="add-book-fab"
        onClick={() => setShowAddModal(true)}
      >
        Add Book
      </Button>
      <Modal
        centered
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        dialogClassName="library-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-grid gap-3">
            <Form.Group controlId="newBookTitle">
              <Form.Label>Book Name</Form.Label>
              <Form.Control type="text" placeholder="Enter the book title" />
            </Form.Group>
            <Form.Group controlId="newBookOwner">
              <Form.Label>Owner</Form.Label>
              <Form.Control type="text" placeholder="Enter the owner name" />
            </Form.Group>
            <Form.Group controlId="newBookStatus">
              <Form.Label>Availability</Form.Label>
              <Form.Select defaultValue="available">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary">Add Book</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
