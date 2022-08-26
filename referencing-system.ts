// second pass - with a copy of the text

// if reference identified
// add to a mini array for formatting purposes
// check if the next non space character is a valid reference too
// If it is, add it to the mini array for formatting purposes
// If not, then run mini array through formatter
// Apply the rules laid out in the brief
// Replace the references with the formatted arrays

interface IReference {
  id: number;
  nameYear: string;
}

const referenceLibrary: IReference[] = [];

// Declaring regexes
const referenceIdentificationRegexGlobal = /\[(.+?)\]/g;
const referenceIdentificationRegex = /\[(.+?)\]/;
const squareBracketRegex = /[\[\]]/g;

const inputText: string =
  "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";

// function identifyReferences(inputText: string) {
//     const matches = inputText.matchAll(referenceIdentificationRegexGlobal)
// }

function referenceExtractor(inputText: string) {
  const extractedReferences: string[] = [];

  // Extract all references from the text
  const rawReferences = inputText.match(referenceIdentificationRegexGlobal);
  if (typeof rawReferences === null) {
    throw new Error("No matching expressions found.");
  }

  // Append to extractedReferences 
  rawReferences?.forEach((reference) => {
    extractedReferences.push(reference);
  });

  referenceLibraryBuilder(extractedReferences);
}

function referenceLibraryBuilder(extractedReferences: string[]) {
  extractedReferences.forEach((inputReference) => {
    // Could be extracted into its own function
    const referenceExists = referenceLibrary.some((reference) => {
      if (reference.nameYear === inputReference) {
        return true;
      }
      return false;
    });

    if (!referenceExists) {
      const reference: IReference = {
        id: referenceLibrary.length + 1,
        nameYear: inputReference,
      };
      referenceLibrary.push(reference);
    }
  });
}


referenceExtractor(inputText);

function textFormatter(inputText: string) {
    let inputTextCopy = inputText.slice()
    const matches = inputTextCopy.matchAll(referenceIdentificationRegexGlobal)
    for (const match of matches) {
        console.log(`Found ${match[0]}`)
        const foundReference = referenceLibrary.filter((reference) => {
            return (reference.nameYear === match[0].toString()) 
        })
        console.log(foundReference);
        inputTextCopy = inputTextCopy.replace(foundReference[0].nameYear, `(${foundReference[0].id})`)
    }
    console.log(inputTextCopy)
}

console.log(`This is the referenceLibrary: ${JSON.stringify(referenceLibrary, null, 2)}`);

textFormatter(inputText)
