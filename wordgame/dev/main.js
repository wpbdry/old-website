/*global
    $, console
*/

/* CONTENTS
    Variables:          line 41
    Custom functions:   line 65
    Event handlers:     line 235
*/

/*  BUGS
    if user has played baby in classic, score 0/0 shows for baby in classial
    make timer stop if words run out if there is a timer
    make timer only start once question has loaded
    clear results span on back to levels
    TO COMPLETE
    make all the different modes behave as they are supposed to and set scoring behaviour
        -in classic and classical mode (and maybe other modes as well) it must start a new score for a new game
    make buttons to reuse words or go back when words have run out
    make it pass mode and level variables from one function to the next, instead of using global mode and level variables, otherwise things will get confusing if user changes mode or level half way through a game
    add functionality for selects at the top
    make answer field bigger
    general bit of styling
    OPTIONAL FURTHER DEVELOPMENT
    Add option to show clue
    Make stats for each mode and level
    have user accounts and passwords or facebook login?
*/

/* Development code to check for duplicates in files
$.get("words/0.txt", function (txt) {
    var words = txt.toLowerCase().split('\n');
    for (i = 0; i<words.length; i++) {
        if (words[i] === "pot") {
            console.log(i + words[i]);
        }
    }
});
*/

//VARIABLES
//answer array for each level
var ans = [[], [], [], [], [], []];
//current answer and question for each level
var curA = ["", "", "", "", "", ""];
var curQ = ["", "", "", "", "", ""];
//scoring variables, mode first then level
var right = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
var total = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
var score = [["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""]];
var highRight = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
var highTotal = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
var highScore = [["0/0", "0/0", "0/0", "0/0", "0/0", "0/0"], ["0/0", "0/0", "0/0", "0/0", "0/0", "0/0"], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""]];

var modeScore = ["0/0", "0/0", "", "", "", "", ""];
var thisQFailed = false;
//mode and level variables
var modesPlayed = [false, false, false, false, false, false, false];
var levelsPlayed = [false, false, false, false, false, false];
var curM = "";
var curL = "";
//timer variable
var timer;

//FUNCTIONS
//Scan ans[curL] to check if a word exists
var scanA = function (word) {
    "use strict";
    var ret = false,
        i;
    for (i = 0; i < ans[curL].length; i += 1) {
        if (word === ans[curL][i]) {
            ret = true;
            break;
        }
    }
    return (ret);
};

//Display question
var displayQ = function () {
    "use strict";
    //display question
    $("#question").text(curQ[curL]);
    //focus cursor on answer field
    $("#answer").focus();
};

//Pick an answer from relevant array and create question
var createQ = function () {
    "use strict";
    //normal procedure to create a new question
    if (ans[curL].length > 0) {
        //pick random answer
        var numb = Math.floor(Math.random() * (ans[curL].length)),
            curAChars = [],
            charNumb;
        //set curA
        curA[curL] = ans[curL][numb];
        //clear previous current question
        curQ[curL] = "";
        //generate curQ
        //split into characters
        curAChars = curA[curL].split("");
        //scramble characters
        while (curAChars.length > 0) {
            charNumb = Math.floor(Math.random() * (curAChars.length));
            curQ[curL] += curAChars[charNumb];
            curAChars.splice(charNumb, 1);
        }
        //to make sure that it does it again if curQ is the same as any of the possible answers
        while (true) {
            if (scanA(curQ[curL]) === true) {
                curQ[curL] = "";
                //split into characters
                curAChars = curA[curL].split("");
                //scramble characters
                while (curAChars.length > 0) {
                    charNumb = Math.floor(Math.random() * (curAChars.length));
                    curQ[curL] += curAChars[charNumb];
                    curAChars.splice(charNumb, 1);
                }
            } else {
                break;
            }
        }
        //delete that answer from answers to prevent repititions
        ans[curL].splice(numb, 1);
        displayQ();
    } else {
        //if all the words have been used
        $("#form").html("<br>Amazing! <br><br> You have used all the words in this mode. <br> Please go back and choose a different mode.<br><br><br>");
    }

};

//Countdown timer
var tDown = function (seconds, critical, end) {
    "use strict";
    var m = Math.floor(seconds / 60),
        s = ("0" + (seconds % 60)).slice(-2);
    $("#timer").text("Time remaining " + m + ":" + s);
    if (seconds <= critical) {
        $("#timer").css("color", "red").css("font-size", "1.1em");
    } else {
        $("#timer").css("color", "black").css("font-size", "1em");
    }
    seconds -= 1;
    if (seconds > -1) {
        timer = setTimeout(function () {
            tDown(seconds, critical, end);
        }, 1000);
    } else {
        end();
    }
};

//Handle timers for different modes
var setModeTimer = function () {
    "use strict";
    if (curM === "0") {
        tDown(300, 30, function () {
            $("#playing").attr("class", "hidden");
            $("#game-over").attr("class", "");
        });
    }
    if (curM === "1") {
        tDown(1200, 120, function () {
            $("#playing").attr("class", "hidden");
            $("#game-over").attr("class", "");
        });
    }
};

//Handle level scoring for different modes
var displayScore = function (correct) {
    "use strict";
    if (curM === "0" || curM === "1") {
        if (thisQFailed === false) {
            if (correct === true) {
                right[curM][curL] += 1;
                total[curM][curL] += 1;
            }
            if (correct === false) {
                total[curM][curL] += 1;
                thisQFailed = true;
            }
            if (correct === "skip") {
                total[curM][curL] += 1;
            }
        }
        if (thisQFailed === true) {
            if (correct === true || correct === "skip") {
                thisQFailed = false;
            }
        }
        score[curM][curL] = right[curM][curL] + "/" + total[curM][curL];
        $("#level-score").text(score[curM][curL]);
    }
};

//Calculate high score and mode score for different modes
var calcHSMS = function () {
    "use strict";
    if (curM === "0" || curM === "1") {
        //calc high score
        if (highRight[curM][curL] < right[curM][curL]) {
            highRight[curM][curL] = right[curM][curL];
            highTotal[curM][curL] = total[curM][curL];
            highScore[curM][curL] = score[curM][curL];
        }
        //calc mode score
        modeScore[curM] = (highRight[curM][0] + highRight[curM][1] + highRight[curM][2] + highRight[curM][3] + highRight[curM][4] + highRight[curM][5]) + "/" + (highTotal[curM][0] + highTotal[curM][1] + highTotal[curM][2] + highTotal[curM][3] + highTotal[curM][4] + highTotal[curM][5]);
    }
};

//Show levels screen and show scores if level has been played before
var showLevels = function () {
    "use strict";
    var i;
    calcHSMS();
    $("#modes").attr("class", "hidden");
    $("#game").attr("class", "hidden");
    $("#selected-level").attr("class", "hidden");
    $("#levels").attr("class", "");
    $("#selected-mode").attr("class", "");
    for (i = 0; i < 6; i += 1) {
        if (levelsPlayed[i] === true) {
            $("#" + i + "-score").html("&nbsp" + highScore[curM][i]);
        }
    }
    $("#mode-score").text(modeScore[curM]);
};

//USER ACTIONS
//On mode selection
$(".mode-buttons").on("click", function () {
    "use strict";
    curM = this.id.split("")[1];
    showLevels();
});

//On back to modes
$("#back-to-modes").on("click", function () {
    "use strict";
    //go back
    $("#levels").attr("class", "hidden");
    $("#modes").attr("class", "");
});

//On level selection
$(".level-buttons").on("click", function () {
    "use strict";
    //set curL
    curL = this.id;
    //load game screen
    $("#levels").attr("class", "hidden");
    $("#game").attr("class", "");
    $("#game-over").attr("class", "hidden");
    $("#playing").attr("class", "");
    $("#selected-level").attr("class", "");
    //update ans array if this level has not been played before
    if (levelsPlayed[curL] === false) {
        //clear questoin from previous level played if it exists
        $("#question").text("");
        //load txt file
        var txtPath = "words/" + curL + ".txt";
        $.get(txtPath, function (txt) {
            ans[curL] = txt.toLowerCase().split('\n');
            //create question
            createQ();
        });
    } else {
        //if ans.curL doesn't need to be updated, we still need to displayQ
        displayQ();
    }
    //make levelsPlayed.curL true for next time
    levelsPlayed[curL] = true;
    //set correct timing according to mode
    setModeTimer();
    //display score
    displayScore();
});

//On form submit
$("#form").on("submit", function (e) {
    "use strict";
    e.preventDefault();
    $("#help").html("");
    var userA = $("#answer").val().toLowerCase();
    console.log("User answer is " + userA);
    console.log("Original answer is " + curA[curL]);
    //if answer is same as original
    if (userA === curA[curL].toLowerCase()) {
        console.log("Submit: successful");
        //display congratulatory text
        $("#result").text(curA[curL] + "! well done!").css("color", "green");
        //update score
        displayScore(true);
        //reset form
        $("#form")[0].reset();
        //create new question
        createQ();
    } else if (scanA(userA) === true) {
        //check if there is another answer that may be correct
        console.log("Alternative answer is " + userA);
        console.log("Submit: successful");
        //display congratulatory text
        $("#result").text(userA + "! well done!").css("color", "green");
        //update score
        displayScore(true);
        //reset form
        $("#form")[0].reset();
        //create new question
        createQ();
    } else {
        //if answer is wrong
        console.log("Submit: unsuccessful");
        //display consoling text
        $("#result").text("bad luck, try again...").css("color", "red");
        //focus cursor and select incorrect answer
        $("#answer").focus();
        $("#answer").select();
        //display score
        displayScore(false);
    }
});

//On skip
$("#skip").on("click", function () {
    "use strict";
    console.log("Submit: skipped");
    //delete text in answer field
    $("#form")[0].reset();
    //display skip text
    $("#result").text("You skipped " + curQ[curL] + ". The correct answer was " + curA[curL]).css("color", "red");
    //display help link
    $("#help").html("<br><a id='help-link'>What does <span id='cur-a'></span> mean?</a>");
    $("#cur-a").text(curA[curL]);
    $("#help-link").attr("href", "http://www.dictionary.com/browse/" + curA[curL]).attr("target", "_blank");
    //update score
    displayScore("skip");
    //create new question
    createQ();
});

//On back to levels
$("#back-to-levels").on("click", function () {
    "use strict";
    //go back
    showLevels();
    clearTimeout(timer);
});

//On play again
$("#play-again").on("click", function () {
    "use strict";
    $("#game-over").attr("class", "hidden");
    $("#playing").attr("class", "");
    displayQ();
    setModeTimer();
});