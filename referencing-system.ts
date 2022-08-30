interface IReference {
  referenceId: number;
  locations: number[];
  referenceLength: number;
}

interface IReferenceInstance {
  nameYear: string;
  index: number;
}

const referenceLibrary = new Map();
const referenceInstanceLibrary = new Map();

// Keep track of groups of references
let groupOfReferencesForFormatting: number[] = [];

let startOfReferenceIndex: number = 0;
let startOfSectionIndex: number = 0;

// Keep track of the instance being worked on
declare var referenceInstanceCount: number;
referenceInstanceCount = 0;

let lastReferenceToBeCleared: number;

let remainingText = "";
let outputText = "";
let finalText = "";

// REGEX
const REFERENCE_IDENTIFICATION_REGEX = /\[(.+?)\]/g;

// INPUT
const inputText: string =
  "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";

function referenceExtractor(inputText: string) {
  // Keeping track of which reference was at which index
  let instanceCounter = 1;
  const referenceInstances = identifyReferences(inputText);
  for (const referenceInstance of referenceInstances) {
    const newReferenceInstance: IReferenceInstance = {
      nameYear: referenceInstance[0],
      index: referenceInstance.index!,
    };
    referenceInstanceLibrary.set(instanceCounter, newReferenceInstance);
    instanceCounter++;
  }

  console.log(referenceInstanceLibrary);
  // Run the text through some regex
  const rawReferences = identifyReferences(inputText);

  // Build a collection of references and their locations
  for (const rawReference of rawReferences) {
    if (recordExists(rawReference)) {
      const existingReference = referenceLibrary.get(rawReference[0]);
      const existingLocations = existingReference.locations;
      if (rawReference.index) {
        const newLocation = rawReference.index;
        existingLocations.push(newLocation);
        groupOfReferencesForFormatting.push(existingReference.referenceId + 1);
      }
    }
    if (!recordExists(rawReference)) {
      const newReference: IReference = {
        referenceId: referenceLibrary.size,
        locations: [rawReference.index!],
        referenceLength: rawReference[0].length,
      };
      referenceLibrary.set(rawReference[0], newReference);
      groupOfReferencesForFormatting.push(newReference.referenceId + 1);
    }
    remainingText = inputText.slice(
      rawReference.index! + rawReference[0].length + 1
    );
    // startOfReferenceIndex = rawReference.index!;
    identifyAdjacentReferences(remainingText);
    referenceInstanceCount++;
  }
  const referencesLeftToFormat =
    groupOfReferencesForFormatting.length > 0 ? true : false;

  if (referencesLeftToFormat) {
    clearReferenceGroupAndSaySomething();
  }

  console.log(referenceLibrary);
  console.log(finalText);
}

// Helper Functions
function identifyReferences(text: string) {
  return text.matchAll(REFERENCE_IDENTIFICATION_REGEX);
}

function recordExists(rawReference: RegExpMatchArray) {
  const reference = rawReference[0];
  if (referenceLibrary.get(reference) === undefined) {
    return false;
  } else {
    return true;
  }
}

function identifyAdjacentReferences(string) {
  if (!string) {
    return;
  }
  if (!isOpenSquareBracket(string[0])) {
    console.log("The next character was not a square bracket");
    clearReferenceGroupAndSaySomething();
  }
}

function clearReferenceGroupAndSaySomething() {
  if (referenceInstanceCount === 0) {
    startOfSectionIndex = 0;
    startOfReferenceIndex = referenceInstanceLibrary.get(1).index;
  } else {
    const previousReference = referenceInstanceLibrary.get(
      lastReferenceToBeCleared
    );
    const endOfPreviousReference =
      previousReference.index + previousReference.nameYear.length;
    startOfSectionIndex = endOfPreviousReference;
    startOfReferenceIndex = referenceInstanceLibrary.get(
      lastReferenceToBeCleared + 1
    ).index;
  }
  outputText = inputText.slice(startOfSectionIndex, startOfReferenceIndex);
  finalText = finalText.concat(outputText);
  const formattedGroup = formatGroupedReferences(
    groupOfReferencesForFormatting
  );
  finalText = finalText.concat(`(${formattedGroup})`);
  groupOfReferencesForFormatting = [];
  lastReferenceToBeCleared = referenceInstanceCount + 1;
}

function isWhiteSpace(str) {
  return str.match(/\s/);
}

function isOpenSquareBracket(str) {
  return str.match(/[[]/);
}

// WIPPPPP
function formatGroupedReferences(groupOfReferencesForFormatting: number[]) {
  if (
    groupOfReferencesForFormatting.length === 1 ||
    groupOfReferencesForFormatting.length === 2
  ) {
    return groupOfReferencesForFormatting.toString();
  } else if (groupOfReferencesForFormatting.length > 2) {
    let miniOutputString = "";
    let numbersInDashedGroup: number[] = [];
    for (let i = 0; i < groupOfReferencesForFormatting.length; i++) {
      // Handle end of range situations 
      if (i + 1 === groupOfReferencesForFormatting.length) {
        if (groupOfReferencesForFormatting[i] - groupOfReferencesForFormatting[i - 1] === 1) {
          numbersInDashedGroup.push(groupOfReferencesForFormatting[i])
          miniOutputString = miniOutputString.concat(`${numbersInDashedGroup[0]}-${numbersInDashedGroup[numbersInDashedGroup.length - 1]}`)
          numbersInDashedGroup = []
        } else if (groupOfReferencesForFormatting[i] - groupOfReferencesForFormatting[i - 1] > 1) {
          // Format the numbersInDashedGroup 
          miniOutputString = miniOutputString.concat(numbersInDashedGroup.toString())
        }
      // Handle in range situations
      } else if (i + 1 < groupOfReferencesForFormatting.length) {
        // Next reference is only one more than current reference
        if (groupOfReferencesForFormatting[i + 1] - groupOfReferencesForFormatting[i] === 1)  {
          numbersInDashedGroup.push(groupOfReferencesForFormatting[i])
        }
        // Next reference is more than one more than current reference
        if (groupOfReferencesForFormatting[i + 1] - groupOfReferencesForFormatting[i] > 1) {
          numbersInDashedGroup.push(groupOfReferencesForFormatting[i])
          if (numbersInDashedGroup.length > 2) {
            miniOutputString = miniOutputString.concat(`${numbersInDashedGroup[0]}-${numbersInDashedGroup[numbersInDashedGroup.length - 1]},`)
          numbersInDashedGroup = []
          } else if (numbersInDashedGroup.length <= 2) {
            miniOutputString = miniOutputString.concat(`${numbersInDashedGroup.toString()},`)
            numbersInDashedGroup = []
          }
        }
      }
    }
    return miniOutputString;
  }
}

referenceExtractor(inputText);

// Improvements

// - Strip all whitespace out to make identifying references more robust.