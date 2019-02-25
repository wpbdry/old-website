/************************************************************************
 _/                _/  _/_/_/    _/_/_/    _/_/_/    _/_/_/    _/      _/
 _/              _/   _/    _/  _/    _/  _/    _/  _/    _/    _/  _/
 _/    _/_/    _/    _/_/_/    _/_/_/    _/    _/  _/_/_/        _/
 _/  _/  _/  _/     _/        _/    _/  _/    _/  _/  _/        _/
 _/_/    _/_/      _/        _/_/_/    _/_/_/    _/    _/      _/
 **********************************************************************/

/**
 * Created by William on 16/12/22.
 */
var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function(processing) {
    processing.size(400, 400);
    processing.background(0xFFF);

    var mouseIsPressed = false;
    processing.mousePressed = function () { mouseIsPressed = true; };
    processing.mouseReleased = function () { mouseIsPressed = false; };

    var keyIsPressed = false;
    processing.keyPressed = function () { keyIsPressed = true; };
    processing.keyReleased = function () { keyIsPressed = false; };

    // use degrees rather than radians in rotate function
    var rotateFn = processing.rotate;
    processing.rotate = function (angle) {
        rotateFn(processing.radians(angle));
    };

    with (processing) {


        // INSERT YOUR KHAN ACADEMY PROGRAM HERE

        /**********************************
         app to remind you to sit up straight when you're using the computer
         ************************************/

        /**needs fixing
         create different voices maybe
         tab icon not changing
         doesn't always play sound
         */

//global variables
        var timer = 20;
        var voice = "voice over";
        var currentScreen = "startScreen";

        var themeC = color(8, 148, 129);
        var selectC = color(255, 0, 0);
        var nameF = createFont("cursive");
        var normalF = createFont("sans-serif");

//audio variables
        var voiceover = [ new Audio("voice_over-1.mp3"),
            new Audio("sounds/voice_over-2.mp3"),
            new Audio("sounds/voice_over-3.mp3"),
            new Audio("sounds/voice_over-4.mp3"),
            new Audio("sounds/voice_over-5.mp3"),
            new Audio("sounds/voice_over-6.mp3"),
            new Audio("sounds/voice_over-7.mp3"),
            new Audio("sounds/voice_over-8.mp3"),
            new Audio("sounds/voice_over-9.mp3"),
            new Audio("sounds/voice_over-10.mp3") ];
        var highbeep = new Audio("sounds/beep-high.mp3");
        var lowbeep = new Audio("sounds/beep-low.mp3");
        var metalchime = new Audio("sounds/metal-chime.mp3");

//logo function
        var drawLogo = function (x, y, size) {
            textFont(nameF, size);
            fill(themeC);
            text ("PostureCheck", x, y);
            textFont(normalF);
        };

        //change favicon function
        function change_favicon(img) {
            var favicon = document.querySelector('link[rel="shortcut icon"]');

            if (!favicon) {
                favicon = document.createElement('link');
                favicon.setAttribute('rel', 'shortcut icon');
                var head = document.querySelector('head');
                head.appendChild(favicon);
            }


            favicon.setAttribute('type', 'image/png');
            favicon.setAttribute('href', img);
        };

        /**start screen function**/
        var drawStartScreen = function () {

            //blank screen
            noStroke();
            fill(255, 255, 255);
            rect(0,0,400,400);

            //welcome text
            textAlign(LEFT, BASELINE);
            fill (0, 0, 0);
            textFont(normalF, 25);
            text("Welcome to", 20, 50);
            drawLogo (166, 50, 33);
            fill(0, 0, 0);
            textSize(14);
            text ("Set a timer below and you will never slouch in front of your computer again. Select your favorite reminder and click start.", 20, 84, 360, 89);
            drawLogo (90, 126, 14);
            fill(0, 0, 0);
            textSize(15);
            text("can audibly remind you to", 184, 126);
            text("sit up straight at the set interval.", 20, 143);

            //time interval selector
            fill(0, 0, 0);
            textSize(24);
            text("Remind me every", 20, 210);
            fill(selectC);
            textAlign(CENTER, BASELINE);
            text(timer, 230, 210);
            fill(0,0,0);
            textAlign(LEFT, BASELINE);
            text("minutes", 253, 210);
            fill(themeC);
            triangle(215, 190, 230, 178, 245, 190);
            triangle(215, 214, 230, 226, 245, 214);

            //voice selector
            fill(0, 0, 0);
            textFont(normalF, 24);
            textAlign(LEFT, BASELINE);
            text("Remind me with", 20, 290);
            fill(selectC);
            textAlign(CENTER, BASELINE);
            text(voice, 290, 290);
            fill(themeC);
            triangle(220, 270, 290, 258, 360, 270);
            triangle(220, 294, 290, 306, 360, 294);

            //start button
            fill (themeC);
            rect (286, 344, 94, 36);
            fill (0,0,0);
            textAlign(LEFT, BASELINE);
            textFont(nameF, 30);
            text ("Start", 292, 374);

        };

        /**running screen function**/
        var drawRunningScreen = function () {
            //blank screen
            noStroke();
            fill(255, 255, 255);
            rect(0,0,400,400);

            //text
            textAlign(CENTER, BASELINE);
            drawLogo(200,85,56);
            fill(0, 0, 0);
            textFont(normalF, 30);
            text("Running...", 200, 120);
            fill(255, 0, 0);
            textSize(18);
            textAlign(LEFT, BASELINE);
            if (timer === 1) {
                text("Remind every 1 minute with " + voice, 20, 174);
            }
            else {
                text("Remind every " + timer + " minutes with " + voice, 20, 174);
            }

            //back button
            fill (themeC);
            rect (20, 344, 98, 36);
            fill (0,0,0);
            textAlign(LEFT, BASELINE);
            textFont(nameF, 30);
            text ("Cancel", 24, 374);

        };

        /**button functionality**/
        mouseClicked = function () {

            /* Start screen buttons */

            if (currentScreen === "startScreen") {
                textAlign(CENTER, BASELINE);

                //timer up
                if (mouseX > 215 && mouseX < 245 &&
                    mouseY > 178 && mouseY < 190 &&
                    timer < 120) {
                    timer ++;
                    fill(255, 255, 255);
                    rect(215, 191, 40, 21);
                    fill(selectC);
                    textFont(normalF, 24);
                    text(timer, 230, 210);
                }
                //timer down
                if (mouseX > 215 && mouseX < 245 &&
                    mouseY > 214 && mouseY < 226 &&
                    timer > 2) {
                    timer -= 1;
                    fill(255, 255, 255);
                    rect(215, 191, 40, 21);
                    fill(selectC);
                    textFont(normalF, 24);
                    text(timer, 230, 210);
                }
                //voice up
                if (mouseX > 220 && mouseX < 360 &&       //up button
                    mouseY > 258 && mouseY < 270) {
                    if (voice === "voice over") {
                        voice = "text only";
                    }
                    else if (voice === "high beep") {
                        voice = "voice over";
                    }
                    else if (voice === "low beep") {
                        voice = "high beep";
                    }
                    else if (voice === "metal chime") {
                        voice = "low beep";
                    }
                    else if (voice === "text only") {
                        voice = "metal chime";
                    }
                    fill(255, 255, 255);
                    rect(200, 271, 180, 24);
                    fill(selectC);
                    textFont(normalF, 24);
                    text(voice, 290, 290);
                }
                //voice down
                if (mouseX > 220 && mouseX < 360 &&       //down button
                    mouseY > 294 && mouseY < 306) {
                    if (voice === "voice over") {
                        voice = "high beep";
                    }
                    else if (voice === "high beep") {
                        voice = "low beep";
                    }
                    else if (voice === "low beep") {
                        voice = "metal chime";
                    }
                    else if (voice === "metal chime") {
                        voice = "text only";
                    }
                    else if (voice === "text only"){
                        voice = "voice over";
                    }
                    fill(255, 255, 255);
                    rect(200, 271, 180, 24);
                    fill(selectC);
                    textFont(normalF, 24);
                    text(voice, 290, 290);
                }

                //start
                if (mouseX > 286 && mouseX < 380 &&
                    mouseY > 344 && mouseY < 380) {
                    drawRunningScreen();
                    currentScreen = "runningScreen";
                }
            }

            //running screen buttons

            if(currentScreen === "runningScreen") {
                if (mouseX > 20 && mouseX < 118 &&
                    mouseY > 344 && mouseY < 380) {
                    drawStartScreen ();
                    currentScreen = "startScreen";
                }
            }
        };

        /**timer end function**/
        var timerEnd = function () {
            document.title = "Check your posture!";
            change_favicon("images/exclamation.png");
            fill(themeC);
            textFont(nameF, 26);
            textAlign(CENTER, BASELINE);
            text("Check your posture!", 200, 280);

            if (voice === "voice over") {
                var n = random(0, voiceover.length) |0;
                var sound = voiceover[n];
                sound.play();
            }
            else if (voice === "high beep") {
                highbeep.play();
            }
            else if (voice === "low beep") {
                lowbeep.play();
            }
            else if (voice === "metal chime") {
                metalchime.play();
            }
        };

        /**call functions**/
        drawStartScreen();

        var i = 0;
        var j = 100;
        var minutes = 0;
        var timeRemaining = 0;
        frameRate(1);
        draw = function() {
            if (currentScreen === "startScreen") {
                i = 0;
                j = 100;
                minutes = 0;
            }
            if (currentScreen === "runningScreen") {
                minutes = i / 60 |0;
                timeRemaining = timer - minutes;
                fill(255, 255, 255);
                rect(15, 190, 360, 32);
                textFont(normalF, 18);
                textAlign(LEFT, BASELINE);
                fill(0, 0, 0);
                if (timeRemaining === 1) {
                    text("Next reminder in 1 minute", 20, 210);
                }
                else {
                    text("Next reminder in " + timeRemaining + " minutes", 20, 210);
                }
                if (i === 60*timer) {
                    timerEnd ();
                    i = 0;
                    j = 0;
                }
                if (j === 10) {
                    document.title = "Posture Check";
                    change_favicon("images/icon.png");
                    fill(255, 255, 255);
                    rect(10, 186, 380, 110);
                }
                i++;
                j++;
            }
        };

        /*****************************************
         end
         ******************************************/

//KHAN CODE OVER

    }
    if (typeof draw !== 'undefined') processing.draw = draw;

});