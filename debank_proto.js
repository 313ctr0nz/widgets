// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Author: @313ctr0nz on Github, @ms360 on twitter

// Inspired by @SithNode.Eth on Twitter 

// Designed to work with iOS widgets + Scriptable
// Donations welcome @ 0xE34b794D84922A21E2cb1F7f360A89Ff65DcC9e9 
// ($ETH/$AVAX/$FTM/$AETH/$MATIC/$CRO/$STRONG)

// Instructions:
//  Copy this code into the Scriptable editor
//  Add wallet addresses to Widget Scriptable Parameter
//      separate multiple addresses with comma ",", 
//      no quotes please
// Change the currency below to the 3 character standard currency code

// change to your currency symbol
const currency = "USD";

// max number of protocols to display
const maxnum = 8; 

function compare( a, b ) {
  if ( a[1].total < b[1].total ){
    return 1;
  }
  if ( a[1].total > b[1].total ){
    return -1;
  }
  return 0;
}

function displayError() {
    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");
    let g = new LinearGradient()
    g.locations = [0, 1]
    g.colors = [
        new Color("#0a1860"),
        new Color("#000000")
    ]
    widget.backgroundGradient = g
    widget.setPadding(0, 10, 0, 10)

    let wtitle = widget.addText(`Error parsing wallet addresses`);
    wtitle.font = Font.mediumSystemFont(16)
    wtitle.textOpacity = 1
    wtitle.textColor = Color.white()

    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
}

async function displayWidget(combined) {
    combined = combined.sort(compare);

    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");
    let g = new LinearGradient()
    g.locations = [0, 1]
    g.colors = [
        new Color("#0a1860"),
        new Color("#000000")
    ]
    widget.backgroundGradient = g
    widget.setPadding(0, 10, 0, 10)

    var count = 0;
    while (count < combined.length && count < maxnum) {
        var element = combined[count++];

        data = {
            "chain"     : element[1].chain,
            "symbol"    : element[1].symbol,
            "amount"    : element[1].amount,  
            "price"     : element[1].price,
            "total"     : element[1].total,
            "logo_url"  : element[1].logo_url
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
          titleStack.addSpacer(10);
        }

        let dataStack = titleStack.addStack()
        dataStack.layoutVertically()
        dataStack.centerAlignContent()

        let wtitle = dataStack.addText(`${data.price.toFixed(2)}`);
        wtitle.font = Font.mediumSystemFont(16)
        wtitle.textOpacity = 1
        wtitle.textColor = Color.white()
        wtitle.lineLimit = 1

        let moneyStack = dataStack.addStack()
        moneyStack.layoutHorizontally()
        moneyStack.centerAlignContent()

        let wtitle2 = moneyStack.addText(`${data.symbol}: ${data.amount.toFixed(2)}`);
        wtitle2.font = Font.mediumSystemFont(16)
        wtitle2.textOpacity = 1
        wtitle2.textColor = Color.white()
        wtitle2.lineLimit = 1

        moneyStack.addSpacer(10);

        let wtitle3 = moneyStack.addText(`${currency}: ${data.total.toFixed(2)}`);
        wtitle3.font = Font.mediumSystemFont(16)
        wtitle3.textOpacity = 1
        wtitle3.textColor = Color.white()
        wtitle3.lineLimit = 1

    }

    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
}

// gets protocols from debank for all wallets
async function getWalletProtoList(wallets) {
    root_url = 'https://openapi.debank.com/v1/user/simple_protocol_list?id=';
    var walletList = [];
    var n = 0;
    while (n < wallets.length) {
        const req = new Request(root_url + wallets[n]);
        const json = await req.loadJSON();
        walletList.push({ "wallet" : wallets[n], "result" : json })
        n++;
    }
    // console.log(walletList)
    return walletList;        
}

// get data from debank for all protocols by walllet
async function getWalletProtoData(list) {
    dataObj = []
    root_url = 'https://openapi.debank.com/v1/user/protocol?protocol_id=';

    return await Promise.all(list.map(async(info, index) => { 
        return await Promise.all(info.result.map(async(proto) => {
            const req = new Request(root_url + proto.id + "&id=" + list[index].wallet);
                return await req.loadJSON();
        }))
    }))
}

async function getExchangeRate() {
    url = "https://api.exchangerate.host/latest?base=" + currency
    const req = new Request(url);
    res = await req.loadJSON();
    return (res.rates.USD)
}

// combine common currencies between wallets
async function combineCurrencies(list) {
    var rate = await getExchangeRate();
    var dict = {};
    list.forEach(proto => {
        proto.forEach(element => {
            // console.log(element)
            if (element.id in dict) {
                if ("supply_token_list" in element.portfolio_item_list[0].detail) {
                    dict[element.id].amount += element.portfolio_item_list[0].detail.supply_token_list[0].amount;
                } else if ("token_list" in element.portfolio_item_list[0].detail) {
                    dict[element.id].amount += element.portfolio_item_list[0].detail.token_list[0].amount;
                }
                dict[element.id].total = dict[element.id].price * dict[element.id].amount / rate;
            } else {
                if ("supply_token_list" in element.portfolio_item_list[0].detail) {
                    Object.assign(dict, { [element.id] : element.portfolio_item_list[0].detail.supply_token_list[0] }) 
                } else if ("token_list" in element.portfolio_item_list[0].detail) {
                    Object.assign(dict, { [element.id] : element.portfolio_item_list[0].detail.token_list[0] }) 
                }
                dict[element.id].total = dict[element.id].price * dict[element.id].amount / rate;
            }
        })
    });
    return Object.entries(dict);
}

/* Main code starts here */
var wallets = []

if (args) {
  if (args.widgetParameter)
    if (args.widgetParameter.includes(",")) {
        wallets = args.widgetParameter.split(",");
    } else {
        wallets = [args.widgetParameter]; 
    }
} else {
  displayError(); 
}
 
console.log(wallets)
if (wallets.length > 0) {
    let walletProtoList = await getWalletProtoList(wallets);
    // console.log(walletProtoList);

    let walletProtoData = await getWalletProtoData(walletProtoList);
    // console.log(walletProtoData);

    let combined = await combineCurrencies(walletProtoData);
    // console.log(combined);

    await displayWidget(combined);
} else {
    displayError(); 
}

