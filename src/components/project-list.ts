import { Component } from "./base-component.js";
import { Project,ProjectStatus } from "../models/project.js";
import { Dragtarget } from "../models/drag-drop.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import {ProjectItem} from "../components/project-item.js"
    // ProjectList class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements Dragtarget {
    assignProject: Project[];
    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
  
      this.assignProject = [];
      this.element.id = `${this.type}-projects`;
      this.configure();
      this.renderContent();
    }
    @autobind
    dragOverhandler(event:DragEvent){
      if(event.dataTransfer && event.dataTransfer.types[0]==="text/plain"){
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add('droppable');
      }
    }
    @autobind
    dragLeavehandler(event:DragEvent){
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove('droppable');
    }
    @autobind
    drophandler(event:DragEvent){
  const projId = event.dataTransfer!.getData("text/plain");
  projectState.moveProject(projId,this.type==="active" ?ProjectStatus.Active: ProjectStatus.Finished);
  console.log(" Project ID:",projId);
    }
    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const projectItem of this.assignProject) {
        // const listItem = document.createElement("li");
        // listItem.textContent = projectItem.title;
        // listEl.appendChild(listItem);
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }
    configure() {
      this.element.addEventListener("dragover",this.dragOverhandler);
      this.element.addEventListener("dragleave",this.dragLeavehandler);
      this.element.addEventListener("drop",this.drophandler);
      projectState.addListner((projects: Project[]) => {
        const relevantProjects = projects.filter((proj) => {
          if (this.type === "active") {
            return proj.status === ProjectStatus.Active;
          }
          return proj.status === ProjectStatus.Finished;
        });
        this.assignProject = relevantProjects;
        this.renderProjects();
      });
    }
    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector(
        "h2"
      )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
    }
  }
  