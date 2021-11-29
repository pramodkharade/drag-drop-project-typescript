import {Project,ProjectStatus} from "../models/project.js";
//Project state Management
type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListner(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
 export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numberofpeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberofpeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }
  moveProject(projectId: string,newStatus:ProjectStatus){
    const matchProject = this.projects.find(project=>project.id===projectId);
    if(matchProject && matchProject.status !==newStatus){
      matchProject.status = newStatus;
      this.updateListeners();
    }
  }
  private updateListeners(){
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
export const projectState = ProjectState.getInstance();