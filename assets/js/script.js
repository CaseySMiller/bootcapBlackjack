var nada = "nada"; // throwaway parameter for drawCard function
var dealerCount = { val: 0 };
var playerCount = { val: 0 };
var splitCount = -1;
var unplayedHands = -1;
var allPlayerCounts = [];
var hasAce = 0;
var playerOtherHands = [
  [
    { value: 0, img: "", raw: "" },
    { value: 0, img: "", raw: "" },
  ], //0 -- other hand for players first split
  [
    { value: 0, img: "", raw: "" },
    { value: 0, img: "", raw: "" },
  ], //1 -- other hand for players second split
  [
    { value: 0, img: "", raw: "" },
    { value: 0, img: "", raw: "" },
  ], //2 -- other hand for playes third split
];

// images and values are filled for testing purposes
// we will need to populate them from the draw card function
var faceDownCard = {
  value: 0,
  img: "assets/images/8cEbeEMLi.png",
};
var drawnCard = {
  value: 10,
  img: "https://deckofcardsapi.com/static/img/KH.png",
  raw: "",
};
var dealerShowCard = {
  value: 5,
  img: "https://deckofcardsapi.com/static/img/KH.png",
  raw: "",
};
var dealerHoleCard = {
  value: 10,
  img: "https://deckofcardsapi.com/static/img/KH.png",
  raw: "",
};
var PlayerFirstCard = {
  value: 8,
  img: "https://deckofcardsapi.com/static/img/8H.png",
  raw: "8",
};
var PlayerSecondCard = {
  value: 8,
  img: "https://deckofcardsapi.com/static/img/8C.png",
  raw: "8",
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

// variables for the chips and betting
var playAgainButton = $("#playAgain");
var confirmButton = $("#confirmWager");
var chipCount = $("#counter");
var increaseButton = $("#add");
var decreaseButton = $("#subtract");
var currentWagerAmount = $("#bet");
var getNewChips = $("#newChips");
var count = localStorage.getItem("stack");
var bet = 0;
// var count = 0;

// setting local storage
// count = localStorage.getItem("stack");
if (count) {
  chipCount.text(`${count} chips`);
}

// request a new stack of chips
getNewChips.on("click", function () {
  if (count === 0 || !count) {
    count = 50;
    localStorage.setItem("stack", count);
    chipCount.text(`${count} chips`);
  } else {
    count;
  }
});

// increasing your bet and reducing size of stack
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

// decreasing bet and increasing size of stack
decreaseButton.on("click", function () {
  if (count >= 0 && bet > 0) {
    count++;
    bet--;
    counter.textContent = count;
    currentWagerAmount.text(`${bet} on this hand`);
    localStorage.setItem("stack", count);
  }
});

function payTheMan(string) {
  if (string === "push") {
    // console.log("i ran push")
    count += bet;
    counter.textContent = count;
    localStorage.setItem("stack", count);
  } else if (string === "blackJack") {
    // console.log("i ran blackjack")
    count = bet * 2.5 + count;
    counter.textContent = count;
    localStorage.setItem("stack", count);
  } else if (string === "winner") {
    // console.log("i ran winner")
    count = bet * 2 + count;
    counter.textContent = count;
    localStorage.setItem("stack", count);
  } else {
    console.log("i ran lost");
    count;
  }
  var btn = document.createElement("button");
  btn.innerHTML = "Click to Play Again";
  btn.onclick = function () {
    window.location.reload();
  };
  document.body.appendChild(btn);
}

// function restartGame() {
//   displayDealerCards();
//   openingDeal();
//   var dealerCount = { val: 0 };
//   var playerCount = { val: 0 };
//   var splitCount = -1;
//   var unplayedHands = -1;
//   var allPlayerCounts = [];
//   var hasAce = 0;
//   allPlayerCounts = [];
// }

confirmButton.on("click", function (event) {
  event.stopPropagation();
  startDeal();
});

function startDeal() {
  // displayDealerCards();
  displayDealerCards();
  // openingDeal();
}

// Initial fetch request from card's api to get deck id#
var shuffleBtn = document.getElementById("buttonShuffle");

var drawBtn = document.getElementById("buttonHit");

var cardValue; //@Ryan: i changed every "cardValue" to "value" except this one so that we could match up properly with our api
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
      // console.log(drawCardObj);
      //call function to display the card image in whereImg
      displayCard(drawCardObj.cards[0].image, whereImgShow);
      //store img address string to whereImgStore
      whereImgStore.img = drawCardObj.cards[0].image;

      // store the value of the drawn card to whereValStore
      if (whereValStore == "nada" || typeof whereValStore == "undefined") {
      } else {
        //store raw value to whereValStore
        whereValStore.raw = drawCardObj.cards[0].value;
        //use the value of the card in whereValUse and store the parsed value in where val store
        useValue(whereValUse, whereValStore, drawCardObj.cards[0]);
        // whereValStore.value = drawCardObj.cards[0].value;
      }
      // return;
    });
}

//function to manipulate the card value taken from drawCard
//pass an array index or the dealerCount or playerCount variable to where
var thisVal = 0;

function useValue(whereUse, whereStore, what) {
  thisVal = 0;

  //convert face cards to 10 and ace to 11
  if (what.value == "KING" || what.value == "QUEEN" || what.value == "JACK") {
    thisVal = 10;
  } else if (what.value == "ACE" || what.raw == "ACE") {
    thisVal = 11;
    hasAce++; //adds the fact that this hand drew an ace
  } else {
    thisVal = parseInt(what.value, 10);
  }

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
  if (hasAce > 0 && whereUse.val > 21) {
    whereUse.val -= 10;
    hasAce--; //show that we used one ace as a 1
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
  // deal player hand
  openingDeal();
}

//function for dealer to play their hand -- not working right
function dealerPlay() {
  // show dealer hole card
  var holeCardEl = dealerCardsEl.children().children().first();
  holeCardEl.attr("src", dealerHoleCard.img);

  // check dealerCount
  dealerCheck();
  // function to execute proper dealer action
  function dealerCheck() {
    if (playerCount.val == -1) {
      winLossCheck();
    } else if (dealerCount.val < 17) {
      //dealer draws if under 17
      drawCard(dealerCardsEl, drawnCard, dealerCount, drawnCard);
      setTimeout(dealerCheck, 1500);
    } else if (dealerCount.val > 21) {
      console.log(dealerCount.val + " dealer BUSTS!");
      // Dealer Busts: set dealerCount to 0 and run win/loss on all hands
      dealerCount.val = 0;
      winLossCheck();
    } else {
      console.log("dealer stands on " + dealerCount.val);
      // Dealer stands on >= 17 call win/loss check
      winLossCheck();
    }
    // console.log(dealerCount.val);
  }
}

function openingDeal() {
  wherePlay.empty();
  playerCount.val = 0;
  drawCard(wherePlay, PlayerFirstCard, playerCount, PlayerFirstCard);
  drawCard(wherePlay, PlayerSecondCard, playerCount, PlayerSecondCard);
  // call playerPlay function after 1.5sec
  setTimeout(function () {
    if (dealerCount.val == 21) {
      console.log("Dealer has Blackjack, stupid dealer");
      // check if player has blackjack
      if (playerCount.val == 21) {
        // Push: return player wager
        // run dealer play to display this
        dealerPlay();
        console.log("push");
      } else {
        // dealer wins with Blackjack before player can play
        // set player count to 0 and run dealerPlay to show this
        allPlayerCounts.push(0);
        dealerPlay();
      }
    } else {
      playerPlay();
    }
  }, 1500);
}

// function for user to play their hand
function playerPlay() {
  //check for blackjack
  if (playerCount === 21) {
    console.log(
      "Player wins with Blackjack and is paid out 3/2 on their wager"
    );
    // add 'blackjack' to end of allPlayerCounts array and check if there are more hands
    // if no unplayed hands exist dealer will play and check win/loss
    allPlayerCounts.push("blackjack");
    checkMoreHands();
  } else {
    // check player count and then let player hit/stand/split/dd
    playerCheck();
  }
}

// function for player hit
function playerHit() {
  //draw a card and add it to current hand
  drawCard(wherePlay, drawnCard, playerCount, drawnCard);
  //after 1.5sec check playerCount
  setTimeout(playerCheck, 1500);
}

function playerCheck() {
  if (playerCount.val > 21) {
    console.log("Player busts, Dealer Wins!");
    playerCount.val = -1;
    allPlayerCounts.push(playerCount.val);
    checkMoreHands();
  } else {
    // player must make this decision and if less 21 they have the option to use the "hit" button to get another card, provided they stay under 21 this option will be available?
    console.log("hit or stand");
  }
}

//function to handle player splitting cards
function playerSplit() {
  if (PlayerFirstCard.raw !== PlayerSecondCard.raw) {
    console.log("You can only split 2 of the same cards");
    return;
  }
  splitCount++;
  unplayedHands++;
  // check if player has already split 3 times this hand and return out of function if so
  if (splitCount > 2) {
    console.log("too many splitty for you"); //change this to warning modal
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
    // append row for other hand title to right playing area column
    var otherHandTitleRowEl = $("<div>");
    otherHandTitleRowEl.addClass("d-flex flex-row name-plate fs-2 fw-b m-2");
    otherHandTitleRowEl.text("Next Hands");
    playingColElRight.append(otherHandTitleRowEl);
  } else {
    currentHandRowEl.empty(); //clear current hand row if 2nd or 3rd split
  }
  // deduct chips
  count -= bet;
  counter.textContent = count; 
  localStorage.setItem("stack", count);
  //append row for other hands
  otherHandsRowEl = $("<div>");
  otherHandsRowEl.addClass("d-flex flex-row");
  otherHandsRowEl.attr("id", "splitHand" + splitCount);
  playingColElRight.append(otherHandsRowEl);

  //display cards in their respective columns
  displayCard(PlayerFirstCard.img, currentHandRowEl);
  displayCard(PlayerSecondCard.img, otherHandsRowEl);

  //store values of split card to other cards array
  playerOtherHands[splitCount][0].value = PlayerSecondCard.value;
  playerOtherHands[splitCount][0].raw = PlayerSecondCard.raw;
  playerOtherHands[splitCount][0].img = PlayerSecondCard.img;
  playerCount.val = PlayerFirstCard.value;

  //draw new cards and append images to correct columns
  //adds card values to their respective places and calculates playerCount for current hand
  drawCard(currentHandRowEl, PlayerSecondCard, playerCount, PlayerSecondCard);
  drawCard(
    otherHandsRowEl,
    playerOtherHands[splitCount][1],
    nada,
    playerOtherHands[splitCount][1]
  );

  // call play function
  setTimeout(playerPlay, 1500);
  // TODO:
  // call function to pull more player chips (maybe in player play function)
}

// function for doubling down
function doubleDown() {
  console.log("Double down dummy!");
  // double bet
  count -= bet;
  counter.textContent = count;
  localStorage.setItem("stack", count);
  bet *= 2;

  // draw only one card
  drawCard(wherePlay, drawnCard, playerCount, drawnCard);
  // check for bust after 1500ms
  setTimeout(() => {
    console.log("this count" + playerCount.val);
    if (playerCount.val > 21) {
      console.log("Player busts");
      playerCount.val = -1;
      allPlayerCounts.push(playerCount.val);
      checkMoreHands();
    } else {
      allPlayerCounts.push(playerCount.val);
      checkMoreHands();
    }
  }, 1500);
}

//function to chack more hands and move to next hand while storing current hand
function checkMoreHands() {
  let currentHtml = "";
  console.log("checking for other hands");
  // check if there is an unplayed split hand
  if (unplayedHands > -1) {
    console.log("there is an unplayed hand");
    // copy current hand to currentHtml
    currentHtml = wherePlay.html();
    // copy [0] index from playerOtherHands to playerFirstCard and PlayerSecondCard
    PlayerFirstCard = playerOtherHands[0][0];
    console.log(PlayerFirstCard);
    PlayerSecondCard = playerOtherHands[0][1];
    // run current player cards through useValue function to calculate new playerCount
    playerCount.val = 0;
    useValue(playerCount, PlayerFirstCard, PlayerFirstCard);
    useValue(playerCount, PlayerSecondCard, PlayerSecondCard);

    // create a row element
    otherHandsRowEl = $("<div>");
    otherHandsRowEl.addClass("d-flex flex-row");
    let x = unplayedHands + 1;
    otherHandsRowEl.attr("id", "finished-hand-" + x);
    // append html(card images) from current hand to new row
    // maybe try to shrink it by 50%
    otherHandsRowEl.html(currentHtml);
    //append new row to bottom of right column
    playingColElRight.append(otherHandsRowEl);
    //remove top card row of right column
    console.log(playingColElRight.children().eq(1));
    playingColElRight.children().eq(1).remove();

    // display split hand from card variables to current hand
    wherePlay.empty();
    displayCard(PlayerFirstCard.img, wherePlay);
    displayCard(PlayerSecondCard.img, wherePlay);

    // delete [0] index from playerOtherHands and append empty object array to end
    playerOtherHands.splice(0, 1);
    let emptyArray = [
      { value: 0, img: "", raw: "" },
      { value: 0, img: "", raw: "" },
    ];
    playerOtherHands.push(emptyArray);
    // subtract this hand from unplayedHands
    unplayedHands--;

    // call player play function
    playerPlay();
  } else {
    dealerPlay();
  }
}

// function to check who wins -- called from dealerPlay
function winLossCheck() {
  console.log(allPlayerCounts);
  //itterate through array of allPlayerCounts
  for (i = 0; i < allPlayerCounts.length; i++) {
    let x = i + 1;
    if (allPlayerCounts[i] === dealerCount.val) {
      console.log("Hand " + x + ": Push");
      // return players wager
      return payTheMan("push");
    } else if (allPlayerCounts[i] == "blackJack") {
      console.log("Player has Blackjack!!");
      // add player wager * 2.5 to chips
      return payTheMan("blackJack");
    } else if (allPlayerCounts[i] > dealerCount.val) {
      console.log("Hand " + x + ": Player wins");
      // add player wager * 2 back to chips
      return payTheMan("winner");
    } else {
      console.log("Hand " + x + ": dealer wins");
      // player doesnt get chips back -- start new hand
      return payTheMan("loser");
    }
  }
}

// buttonHit.on("click", function () {
//   console.log("Hit");
// });

drawBtn.addEventListener("click", function () {
  console.log("player hits");
  playerHit();
});

buttonStand.on("click", function () {
  console.log("Stand");
  // add playerCount to end of allPlayerCounts array
  allPlayerCounts.push(playerCount.val);
  //check for more hands and lets dealer play when they have all been played
  checkMoreHands();
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
  // count = localStorage.getItem("stack");
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

// Daily Motion Api

var song_1 = $("#song_1");
var song_2 = $("#song_2");
var song_3 = $("#song_3");
var jukeboxSrc = $("#jukeboxSrc");
var Jukebox = $("#Jukebox");
var DDmenu2 = $("#dropdownMenuButton2");

song_1.on("click", function (event) {
  event.stopPropagation;
  $("#dropdownMenuButton2").html(
    $(this).text() + ' <span class="caret"></span>'
  );
  var jukeboxDisplay = document.createElement("script");
  Jukebox.append(jukeboxDisplay);
  jukeboxDisplay.setAttribute(
    "src",
    "https://geo.dailymotion.com/player/x77age2.js"
  );
  jukeboxDisplay.setAttribute("data-video", "xuvoto");
  jukeboxDisplay.setAttribute("id", "jukeboxSrc");
});
song_2.on("click", function (event) {
  event.stopPropagation;
  $("#dropdownMenuButton2").html(
    $(this).text() + ' <span class="caret"></span>'
  );
  var jukeboxDisplay = document.createElement("script");
  Jukebox.append(jukeboxDisplay);
  jukeboxDisplay.setAttribute(
    "src",
    "https://geo.dailymotion.com/player/x77age2.js"
  );
  jukeboxDisplay.setAttribute("data-video", "x77age2");
  jukeboxDisplay.setAttribute("id", "jukeboxSrc");
});
song_3.on("click", function (event) {
  event.stopPropagation;
  $("#dropdownMenuButton2").html(
    $(this).text() + ' <span class="caret"></span>'
  );
  var jukeboxDisplay = document.createElement("script");
  Jukebox.append(jukeboxDisplay);
  jukeboxDisplay.setAttribute(
    "src",
    "https://geo.dailymotion.com/player/x77age2.js"
  );
  jukeboxDisplay.setAttribute("data-video", "xqcq7x");
  jukeboxDisplay.setAttribute("id", "jukeboxSrc");
});

DDmenu2.on("click", function (event) {
  event.stopPropagation;
  $("#jukeboxSrc").remove();
});

// Daily Motion Api url endings. directs the script into the proper page.

// xuvoto
// x77age2
// xqcq7x
