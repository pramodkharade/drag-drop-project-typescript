/// <reference path="./base-component.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../utils/validation.ts"/>
/// <reference path="../state/project-state.ts"/>
namespace App {
    //project input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}