import { Dragable } from "../models/drag-drop";
import { Component } from "../components/base-component";
import { Project } from "../models/project";
import { autobind } from "../decorators/autobind";
// ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable
{
  private project: Project;
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  @autobind
  dragStarthandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
    console.log("Start:", event);
  }

  @autobind
  dragEndhandler(event: DragEvent) {
    console.log("END:", event);
  }
  configure() {
    this.element.addEventListener("dragstart", this.dragStarthandler);
    this.element.addEventListener("dragend", this.dragEndhandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
