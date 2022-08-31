export interface IReference {
    referenceId: number;
    locations: number[];
    referenceLength: number;
  }
  
export interface IReferenceInstance {
    nameYear: string;
    index: number;
  }

export interface IFormattedText {
    formattedText: string;
    references: string[]
}