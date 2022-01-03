// Author: @313ctr0nz on Github, @ms360 on twitter

// Inspired by @SithNode.Eth on Twitter 

// Designed to work with iOS widgets + Scriptable

// Instructions:
//  Copy this code into the Scriptable editor
//  Add wallet addresses to Widget Scriptable Parameter
//      separate multiple addresses with comma ",", 
//      no quotes please

// TODO 
// add scriptable support
// Add currency conversion

// change to your currency symbol
const currency = "USD"

// page tracker
var page = 0;

function displayJSButtons(combined) {
    // console.log(combined)
    var body = document.getElementsByTagName("body")[0];

    let lbtn = document.createElement("button");
    lbtn.innerHTML = "Left";
    lbtn.addEventListener("click", function () {
        // console.log("left");
        page--;
        if (page < 0) page = combined.length - 1;
        displayJSData(combined);
    });
    body.appendChild(lbtn);

    let rbtn = document.createElement("button");
    rbtn.innerHTML = "Right";
    body.appendChild(rbtn);
    rbtn.addEventListener("click", function () {
        // console.log("right");
        page++;
        if (page == combined.length) page = 0;
        displayJSData(combined);
    });   

    var img = document.createElement("img");
    img.setAttribute("id", "img");
    body.appendChild(img)

    let chain = document.createElement("div");
    chain.setAttribute("id", "chain");
    body.appendChild(chain);

    let amount = document.createElement("div");
    amount.setAttribute("id", "amount");
    body.appendChild(amount);

    let price = document.createElement("div");
    price.setAttribute("id", "price");
    body.appendChild(price);

    let total = document.createElement("div");
    total.setAttribute("id", "total");
    body.appendChild(total);

    displayJSData(combined);
}

// renders dataObj in widget
async function displayJSData(combined) {
    // console.log(combined[page])
    data = {
        "chain"     : combined[page][1].chain,
        "symbol"    : combined[page][1].symbol,
        "amount"    : combined[page][1].amount,  
        "price"     : combined[page][1].price,
        "total"     : combined[page][1].price * combined[page][1].amount,
        "logo_url"  : combined[page][1].logo_url,
    } 
    chain = document.getElementById("chain")
    chain.innerHTML = "chain: " + data.chain;

    amount = document.getElementById("amount")
    amount.innerHTML = data.symbol + ": " + data.amount;

    price = document.getElementById("price")
    price.innerHTML = "price: " + data.price;

    total = document.getElementById("total")
    total.innerHTML = currency + ": " + data.total;

    img = document.getElementById("img")
    img.src = data.logo_url;
}

function displayWidgetButtons(combined) {
    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");
    
    if ("args" in window) {

        let lbtn = widget.addButton('left')
        lbtn.leftAligned();
        lbtn.onTap = () => {
            page--;
            if (page < 0) page = combined.length - 1;
            displayWidgetData(widget, combined);       
        }

        let rbtn = widget.addButton('right')
        rbtn.rightAligned();
        rbtn.onTap = () => {
            page++;
            if (page == combined.length) page = 0;
            displayWidgetData(widget, combined);    
        }

        displayWidgetData(widget, combined);
    }
}

async function displayWidgetData(widget, combined) {
    // console.log(combined[page])
    data = {
        "chain"     : combined[page][1].chain,
        "symbol"    : combined[page][1].symbol,
        "amount"    : combined[page][1].amount,  
        "price"     : combined[page][1].price,
        "total"     : combined[page][1].price * combined[page][1].amount,
        "logo_url"  : combined[page][1].logo_url,
    } 

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

    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
}

// gets protocols from debank for all wallets
async function getWalletProtoList(wallets) {
    root_url = 'https://openapi.debank.com/v1/user/simple_protocol_list?id=';

    return await Promise.all(wallets.map(wallet => fetch(root_url + wallet)))
        .then(async(response) => Promise.all(response.map(async(res, index) => {
            return { "wallet" : wallets[index], "result" : await res.json() };
        })))
}

// get data from debank for all protocols by walllet
async function getWalletProtoData(list) {
    dataObj = []
    root_url = 'https://openapi.debank.com/v1/user/protocol?protocol_id=';

    return await Promise.all(list.map(async(info, index) => { 
        return await Promise.all(info.result.map(async(proto) => {
            return await fetch(root_url + proto.id + "&id=" + list[index].wallet)
                .then(async(res) => await res.json())
                .then(r => { 
                    return r; 
                })
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

/* Main code starts here */

window.onload = async function() {
    var mode;

    if ("config" in window)
        mode = "scriptable";
    else 
        mode = "javascript";

    if (mode == "javascript")
        var wallets = [
            "0x69052fb47b9ad7216c4a2a96ff379936cae6b3b6",
            "0x5e8dcda987e97f78baf533bde8493a0a726ad1ef",
            "0xba5877e97a8c1ddd86343c3a76ed675cb0810910"
        ];
    else {
        if ("args" in window)
            if (!(args.widgetParameter.includes("0x"))) {
                const title = widget.addText("invalid wallet parameter");
                title.textColor = Color.white();
                title.textOpacity = 0.8;
                title.font = new Font("Helvetica-Light ", 10);
                widget.addSpacer(4);
            }

            if (args.widgetParameter.includes(",")) {
                // Handle multiple wallet addresses
            } else {
                var wallets = [args.widgetParameter]; 
            }
    }

    let walletProtoList = await getWalletProtoList(wallets);
    // console.log(walletProtoList);

    let walletProtoData = await getWalletProtoData(walletProtoList);
    // console.log(walletProtoData);
    
    let combined = combineCurrencies(walletProtoData);
    // console.log(combined);

    if (mode == "javascript") 
        displayJSButtons(combined);
    else if (mode == "scriptable")
        displayWidgetButtons(combined);
}