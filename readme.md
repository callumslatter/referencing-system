# Referencer

Referencer is an API written in TypeScript that takes texts that contain academic references, and applies a 
referencing system. 

## Brief 

Given the text below, extract the references and apply a numeric referencing system.

The cited work is identifiable by square brackets containing a surname and year of publication. 
Assign an incremental number to each cited work in order of appearance in the text.

The format of the citation is comma or hyphen separated numbers, surrounded by parenthesis. 
Numbers should be comma separated _unless_ they represent an incremental-by-one range that is greater than one: 
    "1" and "2" should be (1,2), but "1", "2", "3", should be (1-3). 
Citations can include a combination of comma and hyphen separated numbers:
     "1", "2", "3", "7", "10", "11", "12" should return (1-3,7,10-12)

### Stretch Goal

Create an API that you can send unformatted text to, and have it return the formatted text and the references list (a map containing the corresponding reference number and the author/year of the original reference).

### Example Input Text

"Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]"

## Installation

Clone this repo into a new folder, and in this new folder run `yarn install`.

```bash
# Create a new folder for the project
mkdir referencing-system
cd referencing-system

# Clone this repo (https://github.com/callumslatter/referencing-system) into the current file

# Install relevant dependencies
yarn install
```

## Usage

To start the API, run the following commands.

```bash
# To ensure that the build is correct
yarn build

# To start the API 
yarn start
```

(If making changes, you may want to make use of `yarn run dev` so you don't have to rebuild every time)

To change the port at which the server will listen at, see `src/server.ts`.

### Endpoints

There is only one route and method available:
```bash
POST /formatter
```

`POST /formatter` expects the following input:
```json 
{
    "inputText": "Replace this string with the text you want to format."
}
```

`POST /formatter` returns output in the following shape:
```json
{
    "formattedText": "Beautifully formatted text",
    "references": [
        "1. Author1 Year",
        "2. Author2 Year",
        "3. Author3 Year",
    ]
}
```
#### Example

Input: 
```json
{
    "inputText": "Mollitia quasi dolorem molestiae ut est voluptates quidem.[Fitt 2011] Natus sit dolore eveniet modi dolores dolore.[Auchinleck 1992] [Wix 2012] Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.[Elcom 2004] [Lindroos 2007] [O'Sheeryne 2004] Iste aut deleniti maiores aliquam asperiores illum consectetur.[Lindroos 2007] [Webben 1987] [Smithin 2004] [Brambill 2001] Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.[Auchinleck 1992] [Wix 2012] [Lindroos 2007] [Smithin 2004] [Brambill 2001] [Varvell 2011]"
}
```
Returns: 
```json
{
    "formattedText": "Mollitia quasi dolorem molestiae ut est voluptates quidem.(1) Natus sit dolore eveniet modi dolores dolore.(2,3) Voluptatem vel vel officiis recusandae hic. Sit esse eaque quisquam provident odit et quis nostrum. Dolores ea maiores.(4-6) Iste aut deleniti maiores aliquam asperiores illum consectetur.(5,7-9) Ut in et voluptatem sit odit laborum. Veritatis aut reiciendis quasi mollitia esse qui.(2,3,5,8-10)",
    "references": [
        "1. Fitt 2011",
        "2. Auchinleck 1992",
        "3. Wix 2012",
        "4. Elcom 2004",
        "5. Lindroos 2007",
        "6. O'Sheeryne 2004",
        "7. Webben 1987",
        "8. Smithin 2004",
        "9. Brambill 2001",
        "10. Varvell 2011"
    ]
}
```