<!DOCTYPE html>
<!------------------------------------------------------------------------
_/                _/  _/_/_/    _/_/_/    _/_/_/    _/_/_/    _/      _/  
_/              _/   _/    _/  _/    _/  _/    _/  _/    _/    _/  _/     
_/    _/_/    _/    _/_/_/    _/_/_/    _/    _/  _/_/_/        _/      
_/  _/  _/  _/     _/        _/    _/  _/    _/  _/  _/        _/       
_/_/    _/_/      _/        _/_/_/    _/_/_/    _/    _/      _/  made it!
------------------------------------------------------------------------->

<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Dice-roll</title>
    <link rel="icon" href="icon.png">
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <h1>
        Welcome to my experimental webpage using PHP
    </h1>
    <p>
	    Let's roll a die until we get 3 of the same number in a row:
	</p>
	
    <?php
        //keep track of how many times the same number has appeared in a row
        $numCount = 1;
        //set $ to end loop
        $loopCond = true;
        //keep track of total rolls
        $rolls = 0;
        //to check if number is the repeating
        $prevNum = 0;
    	//while loop
        while ($loopCond == true) {
            $num = rand(1, 6);
            $rolls++;
            echo "<span class = \"coin\"> {$num} </span>";
            //handle counting
            if($num == $prevNum){
                $numCount++;
            }
            else {
                $numCount = 1;
            }
            $prevNum = $num;
            //handle ending
            if($numCount == 3){
                $loopCond = false;
                echo "<div>Congratulations! You got three {$num}s in a row after only {$rolls} rolls!</div><div>Reload page to try again</div>";
            }
            //preventative measure
            if($rolls === 500){
                $loopCond = false;
                echo "<div>Reached maximum number of rolls 500. Please reload page</div>";
            }
            unset($num);
        }
        unset($numCount);
        unset($loopCond);
        unset($rolls);
        unset($prevNum);
    ?>
    
</body>
</html>