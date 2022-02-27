// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

// Designed to work with iOS widgets + Scriptable
// Donations welcome @ 0xE34b794D84922A21E2cb1F7f360A89Ff65DcC9e9 
// ($ETH/$AVAX/$FTM/$AETH/$MATIC/$CRO/$STRONG)

// please ensure data source supports exact tokens entered below
// for coingecko, refer to https://api.coingecko.com/api/v3/coins/list
//    use the ID field
// for dexscreener, TBD
tokens =  [
    "strong",
    "cubo",
    "bitcoin",
    "ethereum",
    "matic-network"
];

// insert currency of choice for token valuation
currency = "usd";

// chose "cg" for coingecko
// chose "dx" for dexscreener (coming soon)
datasource = "cg";

// function displayError() {
//     var widget = new ListWidget();
//     widget.backgroundColor=new Color("#222222");
//     let g = new LinearGradient()
//     g.locations = [0, 1]
//     g.colors = [
//         new Color("#0a1860"),
//         new Color("#000000")
//     ]
//     widget.backgroundGradient = g
//     widget.setPadding(0, 10, 0, 10)

//     let wtitle = widget.addText(`Error`);
//     wtitle.font = Font.mediumSystemFont(14)
//     wtitle.textOpacity = 1
//     wtitle.textColor = Color.white()

//     Script.setWidget(widget);
//     Script.complete();
//     widget.presentMedium();
// }

async function displayWidget(tokens, rate) {
    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");
    let g = new LinearGradient()
    g.locations = [0, 1]
    g.colors = [
        new Color("#0a1860"),
        new Color("#000000")
    ]
    widget.backgroundGradient = g
    widget.setPadding(-8, 15, 0, 15)

    var count = 0;
    while (count < tokens.length) {
        var token = tokens[count++];

        data = {
            "symbol"    : token.symbol,
            "price"     : token.current_price,
            "logo_url"  : token.image
        } 
        console.log(data);
    
        let i = new Request(data.logo_url);
        let image = await i.loadImage();

        let titleStack = widget.addStack()
        titleStack.layoutHorizontally()
        titleStack.centerAlignContent()
        if (image != null) {
          let wimage = titleStack.addImage(image)
          wimage.imageSize = new Size(30, 30)
          titleStack.addSpacer(null);
        }

        let dataStack = titleStack.addStack()
        dataStack.layoutVertically()
        dataStack.centerAlignContent()   
        dataStack.addSpacer(7)

        let wtitle = dataStack.addText(`${(data.price/rate).toFixed(2)} ${currency.toUpperCase()}`);
        wtitle.font = Font.mediumSystemFont(20)
        wtitle.textOpacity = 1
        wtitle.textColor = Color.white()
        wtitle.lineLimit = 1

        let moneyStack = dataStack.addStack()
        moneyStack.layoutHorizontally() 
        moneyStack.topAlignContent()
        
        moneyStack.addSpacer(null);
        
        let totalStack = titleStack.addStack()
        totalStack.layoutHorizontally()
        totalStack.centerAlignContent()
    }

    Script.setWidget(widget);
    Script.complete(); 
    widget.presentMedium();
}


async function getExchangeRate() {
    url = "https://api.exchangerate.host/latest?base=" + currency
    const req = new Request(url);
    res = await req.loadJSON();
    return (res.rates.USD)
}

// get data from debank for all protocols by walllet
async function getCGData() {
    console.log(tokens)
    url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokens.join(',')}&per_page=100&page=1&sparkline=false`
    const req = new Request(url);
    res = await req.loadJSON();
    // console.log(res);
    return (res)
}
 
/* Main code starts here */
console.log("hi") 

var rate = await getExchangeRate();
console.log(rate);  

var tokendata; 
if (datasource == "cg") {
    console.log("coingecko")
    tokendata = await getCGData();
} 

await displayWidget(tokendata, rate); 
