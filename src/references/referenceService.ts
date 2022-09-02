import { IFormattedText, IReferenceInstance, IReference } from "./reference";

export class ReferenceService {
  // Collections of references
  private referenceMap = new Map();
  private referenceInstanceMap = new Map();
  private arrayOfRefsForFormatting: number[] = [];

  // TODO: Take this counter out of class scope and bring it into local scope
  // Tracker
  private lastRefToBeFormatted = 0;

  // Regex
  private REFERENCE_IDENTIFICATION_REGEX: RegExp = /\[(.+?)\]/g;

  public formatText(inputText: string): IFormattedText {
    const output = this.refFormatter(inputText);
    return {
      formattedText: output.text,
      references: output.referenceList,
    };
  }

  private refFormatter(inputText: string) {
    let remainingText: string = "";
    let mapIndex = 1;
    let refInstanceCount = 0;
    let finalText = "";

    // Track where each reference occurs
    const refInstance = Array.from(this.identifyReferences(inputText));
    if (!refInstance) {
      throw new Error("Something went wrong! No refInstances.")
    }
    for (const instance of refInstance) {
      if (instance.index === undefined) {
        throw new Error("Something went wrong!")
      }
      const newRefInstance: IReferenceInstance = {
        nameYear: instance[0],
        index: instance.index,
      };
      this.referenceInstanceMap.set(mapIndex, newRefInstance);
      mapIndex++;
    }

    // Build a collection of reference authors, indexes of their references, and length of each reference
    // Checks to see if there's a reference directly after the one currently being focused on
    for (const instance of refInstance) {
      if (instance.index === undefined) {
        throw new Error("Something went wrong! No instance.index.")
      }
      const existingRef = this.referenceMap.get(instance[0])
      if (existingRef) {
        const existingLocations = existingRef.locations;
        const newLocation = instance.index;
        existingLocations.push(newLocation);
        this.arrayOfRefsForFormatting.push(existingRef.referenceId);
      } else {
        const newRef: IReference = {
          referenceId: this.referenceMap.size + 1,
          locations: [instance.index],
          referenceLength: instance[0].length,
        };
        this.referenceMap.set(instance[0], newRef);
        this.arrayOfRefsForFormatting.push(newRef.referenceId);
      }
      remainingText = inputText.slice(instance.index + instance[0].length + 1);

      // Check text immediately after the current reference. If nothing adjacent, format existing collection of references.
      finalText = this.identifyAdjacentReferences(remainingText, inputText, refInstanceCount, finalText);
      refInstanceCount++;
    }

    const referencesLeftToFormat = this.arrayOfRefsForFormatting.length > 0;

    if (referencesLeftToFormat) {
      finalText = this.concatReferencesToFinalOutput(inputText, finalText, refInstanceCount);
    }
    const referenceList = this.createReferenceList(this.referenceMap);
    return { text: finalText, referenceList };
  }

  // Helper Functions
  private identifyReferences(text: string) {
    return text.matchAll(this.REFERENCE_IDENTIFICATION_REGEX);
  }

  private identifyAdjacentReferences(remainingText: string, inputText: string, refInstanceCount: number, finalText: string) {
    if (!remainingText) {
      return finalText;
    }
    if (!this.isOpenSquareBracket(remainingText[0])) {
      finalText = this.concatReferencesToFinalOutput(inputText, finalText, refInstanceCount);
      return finalText
    }
    return finalText
  }

  private concatReferencesToFinalOutput(inputText: string, finalText: string, refInstanceCount: number) {
    let startOfReferenceIndex: number = 0;
    let startOfSectionIndex: number = 0;
  
    // Establish indexes for slice functions
    if (refInstanceCount === 0) {
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
    let textBetweenReferences = inputText.slice(
      startOfSectionIndex,
      startOfReferenceIndex
    );
    finalText = finalText.concat(textBetweenReferences);
    // Add formatted group of references to output
    const formattedReferences = this.formatGroupOfReferences();
    finalText = finalText.concat(`(${formattedReferences})`);
    // Reset array of refs and track last amended position
    this.arrayOfRefsForFormatting = [];
    this.lastRefToBeFormatted = refInstanceCount + 1;
    return finalText
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
            // Handle refsInDashedGroup length is 2 then output 1,2.
            if (refsInDashedGroup.length <= 2) {
              outputString = outputString.concat(refsInDashedGroup.toString());
              refsInDashedGroup = []
            } else {
              outputString = outputString.concat(
                `${refsInDashedGroup[0]}-${thisRef}`
              );
              refsInDashedGroup = [];
            }
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
