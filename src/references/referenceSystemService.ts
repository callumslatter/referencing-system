import { IFormattedText } from "./reference";

export class referenceSystemService { 
    public get(): IFormattedText {
        return {
            formattedText: "Here's a string really it is!",
            references: ["Here's string 1!"]
        }
    }

    public post(inputText: string): IFormattedText {
        return {
            formattedText: inputText,
            references: ["Here's string 1!"]
        }
    }
}