/**
 * Created by William on 16/12/24.
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

    function getImage(s) {
        var url = "https://www.kasandbox.org/programming-CloudCottage_images/" + s + ".png";
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    // use degrees rather than radians in rotate function
    var rotateFn = processing.rotate;
    processing.rotate = function (angle) {
        rotateFn(processing.radians(angle));
    };

    with (processing) {


        // INSERT YOUR KHAN ACADEMY PROGRAM HERE
        window.alert("Welcome to WD Paint! \n \n• Right click to select background color \n• Undo button");


        /**
         This painting program works by drawing ellipses or rectangles when the mouse is held down.
         The program keeps a log of all the shapes drawn stored in objects in the array.
         Everything is redrawn from the objects every time the draw loop runs, so that the background can be changed without covering everything.
         **/

//rectangle function
        var rectangle = function (rx, ry, rw, rh) {
            rect (rx - rw/2, ry - rh/2, rw, rh);
        };

//variables
        {
            //current color and brush selection
            var r = 0;          //red
            var g = 0;          //green
            var b = 0;          //blue
            var randC = false;  //random coloring
            var randB = false;  //random background coloring
            var h = 20;         //height of brush
            var w = 20;         //width of brush
            var bShape = "c";   //shape of brush

            var n = 0;          //number of strokes (used in undo button)

            //background colors
            var br = 255;
            var bg = 255;
            var bb = 255;

            //array (color and brush selection stored as an object every time a shape is drawn)
            var array = [ {
                ar: 0,
                ag: 0,
                ab: 0,
                aw: 0,
                ah: 0,
                x: 0,           //x position of shape
                y: 0,           //y position of shape
                abShape: "",
                an: 0           //number of strokes at time that shape was drawn
            } ];

            var paint = false; //whether user is painting or not - used for counting n
        }

//buttons
        mouseClicked = function () {
            if (mouseButton === LEFT &&
                mouseX > 330 && mouseX < 360 &&          //size up
                mouseY > 60 && mouseY < 70 &&
                h < 30) {
                h ++;
            }
            if (mouseButton === LEFT &&
                mouseX > 330 && mouseX < 360 &&          //size down
                mouseY > 80 && mouseY < 90 &&
                h > 1) {
                h -= 1;
            }
            if (mouseButton === LEFT &&             //undo
                mouseX > 90 && mouseX < 130 &&
                mouseY > 70 && mouseY <90) {
                while (array[array.length -1].an === n) {
                    array.pop();
                }
                n -= 1;
            }
        };

//constant loop
        draw = function() {

            // create new random colors
            var rr = random(0,255);
            var rg = random(0,255);
            var rb = random(0,255);

            //color changer rectangles
            {
                noStroke();
                fill(255, 0, 0);
                rect(20, 20, 40, 20); //red
                fill(0, 255, 0);
                rect(80, 20, 40, 20); //green
                fill(0, 0, 255);
                rect(140, 20, 40, 20); //blue
                fill(rr, rg, rb);
                rect(200, 20, 40, 20); //random
                fill(0, 0, 0);
                rect(260, 20, 40, 20); //black
                stroke(0, 0, 0);
                fill(255, 255, 255);
                rect(320, 20, 40, 20); //white
            }

            //size selecter shapes
            //bottom
            if (h === 1) {
                fill(230, 230, 230);
                rect(330, 82, 30, 8);   //bottom rect
                fill(200, 200, 200);
                stroke(200, 200, 200);
                triangle(340, 84, 350, 84, 345, 89); //bottom triangle
            }
            else {
                fill(200, 200, 200);
                stroke(0, 0, 0);
                rect(330, 82, 30, 8);   //bottom rect
                fill(0, 0, 0);
                triangle(340, 84, 350, 84, 345, 89); //bottom triangle
            }
            //top
            if (h === 30) {
                fill(230, 230, 230);
                rect(330, 60, 30, 8);   //top rect
                fill(200, 200, 200);
                stroke(200, 200, 200);
                triangle(345, 61, 350, 66, 340, 66); //top triangle
            }
            else {
                fill(200, 200, 200);
                stroke(0, 0, 0);
                rect(330, 60, 30, 8);   //top rect
                fill(0, 0, 0);
                triangle(345, 61, 350, 66, 340, 66); //top triangle
            }
            //middle
            {
                fill(255, 255, 255);
                stroke(0, 0, 0);
                rect(330, 68, 30, 14);  //middle rect
                //text
                fill(0, 0, 0);
                if (h < 10) {
                    text(h, 342, 80);
                }
                else {
                    text(h, 338, 80);
                }
            }

            //brush changer shapes
            fill(255, 255, 255);
            ellipse(295, 75, 30, 30);   //circle
            ellipse(250, 75, 20, 30);   //ellipse
            rect(190, 60, 30, 30);      //square
            rect(150, 60, 20, 30);      //recangle

            //undo rectangle
            rect(90, 70, 40, 20);
            fill(255, 0, 0);
            text("Undo", 95, 85);

            //show current selection
            {
                noStroke();
                fill(255, 255, 255);
                rect(10,45,60,50);                              //erase previous selection
                if(randC === false) {                           //if random colors is off use rgb
                    fill(r, g, b);
                    if(r === 255 && g === 255 && b === 255) {   //if white is selected use outline
                        stroke(0, 0, 0);
                    }
                }
                else {
                    fill(rr, rg, rb);                           //if random colors is on use rr rg rb
                }

                if(bShape === "c" || bShape === "e") {
                    ellipse(35,75,w,h);                         //if ellipse is selected draw ellipse
                }

                else {
                    rect(35-w/2,75-h/2,w,h);                    //if rect is selected draw rect
                }
            }


            //buttons
            //color changer buttons
            noStroke();
            if (mouseIsPressed) {
                if (mouseX>20 && mouseX<60 && mouseY>20 && mouseY<40) { //red
                    fill(255, 100, 100);
                    rect(20, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        r = 255;
                        g = 0;
                        b = 0;
                        randC = false;
                    }
                    else {
                        br = 255;
                        bg = 0;
                        bb = 0;
                        randB = false;
                    }
                }
                if (mouseX>80 && mouseX<120 && mouseY>20 && mouseY<40) { //green
                    fill(100, 255, 100);
                    rect(80, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        r = 0;
                        g = 255;
                        b = 0;
                        randC = false;
                    }
                    else {
                        br = 0;
                        bg = 255;
                        bb = 0;
                        randB = false;
                    }
                }
                if (mouseX>140 && mouseX<180 && mouseY>20 && mouseY<40) { //blue
                    fill(100, 100, 255);
                    rect(140, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        r = 0;
                        g = 0;
                        b = 255;
                        randC = false;
                    }
                    else {
                        br = 0;
                        bg = 0;
                        bb = 255;
                        randB = false;
                    }
                }
                if (mouseX>200 && mouseX<240 && mouseY>20 && mouseY<40) { //random
                    fill(rr+100, rg +100, rb+100);
                    rect(200, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        randC = true;
                    }
                    else {
                        randB = true;
                    }
                }
                if (mouseX>260 && mouseX<300 && mouseY>20 && mouseY<40) { //black
                    fill(100, 100, 100);
                    rect(260, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        r = 0;
                        g = 0;
                        b = 0;
                        randC = false;
                    }
                    else {
                        br = 0;
                        bg = 0;
                        bb = 0;
                        randB = false;
                    }
                }
                if (mouseX>320 && mouseX<360 && mouseY>20 && mouseY<40) { //white
                    stroke(0, 0, 0);
                    fill(200, 200, 200);
                    rect(320, 20, 40, 20);
                    if (mouseButton === LEFT) {
                        r = 255;
                        g = 255;
                        b = 255;
                        randC = false;
                    }
                    else {
                        br = 255;
                        bg = 255;
                        bb = 255;
                        randB = false;
                    }
                }
            }

            //brush changer buttons
            fill(200, 200, 200);
            stroke(0,0,0);
            if (mouseIsPressed && mouseButton === LEFT) {
                if (mouseX>280 && mouseX<310 && mouseY>60 && mouseY<90) {   //circle
                    ellipse(295, 75, 30, 30);
                    bShape = "c";
                }
                if (mouseX>240 && mouseX<260 && mouseY>60 && mouseY<90) {   //ellipse
                    ellipse(250, 75, 20, 30);
                    bShape = "e";
                }
                if (mouseX>190 && mouseX<220 && mouseY>60 && mouseY<90) {   //square
                    rect(190, 60, 30, 30);
                    bShape = "s";
                }
                if (mouseX>150 && mouseX<170 && mouseY>60 && mouseY<90) {   //rect
                    rect(150, 60, 20, 30);
                    bShape = "r";
                }
            }

            //undo button
            if (mouseIsPressed &&
                mouseX > 90 && mouseX < 130 &&
                mouseY > 70 && mouseY <90) {
                fill(200, 200, 200);
                rect(90, 70, 40, 20);
                fill(255, 0, 0);
                text("Undo", 95, 85);
            }

            //backround
            if(randB === true) {
                fill(rr, rg, rb);
            }
            else {
                fill(br, bg, bb);
            }
            rect(20,100,340,280);


            //set width
            if (bShape === "c" || bShape === "s") {
                w = h;
            }
            else {
                w = (2/3)*h;
            }

            //add shape object to array
            if (mouseIsPressed && (
                    mouseX>(20+w/2) && mouseX<(360-w/2) &&
                    mouseY>(100+h/2) && mouseY<(380-h/2)
                )
            ) {
                if (paint === false) {
                    paint = true;
                    n++;
                }
                if(randC === true) {
                    array.push(
                        {
                            ar: rr,
                            ag: rg,
                            ab: rb,
                            aw: w,
                            ah: h,
                            x: mouseX,
                            y: mouseY,
                            abShape: bShape,
                            an: n      //record what stroke number this shape was part of
                        }
                    );
                }

                else if(array[array.length - 1] !== [array.length -2]) {
                    array.push(
                        {
                            ar: r,
                            ag: g,
                            ab: b,
                            aw: w,
                            ah: h,
                            x: mouseX,
                            y: mouseY,
                            abShape: bShape,
                            an: n      //record what stroke number this shape was part of
                        }
                    );
                }
            }
            else {
                paint = false;
            }

            //draw all previous shapes including most recent from objects in array
            noStroke();
            for(var i = 1; i < array.length - 1; i++) {
                fill(array[i].ar, array[i].ag, array[i].ab);
                if (array[i].abShape === "c" || array[i].abShape === "e") {
                    ellipse(array[i].x, array[i].y, array[i].aw, array[i].ah);
                }
                else {
                    rectangle(array[i].x, array[i].y, array[i].aw, array[i].ah);
                }
            }
        };

//KHAN CODE OVER

    }
    if (typeof draw !== 'undefined') processing.draw = draw;

});