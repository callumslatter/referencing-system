// read the text in
var referenceLibrary = [];
var inputText = "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";
function referenceExtractor(inputText) {
    var referenceIdentificationRegex = /\[(.+?)\]/g;
    var squareBracketRegex = /[\[\]]/g;
    // Extract all references from the text
    var rawReferences = inputText.match(referenceIdentificationRegex);
    if (typeof rawReferences === null) {
        throw new Error("No matching expressions found.");
    }
    var extractedReferences = [];
    // Remove square brackets from all extracted references and append to extractedReferences array
    rawReferences === null || rawReferences === void 0 ? void 0 : rawReferences.forEach(function (reference) {
        var debracketedReference = reference.replace(squareBracketRegex, "");
        extractedReferences.push(debracketedReference);
    });
    return extractedReferences;
}
function referenceLibraryBuilder(extractedReferences) {
    extractedReferences.forEach(function (inputReference) {
        // Could be extracted into its own function
        var referenceExists = referenceLibrary.some(function (reference) {
            if (reference.nameYear === inputReference) {
                return true;
            }
            return false;
        });
        if (!referenceExists) {
            var reference = {
                id: referenceLibrary.length + 1,
                nameYear: inputReference
            };
            referenceLibrary.push(reference);
        }
    });
}
var extractedReferences = referenceExtractor(inputText);
referenceLibraryBuilder(extractedReferences);
console.log(referenceLibrary);
