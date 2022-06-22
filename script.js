const GameFlow = ((turnCount = 0) => {
//turncount being defined in the parameters gives it a default value if nothing is passed
    const switchTurns = (resetTurns) => {
        turnCount++
        if (resetTurns == 0) {turnCount = 0}   
        return (turnCount % 2 == 0) ? player1 : player2         
    }
    //start the turn?
    const updateMoves = (cell, cellLocation) => {
        let currentPlayer = switchTurns()
        currentPlayer.setMoves(cellLocation) 
        Gameboard.renderBoard(currentPlayer, cell);   
        Gameboard.checkIfWin(currentPlayer)
    }
    return {switchTurns, updateMoves}

})()

const Gameboard = ( () => {
     let turnsLeftUntilTie = 8;
     let btnEventListenersAdded = false;
     let winnerAnnoucementElement = document.querySelector(".winner")
//ADD OR REMOVE CELL EVENT LISTENERS/ default is add
    const AddOrRemovelisteners = (removeListner = "add") => {
        let board = new Array(9).fill("")
        let boardDisplay = document.querySelectorAll(".cell")
        let cellCounter = 0
        boardDisplay.forEach( (cell) => {
            if (removeListner == "add"){
                cell.setAttribute('data-cell-num', cellCounter);
                cell.addEventListener("mouseup", () => {
                    let cellClick = cell.getAttribute('data-cell-num');            
                    GameFlow.updateMoves(cell, cellClick)}, {once : true});
                    cellCounter++;
                }
            else{
//CLONE AND REPLACE NODE - cloning does not keep event listeners that were added via JS
                newCell = cell.cloneNode(true);
                cell.parentNode.replaceChild(newCell, cell);
                }
        })

        if (btnEventListenersAdded == false) {
            btnEventListenersAdded = true

            let resetButton = document.getElementById("reset")
            resetButton.addEventListener("mouseup", resetGame)

            let changeNamesButton = document.getElementById("change_names")
            changeNamesButton.addEventListener("mouseup", toggleFormVis)

            let xButton = document.getElementById("x_button")
            xButton.addEventListener("mouseup", toggleFormVis)

            let switchNamesButton = document.getElementById("switch_names_button")
                switchNamesButton.addEventListener("click", () => {
                Gameboard.switchPlayerNames()
            })

            let inputElement = document.getElementById("user_name")
            let NameChangeSubmitButton = document.getElementById("submit_button")
            NameChangeSubmitButton.addEventListener("click", () => {
                Gameboard.toggleFormVis()
                let inputPlaceholderText = inputElement.getAttribute("placeholder")
                let nameChangePlayer
                inputPlaceholderText == player1.getPlayerName() ? nameChangePlayer = player1 : nameChangePlayer = player2
                let newPlayerName = document.getElementById("user_name").value
                if (newPlayerName == "") {newPlayerName = nameChangePlayer.getPlayerSymbol()}
                inputElement.setAttribute("placeholder", newPlayerName)
                nameChangePlayer.setPlayerName(newPlayerName) 
            })
        } 
    }
    
//RESET, MAKE NEW PLAYERS, CLEAR BOARD
    const resetGame = () => {
        let player1Name = player1.getPlayerName()
        let player2Name = player2.getPlayerName()
        player1 = PlayerMaker("X")
        player1.setPlayerName(player1Name)
        player2 = PlayerMaker("O")
        player2.setPlayerName(player2Name)
        renderBoard(player1,"", "reset")
        AddOrRemovelisteners("remove")
        AddOrRemovelisteners("add")
        turnsLeftUntilTie = 8;
        GameFlow.switchTurns(0)
        winnerAnnoucementElement.textContent = ""
    }

//CHECK IF A PLAYER WINS PER TURN
    const checkIfWin = (player) => { 
        let isWinner = false       
        let winConditions = 
                    [ ["x","x","x","","","","","","",],
                      ["","","","x","x","x","","","",],
                      ["","","","","","","x","x","x",],
                      ["x","","","x","","","x","","",],
                      ["","x","","","x","","","x","",],
                      ["","","x","","","x","","","x",],
                      ["x","","","","x","","","","x",],
                      ["","","x","","x","","x","","",],]

        let playerMoveArray = player.getPlayerMoves() 
        winConditions.forEach((winCondition) => {
        let matches = 0;
        for (let i=0; i<=winCondition.length; i++){
            if (winCondition[i] == "x" && winCondition[i] == playerMoveArray[i]){
                matches++;
                if (matches >= 3){
                    winnerAnnoucementElement.textContent = `${player.getPlayerName()} Wins!`
                    AddOrRemovelisteners("Remove")  
                    isWinner = true;                
                }
            }
            }   
        })
        if (turnsLeftUntilTie == 0 && isWinner == false){
            winnerAnnoucementElement.textContent = `Tie`
            AddOrRemovelisteners("Remove")
        }
        turnsLeftUntilTie--
        
    }       

    const renderBoard = (player, cell, reset="") => {
        //
        let boardDisplay = document.querySelectorAll(".cell")
        let playerSymbol = player.getPlayerSymbol()   
        //DRAW OUT THE SYMBOLS
        cell.textContent = playerSymbol
        if (reset == "reset"){
             boardDisplay.forEach((cell) => {
            cell.textContent = ""
            }            
        )}
    }

    const toggleFormVis = () => {
        const nameChange = document.querySelector(".form-div")
        nameChange.classList.toggle("visible")
        if (document.querySelector(".form-wrapper").style.width == "100%"){
            document.querySelector(".form-wrapper").style.width = "0"        
        }
        else {document.querySelector(".form-wrapper").style.width = "100%"}
    }

    const switchPlayerNames = () => {
        let inputBox = document.getElementById("user_name")
        inputBox.getAttribute("placeholder") != player2.getPlayerName() ? inputBox.setAttribute("placeholder", player2.getPlayerName()) : inputBox.setAttribute("placeholder", player1.getPlayerName()) 
        return inputBox 
        
    }

    AddOrRemovelisteners()
    return {checkIfWin, renderBoard, resetGame, toggleFormVis, switchPlayerNames }
    
})()

const PlayerMaker = (symbol) => {
    //make a player, store array and store player symbol, store player number?
    let movesArray = new Array(9).fill("");
    let playerName = "";
    let getPlayerSymbol = () => symbol;
    let getPlayerMoves = () => movesArray;
    let getPlayerName = () => playerName;
    const setMoves = (playerMove) => {
        movesArray[playerMove] = 'x';
    }
    const setPlayerName = (playerNameChange) => {
        playerName = playerNameChange        
    }
    return {setMoves, getPlayerSymbol, getPlayerMoves, setPlayerName, getPlayerName}
}


let player1 = PlayerMaker("X")
player1.setPlayerName("X")
let player2 = PlayerMaker("O")
player2.setPlayerName("O")





    
