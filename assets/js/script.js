dealerCount = 0;
// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var faceDownCard = {cardValue: 0, img: 'http://clipart-library.com/images/8cEbeEMLi.png'};
var dealerDrawCard = {cardValue: 6, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerShowCard = {cardValue: 5, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerHoleCard = {cardValue: 5, img: 'https://deckofcardsapi.com/static/img/8H.png'};
var PlayerFirstCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/8H.png'};
var PlayerSecondCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/8C.png'};

// define elements
var dealerCardsEl = $('#DealerCardContainer');
var playerCardsEl = $('#PlayerCardContainer');
// button elements
var buttonHit = $('#buttonHit')
var buttonStand = $('#buttonStand')
var buttonSplit = $('#buttonSplit')
var buttonDD = $('#buttonDD')
var buttonShuffle = $('#buttonShuffle')




// function to display a card
function displayCard(whatCard, whereCard, cardID) {
    var showThisCard = $('<img>');
    var cardDiv = $('<div>');
    cardDiv.addClass('flex-column card');
    showThisCard.attr('id', cardID);
    showThisCard.attr('src', whatCard.img);
    whereCard.append(cardDiv);
    cardDiv.append(showThisCard);
};

//function to show dealer cards
function displayDealerCards () {
    // empty dealer conatianer
    dealerCardsEl.empty();
    // display dealer hole card
    displayCard(faceDownCard, dealerCardsEl, 'hole-card');
    // display dealer show card
    displayCard(dealerShowCard, dealerCardsEl);
};
// comment in next line to display dealer cards
displayDealerCards();

//function for dealer to play their hand
function dealerPlay () {
    // dealers starting count
    dealerCount = dealerShowCard.cardValue + dealerHoleCard.cardValue;
    var dealerStand = false;
    var holeCard = $('#hole-card');
    // display dealer hole card
    // displayCard(dealerHoleCard, dealerCardsEl); 
    holeCard.attr('src', dealerHoleCard.img);
    
    // draw cards until dealer has 17 or greater
    while (dealerCount < 17) {
        // call draw card api function populates dealerDrawCard
        dealerCount = dealerCount + dealerDrawCard.cardValue;
        displayCard(dealerDrawCard, dealerCardsEl);
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
    // append row for current hand title to left playing area column
    var currentHandTitleRowEl = $('<div>');
    currentHandTitleRowEl.addClass('d-flex flex-row name-plate fs-2 fw-b m-2');
    currentHandTitleRowEl.text('Current Hand');
    playingColElLeft.append(currentHandTitleRowEl);
    // append row for current hand to left playing area column
    var currentHandRowEl = $('<div>');
    currentHandRowEl.addClass('d-flex flex-row');
    playingColElLeft.append(currentHandRowEl);
    // append row for current hand title to left playing area column
    var otherHandTitleRowEl = $('<div>');
    otherHandTitleRowEl.addClass('d-flex flex-row name-plate fs-2 fw-b m-2');
    otherHandTitleRowEl.text('Next Hands');
    playingColElRight.append(otherHandTitleRowEl);
    //append row for other hands
    var otherHandsRowEl = $('<div>');
    otherHandsRowEl.addClass('d-flex flex-row');
    playingColElRight.append(otherHandsRowEl);
    
    //display cards in their respective columns
    displayCard(PlayerFirstCard, currentHandRowEl);
    displayCard(PlayerSecondCard, otherHandsRowEl);

    //todo:
    //draw new card and append to correct columns
};
//comment in next line to test split bahavior
// playerSplit();


buttonHit.on("click", function () {
    console.log("Hit")
})

buttonStand.on("click", function () {
    console.log("Stand")
})

buttonSplit.on("click", function () {
    console.log("Split")
})

buttonDD.on("click", function () {
    console.log("DD")
})

buttonShuffle.on("click", function () {
    console.log("Shuffle")
})