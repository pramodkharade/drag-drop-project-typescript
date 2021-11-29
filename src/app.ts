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
