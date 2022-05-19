var dealerCount = 0;
var playerCount = 0;
var playerCount2hand = 0;
var playerCount3hand = 0;
var playerCount4hand = 0;

// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var faceDownCard = {
    cardValue: 0,
    img: "http://clipart-library.com/images/8cEbeEMLi.png",
};
var dealerDrawCard = {
    cardValue: 10,
    img: "https://deckofcardsapi.com/static/img/KH.png",
};
var dealerShowCard = {
    cardValue: 5,
    img: "https://deckofcardsapi.com/static/img/KH.png",
};
var dealerHoleCard = {
    cardValue: 10,
    img: "https://deckofcardsapi.com/static/img/KH.png",
};
var PlayerFirstCard = {
    cardValue: 10,
    img: "https://deckofcardsapi.com/static/img/8H.png",
};
var PlayerSecondCard = {
    cardValue: 10,
    img: "https://deckofcardsapi.com/static/img/8C.png",
};

// define elements
var dealerCardsEl = $("#DealerCardContainer");
var playerCardsEl = $("#PlayerCardContainer");
// button elements
var buttonHit = $('#buttonHit')
var buttonStand = $('#buttonStand')
var buttonSplit = $('#buttonSplit')
var buttonDD = $('#buttonDD')
var buttonShuffle = $('#buttonShuffle')
var buttonModalSubmit = $('#buttonModalSubmit')
var startModal = $('#startModal')
var deck_1 = $('#deck_1')
var deck_2 = $('#deck_2')
var deck_3 = $('#deck_3')
var deck_4 = $('#deck_4')
var deck_5 = $('#deck_5')
var deck_6 = $('#deck_6')

// Ryan's addition:
var shuffleBtn = document.getElementById("buttonShuffle");

var drawBtn = document.getElementById("buttonHit");

var deck_id;
var numOfDecks = 1;
var drawCardObj;

function shuffleDeck() {
    var requestUrl = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numOfDecks}`;

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        deck_id = data.deck_id;
        localStorage.setItem("deckId", deck_id);
    });
}

shuffleBtn.addEventListener("click", shuffleDeck);

function drawCard(where, addId) {
    var requestUrl = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        drawCardObj = data;
        return drawCardObj;
    })
    .then(function (drawCardObj) {
        // console.log(drawCardObj.cards[0].image);
        console.log(where);
        displayCard(drawCardObj.cards[0].image, where, addId)
    });
};
drawBtn.addEventListener("click", drawCard);




// function to display a card
function displayCard(whatCard, whereCard, cardID) {
    var showThisCard = $('<img>');
    var cardDiv = $('<div>');
    cardDiv.addClass('flex-column card');
    showThisCard.attr('id', cardID);
    showThisCard.attr('src', whatCard); //removed .img
    whereCard.append(cardDiv);
    cardDiv.append(showThisCard);
};

//function to show dealer cards
function displayDealerCards () {
    // empty dealer conatianer
    dealerCardsEl.empty();
    // display dealer hole card
    displayCard(faceDownCard.img, dealerCardsEl, 'hole-card');
    // display dealer show card
    displayCard(dealerShowCard.img, dealerCardsEl);
};


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
    console.log("dealer BUSTS");
    //call player win function
    } else {
    console.log("dealer stands on " + dealerCount);
    //call function to compare dealer hand to players
    }
}
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
    displayCard(PlayerFirstCard.img, currentHandRowEl);
    displayCard(PlayerSecondCard.img, otherHandsRowEl);

    //draw new cards and append to correct columns
    drawCard(currentHandRowEl);
    drawCard(otherHandsRowEl);

};


buttonHit.on("click", function () {
    console.log("Hit");
});

buttonStand.on("click", function () {
    console.log("Stand");
});

buttonSplit.on("click", function () {
    console.log("Split");
    playerSplit();
});

buttonDD.on("click", function () {
    console.log("DD");
});

buttonShuffle.on("click", function () {
    console.log("Shuffle")
})

buttonModalSubmit.on('click', function () {
    startModal.attr("style", "display: none")
    numOfDecks = selectedDeck
    shuffleDeck()
    displayDealerCards();
    //comment in next line to test dealer play
    // dealerPlay();
})

// Dropdown Menu for decks logic

var selectedDeck = 1;

deck_1.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 1
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');})
deck_2.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 2
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');
})
deck_3.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 3
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');
})
deck_4.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 4
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');
})
deck_5.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 5
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');
})
deck_6.on('click', function (event) {
    event.stopPropagation
    selectedDeck = 6
    $("#dropdownMenuButton1").html($(this).text()+' <span class="caret"></span>');
})


// Jukebox AKA spotify api
