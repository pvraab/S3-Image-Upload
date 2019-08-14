import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  state = {
    url: "",
    photo: null,
    photoName: ""
  }

  handleInputChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]:value
    })
  }

  getFile = (event) => {
      this.setState({
        photo: event.target.files[0]
      })
      // const file = files[0];
      // console.log(event.target.files);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Click");
    document.querySelector("#fileUpload").reportValidity();
    let payload = new FormData();
    payload.append("file", this.state.photo);
    payload.append("photoName", this.state.photoName);
    console.log(this.state);
    fetch("http://localhost:8000/api/scribble", {
      method: "POST",
      body: payload,
      credentials: "include",
      mode: "cors"
    })
    .then(res => res.json())
    .then(response => {
      console.log(response);
      this.setState({
        url: response
      })
    }
      )
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {(this.state.url)?
          <img src={this.state.url} />
          :
          ""
        }
        </header>
        <form id="fileUpload">
          <label>Select an image</label>
          <input type="file" required name="photo" onChange={this.getFile}/>
          <label>Name your image</label>
          <input type="text" required name="photoName" onChange={this.handleInputChange}/>
          <button onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
