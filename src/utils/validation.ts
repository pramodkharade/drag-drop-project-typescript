namespace App{
    // validation interface as data type
export interface validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }
  export function validate(validatInputuser: validatable) {
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
}