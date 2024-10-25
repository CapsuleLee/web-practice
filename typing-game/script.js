
// const quotes = [
//     'When you have eliminated the impossible, whatever remains, however ',
//     'improbable, must be the truth.',
//     'There is nothing more deceptive than an obvious fact.',
//     'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.', 
//     'I never make exceptions. An exception disproves the rule.',
//     'What one man can invent another can discover.',
//     'Nothing clears up a case so much as stating it to another person.',
//     'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
// ];

const quotes =[
    'test',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
let isGameActive=false;

const quoteElement =document.getElementById('quote');
const messageElement =document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const buttonElement = document.getElementById('start');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close_btn');
const modalMessage = document.getElementById('modal-message');
const modalHighScore = document.getElementById('modal-highScore');
let bestScore = localStorage.getItem('bestScore') ? parseFloat(localStorage.getItem('bestScore')) : null;

document.getElementById('start').addEventListener('click', () => {

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.focus();
    startTime = new Date().getTime();
    typedValueElement.disabled = false;

    typedValueElement.classList.add('my-input');
    if (startTime>0){
        buttonElement.disabled = true;
        
    }
});

typedValueElement.addEventListener('input', () => {

    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
        
        if (bestScore === null || elapsedTime < bestScore) {
            bestScore = elapsedTime / 1000;
            localStorage.setItem('bestScore', bestScore);
        }

        showModal(message);
    
        typedValueElement.disabled = true;
        buttonElement.disabled = false;
        
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) { //
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});
  
function showModal(message) {
    modalMessage.innerText = message; // 결과 메시지 설정
    modalHighScore.innerText = "최고 기록: "+bestScore +"초";
    modal.classList.add('on'); // 모달 창 보이기
}

//닫기 버튼을 눌렀을 때 모달팝업이 닫힘
modalClose.addEventListener('click',function(){
  //'on' class 제거
    
    modal.classList.remove('on');
});