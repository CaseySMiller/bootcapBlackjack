var nada = "nada"; // throwaway parameter for drawCard function
var dealerCount = { val: 0 };
var playerCount = { val: 0 };
var splitCount = -1;
var playerOtherHands = [
  [
    { cardValue: 0, img: "" },
    { cardValue: 0, img: "" },
  ], //0 -- other hand for players first split
  [
    { cardValue: 0, img: "" },
    { cardValue: 0, img: "" },
  ], //1 -- other hand for players second split
  [
    { cardValue: 0, img: "" },
    { cardValue: 0, img: "" },
  ], //2 -- other hand for playes third split
];

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
  cardValue: 8,
  img: "https://deckofcardsapi.com/static/img/8H.png",
};
var PlayerSecondCard = {
  cardValue: 8,
  img: "https://deckofcardsapi.com/static/img/8C.png",
};

// declare elements for splitting hands
var otherHandsRowEl;
var playingColElRight;
var playingColElLeft;
var currentHandRowEl;

// define elements
var dealerCardsEl = $("#DealerCardContainer");
var playerCardsEl = $("#PlayerCardContainer");
// variable to tell playHand and doubleDown functions where to place cards
var wherePlay = playerCardsEl;
// button elements
var buttonHit = $("#buttonHit");
var buttonStand = $("#buttonStand");
var buttonSplit = $("#buttonSplit");
var buttonDD = $("#buttonDD");
var buttonShuffle = $("#buttonShuffle");
var buttonModalSubmit = $("#buttonModalSubmit");
var startModal = $("#startModal");
var deck_1 = $("#deck_1");
var deck_2 = $("#deck_2");
var deck_3 = $("#deck_3");
var deck_4 = $("#deck_4");
var deck_5 = $("#deck_5");
var deck_6 = $("#deck_6");

// Ryan's attempt at starting  chip stack
var confirmButton = $("#confirmWager");
var chipCount = $("#counter");
var increaseButton = $("#add");
var decreaseButton = $("#subtract");
var currentWagerAmount = $("#bet");
var getNewChips = $("#newChips");
var count = 0;
var stack = localStorage.getItem("stack");
var bet = 0;

chipCount.text(`${count} chips`);

getNewChips.on("click", function () {
  if (count === 0) {
    count = 50;
    localStorage.setItem("stack", count);
    chipCount.text(`${count} chips`);
  } else {
    count;
  }
});

increaseButton.on("click", function () {
  if (count >= 1) {
    bet++;
    count--;
    chipCount.text(`${count} chips`);
    currentWagerAmount.text(`${bet} on this hand`);
    localStorage.setItem("stack", count);
  } else if (count === 0 && bet >= 1) {
    alert(`You have no more chips to wager!`);
  } else {
    $("<button>Request More Chips</button>").on("click", function () {
      count = 50;
    });
  }
});

decreaseButton.on("click", function () {
  if (count >= 0 && bet > 0) {
    count++;
    bet--;
    counter.textContent = count;
    currentWagerAmount.text(`${bet} on this hand`);
    localStorage.setItem("stack", count);
  }
});

function startDeal() {
  displayDealerCards();
  // playerPlay();
}

confirmButton.on("click", function () {
  startDeal();
});

// Ryan's addition:
var shuffleBtn = document.getElementById("buttonShuffle");

var drawBtn = document.getElementById("buttonHit");

var cardValue;
var deck_id;
var numOfDecks = 1;
var drawCardObj = {};

shuffleBtn.addEventListener("click", shuffleDeck);

drawBtn.addEventListener("click", drawCard);

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

// parameters explanation for drawCard function: (where to display the image,  what object to store the image in,  what object to use the img value ie. playerCount (no .val),  object to store the card value in)
function drawCard(whereImgShow, whereImgStore, whereValUse, whereValStore) {
  deck_id = localStorage.getItem("deckId");
  var requestUrl = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      drawCardObj = data;
      //call function to display the card image in whereImg
      displayCard(drawCardObj.cards[0].image, whereImgShow);
      //store img address string to whereImgStore
      whereImgStore.img = drawCardObj.cards[0].image;

      //use the value of the card in whereValuse
      useValue(whereValUse, whereValStore, drawCardObj.cards[0].value);
      // store the value of the drawn card to whereValStore
      whereValStore.cardValue = drawCardObj.cards[0].value;
      // return;
    });
}

//function to manipulate the card value taken from drawCard
//pass an array index or the dealerCount or playerCount variable to where
function useValue(whereUse, whereStore, what) {
  var thisVal = 0;
  //convert face cards to 10 and ace to 11
  if (what == "KING" || what == "QUEEN" || what == "JACK") {
    thisVal = 10;
  } else if (what == "ACE") {
    thisVal = 11;
  } else {
    thisVal = parseInt(what, 10);
  }

  //store thisVal to whereStore
  whereStore.cardValue = thisVal;
  //use thisVal in whereUse
  whereUse.val += thisVal;
  //check if an ace put player over 21 and if so makes the ace value=1
  if (thisVal === 11 && whereUse.val > 21) {
    whereUse.val -= 10;
  }
}

// function to display a card and append it to the HTML in whereCard location
function displayCard(whatCard, whereCard) {
  if (whereCard == "nada") {
    return;
  }
  var showThisCard = $("<img>");
  var cardDiv = $("<div>");
  cardDiv.addClass("flex-column card");
  showThisCard.attr("src", whatCard);
  whereCard.append(cardDiv);
  cardDiv.append(showThisCard);
}

//function to show dealer cards
function displayDealerCards() {
  // empty dealer conatianer
  dealerCardsEl.empty();
  // display dealer hole card
  displayCard(faceDownCard.img, dealerCardsEl);
  //draw dealers hole card and save img and val to object and update dealerCount
  drawCard(nada, dealerHoleCard, dealerCount, dealerHoleCard);
  //draw dealer show card and display and save img and val to object and update dealerCount
  drawCard(dealerCardsEl, dealerShowCard, dealerCount, dealerShowCard);
}

//function for dealer to play their hand
function dealerPlay() {
  // dealers starting count
  dealerCount.val = dealerShowCard.cardValue + dealerHoleCard.cardValue;
  var dealerStand = false;
  var holeCard = $("#hole-card");
  // display dealer hole card
  // displayCard(dealerHoleCard, dealerCardsEl);
  holeCard.attr("src", dealerHoleCard.img);

  // draw cards until dealer has 17 or greater
  while (dealerCount.val < 17) {
    // call draw card api function populates dealerDrawCard
    dealerCount.val = dealerCount.val + dealerDrawCard.cardValue;
    displayCard(dealerDrawCard, dealerCardsEl);
  }
  // dealer busts or stands
  if (dealerCount > 21) {
    console.log("dealer BUSTS");
    //call player win function
  } else {
    console.log("dealer stands on " + dealerCount.val);
    //call function to compare dealer hand to players
  }
}
//comment in next line to test dealer play
// dealerPlay();

// function for user to play their hand
// function playerPlay() {
//   var firstCard = $("#firstDealt");
//   var secondCard = $("#secondDealt");
//   playerCardsEl.empty();

//   drawCard(playerCardsEl, "firstCard");
//   console.log(firstCard);
//   drawCard(playerCardsEl, "secondCard");
//   console.log(secondCard);
//   playerCount = PlayerFirstCard.cardValue + PlayerSecondCard.cardValue;

//   if (playerCount === 21) {
//     console.log(
//       "Player wins with Blackjack and is paid out 3/2 on their wager"
//     ); // run player wins function?
//   } else if (PlayerFirstCard.cardValue === PlayerSecondCard.cardValue) {
//     console.log("Would you like to split your hand?"); // run playerSplit()?
//   } else if (currentHandTotal < 21) {
//     // this function needs to be created
//     console.log("Would you like to hit or stand?"); // should this be an alert or modal?
//   } else {
//     console.log("Player stands on " + dealerCount);
//     //call function to compare dealer hand to players
//   }

//   // displayCard(PlayerFirstCard, playerCardsEl, cardID);
// }
// playerPlay();
//comment in next line to test dealer play
// dealerPlay();
//this is a testing function only and is not used anywhere in the aplication
function testThis(element) {
  dealerShowCard.cardValue = "foo";
  console.log(dealerShowCard);
}

//function to handle player splitting cards
function playerSplit() {
  splitCount++;
  // check if player has already split 3 times this hand and return out of function if so
  if (splitCount > 2) {
    alert("too many splitty for you"); //change this to warning modal
    return;
  } else if (splitCount === 0) {
    // set up columns if this is the first split
    //clear player cards row
    playerCardsEl.empty();
    // split player row into current playing column on left and split hand in small col on right.
    playingColElLeft = $("<div>");
    playingColElRight = $("<div>");
    playingColElLeft.addClass("col-8");
    playingColElLeft.attr("id", "current-hand-col");
    playerCardsEl.append(playingColElLeft);
    playingColElRight.addClass("col-4");
    playingColElRight.attr("id", "other-hands-col");
    playerCardsEl.append(playingColElRight);
    // append row for current hand title to left playing area column
    var currentHandTitleRowEl = $("<div>");
    currentHandTitleRowEl.addClass("d-flex flex-row name-plate fs-2 fw-b m-2");
    currentHandTitleRowEl.text("Current Hand");
    playingColElLeft.append(currentHandTitleRowEl);
    // append row for current hand to left playing area column
    currentHandRowEl = $("<div>");
    currentHandRowEl.addClass("d-flex flex-row");
    playingColElLeft.append(currentHandRowEl);
    // append row for current hand title to left playing area column
    var otherHandTitleRowEl = $("<div>");
    otherHandTitleRowEl.addClass("d-flex flex-row name-plate fs-2 fw-b m-2");
    otherHandTitleRowEl.text("Next Hands");
    playingColElRight.append(otherHandTitleRowEl);
  } else {
    currentHandRowEl.empty(); //clear current hand row if 2nd or 3rd split
  }
  //append row for other hands
  otherHandsRowEl = $("<div>");
  otherHandsRowEl.addClass("d-flex flex-row");
  otherHandsRowEl.attr("id", "splitHand" + splitCount);
  playingColElRight.append(otherHandsRowEl);

  //display cards in their respective columns
  displayCard(PlayerFirstCard.img, currentHandRowEl);
  displayCard(PlayerSecondCard.img, otherHandsRowEl);

  //store values of split card to other cards array
  playerOtherHands[splitCount][0].cardValue = PlayerSecondCard.cardValue;
  playerOtherHands[splitCount][0].img = PlayerSecondCard.img;
  playerCount = PlayerFirstCard.cardValue;

  //draw new cards and append images to correct columns
  //adds card values to their respective places and calculates playerCount for current hand
  drawCard(currentHandRowEl, PlayerSecondCard, playerCount, PlayerSecondCard);
  drawCard(
    otherHandsRowEl,
    playerOtherHands[splitCount][1],
    nada,
    playerOtherHands[splitCount][1]
  );

  // TODO:
  // call play function
  // call function to pull more player chips (maybe in player play function)
}

// function for doubling down
function doubleDown() {
  console.log("Double down dummy!");
  // double bet
  // draw only
  drawCard(wherePlay, nada, playerCount, nada);

  // dealer play and check win/loss
}

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
  doubleDown();
});

buttonShuffle.on("click", function () {
  console.log("Shuffle");
});

buttonModalSubmit.on("click", function () {
  startModal.attr("style", "display: none");
  numOfDecks = selectedDeck;
  // shuffleDeck()
  displayDealerCards();
  //comment in next line to test dealer play
  // dealerPlay();
});

// Dropdown Menu for decks logic

var selectedDeck = 1;

deck_1.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 1;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});
deck_2.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 2;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});
deck_3.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 3;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});
deck_4.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 4;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});
deck_5.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 5;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});
deck_6.on("click", function (event) {
  event.stopPropagation;
  selectedDeck = 6;
  $("#dropdownMenuButton1").html(
    $(this).text() + ' <span class="caret"></span>'
  );
});

// Invalid play modal popup

var invalidConfirm = $("#invalidConfirm");
var invalidAction = $("#invalidAction");

invalidConfirm.on("click", function () {
  invalidAction.attr("style", "display: none");
});

// Function to call invalid play modal

function invalidActionDisplay() {
  invalidAction.attr("style", "display: flex");
}

// Buttons for chips and chip count.

// var chipCount = $("#counter"); - current stack of chips
// var increaseButton = $("#add"); - increasing your bet
// var decreaseButton = $("#subtract"); - decreasing bet
// var currentWagerAmount = $("#bet"); - current bet
// var getNewChips = $("#newChips"); - only should be needed at beginning game and then when the stack hits zero
