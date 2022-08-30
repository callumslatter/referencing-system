// export class ReferencingSystemService {
// }
const referenceLibrary = new Map();
const referenceInstanceLibrary = new Map();
// Keep track of groups of references
let arrayOfRefsForFormatting = [];
refInstanceCount = 0;
let lastRefToBeFormatted;
// let remainingText: string = "";
let finalText = "";
// REGEX
const REFERENCE_IDENTIFICATION_REGEX = /\[(.+?)\]/g;
// INPUT
const inputText = "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";
function refFormatter(inputText) {
    let remainingText = "";
    let instanceCounter = 1;
    // Track where each reference occurs
    const refInstance = identifyReferences(inputText);
    for (const instance of refInstance) {
        const newRefInstance = {
            nameYear: instance[0],
            index: instance.index,
        };
        referenceInstanceLibrary.set(instanceCounter, newRefInstance);
        instanceCounter++;
    }
    // Build a collection of reference authors, indexes of their references, and length of each reference
    // Checks to see if there's a reference directly after the one currently being focused on
    const rawRefs = identifyReferences(inputText);
    for (const rawRef of rawRefs) {
        if (recordExists(rawRef)) {
            const existingRef = referenceLibrary.get(rawRef[0]);
            const existingLocations = existingRef.locations;
            const newLocation = rawRef.index;
            existingLocations.push(newLocation);
            arrayOfRefsForFormatting.push(existingRef.referenceId);
        }
        else if (!recordExists(rawRef)) {
            const newRef = {
                referenceId: referenceLibrary.size + 1,
                locations: [rawRef.index],
                referenceLength: rawRef[0].length,
            };
            referenceLibrary.set(rawRef[0], newRef);
            arrayOfRefsForFormatting.push(newRef.referenceId);
        }
        remainingText = inputText.slice(rawRef.index + rawRef[0].length + 1);
        // Check text immediately after the current reference. If nothing adjacent, format existing collection of references.
        identifyAdjacentReferences(remainingText);
        refInstanceCount++;
    }
    const referencesLeftToFormat = arrayOfRefsForFormatting.length > 0 ? true : false;
    if (referencesLeftToFormat) {
        concatReferences();
    }
    console.log(inputText);
    console.log("\n");
    console.log(finalText);
    console.log("\n");
    createReferenceList(referenceLibrary);
}
// Helper Functions
function identifyReferences(text) {
    return text.matchAll(REFERENCE_IDENTIFICATION_REGEX);
}
function recordExists(rawRef) {
    const reference = rawRef[0];
    if (referenceLibrary.get(reference) === undefined) {
        return false;
    }
    else {
        return true;
    }
}
function identifyAdjacentReferences(string) {
    if (!string) {
        return;
    }
    if (!isOpenSquareBracket(string[0])) {
        concatReferences();
    }
}
function concatReferences() {
    let startOfReferenceIndex = 0;
    let startOfSectionIndex = 0;
    // Establish indexes for slice functions
    if (refInstanceCount === 0) {
        startOfSectionIndex = 0;
        startOfReferenceIndex = referenceInstanceLibrary.get(1).index;
    }
    else {
        const previousReference = referenceInstanceLibrary.get(lastRefToBeFormatted);
        const endOfPreviousReference = previousReference.index + previousReference.nameYear.length;
        startOfSectionIndex = endOfPreviousReference;
        startOfReferenceIndex = referenceInstanceLibrary.get(lastRefToBeFormatted + 1).index;
    }
    // 
    let textBetweenReferences = inputText.slice(startOfSectionIndex, startOfReferenceIndex);
    finalText = finalText.concat(textBetweenReferences);
    const formattedReferences = formatGroupOfReferences(arrayOfRefsForFormatting);
    finalText = finalText.concat(`(${formattedReferences})`);
    arrayOfRefsForFormatting = [];
    lastRefToBeFormatted = refInstanceCount + 1;
}
function createReferenceList(referenceLibrary) {
    console.log("Reference list:");
    const references = referenceLibrary.entries();
    for (const reference of references) {
        const debracketedReference = reference[0].slice(1, reference[0].length - 1);
        console.log(`${reference[1].referenceId}. ${debracketedReference}`);
    }
}
function isWhiteSpace(str) {
    return str.match(/\s/);
}
function isOpenSquareBracket(str) {
    return str.match(/[[]/);
}
function formatGroupOfReferences(arrayOfRefsForFormatting) {
    // If less than three references, output references in current state
    if (arrayOfRefsForFormatting.length === 1 ||
        arrayOfRefsForFormatting.length === 2) {
        return arrayOfRefsForFormatting.toString();
    }
    else if (arrayOfRefsForFormatting.length > 2) {
        let outputString = "";
        let refsInDashedGroup = [];
        for (let i = 0; i < arrayOfRefsForFormatting.length; i++) {
            // This 'If' clause handles final ref in arrayOfRefs
            if (i + 1 === arrayOfRefsForFormatting.length) {
                // If final ref Id is only 1 more than penultimate...
                if (arrayOfRefsForFormatting[i] - arrayOfRefsForFormatting[i - 1] === 1) {
                    refsInDashedGroup.push(arrayOfRefsForFormatting[i]);
                    outputString = outputString.concat(`${refsInDashedGroup[0]}-${refsInDashedGroup[refsInDashedGroup.length - 1]}`);
                    refsInDashedGroup = [];
                    // If final ref Id is more than 1 more than penultimate...
                }
                else if (arrayOfRefsForFormatting[i] - arrayOfRefsForFormatting[i - 1] > 1) {
                    outputString = outputString.concat(refsInDashedGroup.toString());
                }
                // Handle in range situations
            }
            else if (i + 1 < arrayOfRefsForFormatting.length) {
                // Next reference is only one more than current reference
                if (arrayOfRefsForFormatting[i + 1] - arrayOfRefsForFormatting[i] === 1) {
                    refsInDashedGroup.push(arrayOfRefsForFormatting[i]);
                }
                // Next reference is more than one more than current reference
                if (arrayOfRefsForFormatting[i + 1] - arrayOfRefsForFormatting[i] > 1) {
                    refsInDashedGroup.push(arrayOfRefsForFormatting[i]);
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
refFormatter(inputText);
// Improvements
// - Strip all whitespace out to make identifying references more robust.
