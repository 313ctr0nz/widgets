// Inspired by @SithNode.Eth on Twitter 
// add wallet addresses to Widget Scriptable Parameter
// separate multiple addresses with comma ",", 
// no quotes please

// TODO 
// Handle multiple wallet addresses
// Add pagination + buttons
// Filter out shit coins
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
var i;
var img;
while (n < wallets.length) {
    const address = wallets[n];
    if (config.runsInWidget) { // print address
        const title = widget.addText(address);
        title.textColor = Color.white();
        title.textOpacity = 0.8;
        title.font = new Font("Helvetica-Light ", 10);
        widget.addSpacer(4);
    }
    var balance_url = "https://openapi.debank.com/v1/user/token_list?is_all=true&id="+address;
    var req = new Request(balance_url);
    const data = await req.loadJSON();
    console.log(data);
    var resp = data;
    resp.forEach(token => {
        if (config.runsInWidget) { // print address
            i = new Request(token.logo_url);
            img = await i.loadImage();
            let image = widget.addImage(img);
            image.leftAlignImage();
            image.imageSize = new Size(30,30)
        
            const strongtext = widget.addText(`${token.symbol}: ${token.amount.toFixed(2)}`);
            strongtext.textColor = Color.white();
            strongtext.font = new Font("Courier", 14);
            widget.addSpacer(2);
            const usdtext = widget.addText(`USD: ${(token.amount * token.price).toFixed(2)}`);
            usdtext.textColor = Color.white();
            usdtext.font = new Font("Courier", 14);    
            widget.addSpacer(2);
        }
    });
    n += 1;
}

if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium()
}