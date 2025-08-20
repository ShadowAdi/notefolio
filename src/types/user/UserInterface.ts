export interface UserInterface{
    id:string;
    username:string;
    email:string;
    profileUrl:string;
}

export interface UserProfileInterface extends UserInterface{
    createdAt:string;
    updatedAt:string;
    bio:string
}