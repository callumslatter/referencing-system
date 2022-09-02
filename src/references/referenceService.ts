import { IFormattedText, IReferenceInstance, IReference } from "./reference";

export class ReferenceService {
  // Collections of references
  private referenceMap = new Map();
  private referenceInstanceMap = new Map();
  private arrayOfRefsForFormatting: number[] = [];
  // Trackers
  private refInstanceCount = 0;
  private lastRefToBeFormatted = 0;
  // Output strings
  private finalText: string = "";
  private inputText: string = "";
  // Regex
  private REFERENCE_IDENTIFICATION_REGEX: RegExp = /\[(.+?)\]/g;

  public formatText(inputBody: string): IFormattedText {
    this.inputText = inputBody;
    const output = this.refFormatter(this.inputText);
    return {
      formattedText: output.text,
      references: output.referenceList,
    };
  }

  private refFormatter(inputText: string) {
    let remainingText: string = "";
    let instanceCounter = 1;

    // Track where each reference occurs
    const refInstance = this.identifyReferences(inputText);
    if (!refInstance) {
      return { text: "No references found", referenceList: [] }
    }
    for (const instance of refInstance) {
      if (instance.index === undefined) {
        throw new Error("Something went wrong!")
      }
      const newRefInstance: IReferenceInstance = {
        nameYear: instance[0],
        index: instance.index,
      };
      this.referenceInstanceMap.set(instanceCounter, newRefInstance);
      instanceCounter++;
    }

    // Build a collection of reference authors, indexes of their references, and length of each reference
    // Checks to see if there's a reference directly after the one currently being focused on
    const rawRefs = this.identifyReferences(inputText);
    for (const rawRef of rawRefs) {
      if (rawRef.index === undefined) {
        throw new Error("Something went wrong!")
      }
      if (this.recordExists(rawRef)) {
        const existingRef = this.referenceMap.get(rawRef[0]);
        const existingLocations = existingRef.locations;
        const newLocation = rawRef.index;
        existingLocations.push(newLocation);
        this.arrayOfRefsForFormatting.push(existingRef.referenceId);
      } else {
        const newRef: IReference = {
          referenceId: this.referenceMap.size + 1,
          locations: [rawRef.index],
          referenceLength: rawRef[0].length,
        };
        this.referenceMap.set(rawRef[0], newRef);
        this.arrayOfRefsForFormatting.push(newRef.referenceId);
      }
      remainingText = inputText.slice(rawRef.index + rawRef[0].length + 1);

      // Check text immediately after the current reference. If nothing adjacent, format existing collection of references.
      this.identifyAdjacentReferences(remainingText);
      this.refInstanceCount++;
    }

    const referencesLeftToFormat = this.arrayOfRefsForFormatting.length > 0;

    if (referencesLeftToFormat) {
      this.concatReferencesToFinalOutput();
    }
    const referenceList = this.createReferenceList(this.referenceMap);
    return { text: this.finalText, referenceList };
  }

  // Helper Functions
  private identifyReferences(text: string) {
    return text.matchAll(this.REFERENCE_IDENTIFICATION_REGEX);
  }

  private recordExists(rawRef: RegExpMatchArray) {
    return this.referenceMap.get(rawRef[0]) !== undefined;
  }

  private identifyAdjacentReferences(string: string) {
    if (!string) {
      return;
    }
    if (!this.isOpenSquareBracket(string[0])) {
      this.concatReferencesToFinalOutput();
    }
  }

  private concatReferencesToFinalOutput() {
    let startOfReferenceIndex: number = 0;
    let startOfSectionIndex: number = 0;
    // Establish indexes for slice functions
    if (this.refInstanceCount === 0) {
      startOfSectionIndex = 0;
      startOfReferenceIndex = this.referenceInstanceMap.get(1).index;
    } else {
      const previousReference = this.referenceInstanceMap.get(
        this.lastRefToBeFormatted
      );
      const endOfPreviousReference =
        previousReference.index + previousReference.nameYear.length;
      startOfSectionIndex = endOfPreviousReference;
      startOfReferenceIndex = this.referenceInstanceMap.get(
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
    const formattedReferences = this.formatGroupOfReferences();
    this.finalText = this.finalText.concat(`(${formattedReferences})`);
    // Reset array of refs and track last amended position
    this.arrayOfRefsForFormatting = [];
    this.lastRefToBeFormatted = this.refInstanceCount + 1;
  }

  private createReferenceList(referenceMap: Map<any, any>) {
    const refsOutputArray: string[] = [];
    const references = referenceMap.entries();
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

  private isOpenSquareBracket(str: string) {
    return str.match(/[[]/);
  }

  private formatGroupOfReferences() {
    this.arrayOfRefsForFormatting.sort(function (a, z) {
      return a - z;
    });
    // If less than three references, output references in current state
    if (this.arrayOfRefsForFormatting.length <= 2) {
      return this.arrayOfRefsForFormatting.toString();
    }
    {
      let outputString = "";
      let refsInDashedGroup: number[] = [];
      for (let i = 0; i < this.arrayOfRefsForFormatting.length; i++) {
        const thisRef = this.arrayOfRefsForFormatting[i];
        const nextRef = this.arrayOfRefsForFormatting[i + 1];
        const prevRef = this.arrayOfRefsForFormatting[i - 1];
        // This 'If' clause handles final ref in arrayOfRefs
        if (i + 1 === this.arrayOfRefsForFormatting.length) {
          // If final ref Id is only 1 more than penultimate...
          if (thisRef - prevRef === 1) {
            refsInDashedGroup.push(thisRef);
            outputString = outputString.concat(
              `${refsInDashedGroup[0]}-${thisRef}`
            );
            refsInDashedGroup = [];
            // If final ref Id is more than 1 more than penultimate...
          } else if (thisRef - prevRef > 1) {
            outputString = outputString.concat(refsInDashedGroup.toString());
          }
          // Handle in range situations
        } else if (i + 1 < this.arrayOfRefsForFormatting.length) {
          // Next reference is only one more than current reference
          if (nextRef - thisRef === 1) {
            refsInDashedGroup.push(this.arrayOfRefsForFormatting[i]);
          }
          // Next reference is more than one more than current reference
          if (nextRef - thisRef > 1) {
            refsInDashedGroup.push(thisRef);
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
