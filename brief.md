## Brief

Given the text below, extract the references and apply a numeric referencing system.

The cited work is identifiable by square brackets containing a surname and year of publication. 
Assign an incremental number to each cited work in order of appearance in the text.

The format of the citation is comma or hyphen separated numbers, surrounded by parenthesis. 
Numbers should be comma separated _unless_ they represent an incremental-by-one range that is greater than one: 
    "1" and "2" should be (1,2), but "1", "2", "3", should be (1-3). 
Citations can include a combination of comma and hyphen separated numbers:
     "1", "2", "3", "7", "10", "11", "12" should return (1-3,7,10-12)

## Stretch

Create an API that you can send unformatted text to, and have it return the formatted text and the references list (a map containing the corresponding reference number and the author/year of the original reference).

## Text

"Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]"


// if reference identified
// add to a mini array for formatting purposes
// check if the next non space character is a valid reference too
// If it is, add it to the mini array for formatting purposes
// If not, then run mini array through formatter
// Apply the rules laid out in the brief
// Replace the references with the formatted arrays
