var nada = "nada"; // throwaway parameter for drawCard function
var dealerCount = { val: 0 };
var playerCount = { val: 0 };
var splitCount = -1;
var playerOtherHands = [
  [
    { value: 0, img: "" },
    { value: 0, img: "" },
  ], //0 -- other hand for players first split
  [
    { value: 0, img: "" },
    { value: 0, img: "" },
  ], //1 -- other hand for players second split
  [
    { value: 0, img: "" },
    { value: 0, img: "" },
  ], //2 -- other hand for playes third split
];

// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var faceDownCard = {
  value: 0,
  img: "http://clipart-library.com/images/8cEbeEMLi.png",
};
var dealerDrawCard = {
  value: 10,
  img: "https://deckofcardsapi.com/static/img/KH.png",
};
var dealerShowCard = {
  value: 5,
  img: "https://deckofcardsapi.com/static/img/KH.png",
};
var dealerHoleCard = {
  value: 10,
  img: "https://deckofcardsapi.com/static/img/KH.png",
};
var PlayerFirstCard = {
  value: 8,
  img: "https://deckofcardsapi.com/static/img/8H.png",
};
var PlayerSecondCard = {
  value: 8,
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

confirmButton.on("click", function () {
  startDeal();
});

function startDeal() {
  displayDealerCards();
  openingDeal();
}

// Ryan's addition:
var shuffleBtn = document.getElementById("buttonShuffle");

var drawBtn = document.getElementById("buttonHit");

var cardValue; //@Ryan: i changed every "cardValue" to "value" except this one so that we could match up properl;y with our api
var deck_id;
var numOfDecks = 1;
var drawCardObj = {};

shuffleBtn.addEventListener("click", shuffleDeck);

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
  if (deck_id === null) {
    return;
  }
  var requestUrl = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      drawCardObj = data;
      //   console.log(data);
      //call function to display the card image in whereImg
      displayCard(drawCardObj.cards[0].image, whereImgShow);
      //store img address string to whereImgStore
      whereImgStore.img = drawCardObj.cards[0].image;

      //use the value of the card in whereValuse
      useValue(whereValUse, whereValStore, drawCardObj.cards[0]);
      // store the value of the drawn card to whereValStore
      if (whereValStore == "nada" || typeof whereValStore == "undefined") {
      } else {
        whereValStore.value = drawCardObj.cards[0];
      }
      // return;
    });
}

//function to manipulate the card value taken from drawCard
//pass an array index or the dealerCount or playerCount variable to where
var thisVal = 0;
//dealerCount,dealerHoleCard,drawCardObj.cards[0]
function useValue(whereUse, whereStore, what) {
  // console.log(what.value);
  thisVal = 0;
  //convert face cards to 10 and ace to 11
  if (what.value == "KING" || what.value == "QUEEN" || what.value == "JACK") {
    thisVal = 10;
    // console.log('face card');
  } else if (what.value == "ACE") {
    // console.log('ace');
    thisVal = 11;
  } else {
    // console.log('sumthin');
    thisVal = parseInt(what.value, 10);
  }
  console.log(thisVal);
  console.log(whereUse);

  // check if whereStore is not defined
  if (whereStore == "nada" || typeof whereStore == "undefined") {
  } else {
    //store thisVal to whereStore
    whereStore.value = thisVal;
  }
  //check if whereUse is not defined
  if (whereUse == "nada" || typeof whereUse == "undefined") {
  } else {
    //use thisVal in whereUse
    whereUse.val += thisVal;
  }

  //check if an ace put player over 21 and if so makes the ace value=1
  if (thisVal === 11 && whereUse.val > 21) {
    whereUse.val -= 10;
  }
  return whereUse.val;
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

// trial sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function Tutor() {
  document.write("Hello Toturix");
  for (let i = 1; i < 20; i++) {
    await sleep(3000);
    document.write(i + " " + "Welcome to tutorix" + " " + "</br>");
  }
}
// Tutor() //commented out so code doesnt break
// end trial sleep function

//function to show dealer cards
function displayDealerCards() {
  // empty dealer conatianer
  dealerCardsEl.empty();
  // display dealer hole card
  displayCard(faceDownCard.img, dealerCardsEl);
  //draw dealers hole card and save img and val to object and update dealerCount
  drawCard(nada, dealerHoleCard, dealerCount, dealerHoleCard);
  //draw dealer show card and display and save img and val to object and update dealerCount after 500ms
  drawCard(dealerCardsEl, dealerShowCard, dealerCount, dealerShowCard);
  console.log(dealerCount);

  // console.log(dealerCardsEl.children([0]).children([0]).attr('src'));
}

//function for dealer to play their hand -- not working right
function dealerPlay() {
  var dealerStand = false;
  // show dealer hole card
  var holeCard = dealerCardsEl.children().children().first();
  holeCard.attr("src", dealerHoleCard.img);

  console.log(dealerCount);

  //currently does nothing but display the hole card properly and make dealer stand/bust on what they are dealt

  //dealer does not yet draw till >= 17

  if (dealerCount > 21) {
    console.log("dealer BUSTS");
    //call player win function
  } else {
    console.log("dealer stands on " + dealerCount.val);
    dealerStand = true;
    //call function to compare dealer hand to players
  }
}

function openingDeal() {
  playerCardsEl.empty();
  drawCard(
    playerCardsEl,
    PlayerFirstCard.img,
    playerCount,
    PlayerFirstCard.value
  );

  drawCard(
    playerCardsEl,
    PlayerSecondCard.img,
    playerCount,
    PlayerSecondCard.value
  );
}

// function for user to play their hand
function playerPlay() {
  // var firstCard = $("#firstDealt");
  // var secondCard = $("#secondDealt");
  // playerCardsEl.empty();

  drawCard(
    playerCardsEl,
    PlayerFirstCard.img,
    playerCount,
    PlayerFirstCard.value
  );

  // console.log(drawCard);

  if (playerCount === 21) {
    console.log(
      "Player wins with Blackjack and is paid out 3/2 on their wager"
    ); // run player wins function?
  } else if (PlayerFirstCard.value === PlayerSecondCard.value) {
    console.log("Would you like to split your hand?"); // run playerSplit()?
  } else if (currentHandTotal < 21) {
    // this function needs to be created
    console.log("Would you like to hit or stand?"); // should this be an alert or modal?
  } else {
    console.log("Player stands on " + dealerCount);
    //call function to compare dealer hand to players
  }
  console.log(playerCount);
  // displayCard(PlayerFirstCard, playerCardsEl, cardID);
}
// playerPlay();
// comment in next line to test dealer play
// dealerPlay();

//this is a testing function only and is not used anywhere in the aplication

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
    // update wherePlay variable to play in this new row
    wherePlay = currentHandRowEl;
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

  //display cards in their respective columns
  displayCard(PlayerFirstCard.img, currentHandRowEl);
  displayCard(PlayerSecondCard.img, otherHandsRowEl);

  //store values of split card to other cards array
  playerOtherHands[splitCount][0].value = PlayerSecondCard.value;
  playerOtherHands[splitCount][0].img = PlayerSecondCard.img;
  playerCount = PlayerFirstCard.value;

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

// buttonHit.on("click", function () {
//   console.log("Hit");
// });

drawBtn.addEventListener("click", playerPlay); // testDrawCard  was drawCard

buttonStand.on("click", function () {
  console.log("Stand");
  dealerPlay(); //this is here for testing only
  // myLoop();
});

buttonSplit.on("click", function () {
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
