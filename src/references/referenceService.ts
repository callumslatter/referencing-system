import { IFormattedText, IReferenceInstance, IReference } from "./reference";

export class referenceService {
  constructor(
    // Collections of references
    private referenceLibrary = new Map(),
    private referenceInstanceLibrary = new Map(),
    private arrayOfRefsForFormatting: number[] = [],
    // Trackers
    private refInstanceCount: number = 0,
    private lastRefToBeFormatted: number = 0,
    // Output strings
    private finalText: string = "",
    private inputText: string = "",
    // Regex
    private REFERENCE_IDENTIFICATION_REGEX: RegExp = /\[(.+?)\]/g
  ) {}

  public post(inputBody: string): IFormattedText {
    this.inputText = inputBody;
    const output = this.refFormatter(this.inputText);
    return {
      formattedText: output.text,
      references: output.referenceList,
    };
  }

  refFormatter(inputText: string) {
    let remainingText: string = "";
    let instanceCounter = 1;

    // Track where each reference occurs
    const refInstance = this.identifyReferences(inputText);
    for (const instance of refInstance) {
      const newRefInstance: IReferenceInstance = {
        nameYear: instance[0],
        index: instance.index!,
      };
      this.referenceInstanceLibrary.set(instanceCounter, newRefInstance);
      instanceCounter++;
    }

    // Build a collection of reference authors, indexes of their references, and length of each reference
    // Checks to see if there's a reference directly after the one currently being focused on
    const rawRefs = this.identifyReferences(inputText);
    for (const rawRef of rawRefs) {
      if (this.recordExists(rawRef)) {
        const existingRef = this.referenceLibrary.get(rawRef[0]);
        const existingLocations = existingRef.locations;
        const newLocation = rawRef.index;
        existingLocations.push(newLocation);
        this.arrayOfRefsForFormatting.push(existingRef.referenceId);
      } else if (!this.recordExists(rawRef)) {
        const newRef: IReference = {
          referenceId: this.referenceLibrary.size + 1,
          locations: [rawRef.index!],
          referenceLength: rawRef[0].length,
        };
        this.referenceLibrary.set(rawRef[0], newRef);
        this.arrayOfRefsForFormatting.push(newRef.referenceId);
      }
      remainingText = inputText.slice(rawRef.index! + rawRef[0].length + 1);

      // Check text immediately after the current reference. If nothing adjacent, format existing collection of references.
      this.identifyAdjacentReferences(remainingText);
      this.refInstanceCount++;
    }

    const referencesLeftToFormat =
      this.arrayOfRefsForFormatting.length > 0 ? true : false;

    if (referencesLeftToFormat) {
      this.concatReferencesToFinalOutput();
    }
    let referenceList = this.createReferenceList(this.referenceLibrary);
    return { text: this.finalText, referenceList: referenceList };
  }

  // Helper Functions
  identifyReferences(text: string) {
    return text.matchAll(this.REFERENCE_IDENTIFICATION_REGEX);
  }

  recordExists(rawRef: RegExpMatchArray) {
    const reference = rawRef[0];
    if (this.referenceLibrary.get(reference) === undefined) {
      return false;
    } else {
      return true;
    }
  }

  identifyAdjacentReferences(string: string) {
    if (!string) {
      return;
    }
    if (!this.isOpenSquareBracket(string[0])) {
      this.concatReferencesToFinalOutput();
    }
  }

  concatReferencesToFinalOutput() {
    let startOfReferenceIndex: number = 0;
    let startOfSectionIndex: number = 0;
    // Establish indexes for slice functions
    if (this.refInstanceCount === 0) {
      startOfSectionIndex = 0;
      startOfReferenceIndex = this.referenceInstanceLibrary.get(1).index;
    } else {
      const previousReference = this.referenceInstanceLibrary.get(
        this.lastRefToBeFormatted
      );
      const endOfPreviousReference =
        previousReference.index + previousReference.nameYear.length;
      startOfSectionIndex = endOfPreviousReference;
      startOfReferenceIndex = this.referenceInstanceLibrary.get(
        this.lastRefToBeFormatted + 1
      ).index;
    }
    // Obtains the text between groups of references and adds it to output
    let textBetweenReferences = this.inputText.slice(
      startOfSectionIndex,
      startOfReferenceIndex
    );
    this.finalText = this.finalText.concat(textBetweenReferences);
    // Add formatted group of references to output
    const formattedReferences = this.formatGroupOfReferences(
      this.arrayOfRefsForFormatting
    );
    this.finalText = this.finalText.concat(`(${formattedReferences})`);
    // Reset array of refs and track last amended position
    this.arrayOfRefsForFormatting = [];
    this.lastRefToBeFormatted = this.refInstanceCount + 1;
  }

  createReferenceList(referenceLibrary: Map<any, any>) {
    let refsOutputArray: string[] = [];
    const references = referenceLibrary.entries();
    for (const reference of references) {
      const debracketedReference = reference[0].slice(
        1,
        reference[0].length - 1
      );
      refsOutputArray.push(
        `${reference[1].referenceId}. ${debracketedReference}`
      );
    }
    return refsOutputArray;
  }

  isWhiteSpace(str: string) {
    return str.match(/\s/);
  }

  isOpenSquareBracket(str: string) {
    return str.match(/[[]/);
  }

  formatGroupOfReferences(arrayOfRefsForFormatting: number[]) {
    arrayOfRefsForFormatting.sort(function(a,b){return a-b})
    // If less than three references, output references in current state
    if (
      this.arrayOfRefsForFormatting.length === 1 ||
      this.arrayOfRefsForFormatting.length === 2
    ) {
      return this.arrayOfRefsForFormatting.toString();
    } else if (this.arrayOfRefsForFormatting.length > 2) {
      let outputString = "";
      let refsInDashedGroup: number[] = [];
      for (let i = 0; i < this.arrayOfRefsForFormatting.length; i++) {
        // This 'If' clause handles final ref in arrayOfRefs
        if (i + 1 === this.arrayOfRefsForFormatting.length) {
          // If final ref Id is only 1 more than penultimate...
          if (
            this.arrayOfRefsForFormatting[i] -
              this.arrayOfRefsForFormatting[i - 1] ===
            1
          ) {
            refsInDashedGroup.push(this.arrayOfRefsForFormatting[i]);
            outputString = outputString.concat(
              `${refsInDashedGroup[0]}-${
                refsInDashedGroup[refsInDashedGroup.length - 1]
              }`
            );
            refsInDashedGroup = [];
            // If final ref Id is more than 1 more than penultimate...
          } else if (
            this.arrayOfRefsForFormatting[i] -
              this.arrayOfRefsForFormatting[i - 1] >
            1
          ) {
            outputString = outputString.concat(refsInDashedGroup.toString());
          }
          // Handle in range situations
        } else if (i + 1 < this.arrayOfRefsForFormatting.length) {
          // Next reference is only one more than current reference
          if (
            this.arrayOfRefsForFormatting[i + 1] -
              this.arrayOfRefsForFormatting[i] ===
            1
          ) {
            refsInDashedGroup.push(arrayOfRefsForFormatting[i]);
          }
          // Next reference is more than one more than current reference
          if (
            this.arrayOfRefsForFormatting[i + 1] -
              this.arrayOfRefsForFormatting[i] >
            1
          ) {
            refsInDashedGroup.push(this.arrayOfRefsForFormatting[i]);
            if (refsInDashedGroup.length > 2) {
              outputString = outputString.concat(
                `${refsInDashedGroup[0]}-${
                  refsInDashedGroup[refsInDashedGroup.length - 1]
                },`
              );
              refsInDashedGroup = [];
            } else if (refsInDashedGroup.length <= 2) {
              outputString = outputString.concat(
                `${refsInDashedGroup.toString()},`
              );
              refsInDashedGroup = [];
            }
          }
        }
      }
      return outputString;
    }
  }
}
