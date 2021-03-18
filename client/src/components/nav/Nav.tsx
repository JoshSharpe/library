import React from "react";
import "./Nav.css";

interface NavProps {
  link: (newView: String) => void
}

export default class Nav extends React.Component<NavProps, any> {

  constructor(props: NavProps) {
    super(props);
  }

  render = () => {
    return (
      <nav>
        <ul>
          <li onClick={() => this.props.link("home")}>
            <a href="#" >Library Catalog</a>
          </li>
          <li onClick={() => this.props.link("create")}>
            <a href="#" >Add Book</a>
          </li>
        </ul>
      </nav>
    );
  }
}