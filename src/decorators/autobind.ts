namespace  App{
// autobin Decorator
export function autobind(
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
}
  