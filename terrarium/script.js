
// let currentZIndex=2;


// console.log(document.getElementById('plant1'));
// dragElement(document.getElementById('plant1'));
// dragElement(document.getElementById('plant2'));
// dragElement(document.getElementById('plant3'));
// dragElement(document.getElementById('plant4'));
// dragElement(document.getElementById('plant5'));
// dragElement(document.getElementById('plant6'));
// dragElement(document.getElementById('plant7'));
// dragElement(document.getElementById('plant8'));
// dragElement(document.getElementById('plant9'));
// dragElement(document.getElementById('plant10'));
// dragElement(document.getElementById('plant11'));
// dragElement(document.getElementById('plant12'));
// dragElement(document.getElementById('plant13'));
// dragElement(document.getElementById('plant14'));

// function pointerDrag(e, terrariumElement) {
//     e.preventDefault();
//     console.log(e);
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onpointermove = function(event) { elementDrag(event, terrariumElement) };
//     document.onpointerup = stopElementDrag;
// }

// function dragElement(terrariumElement) {
//     let pos1 = 0,
//         pos2 = 0,
//         pos3 = 0,
//         pos4 = 0;
//     terrariumElement.onpointerdown = function(e) { pointerDrag(e, terrariumElement) };
//     terrariumElement.ondblclick = function() {
//         bringToFront(terrariumElement);
//     };
// }

// function elementDrag(e, terrariumElement) {
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     console.log(pos1, pos2, pos3, pos4);
//     terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
//     terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
// }

// function stopElementDrag() {
//     document.onpointerup = null;
//     document.onpointermove = null;
// }

// function bringToFront(terrariumElement) {
    
//     currentZIndex++;
//     terrariumElement.style.zIndex = currentZIndex;
// }


const plants = document.querySelectorAll('.plant');
const terrarium = document.getElementById('terrarium');

let currentZIndex=2;
let mouseOffsetX, mouseOffsetY;

plants.forEach(plant => {
    plant.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        
        // 드래그 시작 시 마우스와 이미지의 상대 위치 저장
        const rect = e.target.getBoundingClientRect();
        mouseOffsetX = e.clientX - rect.left;
        mouseOffsetY = e.clientY - rect.top;
    });
    plant.addEventListener('dblclick', function() {
        bringToFront(this); 
    });
});

// Terrarium에 들어왔을 때 드롭 허용
terrarium.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

// Terrarium에 드롭할 때 이미지 이동 처리
terrarium.addEventListener('drop', (e) => {
    e.preventDefault();
    const plantId = e.dataTransfer.getData('text/plain'); // 드롭된 식물 ID 가져오기
    const droppedPlant = document.getElementById(plantId); // 드롭된 식물 요소 가져오기

    terrarium.appendChild(droppedPlant);
   
    droppedPlant.style.position = 'absolute';
    droppedPlant.style.width = '100px'; 

    droppedPlant.style.left = `${e.clientX - terrarium.offsetLeft - mouseOffsetX+7}px`; // 좌우 위치 조정
    droppedPlant.style.top = `${e.clientY - terrarium.offsetTop - mouseOffsetY+80}px`; // 상하 위치 조정
});

function bringToFront(plant) {
    // 현재 식물의 z-index 값을 가져오기
    const plantZIndex = parseInt(window.getComputedStyle(plant).zIndex) || 2;

    currentZIndex = Math.max(currentZIndex, plantZIndex) + 1;
   
    plant.style.zIndex = currentZIndex;
}