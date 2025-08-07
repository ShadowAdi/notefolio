import { FormEvent } from "react";

export interface RegisterInterfaceType{
     heading:string;
        buttonText:string;
        onSubmit?:(e:FormEvent<HTMLFormElement>)=>{}
}