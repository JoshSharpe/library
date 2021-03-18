import React from 'react';
import { Book } from '../../api/books';
import './Book.css';

interface BookProps {
  book?: Book,
  link: (newView: String) => void,
}

interface BookState {
}

export default class BookView extends React.Component<BookProps, BookState> {
  constructor(props: BookProps) {
    super(props);
  }

  getChanges = (book: Book) => {
    if (book === undefined || book.history === undefined) {
      return (
        <div className="row">
          No changes have been made.
        </div>
      )
    }
    return book.history.map((change) => {
      return (
        <div className="row">
          <div className="col-4">{change.time}</div>
          <div className="col-6">{change.description}</div>
        </div>
      )
    })
  }

  render = () => {
    if (!this.props.book) {
      return (<div>No book selected. Return to the library.</div>)
    }

    return (
      <div className="update-form panel">
        <div className="page-title">View Book</div>
        <hr />
        <div className="row">
          <div className="col-4">Title</div>
          <div className="col-6">{this.props.book.title}</div>
        </div>
        <div className="row">
          <div className="col-4">Author First Name</div>
          <div className="col-6">{this.props.book.author.first_name}</div>
        </div>
        <div className="row">
          <div className="col-4">Author Last Name</div>
          <div className="col-6">{this.props.book.author.last_name}</div>
        </div>
        <div className="row">
          <div className="col-4">ISBN</div>
          <div className="col-6">{this.props.book.isbn}</div>
        </div>
        <div className="row">
          <div className="col-4">Books Available</div>
          <div className="col-6">{this.props.book.quantity_available}</div>
        </div>
        <div className="row">
          <div className="col-4">Total Owned</div>
          <div className="col-6">{this.props.book.quantity_total}</div>
        </div>
        <div className="row">
          <div className="col-4">Description</div>
          <div className="col-6">{this.props.book.description}</div>
        </div>
        <div className="history left">
          <hr />
          <div className="row">History</div>
          {this.getChanges(this.props.book)}
        </div>
      </div>
    );
  }
}