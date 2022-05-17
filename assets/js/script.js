
// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var faceDownCard = {cardValue: 0, img: 'https://thumbs.dreamstime.com/z/playing-card-back-side-62x90-mm-17826026.jpg'};
var dealerDrawCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerShowCard = {cardValue: 5, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerHoleCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var PlayerFirstCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/8H.png'};
var PlayerSecondCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/8C.png'};

// define elements
var dealerCardsEl = $('#dealer-cards');
var playerCardsEl = $('#player-cards');


// display dealer show card
displayCard(dealerShowCard, dealerCardsEl);
// display dealer hole card
displayCard(faceDownCard, dealerCardsEl);

// function to display a card
function displayCard(whatCard, whereCard) {
    var showThisCard = $('<img>');
    var cardDiv = $('<div>');
    cardDiv.addClass('col-1 card');
    showThisCard.attr('src', whatCard.img);
    whereCard.append(cardDiv);
    cardDiv.append(showThisCard);
};

//function for dealer to play their hand
function dealerPlay () {
    // dealers starting count
    var dealerCount = dealerShowCard.cardValue + dealerHoleCard.cardValue;
    var dealerStand = false;

    // display dealer hole card
    displayCard(dealerHoleCard, dealerCardsEl);
    
    // draw cards until dealer has 17 or greater
    while (dealerCount < 17) {
        // call draw card api function populates dealerDrawCard
        dealerCount = dealerCount + dealerDrawCard.cardValue;
        displayCard(dealerHoleCard, dealerCardsEl);
    };

    // dealer busts or stands
    if (dealerCount > 21) {
        console.log('dealer BUSTS');
        //call player win function
    } else {
        console.log('dealer stands on ' + dealerCount);
        //call function to compare dealer hand to players
    };

};
//comment in next line to test dealer play
// dealerPlay();




//function to handle player splitting cards
function playerSplit() {
    console.log('player splits');
    //clear player cards row
    playerCardsEl.empty();
    // split player row into current playing column on left and split hand in small col on right.
    var playingColElLeft = $('<div>');
    var playingColElRight = $('<div>');
    playingColElLeft.addClass('col-8');
    playingColElLeft.attr('id', 'current-hand-col');
    playerCardsEl.append(playingColElLeft);
    playingColElRight.addClass('col-4');
    playingColElRight.attr('id', 'other-hands-col');
    playerCardsEl.append(playingColElRight);
    // append row for current hand to left playing area column
    var currentHandRowEl = $('<div>');
    currentHandRowEl.addClass('row');
    playingColElLeft.append(currentHandRowEl);
    //display cards in their respective columns
    displayCard(PlayerFirstCard, currentHandRowEl);
    displayCard(PlayerSecondCard, playingColElRight);

    //todo:
    //draw new card and append to correct columns
};
//comment in next line to test split bahavior
// playerSplit();