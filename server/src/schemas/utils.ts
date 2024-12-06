import 'reflect-metadata';

export function Example(value: any): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata('example', value, target, propertyKey);
    };
}
