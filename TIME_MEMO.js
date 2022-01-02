// Inspired by @SithNode.Eth on Twitter 
// Designed to work with iOS widgets + Scriptable

// Instructions:
//  Copy this code into the Scriptable editor
//  Add wallet addresses to Widget Scriptable Parameter
//      separate multiple addresses with comma ",", 
//      no quotes please

// This script cab be copied and modified to fetch any tokens
// Just change the params object below 
// Feel free to contribute to the repository with a pull request

// TODO 
// Handle multiple wallet addresses
// Add currency conversion

params = {
    "currency"      : "USD",                    // currency to display
    "protocol_id"   : "avax_wonderland",        // debank protocol ID
    "header_text"   : "Staked Time balance",    // label 
    "token_disp"    : "MEMO",                   // token display label
    "location"      : "supply_token_list"       // location in schema for data
}

// renders dataObj in widget
function displayData(widget, dataObj) {
    let image = widget.addImage(dataObj.img);
    image.centerAlignImage();
    image.imageSize = new Size(30,30)
    widget.addSpacer(8);

    const title = widget.addText(params.header_text);
    title.textColor = Color.white();
    title.textOpacity = 0.8;
    title.font = new Font("Helvetica-Light ", 10);
    widget.addSpacer(4);

    const pricetext = widget.addText(`Price: ${dataObj.price.toFixed(2)}`);
    pricetext.textColor = Color.white();
    pricetext.font = new Font("Courier", 14);
    widget.addSpacer(2);

    const strongtext = widget.addText(`${params.token_disp}:  ${dataObj.token_val.toFixed(2)}`);
    strongtext.textColor = Color.white();
    strongtext.font = new Font("Courier", 14);
    widget.addSpacer(2);

    // TODO: currency conversion
    const usdtext = widget.addText(`${params.currency}:   ${dataObj.fiat_val.toFixed(2)}`);
    usdtext.textColor = Color.white();
    usdtext.font = new Font("Courier", 14);

    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
}

// gets data from debank for wallets
async function getData(wallets) {
    dataObj = {
        "fiat_val"  : 0,
        "token_val" : 0,
        "price"     : 0,
        "img"       : null
    };
    
    var n = 0;
    var i;
    while (n < wallets.length) {
        var balance_url = 'https://openapi.debank.com/v1/user/protocol?id=' + wallets[n] + '&protocol_id=' + params.protocol_id;
        const req = new Request(balance_url);
        const data = await req.loadJSON();
        console.log(data);
        var resp = data;
        var total_cnt = resp['portfolio_item_list'].length;
        console.log(total_cnt);
        var i =0;
        while (i < total_cnt) {
            dataObj.fiat_val  = dataObj.fiat_val + resp['portfolio_item_list'][i]['stats']['asset_usd_value'];
            dataObj.token_val = dataObj.token_val + resp['portfolio_item_list'][i]['detail'][params.location][0]['amount'];
            dataObj.price = resp['portfolio_item_list'][i]['detail']['supply_token_list'][0]['price'];
    
            // TODO - we only need to download this once
            i = new Request(resp['portfolio_item_list'][i]['detail'][params.location][0]['logo_url']);
            dataObj.img = await i.loadImage();
        
            i = i+1;
        }
        n =n +1;
    }
    return dataObj;    
}

/* Main code starts here */

var widget;
if (config.runsInWidget) {
    widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");
}

if (!(args.widgetParameter.includes("0x"))) {
    const title = widget.addText("invalid wallet parameter");
    title.textColor = Color.white();
    title.textOpacity = 0.8;
    title.font = new Font("Helvetica-Light ", 10);
    widget.addSpacer(4);
}

var wallets = [];

if (args.widgetParameter.includes(",")) {
    // Handle multiple wallet addresses
} else {
    wallets = [args.widgetParameter]; 
}

dataObj = await getData(wallets);

if (config.runsInWidget) {
    displayData(widget, dataObj);
}
