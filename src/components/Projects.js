import React, { Component } from 'react';
import ProjectItem from './ProjectItem';

class Projects extends Component {
 render() {
    let projectsItems;
    if(this.props.projects){
        projectsItems = this.props.projects.map(project =>{
           // console.log(project);
        return(  
            <ProjectItem key = {project.title} project={project} />
           );
        });
    }
    return (
      <div className="Projects">
        {projectsItems}
       </div>
    );
  }
}

export default Projects;
