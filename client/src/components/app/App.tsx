import React from "react";
import { Book } from "../../api/books";
import BookView from "../book/Book";
import Library from "../library/Library";
import Nav from "../nav/Nav";
import Update from "../update/Update";
import './App.css';

const HomeViewNav = "home";
const CreateViewNav = "create";
const UpdateViewNav = "update";
const BookViewNav = "book";

interface AppState {
  currentBook?: Book,
  currentView: String
}

export default class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {
      currentView: HomeViewNav
    }

    this.setCurrentView = this.setCurrentView.bind(this);
    this.setCurrentBook = this.setCurrentBook.bind(this);
  }

  setCurrentView = (newView: String) => {
    if (newView === HomeViewNav || newView === CreateViewNav) {
      this.setState({
        currentBook: undefined,
        currentView: newView
      });
    } else {
      this.setState({
        currentView: newView
      });
    }
  }

  setCurrentBook = (newBook: Book) => {
    this.setState({ currentBook: newBook });
  }

  getCurrentView = () => {
    if (this.state.currentView === HomeViewNav) {
      return (<Library setBook={this.setCurrentBook} link={this.setCurrentView} />);
    }

    if (this.state.currentView === CreateViewNav) {
      return (<Update isCreate={true} setBook={this.setCurrentBook} link={this.setCurrentView} />);
    }

    if (this.state.currentView === UpdateViewNav) {
      return (<Update isCreate={false} book={this.state.currentBook} setBook={this.setCurrentBook} link={this.setCurrentView} />);
    }

    if (this.state.currentView === BookViewNav) {
      return (<BookView book={this.state.currentBook} link={this.setCurrentView} />);
    }
  }

  render() {
    return (
      <div className="App">
        <Nav link={this.setCurrentView} />
        {this.getCurrentView()}
      </div>
    );
  }
}