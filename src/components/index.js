import React, { Component } from "react";
import '../App.css';

class BlackJack extends Component {

    constructor(props){
        super(props); 
        this.state = {
            deck: [],
            hidden: null,
            
            dealerSum: 0,
            yourSum : 0,
            yourAceCount : 0,

            playerChips: 1000,
            betAmount: 0,
        }

 
        this.canHit = true
    }

    componentDidMount () {
        this.buildDeck();
        this.shuffleDeck();
        this.startGame();
  };

    buildDeck = () => {
        let values = ["A", "2", "3", "4", "5", "6", "7","8","9","10","J","Q","K"];
        let types = ["C","D","H","S"];
        this.state.deck = [];

        for (let i = 0; i < types.length; i++){
            for (let j = 0; j < values.length; j++){
                this.state.deck.push(values[j] + "-" + types[i]); 
                }
            }
    }

    shuffleDeck = () => {
        for (let i = 0; i < this.state.deck.length; i++) {
        let j = Math.floor(Math.random() * this.state.deck.length);
        let temp = this.state.deck[i];
        this.state.deck[i] = this.state.deck[j];
        this.state.deck[j] = temp;
        }
    }

    startGame = () => {
        const hiddenCard = this.state.deck.pop();
        const dealerSum = this.state.dealerSum + this.getValue(hiddenCard);
        const dealerAceCount = this.checkAce(hiddenCard);

        this.setState({
            hidden: hiddenCard,
            dealerSum: dealerSum,
            dealerAceCount: dealerAceCount,
        })

        while (this.state.dealerSum < 17) {
            let cardImg = document.createElement("img");
            let card = this.state.deck.pop();
            cardImg.src = "cards/" + card + ".png";
            this.state.dealerSum += this.getValue(card);
            this.dealerAceCount += this.checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
        }
        
        for (let i = 0; i < 1; i++) {
            let cardImg = document.createElement("img");
            let card = this.state.deck.pop();
            cardImg.src = "cards/" + card + ".png";
            this.state.yourSum += this.getValue(card);
            this.state.yourAceCount += this.checkAce(card);
            document.getElementById("your-cards").append(cardImg);
        }

        document.getElementById("hit").addEventListener("click", this.hit);
        document.getElementById("stay").addEventListener("click", this.stay);
    
    }
    placeBet = (amount) => {
        if (amount <= this.state.playerChips){
            this.setState({
                betAmount: amount,
                playerChips: this.state.playerChips - amount,
            });
        }else {
            alert("Você não tem mais fichas!")
        }
    }

   hit = () => {
    if (!this.canHit) {
      return;
    }

    let cardImg = document.createElement("img");
    let card = this.state.deck.pop();
    cardImg.src = "cards/" + card + ".png";
    this.state.yourSum += this.getValue(card);
    this.state.yourAceCount += this.checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (this.reduceAce(this.state.yourSum, this.state.yourAceCount) > 21){
        this.canHit = false; 
    }
  }

   stay = () => {
    this.state.dealerSum = this.reduceAce(this.state.dealerSum, this.state.dealerAceCount);
    this.state.yourSum = this.reduceAce(this.state.yourSum, this.state.yourAceCount);

    this.canHit = false;
    document.getElementById("hidden").src = "cards/" + this.state.hidden + ".png";
    
    let message = "";
    if (this.state.yourSum > 21){
      message = "You Lose!";
    }
    else if (this.state.dealerSum > 21){
      message = "You Win!"
    }
    else if (this.state.yourSum === this.state.dealerSum) {
      message = "Tie!";
    }
    else if (this.state.yourSum > this.state.dealerSum) {
      message = "You Win!";
    }
    else if (this.state.yourSum < this.state.dealerSum) {
      message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = this.state.dealerSum;
    document.getElementById("your-sum").innerText = this.state.yourSum;
    document.getElementById("results").innerText = message;
  }

   getValue = (card) => {
    let data = (typeof card === 'string') ? card.split("-") : []
    let value = data[0];

    if (isNaN(value)){
      if (value === "A") {
        return 11;
      }
      return 10; 
    }
    return parseInt(value)
  }

   checkAce= (card) =>  {
    if (typeof card === 'string' && card[0] === "A") {
      return 1;
    }
    return [];
  }

   reduceAce = (playerSum, playerAceCount) => {
    while(playerSum > 21 && playerAceCount > 0){
      playerSum -= 10;
      playerAceCount -= 1;
    }
    return playerSum;
  }
  
  render() {
  return (
    <div className='container'>
        <div>
            <h2>Dealer: <span id="dealer-sum"></span></h2>
            <div id="dealer-cards">
                <img id='hidden' src="cards/BACK.png" alt='card'/>
            </div>
            <h2>You <span id="your-sum"></span></h2>
            <div id="your-cards">
            </div>
            <br />
            <button id="hit">Hit</button>
            <button id="stay">Stay</button>
            <p id="results"></p>
        </div>
        <div className="aposta">
            <h2>Fichas do Jogador: {this.state.playerChips}</h2>
            <h2>Aposta: {this.state.betAmount}</h2>
            <button className="btn-aposta" onClick={() => this.placeBet(10)}>Apostar 10 fichas</button>
            <button className="btn-aposta" onClick={() => this.placeBet(50)}>Apostar 50 fichas</button>
            <button className="btn-aposta" onClick={() => this.placeBet(100)}>Apostar 100 fichas</button>
        </div>
    </div>
  );
}
}

export default BlackJack;
