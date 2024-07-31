import { IComponent } from "./component.h";

// internal type, not accessible outsite entity.ts
type constr<T> = { new(...args: unknown[]): T } // type of Component to expect

export abstract class Entity {
  protected _components: IComponent[] = [];

  // give read-only access for the outside world

  /*Getter methods allow you to retrieve the value of a property from the entity,
while setter methods enable you to modify the value of a property with certain validations or actions. */

  public get Components(): IComponent[] {
    return this._components;
  }

  public AddComponent(component: IComponent): void {
    this._components.push(component);

    component.Entity = this;
    /*
    This below is written, because
    
    export interface IComponent {
        Entity: Entity | null
    }   
    */
  }

  public GetComponent<C extends IComponent>(constr: constr<C>): C {

    for (const component of this._components){
        if(component instanceof constr){
            return component as C
        }
    }
    throw Error (`Components ${constr.name} not found on Entity ${this.constructor.name}`)
  }

  public RemoveComponent<C extends IComponent>(constr: constr<C>): void{
        let toRemove: IComponent | undefined;
        let index: number | undefined;

        for(let i=0; i < this._components.length; i++){
            const component = this._components[i];
            if(component instanceof constr){
                toRemove = component;
                index = i;
                break
            }
        }

        if(toRemove && index){
            toRemove.Entity = null;
            this._components.splice(index, 1);
        }
  }

  public HasComponent<C extends IComponent>(constr: constr<C> ): boolean  {
    for(const component of this._components){
        if(component instanceof constr){
            return true
        }
    }
    return false
  }
}
