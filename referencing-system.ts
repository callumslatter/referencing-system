// read the text in

// first pass 

// create a references array
// if reference identified
    // check if reference already exists
    // if not create a reference and create a reference id

// second pass - with a copy of the text

// if reference identified 
    // add to a mini array for formatting purposes
    // check if the next non space character is a valid reference too
    // If it is, add it to the mini array for formatting purposes  
    // If not, then run mini array through formatter
        // Apply the rules laid out in the brief 
        // Replace the references with the formatted arrays




interface Reference {
    id: number;
    nameYear: string;
}

const references: Reference[] = []

const inputText: string = "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]"

function referenceExtractor(inputText: string) {
    const regex = `\[(.+?)\]`
    const indexOfFirst = inputText.search(regex);
    console.log(indexOfFirst)
}

referenceExtractor(inputText)


