$(document).onload +=
    $(document).keydown(
        function (event) {
            for (i = 0; i < Typer.typingPower; i++) {
                console.log(i);
                setTimeout(function () {
                    Typer.addText(event)
                }, (i - 1) * Typer.multikeyDelay); //Capture the keydown event and call the addText, this is executed on page load
            }
        }
    );

var Typer = {
    text: null,
    accessCountimer: null,
    index: 0, // current cursor position
    speed: 2, // speed of the Typer
    file: "", //file, must be setted
    accessCount: 0, //times alt is pressed for Access Granted
    deniedCount: 0, //times caps is pressed for Access Denied
    hljstype: '',
    typingPower: 1,
    multikeyDelay: 100,
    init: function () {// inizialize Hacker Typer
        accessCountimer = setInterval(function () {
            Typer.updLstChr();
        }, 500); // inizialize timer for blinking cursor
        $.get(Typer.file, function (data) {// get the text file
            Typer.text = data;// save the textfile in Typer.text
            Typer.hljstype = hl.highlightAuto(Typer.text).language
        });
    },

    content: function () {
        return $c.html();// get console content
    },

    write: function (str) {// append to console content
        $c.append(str);
        return false;
    },

    makeAccess: function () { //create Access Granted popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop(); // hide all popups
        Typer.accessCount = 0; //reset count
        var ddiv = $("<div id='gran'>").html(""); // create new blank div and id "gran"
        ddiv.addClass("accessGranted"); // add class to the div
        ddiv.html("<h1>ACCESS GRANTED</h1>"); // set content of div
        $(document.body).prepend(ddiv); // prepend div to body
        return false;
    },
    makeDenied: function () { //create Access Denied popUp      FIXME: popup is on top of the page and doesn't show is the page is scrolled
        Typer.hidepop(); // hide all popups
        Typer.deniedCount = 0; //reset count
        var ddiv = $("<div id='deni'>").html(""); // create new blank div and id "deni"
        ddiv.addClass("accessDenied");// add class to the div
        ddiv.html("<h1>ACCESS DENIED</h1>");// set content of div
        $(document.body).prepend(ddiv);// prepend div to body
        return false;
    },

    hidepop: function () {// remove all existing popups
        $("#deni").remove();
        $("#gran").remove();
    },

    addText: function (key) {//Main function to add the code
        if (key.keyCode == 18) {// key 18 = alt key
            Typer.accessCount++; //increase counter
            if (Typer.accessCount >= 3) {// if it's presed 3 times
                //Typer.makeAccess(); // make access popup
            }
        } else if (key.keyCode == 20) {// key 20 = caps lock
            Typer.deniedCount++; // increase counter
            if (Typer.deniedCount >= 3) { // if it's pressed 3 times
                //Typer.makeDenied(); // make denied popup
            }
        } else if (key.keyCode == 27) { // key 27 = esc key
            //Typer.hidepop(); // hide all popups
        } else if (Typer.text) { // otherway if text is loaded
            if (key.keyCode != 8) { // if key is not backspace
                Typer.index += Typer.speed;	// add to the index the speed
            } else {
                if (Typer.index > 0) // else if index is not less than 0
                    Typer.index -= Typer.speed;//	remove speed for deleting text
            }
            var text = $("<div/>").text(Typer.text.substring(0, Typer.index)).html();// parse the text for stripping html enities
            text = hl.highlight(Typer.hljstype, text).value;
            var rtn = new RegExp("\n", "g"); // newline regex
            var rts = new RegExp("(\\s(?!class))", "g"); // whitespace regex
            var rtt = new RegExp("\\t", "g"); // tab regex
            $cur.removeClass('hide');
            $c.html(text.replace(rtn, "<br/>").replace(rtt, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts, "&nbsp;").replace(new RegExp('&amp;', 'g'), '&'));
            window.scrollTo(0,document.body.scrollHeight); // scroll to make sure bottom is always visible
        }
        if (key.keyCode == 122) { // prevent F11(fullscreen) from being blocked
            key.preventDefault()
        }
        if (key.keyCode != 122) { // otherway prevent keys default behavior
            key.returnValue = false;
        }
    },

    updLstChr: function () { // blinking cursor
        $cur.toggleClass('hide', !$cur.hasClass('hide'))
    }
}