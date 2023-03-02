import { Language } from "./LanguageEnum";

export class Skill {

    constructor(){
        this.name = "";  
    }

    public id!: number;
    public name:String;
    public language!:Language;

}