import { FormEvent } from "react";

export interface LoginInterfaceType{
    heading:string;
    buttonText:string;
    onSubmit?:(e:FormEvent<HTMLFormElement>)=>{}
}