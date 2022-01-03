// Inspired by @SithNode.Eth on Twitter 
// Designed to work with iOS widgets + Scriptable

// Instructions:
//  Copy this code into the Scriptable editor
//  Add wallet addresses to Widget Scriptable Parameter
//      separate multiple addresses with comma ",", 
//      no quotes please

// TODO 
// add scriptable support & javascript
// Add currency conversion

var page = 0;

function displayButtons(widget, combined) {
    // console.log(combined)
    var body = document.getElementsByTagName("body")[0];

    let lbtn = document.createElement("button");
    lbtn.innerHTML = "Left";
    lbtn.addEventListener("click", function () {
        // console.log("left");
        page--;
        if (page < 0) page = combined.length - 1;
        displayData(widget, combined);
    });
    body.appendChild(lbtn);

    let rbtn = document.createElement("button");
    rbtn.innerHTML = "Right";
    body.appendChild(rbtn);
    rbtn.addEventListener("click", function () {
        // console.log("right");
        page++;
        if (page == combined.length) page = 0;
        displayData(widget, combined);
    });   

    let t = document.createElement("div");
    t.setAttribute("id", "t");
    body.appendChild(t);
    displayData(widget, combined);
}

// renders dataObj in widget
async function displayData(widget, combined) {
    // console.log(page)
    data = {
        "chain"     : combined[page][1].chain,
        "symbol"    : combined[page][1].symbol,
        // "logo_url"  : combined[page][1].logo_url,
        "amount"    : combined[page][1].amount  
    } 
    t = document.getElementById("t")
    t.innerHTML = JSON.stringify(data);

    // let image = widget.addImage(dataObj.img);
    // image.centerAlignImage();
    // image.imageSize = new Size(30,30)
    // widget.addSpacer(8);

    // const title = widget.addText(params.header_text);
    // title.textColor = Color.white();
    // title.textOpacity = 0.8;
    // title.font = new Font("Helvetica-Light ", 10);
    // widget.addSpacer(4);

    // const pricetext = widget.addText(`Price: ${dataObj.price.toFixed(2)}`);
    // pricetext.textColor = Color.white();
    // pricetext.font = new Font("Courier", 14);
    // widget.addSpacer(2);

    // const strongtext = widget.addText(`${params.token_disp}:  ${dataObj.token_val.toFixed(2)}`);
    // strongtext.textColor = Color.white();
    // strongtext.font = new Font("Courier", 14);
    // widget.addSpacer(2);

    // // TODO: currency conversion
    // const usdtext = widget.addText(`${params.currency}:   ${dataObj.fiat_val.toFixed(2)}`);
    // usdtext.textColor = Color.white();
    // usdtext.font = new Font("Courier", 14);

    // Script.setWidget(widget);
    // Script.complete();
    // widget.presentMedium();
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
    var widget;
    if ("config" in window)
        if (config.runsInWidget) {
            widget = new ListWidget();
            widget.backgroundColor=new Color("#222222");
        }
    
        if ("args" in window)
            if (!(args.widgetParameter.includes("0x"))) {
            const title = widget.addText("invalid wallet parameter");
            title.textColor = Color.white();
            title.textOpacity = 0.8;
            title.font = new Font("Helvetica-Light ", 10);
            widget.addSpacer(4);
    }
    
    var wallets = [
        "0x69052fb47b9ad7216c4a2a96ff379936cae6b3b6",
        "0x5e8dcda987e97f78baf533bde8493a0a726ad1ef",
        "0xba5877e97a8c1ddd86343c3a76ed675cb0810910"
    ];
    
    // if ("args" in window)
    //     if (args.widgetParameter.includes(",")) {
    //         // Handle multiple wallet addresses
    //     } else {
    //         wallets = [args.widgetParameter]; 
    //     }
    
    let walletProtoList = await getWalletProtoList(wallets);
    // console.log(walletProtoList);

    let walletProtoData = await getWalletProtoData(walletProtoList);
    // console.log(walletProtoData);
    
    let combined = combineCurrencies(walletProtoData);
    // console.log(combined);

    displayButtons(widget, combined);
}