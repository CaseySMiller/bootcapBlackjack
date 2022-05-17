

// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var dealerDrawCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerShowCard = {cardValue: 5, img: 'https://deckofcardsapi.com/static/img/KH.png'};
var dealerHoleCard = {cardValue: 10, img: 'https://deckofcardsapi.com/static/img/KH.png'};
// define elements
var dealerCards = $('#dealer-cards');

// display dealer show card
var showThisCard = $('<img>');
var cardDiv = $('<div>');
cardDiv.addClass('col-1 card');
showThisCard.attr('src', dealerShowCard.img);
dealerCards.append(cardDiv);
cardDiv.append(showThisCard);



function dealerPlay () {
    // dealers starting count
    var dealerCount = dealerShowCard.cardValue + dealerHoleCard.cardValue;
    var dealerStand = false;

    // display dealer hole card
    cardDiv = $('<div>');
    cardDiv.addClass('col-1 card');
    showThisCard = $('<img>');
    showThisCard.attr('src', dealerHoleCard.img);
    dealerCards.append(cardDiv);
    cardDiv.append(showThisCard);

    // draw cards until dealer has 17 or greater
    while (dealerCount < 17) {
        // call draw card api function populates dealerDrawCard
        dealerCount = dealerCount + dealerDrawCard.cardValue;
        cardDiv = $('<div>');
        cardDiv.addClass('col-1 card');
        showThisCard = $('<img>');
        showThisCard.attr('src', dealerDrawCard.img);
        dealerCards.append(cardDiv);
        cardDiv.append(showThisCard);
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

//comment in next line to test
// dealerPlay();



