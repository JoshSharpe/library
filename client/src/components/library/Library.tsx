import React from 'react';
import { api, Book } from '../../api/books';
import LibraryRow from '../row/LibraryRow';
import './Library.css';

interface LibProps {
  link: (newView: String) => void,
  setBook: (newBook: Book) => void
}

export default class Library extends React.Component<LibProps, any> {

  constructor(props: LibProps) {
    super(props);

    this.state = {
      books: Array<Book>(),
    }
  }

  componentDidMount = () => {
    api.getBookList()
      .then((resp) => {
        this.setState(() => {
          return { books: resp.data };
        });
      }).catch((err) => {
        console.error("Error calling api. Error: ", err);
      });
  }

  checkoutBook = (book: Book, index: Number) => {
    let now = new Date();
    book.quantity_available = book.quantity_available.valueOf() - 1;
    book.history.push({
      type: "checkout",
      author: "user",
      description: "checkout book from library.",
      time: now.toISOString()
    })
    api.updateBook(book).then(() => {
      let books = this.state.books;
      books[index.valueOf()] = book;
      this.setState({ books: books });
    }).catch((err) => {
      console.error("Error checking book out. Err: ", err);
    });
  }

  checkinBook = (book: Book, index: Number) => {
    let now = new Date();
    book.quantity_available = book.quantity_available.valueOf() + 1;
    book.history.push({
      type: "checkin",
      author: "user",
      description: "check book into library.",
      time: now.toISOString()
    });
    api.updateBook(book).then(() => {
      let books = this.state.books;
      books[index.valueOf()] = book;
      this.setState({ books: books });
    }).catch((err) => {
      console.error("Error checking book out. Err: ", err);
    });
  }

  deleteBook = (isbn: String, index: Number) => {
    api.deleteBook(isbn)
      .then(() => {
        this.setState(() => {
          return { books: this.state.books.splice(index, 1) };
        });
      })
      .catch((err) => {
        console.error("Error calling api. Error: ", err);
        return
      });
  }

  bookTable = () => {
    let rows = this.state.books.map((book: Book, index: Number) => {
      return (<LibraryRow key={book.isbn.toString()} book={book} index={index} deleteFn={this.deleteBook} link={this.props.link} setBook={this.props.setBook} checkoutBook={this.checkoutBook}
        checkinBook={this.checkinBook} />);
    })

    return (
      <table className="lib-list">
        <thead>
          <tr className="center">
            <th className="col-2">Title</th>
            <th className="col-2">Author</th>
            <th className="col-4">Description</th>
            <th className="col-1">In / Total</th>
            <th className="col-1">Check-out</th>
            <th className="col-1">Check-in</th>
            <th className="col-1">Edit</th>
            <th className="col-1">Remove</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }

  render = () => {
    return (
      <div className="library panel">
        <div className="page-title">Library List</div>
        <hr />
        {
          this.state.books.length === 0 ?
            <div>No books in collection yet.</div> :
            this.bookTable()
        }
      </div>
    );
  }
}