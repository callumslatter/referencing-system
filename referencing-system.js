const referenceLibrary = [];
const referenceLocationLibrary = new Map();
// REGEX
const REFERENCE_IDENTIFICATION_REGEX = /\[(.+?)\]/g;
// INPUT
const inputText = "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";
// Helper Function
function identifyReferences(inputText) {
    return inputText.matchAll(REFERENCE_IDENTIFICATION_REGEX);
}
function referenceExtractor(inputText) {
    // Run the text through some regex
    const rawReferences = identifyReferences(inputText);
    // Build a collection of references and reference locations
    for (const rawReference of rawReferences) {
        // Expects reference[0] should be string in format [Name 0000]
        const existingReference = referenceLibrary.some((reference) => {
            if (reference.nameYear === rawReference[0]) {
                reference.locations?.push(rawReference.index);
                return true;
            }
            return false;
        });
        if (!existingReference) {
            const reference = {
                referenceId: referenceLibrary.length + 1,
                nameYear: rawReference[0],
                locations: [rawReference.index],
            };
            referenceLibrary.push(reference);
        }
    }
    referenceLibrary.forEach((reference) => {
        reference.locations?.forEach((location) => {
            const referenceLocation = {
                referenceId: reference.referenceId,
                index: location,
                accountedFor: false,
                referenceLength: reference.nameYear.length
            };
            referenceLocationLibrary.set(referenceLocationLibrary.size, referenceLocation);
        });
    });
}
function textFormatter(inputText) {
    let inputTextCopy = inputText.slice();
    console.log(referenceLibrary);
    console.log(referenceLocationLibrary);
    let groupOfReferences = [];
    referenceLocationLibrary.forEach((referenceLocation) => {
        if (referenceLocation.accountedFor !== true) {
            const referenceToBeAddedToGroup = referenceLibrary.find(element => element.referenceId === referenceLocation.referenceId);
            if (referenceToBeAddedToGroup) {
                groupOfReferences.push(referenceToBeAddedToGroup);
            }
        }
    });
    //   let matches = identifyReferences(inputText);
    //   for (const match of matches) {
    //     // Expects reference[0] should be string in format [Name 0000]
    //     const foundReference = referenceLibrary.filter((value) => {
    //       return value.nameYear === match[0].toString();
    //     });
    //     if (match.index !== undefined) {
    //       groupOfReferences.push(foundReference[0]);
    //       const remainingText = inputText
    //         .slice(match.index + match[0].length)
    //         .trimStart();
    //       const firstCharacter = remainingText[0];
    //       if (firstCharacter && isOpenSquareBracket(firstCharacter)) {
    //         console.log("This is also a reference");
    //       }
    //     }
    //     // if inputText[match.index]
    //     inputTextCopy = inputTextCopy.replace(
    //       foundReference[0].nameYear,
    //       `(${foundReference[0].id})`
    //     );
    //   }
    //   console.log(inputTextCopy);
}
function isOpenSquareBracket(str) {
    return str.match(/[[]/);
}
referenceExtractor(inputText);
textFormatter(inputText);
