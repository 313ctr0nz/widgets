// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

// Designed to work with iOS widgets + Scriptable
// Donations welcome @ 0xE34b794D84922A21E2cb1F7f360A89Ff65DcC9e9 
// ($ETH/$AVAX/$FTM/$AETH/$MATIC/$CRO/$STRONG)

// please ensure data source supports exact tokens entered below
// for coingecko, refer to https://api.coingecko.com/api/v3/coins/list
//      use the ID field
// for dexscreener, TBD

// if you are holding tokens, 
//      provide the amount of tokens and the value on the date or purchase for P&L
//      this script will calculate profit and loss from current investment 
//      based on real time price information
hodl_token_info =  [
    { "name" : "bitcoin",          "amount" : 5.5,     "value" : 1500  }, 
    { "name" : "cubo",             "amount" : 50.5,    "value" : 10    }, 
    { "name" : "ethereum",         "amount" : 25.5,    "value" : 4500  }, 
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
        // console.log(token)

        var hodl = hodl_token_info.filter(obj => { return obj.name == token.id });
        console.log(hodl[0])
  
        data = {
            "id"        : token.id,
            "symbol"    : token.symbol,
            "price"     : token.current_price,
            "logo_url"  : token.image,
            "amount"    : hodl[0].amount,
            "value"     : hodl[0].value,
            "total"     : (token.current_price * hodl[0].amount) - (hodl[0].value * hodl[0].amount)  
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
        
        let wtitle2 = moneyStack.addText(`${data.amount.toFixed(2)} | ${data.symbol}`);
        wtitle2.font = Font.mediumSystemFont(9)
        wtitle2.textOpacity = 1
        wtitle2.textColor = Color.lightGray()
        wtitle2.lineLimit = 1

        moneyStack.addSpacer(null);
        
        let totalStack = titleStack.addStack()
        totalStack.layoutHorizontally()
        totalStack.centerAlignContent()

        let wtitle3 = totalStack.addText(`${data.total.toFixed(2)} ${currency}`);
        wtitle3.font = Font.mediumSystemFont(12)
        wtitle3.textOpacity = 1
        wtitle3.textColor = (data.total > 0) ? Color.green() : Color.red();
        wtitle3.lineLimit = 1
       
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
    console.log(hodl_token_info)
    var tokennames = [];
    hodl_token_info.forEach(token => {
        tokennames.push(token.name)
    })
    url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokennames.join(',')}&per_page=100&page=1&sparkline=false`
    const req = new Request(url);
    res = await req.loadJSON();
    // console.log(res);
    return (res)
}
 
/* Main code starts here */
// console.log("hi") 

var rate = await getExchangeRate();
// console.log(rate);  

var tokendata; 
if (datasource == "cg") {
    // console.log("coingecko")
    tokendata = await getCGData();
} 

await displayWidget(tokendata, rate); 
