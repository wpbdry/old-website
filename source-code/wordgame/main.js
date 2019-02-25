//create necessary global variables
var ans = {
    bab: [],
    eas: [],
    nor: [],
    har: [],
    ext: [],
    pro: []
};
var curA;
var curQ;
//scoring variables
var right = {
    bab: 0,
    eas: 0,
    nor: 0,
    har: 0,
    ext: 0,
    pro: 0
};
var total = {
    bab: 0,
    eas: 0,
    nor: 0,
    har: 0,
    ext: 0,
    pro: 0
};
//mode variables
var modesPlayed = {
    bab: false,
    eas: false,
    nor: false,
    har: false,
    ext: false,
    pro: false
};
var curM = "";

//create function that scans ans[curM] to check if a word exists
var scanA = function (word) {
    "use strict";
    var ret = false;
    for (var i = 0; i <ans[curM].length; i ++) {
        if (word === ans[curM][i]) {
            ret = true;
            break;
        }
    }
    return(ret);
}

//create function that picks an answer and creates question from it
var createQ = function () {
    "use strict";
    //normal procedure to create a new question
    if (ans[curM].length > 0) {
        //pick random answer
        var numb = Math.floor(Math.random() * (ans[curM].length));
        //set curA
        curA = ans[curM][numb];
        //clear previous current question
        curQ = "";
        //generate curQ
        //split into characters
        var curAChars = curA.split("");
        //scramble characters
        while (curAChars.length > 0) {
            var charNumb = Math.floor(Math.random() * (curAChars.length));
            curQ += curAChars[charNumb];
            curAChars.splice(charNumb, 1);
        }
        //to make sure that it does it again if curQ is the same as any of the possible answers
        while (true) {
            if (scanA(curQ) === true) {
                curQ = "";
                //split into characters
                curAChars = curA.split("");
                //scramble characters
                while (curAChars.length > 0) {
                    var charNumb = Math.floor(Math.random() * (curAChars.length));
                    curQ += curAChars[charNumb];
                    curAChars.splice(charNumb, 1);
                }
            }
            else {
                break;
            }
        }
        //delete that answer from answers to prevent repititions
        ans[curM].splice(numb, 1);
        //display question
        $("#question").text(curQ);
        //focus cursor on answer field
        $("#answer").focus();
    }
    //if all the words have been used
    else {
        $("#form").html("<br>Amazing! <br><br> You have used all the words in this mode. <br> Please go back and choose a different mode.<br><br><br>");
    }

};

//when page loads show modes page
$(document).ready(function () {
    $.get("modes.html", function (data) {
        $("#content").html(data);
    });
});

//when user selects mode
$("#content").on("click", ".mode-buttons", function () {
    "use strict";
    //set curM
    curM = this.id;
    //update ans object if this mode has not been played before
    if (modesPlayed[curM] === false) {
        //load txt file
        var txtPath = "words/" + curM + ".txt";
        $.get(txtPath, function (txt) {
            ans[curM] = txt.toLowerCase().split('\n');
            //need to load game here so that it happens after ans.curM has been created so that createQ words correctly
            $.get("game.html", function (data) {
                $("#content").html(data);
                //load previous score for this mode in case it exists
                $(".right").text(right[curM]);
                $(".total").text(total[curM]);
                $(".wrong").text(total[curM] - right[curM]);
                //create question
                createQ();
        });
    });
    }
    else {
        //if ans.curM doesn't need to be updated, we still need to load game
        $.get("game.html", function (data) {
            $("#content").html(data);
            //load previous score for this mode in case it exists
            $(".right").text(right[curM]);
            $(".total").text(total[curM]);
            $(".wrong").text(total[curM] - right[curM]);
            //create question
            createQ();
        });
    }         
    //make modesPlayed.curM true for next time
    modesPlayed[curM] = true;
});

//on form submit
$("#content").on("submit", "#form", function (e) {
    "use strict";
    e.preventDefault();
    $("#help").html("");
    console.log("User answer is " + $("#answer").val().toLowerCase());
    console.log("Original answer is " + curA);
    var userA = $("#answer").val().toLowerCase();
    //if answer is same as original
    if (userA === curA.toLowerCase()) {
        console.log("successful");
        //display congratulatory text
        $("#result").text(curA + "! well done!").css("color", "green");
        //update score variables
        right[curM] ++;
        total[curM] ++;
        //display scores
        $(".right").text(right[curM]);
        $(".total").text(total[curM]);
        $("#form")[0].reset();
        //create new question
        createQ();
    }
    //check if there is another answer that may be correct
    else if (scanA(userA) === true) {
        console.log("Alternative answer is " + userA);
        console.log("successful");
        //display congratulatory text
        $("#result").text(userA + "! well done!").css("color", "green");
        //update score variables
        right[curM] ++;
        total[curM] ++;
        //display scores
        $(".right").text(right[curM]);
        $(".total").text(total[curM]);
        $("#form")[0].reset();
        //create new question
        createQ();
    }
    //if answer is wrong
    else {
        console.log("unsuccessful");
        //display consoling text
        $("#result").text("bad luck, try again...").css("color", "red");
        //focus cursor and select incorrect answer
        $("#answer").focus();
        $("#answer").select();
        //update score variables and display
        total[curM]++;
        $(".wrong").text(total[curM] - right[curM]);
        $(".total").text(total[curM]);
    }
});

//on skip
$("#content").on("click", "#skip", function () {
    "use strict";
    console.log("skipped");
    //update score variables and display as if wrong
    total[curM] ++;
    $(".wrong").text(total[curM] - right[curM]);
    $(".total").text(total[curM]);
    //delete text in answer field
    $("#form")[0].reset();
    //display skip text
    $("#result").text("You skipped " + curQ + ". The correct answer was " + curA).css("color", "red");
    //display help link
    $("#help").html("<br><a id='help-link'>What does <span id='cur-a'></span> mean?</a>");
    $("#cur-a").text(curA);
    $("#help-link").attr("href", "http://www.dictionary.com/browse/" + curA).attr("target", "_blank");
    //create new question
    createQ();
});

//on back to modes
$("#content").on("click", "#back-to-modes", function () {
    "use strict";
    //go back
    $.get("modes.html", function (data) {
        $("#content").html(data);
        //update scores
        if (modesPlayed.bab) {
            $("#bab-score").text(" " + right.bab + "/" + total.bab);
        }
        if (modesPlayed.eas) {
            $("#eas-score").text(" " + right.eas + "/" + total.eas);
        
        }
        if (modesPlayed.nor) {
            $("#nor-score").text(" " + right.nor + "/" + total.nor);
        
        }
        if (modesPlayed.har) {
            $("#har-score").text(" " + right.har + "/" + total.har);
        
        }
        if (modesPlayed.ext) {
            $("#ext-score").text(" " + right.ext + "/" + total.ext);
        
        }
        if (modesPlayed.pro) {
            $("#pro-score").text(" " + right.pro + "/" + total.pro);
        }
        
        //total score
        var totRight = right.bab + right.eas + right.nor + right.har + right.ext + right.pro;
        var totTot = total.bab + total.eas + total.nor + total.har + total.ext + total.pro;
        $("#tot-score").text(" " + totRight + " / " + totTot);
    });
});