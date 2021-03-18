import React from 'react';
import { api, Book, Update } from '../../api/books';
import './Update.css';

interface UpdateProps {
  isCreate: boolean,
  book?: Book,
  link: (newView: String) => void,
  setBook: (newBook: Book) => void
}

interface UpdateState {
  book: Book,
}

export default class UpdateForm extends React.Component<UpdateProps, UpdateState> {

  constructor(props: UpdateProps) {
    super(props);

    if (this.props.isCreate) {
      this.state = {
        book: {
          title: "",
          author: {
            first_name: "",
            last_name: ""
          },
          isbn: "",
          quantity_available: 0,
          quantity_total: 0,
          description: "",
          history: Array<Update>()
        }
      }
    } else if (this.props.book != undefined) {
      this.state = { book: this.props.book };
    }

    this.updateTitle = this.updateTitle.bind(this);
  }


  createBook = () => {
    let now = new Date();
    this.state.book.history.push({
      type: "add_to_collection",
      author: "user",
      description: "new book to the collection.",
      time: now.toISOString()
    })
    api.createBook(this.state.book)
      .then((resp) => {
        this.props.link("home");
      }).catch((err) => {
        console.error("Error create book. Err", err);
      });
    // api.
  }

  submitButton = () => {
    if (this.props.isCreate) {
      return (<button onClick={this.createBook} >Add Book To Collection</button>);
    }

    return (<button >Update</button>);
  }

  updateTitle = (evt: any) => {
    let book = this.state.book;
    book.title = evt.target.value;
    this.setState({ book: book });
  }

  updateFn = (evt: any) => {
    let book = this.state.book;
    book.author.first_name = evt.target.value;
    this.setState({ book: book });
  }

  updateLn = (evt: any) => {
    let book = this.state.book;
    book.author.last_name = evt.target.value;
    this.setState({ book: book });
  }

  updateIsbn = (evt: any) => {
    let book = this.state.book;
    book.isbn = evt.target.value;
    this.setState({ book: book });
  }

  updateAvailable = (evt: any) => {
    let book = this.state.book;
    book.quantity_available = parseInt(evt.target.value);
    this.setState({ book: book });
  }

  updateTotal = (evt: any) => {
    let book = this.state.book;
    book.quantity_total = parseInt(evt.target.value);
    this.setState({ book: book });
  }

  updateDescription = (evt: any) => {
    let book = this.state.book;
    book.description = evt.target.value;
    this.setState({ book: book });
  }

  render = () => {
    if (!this.state.book) {
      return (<div>Loading...</div>)
    }

    return (
      <div className="update-form panel">
        <div className="page-title">{this.props.isCreate ? "New Book" : "Update Book"}</div>
        <hr />
        <div className="row">
          <div className="col-4">Title</div>
          <div className="col-6"><input type="text" name="title" value={this.state.book.title.toString()} onChange={this.updateTitle} /></div>
        </div>
        <div className="row">
          <div className="col-4">Author First Name</div>
          <div className="col-6"><input type="text" name="first_name" value={this.state.book.author.first_name.toString()} onChange={this.updateFn} /></div>
        </div>
        <div className="row">
          <div className="col-4">Author Last Name</div>
          <div className="col-6"><input type="text" name="last_name" value={this.state.book.author.last_name.toString()} onChange={this.updateLn} /></div>
        </div>
        <div className="row">
          <div className="col-4">ISBN</div>
          <div className="col-6"><input type="text" name="isbn" value={this.state.book.isbn.toString()} onChange={this.updateIsbn} /></div>
        </div>
        <div className="row">
          <div className="col-4">Books Available</div>
          <div className="col-6"><input type="text" name="quantity_available" value={this.state.book.quantity_available.toString()} onChange={this.updateAvailable} /></div>
        </div>
        <div className="row">
          <div className="col-4">Total Owned</div>
          <div className="col-6"><input type="text" name="quantity_total" value={this.state.book.quantity_total.toString()} onChange={this.updateTotal} /></div>
        </div>
        <div className="row">
          <div className="col-4">Description</div>
          <div className="col-6"><input type="text" name="description" value={this.state.book.description.toString()} onChange={this.updateDescription} /></div>
        </div>
        {this.submitButton()}
      </div>
    );
  }
}