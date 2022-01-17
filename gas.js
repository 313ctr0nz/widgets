// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Author: @313ctr0nz on Github, @ms360 on twitter

// Designed to work with iOS widgets + Scriptable
// Donations welcome @ 0xE34b794D84922A21E2cb1F7f360A89Ff65DcC9e9 
// ($ETH/$AVAX/$FTM/$AETH/$MATIC/$CRO/$STRONG)

// Instructions:
//  Copy this code into the Scriptable editor


async function displayWidget(ethgas) {
    console.log(ethgas)
    var widget = new ListWidget();
    widget.backgroundColor=new Color("#222222");

    let g = new LinearGradient()
    g.locations = [0, 1]
    g.colors = [
        new Color("#0a1860"),
        new Color("#000000")
    ];

    widget.backgroundGradient = g;
    widget.setPadding(0, 10, 0, 10);

    let titleStack = widget.addStack();
    titleStack.layoutHorizontally();
    titleStack.centerAlignContent();

    let dataStack1 = widget.addStack();
    dataStack1.layoutVertically();
    dataStack1.centerAlignContent();

    let title = dataStack1.addText(`ETH Gas`);
    title.font = Font.mediumSystemFont(16);
    title.textOpacity = 1;
    title.textColor = Color.white();
    title.lineLimit = 1;
    dataStack1.addSpacer(20);

    let slow = dataStack1.addText(`${ethgas.slow.gwei} gwei / \$${ethgas.slow.usd}`);
    slow.font = Font.mediumSystemFont(16)
    slow.textOpacity = 1
    slow.textColor = Color.white()
    slow.lineLimit = 1
    widget.addSpacer(10);

    let normal = dataStack1.addText(`${ethgas.normal.gwei} gwei / \$${ethgas.normal.usd}`);
    normal.font = Font.mediumSystemFont(16)
    normal.textOpacity = 1
    normal.textColor = Color.white()
    normal.lineLimit = 1
    widget.addSpacer(10);

    let fast = dataStack1.addText(`${ethgas.fast.gwei} gwei / \$${ethgas.fast.usd}`);
    fast.font = Font.mediumSystemFont(16)
    fast.textOpacity = 1
    fast.textColor = Color.white()
    fast.lineLimit = 1
    widget.addSpacer(10);

    let instant = dataStack1.addText(`${ethgas.instant.gwei} gwei / \$${ethgas.instant.usd}`);
    instant.font = Font.mediumSystemFont(16)
    instant.textOpacity = 1
    instant.textColor = Color.white()
    instant.lineLimit = 1
    widget.addSpacer(10);


    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
}

// gets protocols from debank for all wallets
async function getETHgas() {
    url = 'https://ethgas.watch/api/gas';
    const req = new Request(url);
    const json = await req.loadJSON();
    console.log(json)
    return json;        
}


/* Main code starts here */

ethgas = await getETHgas()
console.log(ethgas)

await displayWidget(ethgas);

