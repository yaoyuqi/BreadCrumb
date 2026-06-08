import { useState } from 'react'
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
} from 'react-bootstrap'
import './LabrayPage.css'

type BookStatus = 'available' | 'unavailable'

type Book = {
  id: number
  name: string
  owner: string
  status: BookStatus
}

const books: Book[] = [
  { id: 1, name: 'Atomic Habits', owner: 'Emma Clark', status: 'available' },
  { id: 2, name: 'Deep Work', owner: 'Noah Patel', status: 'unavailable' },
  { id: 3, name: 'The Pragmatic Programmer', owner: 'Ava Nguyen', status: 'available' },
  { id: 4, name: 'Clean Code', owner: 'Liam Foster', status: 'unavailable' },
  { id: 5, name: 'Designing Data-Intensive Applications', owner: 'Sophia Reed', status: 'available' },
]

function LabrayPage() {
  const [showAddModal, setShowAddModal] = useState(false)

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
                <p className="library-eyebrow">Desktop Library View</p>
                <h1 className="library-title">Library</h1>
              </div>
            </header>

            <Row className="library-toolbar align-items-end gy-3">
              <Col lg={7}>
                <Form.Group controlId="bookSearch">
                  <Form.Label className="library-label">Book Search</Form.Label>
                  <Form.Control
                    type="search"
                    placeholder="Search or filter by book title"
                    aria-label="Search books"
                  />
                </Form.Group>
              </Col>

              <Col lg={5}>
                <div className="library-pagination-wrap">
                  <span className="library-label">Page</span>
                  <Pagination className="library-pagination mb-0">
                    <Pagination.Prev />
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Next />
                  </Pagination>
                </div>
              </Col>
            </Row>

            <Card className="library-table-card border-0">
              <div className="table-responsive">
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
                      const isAvailable = book.status === 'available'

                      return (
                        <tr key={book.id}>
                          <td>
                            <div className="book-name">{book.name}</div>
                          </td>
                          <td>{book.owner}</td>
                          <td>
                            <div className="availability-cell">
                              <Badge
                                bg={isAvailable ? 'success' : 'secondary'}
                                className="availability-badge"
                              >
                                {book.status}
                              </Badge>

                              <div className="availability-actions">
                                <Button
                                  variant={isAvailable ? 'outline-primary' : 'primary'}
                                  size="sm"
                                >
                                  Borrow
                                </Button>
                                <Button
                                  variant={isAvailable ? 'warning' : 'outline-warning'}
                                  size="sm"
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
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Card>

            <Button
              type="button"
              className="add-book-fab"
              onClick={() => setShowAddModal(true)}
            >
              Add Book
            </Button>
          </Card.Body>
        </Card>
      </Container>

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
          <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">Add Book</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default LabrayPage
