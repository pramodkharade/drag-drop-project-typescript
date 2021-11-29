// Generic or Base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtBeinnning: Boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeinnning ? "afterbegin" : "beforeend",
      this.element
    );
  }
  abstract configure?(): void;
  abstract renderContent(): void;
}
//Project state Management
type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListner(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
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
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
const projectState = ProjectState.getInstance();
// Drag and drop interface
interface Dragable{
  dragStarthandler(event:DragEvent):void;
  dragEndhandler(event:DragEvent):void;
  
}
interface Dragtarget{
  dragOverhandler(event:DragEvent):void;
  drophandler(event:DragEvent):void;
  dragLeavehandler(event:DragEvent):void;
}
// Project Type
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
// validation interface as data type
interface validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatInputuser: validatable) {
  let isValid = true;
  if (validatInputuser.required) {
    isValid = isValid && validatInputuser.value.toString().trim().length !== 0;
  }
  if (
    validatInputuser.minLength != null &&
    typeof validatInputuser.value === "string"
  ) {
    isValid =
      isValid && validatInputuser.value.length >= validatInputuser.minLength;
  }
  if (
    validatInputuser.maxLength != null &&
    typeof validatInputuser.value === "string"
  ) {
    isValid =
      isValid && validatInputuser.value.length <= validatInputuser.maxLength;
  }
  if (
    validatInputuser.min != null &&
    typeof validatInputuser.value === "number"
  ) {
    isValid = isValid && validatInputuser.value >= validatInputuser.min;
  }
  if (
    validatInputuser.max != null &&
    typeof validatInputuser.value === "number"
  ) {
    isValid = isValid && validatInputuser.value <= validatInputuser.max;
  }
  return isValid;
}
// autobin Decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const ajDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return ajDescriptor;
}
// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Dragable {
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
  dragStarthandler(event:Event){
    console.log("Start:",event);
  }

  @autobind
  dragEndhandler(event:Event){
    console.log("END:",event);
  }
  configure() {
    this.element.addEventListener("dragstart",this.dragStarthandler);
    this.element.addEventListener("dragend",this.dragEndhandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
// ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements Dragtarget {
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
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.add('droppable');
  }
  @autobind
  dragLeavehandler(event:DragEvent){
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove('droppable');
  }
  @autobind
  drophandler(event:DragEvent){

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
    this.element.addEventListener("drag",this.drophandler);
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

//project input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }
  private clearInput() {
    this.titleInputElement.value = " ";
    this.descriptionInputElement.value = " ";
    this.peopleInputElement.value = " ";
  }
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    const titlevalidatable: validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionvalidatable: validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peoplevalidatable: validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
    };
    if (
      !validate(titlevalidatable) ||
      !validate(descriptionvalidatable) ||
      !validate(peoplevalidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      console.log("Title:", title, " Desc:", desc, " People:", people);
      this.clearInput();
    }
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}
}
let prjOb = new ProjectInput();
let activePrj = new ProjectList("active");
let finshedPrj = new ProjectList("finished");
