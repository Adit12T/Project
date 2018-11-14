import React, { Component } from 'react';
import ProjectItem from './ProjectItem';

class Projects extends Component {
   deleteProject(id){
      this.props.onDelete(id);
      }
 render() {
    let projectsItems;
    if(this.props.projects){
        projectsItems = this.props.projects.map(project =>{
           // console.log(project);
        return(  
            <ProjectItem onDelete={this.deleteProject.bind(this)} key = {project.title} project={project} />
           );
        });
    }
    return (
      <div className="Projects">
      <h3>Latest Projects</h3>
        {projectsItems}
       </div>
    );
  }
}

export default Projects;
