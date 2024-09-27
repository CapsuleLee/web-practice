

let cardOne = 7;
let cardTwo = 5;
let sum = cardOne + cardTwo;
let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 1;

let cardThree = 9;
sum += cardThree;
if (sum > 21){
    console.log(`You have ${sum} points`);
    console.log("You lost");
    return;
} else if (sum ===21){
    console.log(`You have ${sum} points`);
    console.log("You win");
    return;
}
console.log(`You have ${sum} points`);

let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank;
let extraCard = 10;
while (bankSum<17){
    bankSum += extraCard;
}

console.log(`Bank have ${bankSum} points`);
if (bankSum>21){
    console.log("You win");
    return;
}
if (bankSum === sum){
    console.log("Draw");
    return;
}


if (bankSum > 21 || (sum <= 21 && sum > bankSum)){
    console.log("You win");
} else {
    console.log("Bank wins");
}