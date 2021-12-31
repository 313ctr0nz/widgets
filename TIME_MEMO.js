// Inspired by @SithNode.Eth on Twitter 
// add wallet addresses to Widget Scriptable Parameter
// separate multiple addresses with comma ",", 
// no quotes please

// TODO 
// Handle multiple wallet addresses
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

var n = 0;
var usd = 0;
var memo = 0;
var i;
var img;
while (n < wallets.length) {
    var balance_url = 'https://openapi.debank.com/v1/user/protocol?id=' + wallets[n] + '&protocol_id=avax_wonderland' ;
    const req = new Request(balance_url);
    const data = await req.loadJSON();
    console.log(data);
    var resp = data;
    var total_cnt = resp['portfolio_item_list'].length;
    console.log(total_cnt);
    var i =0;
    while (i < total_cnt) {
        usd = usd + resp['portfolio_item_list'][i]['stats']['asset_usd_value'];
        memo = memo + resp['portfolio_item_list'][i]['detail']['supply_token_list'][0]['amount'];

        i = new Request(resp['portfolio_item_list'][i]['detail']['supply_token_list'][0]['logo_url']);
        img = await i.loadImage();
    
        i = i+1;
    }
    n =n +1;
}
if (config.runsInWidget) {
    let image = widget.addImage(img);
    image.centerAlignImage();
    image.imageSize = new Size(30,30)
    widget.addSpacer(4);

    const title = widget.addText("Staked Time balance");
    title.textColor = Color.white();
    title.textOpacity = 0.8;
    title.font = new Font("Helvetica-Light ", 10);
    widget.addSpacer(4);
    const strongtext = widget.addText(`MEMO: ${memo.toFixed(2)}`);
    strongtext.textColor = Color.white();
    strongtext.font = new Font("Courier", 14);
    widget.addSpacer(2);
    const usdtext = widget.addText(`USD: ${usd.toFixed(2)}`);
    usdtext.textColor = Color.white();
    usdtext.font = new Font("Courier", 14);
    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium()
}
