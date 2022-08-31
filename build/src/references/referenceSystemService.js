"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceSystemService = void 0;
class referenceSystemService {
    constructor(referenceLibrary = new Map(), referenceInstanceLibrary = new Map(), 
    // Keep track of groups of references
    arrayOfRefsForFormatting = [], 
    // Keep track of the instance being worked on
    refInstanceCount = 0, lastRefToBeFormatted = 0, 
    // let remainingText: string = "";
    finalText = "", 
    // REGEX
    REFERENCE_IDENTIFICATION_REGEX = /\[(.+?)\]/g) {
        this.referenceLibrary = referenceLibrary;
        this.referenceInstanceLibrary = referenceInstanceLibrary;
        this.arrayOfRefsForFormatting = arrayOfRefsForFormatting;
        this.refInstanceCount = refInstanceCount;
        this.lastRefToBeFormatted = lastRefToBeFormatted;
        this.finalText = finalText;
        this.REFERENCE_IDENTIFICATION_REGEX = REFERENCE_IDENTIFICATION_REGEX;
    }
    post(inputText) {
        return {
            formattedText: inputText,
            references: ["Here's string 1!"],
        };
    }
    //   // INPUT
    //   inputText: string =
    //     "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";
    refFormatter(inputText) {
        let remainingText = "";
        let instanceCounter = 1;
        // Track where each reference occurs
        const refInstance = this.identifyReferences(inputText);
        for (const instance of refInstance) {
            const newRefInstance = {
                nameYear: instance[0],
                index: instance.index,
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
            }
            else if (!this.recordExists(rawRef)) {
                const newRef = {
                    referenceId: this.referenceLibrary.size + 1,
                    locations: [rawRef.index],
                    referenceLength: rawRef[0].length,
                };
                this.referenceLibrary.set(rawRef[0], newRef);
                this.arrayOfRefsForFormatting.push(newRef.referenceId);
            }
            remainingText = inputText.slice(rawRef.index + rawRef[0].length + 1);
            // Check text immediately after the current reference. If nothing adjacent, format existing collection of references.
            this.identifyAdjacentReferences(remainingText);
            this.refInstanceCount++;
        }
        const referencesLeftToFormat = this.arrayOfRefsForFormatting.length > 0 ? true : false;
        if (referencesLeftToFormat) {
            concatReferences();
        }
        console.log(inputText);
        console.log("\n");
        console.log(this.finalText);
        console.log("\n");
        createReferenceList(this.referenceLibrary);
    }
    // Helper Functions
    identifyReferences(text) {
        return text.matchAll(this.REFERENCE_IDENTIFICATION_REGEX);
    }
    recordExists(rawRef) {
        const reference = rawRef[0];
        if (this.referenceLibrary.get(reference) === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    identifyAdjacentReferences(string) {
        if (!string) {
            return;
        }
        if (!isOpenSquareBracket(string[0])) {
            concatReferences();
        }
    }
    concatReferences() {
        let startOfReferenceIndex = 0;
        let startOfSectionIndex = 0;
        // Establish indexes for slice functions
        if (this.refInstanceCount === 0) {
            startOfSectionIndex = 0;
            startOfReferenceIndex = this.referenceInstanceLibrary.get(1).index;
        }
        else {
            const previousReference = this.referenceInstanceLibrary.get(this.lastRefToBeFormatted);
            const endOfPreviousReference = previousReference.index + previousReference.nameYear.length;
            startOfSectionIndex = endOfPreviousReference;
            startOfReferenceIndex = this.referenceInstanceLibrary.get(this.lastRefToBeFormatted + 1).index;
        }
        //
        let textBetweenReferences = inputText.slice(startOfSectionIndex, startOfReferenceIndex);
        this.finalText = this.finalText.concat(textBetweenReferences);
        const formattedReferences = formatGroupOfReferences(this.arrayOfRefsForFormatting);
        this.finalText = this.finalText.concat(`(${formattedReferences})`);
        this.arrayOfRefsForFormatting = [];
        this.lastRefToBeFormatted = this.refInstanceCount + 1;
    }
    createReferenceList(referenceLibrary) {
        console.log("Reference list:");
        const references = referenceLibrary.entries();
        for (const reference of references) {
            const debracketedReference = reference[0].slice(1, reference[0].length - 1);
            console.log(`${reference[1].referenceId}. ${debracketedReference}`);
        }
    }
    isWhiteSpace(str) {
        return str.match(/\s/);
    }
    isOpenSquareBracket(str) {
        return str.match(/[[]/);
    }
    formatGroupOfReferences(arrayOfRefsForFormatting) {
        // If less than three references, output references in current state
        if (this.arrayOfRefsForFormatting.length === 1 ||
            this.arrayOfRefsForFormatting.length === 2) {
            return this.arrayOfRefsForFormatting.toString();
        }
        else if (this.arrayOfRefsForFormatting.length > 2) {
            let outputString = "";
            let refsInDashedGroup = [];
            for (let i = 0; i < this.arrayOfRefsForFormatting.length; i++) {
                // This 'If' clause handles final ref in arrayOfRefs
                if (i + 1 === this.arrayOfRefsForFormatting.length) {
                    // If final ref Id is only 1 more than penultimate...
                    if (this.arrayOfRefsForFormatting[i] - this.arrayOfRefsForFormatting[i - 1] ===
                        1) {
                        refsInDashedGroup.push(this.arrayOfRefsForFormatting[i]);
                        outputString = outputString.concat(`${refsInDashedGroup[0]}-${refsInDashedGroup[refsInDashedGroup.length - 1]}`);
                        refsInDashedGroup = [];
                        // If final ref Id is more than 1 more than penultimate...
                    }
                    else if (this.arrayOfRefsForFormatting[i] - this.arrayOfRefsForFormatting[i - 1] >
                        1) {
                        outputString = outputString.concat(refsInDashedGroup.toString());
                    }
                    // Handle in range situations
                }
                else if (i + 1 < this.arrayOfRefsForFormatting.length) {
                    // Next reference is only one more than current reference
                    if (this.arrayOfRefsForFormatting[i + 1] - this.arrayOfRefsForFormatting[i] ===
                        1) {
                        refsInDashedGroup.push(arrayOfRefsForFormatting[i]);
                    }
                    // Next reference is more than one more than current reference
                    if (this.arrayOfRefsForFormatting[i + 1] - this.arrayOfRefsForFormatting[i] >
                        1) {
                        refsInDashedGroup.push(this.arrayOfRefsForFormatting[i]);
                        if (refsInDashedGroup.length > 2) {
                            outputString = outputString.concat(`${refsInDashedGroup[0]}-${refsInDashedGroup[refsInDashedGroup.length - 1]},`);
                            refsInDashedGroup = [];
                        }
                        else if (refsInDashedGroup.length <= 2) {
                            outputString = outputString.concat(`${refsInDashedGroup.toString()},`);
                            refsInDashedGroup = [];
                        }
                    }
                }
            }
            return outputString;
        }
    }
}
exports.referenceSystemService = referenceSystemService;
