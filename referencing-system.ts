interface IReference {
    referenceId: number;
    locations?: number[];
    referenceLength: number;
  }
  
  interface IReferenceInstances {
    index: number;
    referenceId: number;
    accountedFor: boolean;
    referenceLength: number;
  }
  
  const referenceLibrary = new Map();
  const referenceInstanceLibrary = new Map();

  // Keep track of groups of references
  let groupOfReferencesForFormatting: number[] = []
  
  // Keep track of the instance being worked on
  declare var referenceInstanceCount: number
  referenceInstanceCount = 0

  let remainingText = ""
  
  // REGEX
  const REFERENCE_IDENTIFICATION_REGEX = /\[(.+?)\]/g;
  
  // INPUT
  const inputText: string =
    "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]";
  
  // Helper Function
  function identifyReferences(inputText: string) {
    return inputText.matchAll(REFERENCE_IDENTIFICATION_REGEX);
  }
  
  function recordExists(rawReference: RegExpMatchArray) {
    const reference = rawReference[0];
    if (referenceLibrary.get(reference) === undefined) {
      return false;
    } else {
      return true;
    }
  }
  
  function referenceExtractor(inputText: string) {
    // Run the text through some regex
    const rawReferences = identifyReferences(inputText);
  
    // rawReference shape
    //   [
    //   '[Auchinleck 1992]',
    //   'Auchinleck 1992',
    //   index: 521,
    //   input: "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]",
    //   groups: undefined
    //   ]

    // Check for adjacent references here 
    
    // Build a collection of references and their locations
    for (const rawReference of rawReferences) {
      if (recordExists(rawReference)) {
        const existingLocations = referenceLibrary.get(rawReference[0]).locations;
        if (rawReference.index) {
          const newLocation = rawReference.index;
          existingLocations.push(newLocation);
        }
      }
      if (!recordExists(rawReference)) {
        const newReference: IReference = {
          referenceId: referenceLibrary.size,
          locations: [rawReference.index!],
          referenceLength: rawReference[0].length
        };
        referenceLibrary.set(rawReference[0], newReference);
      }
      remainingText = inputText.slice(rawReference.index! + rawReference[0].length + 1)
      identifyAdjacentReferences(remainingText)
      referenceInstanceCount++
    }
  
    const referencesLeftToFormat = groupOfReferencesForFormatting.length > 0 ? true : false

    if (referencesLeftToFormat) {
      console.log(groupOfReferencesForFormatting)
      groupOfReferencesForFormatting = [];
    }
  
    console.log(referenceLibrary);
  }
  
  function identifyAdjacentReferences(string) {
    if(!string){
      return;
    }
    if(!isOpenSquareBracket(string[0])) {
      console.log("The next character was not a square bracket")
      groupOfReferencesForFormatting.push(referenceInstanceCount)
      clearReferenceGroupAndSaySomething()
    }
    if(isOpenSquareBracket(string[0])) {
      console.log("The next character was a square bracket")
      groupOfReferencesForFormatting.push(referenceInstanceCount)
    } 
  }

  function clearReferenceGroupAndSaySomething() {
    console.log(groupOfReferencesForFormatting)
    groupOfReferencesForFormatting = []
    console.log("Doing something!")
  }
  
  //   // TODO:
  
  //   // For each reference, check if the character after index + plus character length meets the following condition
  //  // If white space, check next character, 
  //      If not whitespace, is an open square bracket? If yes, Add it to the group for fromatting, mark instance as having been accounted for
  //      If not whitespace, is any other character => format anything that is already in the group for formatting. 
  // }
  
  function isWhiteSpace(str) {
    return str.match(/\s/)
  }
  
  function isOpenSquareBracket(str) {
    return str.match(/[[]/);
  }
  
  referenceExtractor(inputText);
  // textFormatter(inputText);
  

  // Improvements 

  // - Strip all whitespace out to make identifying references more robust.