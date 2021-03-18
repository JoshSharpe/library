import React from 'react';
import { Book } from '../../api/books';
import './LibraryRow.css';

interface LibRowProps {
  book: Book,
  index: Number,
  deleteFn: (isbn: String, index: Number) => void,
  link: (newView: String) => void,
  setBook: (newBook: Book) => void,
  checkoutBook: (book: Book, index: Number) => void,
  checkinBook: (book: Book, index: Number) => void
}

export default class LibraryRow extends React.Component<LibRowProps, any> {

  constructor(props: LibRowProps) {
    super(props);
  }

  render = () => {
    let book = this.props.book;
    return (
      <tr className="lib-row">
        <td className="book-title" onClick={() => { this.props.setBook(book); this.props.link("book") }}>
          <a href="#">{book.title}</a>
        </td>

        <td >{book.author.last_name}, {book.author.first_name}</td>

        <td >{book.description}</td>

        <td className="center">{book.quantity_available} / {book.quantity_total}</td>

        <td className="center"><i onClick={() => this.props.checkoutBook(book, this.props.index)} title="Check-out book" className="fas fa-arrow-circle-left"></i></td>

        <td className="center"><i onClick={() => this.props.checkinBook(book, this.props.index)} title="Check-in book" className="fas fa-arrow-circle-right"></i></td>

        <td className="center" onClick={() => { this.props.setBook(book); this.props.link("update") }}>
          {/* <td className="center" onClick={() => console.log("BOOK: ", book)}> */}
          <i title="Update book information" className="fas fa-edit"></i>
        </td>

        <td className="center"> <i title="Remove all book information" className="fas fa-trash-alt" onClick={() => this.props.deleteFn(book.isbn, this.props.index)}></i></td>
      </tr >
    );
  }

}