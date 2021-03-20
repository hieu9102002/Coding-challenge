import * as fs from "fs";
const file1:string = "./output/file_1.txt";
const file2:string = "./output/file_2.txt";
const numberGames:number = 1000;

var playerOneWin:number = 0;
var playerOneLose:number = 0;
var draw:number = 0;

function getRndInteger(min:number, max:number):number {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function Create2DArray(rows:number):string[][] {
    var arr:string[][] = [];
  
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
  
    return arr;
}

function CheckEmptyCell(board:string[][], row:number, col:number):boolean{
    return board[row][col] != null
}

function CheckWinner(board:string[][]):boolean{
    //checkRow
    for (var i:number = 0; i <= 2; i++){
        if (CheckEmptyCell(board,0,i) && board[0][i] === board[1][i] && board[0][i] === board[2][i]) return true;
    }
    //checkCol
    for (var i:number = 0; i <=2; i++){
        if (CheckEmptyCell(board,i,0) && board[i][0] === board[i][1] && board[i][0] === board[i][2]) return true;
    }
    //checkDiag
    if(CheckEmptyCell(board,0,0) &&board[0][0] === board[1][1] && board[0][0] === board[2][2]) return true;
    if(CheckEmptyCell(board,2,0) &&board[2][0] === board[1][1] && board[2][0] === board[0][2]) return true;
    return false;
}

function GamePlay(board:string[][]):string{
    for(var i:number = 0; i < 9; i++) {
        var firstPlayerMove:boolean = (i%2==0);
        var row = getRndInteger(0,2);
        var col = getRndInteger(0,2);
        while (CheckEmptyCell(board,row,col)) {
            row = getRndInteger(0,2);
            col = getRndInteger(0,2);
        }
        firstPlayerMove ? board[row][col] = "X" : board[row][col] = "O";
        if (CheckWinner(board)) {
            if (firstPlayerMove){
                playerOneWin += 1;
                return "Win";
            } else {
                playerOneLose +=1;
                return "Lose";
            }
        }
        firstPlayerMove = !firstPlayerMove;
    } 
    draw += 1;
    return "Draw";
}

function PrintBoard(board:string[][]):void{
    var print:string = "";
    for(var i:number = 0; i < 3; i++){
        for(var j:number = 0; j<3; j++){
            CheckEmptyCell(board, i, j) ? print += board[i][j] : print += "-";
            print += " | ";
        }
        print += "\n";
    }
    console.log(print)
}

function WriteToFile1(gameRecord:string[]):void{
    fs.writeFile(file1, '', function(){console.log('done')})
    const stream = fs.createWriteStream(file1, {flags: 'a'});
    stream.write("game_number, player_one_result \n");
    for(var i:number = 0; i < gameRecord.length; i++){
        stream.write(i.toString() + ", " + gameRecord[i].toString() + "\n");
    }
}

function WriteToFile2():void{
    var playerOneWinrate:number = playerOneWin/numberGames*100;
    var playerTwoWinrate:number = playerOneLose/numberGames*100;
    var drawRate:number = draw/numberGames*100;
    fs.writeFile(file2, '', function(){console.log('done')});
    const stream = fs.createWriteStream(file2, {flags: 'a'});
    stream.write("Player 1 winrate: " + playerOneWinrate.toString() + "% \n")
    stream.write("Player 2 winrate: " + playerTwoWinrate.toString() + "% \n")
    stream.write("Draw rate: " + drawRate.toString() + "% \n")
}

function main():void{
    var gameRecord:string[] = new Array();
    for (var i = 0; i < numberGames; i++){
        let board = Create2DArray(3);
        gameRecord.push(GamePlay(board));
    }
    console.log("Done");
    WriteToFile1(gameRecord);
    WriteToFile2();
}

main()