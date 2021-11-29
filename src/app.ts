//Project state Management
type Listener = (items: Project[]) => void;
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {}
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
  addListner(listenerFn: Listener) {
    this.listeners.push(listenerFn);
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
// ProjectList class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignProject: Project[];
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.assignProject = [];
    this.element.id = `${this.type}-projects`;
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
    this.attach();
    this.renderContent();
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignProject) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
  }
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()}-PROJECTS`;
  }
}

//project input class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
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
    this.attach();
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
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}
let prjOb = new ProjectInput();
let activePrj = new ProjectList("active");
let finshedPrj = new ProjectList("finished");
