// Author: @313ctr0nz on Github, @ms360 on twitter

// Inspired by @SithNode.Eth on Twitter 

// Designed to work with iOS widgets + Scriptable

// Instructions:
//  Copy this code into the Scriptable editor
//  Add wallet addresses to Widget Scriptable Parameter
//      separate multiple addresses with comma ",", 
//      no quotes please

// TODO 
// Add currency conversion
// Add multiple wallet support

// change to your currency symbol
const currency = "USD";

// max number of protocols to display
const maxnum = 6; 

async function displayWidget(combined) {
    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");

    var count = 0;
    while (count < combined.length && count < maxnum) {
        var element = combined[count++];

        data = {
            "chain"     : element[page][1].chain,
            "symbol"    : element[page][1].symbol,
            "amount"    : element[page][1].amount,  
            "price"     : element[page][1].price,
            "total"     : element[page][1].price * element[page][1].amount,
            "logo_url"  : element[page][1].logo_url
        } 
        console.log(data);
    
        let i = new Request(data.logo_url);
        let image = widget.addImage(await i.loadImage());
        image.centerAlignImage();
        image.imageSize = new Size(30,30)
        widget.addSpacer(8);
    
        const chaintext = widget.addText(`Chain: ${data.chain}`);
        chaintext.textColor = Color.white();
        chaintext.font = new Font("Courier", 14);
        widget.addSpacer(2);
    
        const amounttext = widget.addText(`${data.symbol}:  ${data.amount.toFixed(2)}`);
        amounttext.textColor = Color.white();
        amounttext.font = new Font("Courier", 14);
        widget.addSpacer(2);
    
        const pricetext = widget.addText(`Price: ${data.price.toFixed(2)}`);
        pricetext.textColor = Color.white();
        pricetext.font = new Font("Courier", 14);
        widget.addSpacer(2);
    
        // TODO: currency conversion
        const usdtext = widget.addText(`${currency}:   ${dataj.total.toFixed(2)}`);
        usdtext.textColor = Color.white();
        usdtext.font = new Font("Courier", 14);    
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

// combine common currencies between wallets
function combineCurrencies(list) {
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
            } else {
                if ("supply_token_list" in element.portfolio_item_list[0].detail) {
                    Object.assign(dict, { [element.id] : element.portfolio_item_list[0].detail.supply_token_list[0] }) 
                } else if ("token_list" in element.portfolio_item_list[0].detail) {
                    Object.assign(dict, { [element.id] : element.portfolio_item_list[0].detail.token_list[0] }) 
                }
            }
        })
    });
    return Object.entries(dict);
}

async function main() {
    if (args.widgetParameter.includes(",")) {
        // Handle multiple wallet addresses
    } else {
        var wallets = [args.widgetParameter]; 
    }

    let walletProtoList = await getWalletProtoList(wallets);
    console.log(walletProtoList);

    let walletProtoData = await getWalletProtoData(walletProtoList);
    console.log(walletProtoData);
    
    let combined = combineCurrencies(walletProtoData);
    console.log(combined);

    await displayWidget(combined);
}

/* Main code starts here */
main();


