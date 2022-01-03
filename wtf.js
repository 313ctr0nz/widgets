

const currency = "USD";

// page tracker
var page = 0;

function displayWidget(combined) {
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


var combined = [
    [
        "ftm_hectordao",
        {
            "id": "0x5c4fdfc5233f935f20d2adba572f770c2e377ab0",
            "chain": "ftm",
            "name": "Hector",
            "symbol": "HEC",
            "display_symbol": null,
            "optimized_symbol": "HEC",
            "decimals": 9,
            "logo_url": "https://static.debank.com/image/ftm_token/logo_url/0x5c4fdfc5233f935f20d2adba572f770c2e377ab0/bbdc6b584afaef5c169e688bbf322d6b.png",
            "protocol_id": "ftm_hectordao",
            "price": 58.72301847011432,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1635779103,
            "amount": 6.785129660999999
        }
    ],
    [
        "avax_wonderland",
        {
            "id": "0xb54f16fb19478766a268f172c9480f8da1a7c9c3",
            "chain": "avax",
            "name": "Time",
            "symbol": "TIME",
            "display_symbol": null,
            "optimized_symbol": "TIME",
            "decimals": 9,
            "logo_url": "https://static.debank.com/image/avax_token/logo_url/0xb54f16fb19478766a268f172c9480f8da1a7c9c3/321e410d3e7782fb9047297aeb7998b7.png",
            "protocol_id": "avax_wonderland",
            "price": 3252.091676450471,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1630606431,
            "amount": 0.34700997
        }
    ],
    [
        "avax_papadao",
        {
            "id": "0x70b33ebc5544c12691d055b49762d0f8365d99fe",
            "chain": "avax",
            "name": "PAPA",
            "symbol": "PAPA",
            "display_symbol": null,
            "optimized_symbol": "PAPA",
            "decimals": 9,
            "logo_url": "https://static.debank.com/image/avax_token/logo_url/0x70b33ebc5544c12691d055b49762d0f8365d99fe/c0dd602b11ab8fe28a579dfe913a03c0.png",
            "protocol_id": "avax_papadao",
            "price": 2.8434281226061517,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1638114172,
            "amount": 54.206347646
        }
    ],
    [
        "avax_louverture",
        {
            "id": "0xff579d6259dedcc80488c9b89d2820bcb5609160",
            "chain": "avax",
            "name": "Louverture",
            "symbol": "LVT",
            "display_symbol": null,
            "optimized_symbol": "LVT",
            "decimals": 18,
            "logo_url": "https://static.debank.com/image/avax_token/logo_url/0xff579d6259dedcc80488c9b89d2820bcb5609160/1cb6f589333821beb33f9f6b5aecdbad.png",
            "protocol_id": "avax_louverture",
            "price": 0.005809831020000919,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1639437482,
            "amount": 1070.4636791406294
        }
    ],
    [
        "arb_umami",
        {
            "id": "0x1622bf67e6e5747b81866fe0b85178a93c7f86e3",
            "chain": "arb",
            "name": "Umami",
            "symbol": "UMAMI",
            "display_symbol": null,
            "optimized_symbol": "UMAMI",
            "decimals": 9,
            "logo_url": "https://static.debank.com/image/arb_token/logo_url/0x1622bf67e6e5747b81866fe0b85178a93c7f86e3/8d72a4d1f0eac49ad37a71052c831900.png",
            "protocol_id": "arb_umami",
            "price": 27.600048153265103,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1638219842,
            "amount": 2.576596257
        }
    ],
    [
        "strongblock",
        {
            "id": "0x990f341946a3fdb507ae7e52d17851b87168017c",
            "chain": "eth",
            "name": "Strong",
            "symbol": "STRONG",
            "display_symbol": null,
            "optimized_symbol": "STRONG",
            "decimals": 18,
            "logo_url": "https://static.debank.com/image/eth_token/logo_url/0x990f341946a3fdb507ae7e52d17851b87168017c/c9ec62a95863c8358f3701b172821df4.png",
            "protocol_id": "strongblock",
            "price": 529.7549774353463,
            "is_verified": true,
            "is_core": true,
            "is_wallet": true,
            "time_at": 1596834300,
            "amount": 0.7646571428571429
        }
    ]
]

displayWidget(combined);

// var widget = new ListWidget();
// widget.backgroundColor=new Color("#222222");

// const usdtext = widget.addText(`hi`);
// usdtext.textColor = Color.white();
// usdtext.font = new Font("Courier", 14);

// Script.setWidget(widget);
// Script.complete();
// widget.presentMedium();


