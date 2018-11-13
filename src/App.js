import React, { Component } from 'react';
import Projects from './components/Projects';
import AddProjects from './components/AddProjects';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      projects: [ ]}
  }

componentWillMount(){
  this.setState({projects:[
    {  title: 'Business Website',
      category: 'Web Design'
    },
    {
      title: 'Social App',
      category: 'Mobile Development'
    },
    {
      title: 'Shopping Cart',
      category: 'Web Development'
    }
  ]});
}
handleAddProject(project){
  console.log(project);
}

  render() {
    return (
      <div className="App">
       <AddProjects addProjects = {this.handleAddProject.bind(this)} />
       <Projects projects = {this.state.projects} />
      </div>
    );
  }
}

export default App;
