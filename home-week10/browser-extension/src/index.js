import axios from 'axios';

// form fields
const form = document.querySelector('.form-data');
// const region = document.querySelector('.region-name');
const regions = [
    document.getElementById('region1'),
    document.getElementById('region2'),
    document.getElementById('region3')
];
const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
// const results = document.querySelector('.result-container');
const resultDiv = document.querySelector('.result');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');



const calculateColor = async (value) => {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    let closestNum = co2Scale.sort((a, b) => {
    return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + ' is closest to ' + closestNum);
    let num = (element) => element > closestNum;
    let scaleIndex = co2Scale.findIndex(num);
    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};
   
async function displayCarbonUsage(apiKey, region, resultId) {
    try {
        const response = await axios.get('https://api.co2signal.com/v1/latest', {
            params: { countryCode: region },
            headers: { 'auth-token': apiKey }
        });

        const dataContainer = document.getElementById(resultId);
        dataContainer.querySelector('.my-region').textContent = region;
        dataContainer.querySelector('.carbon-usage').textContent =
            Math.round(response.data.data.carbonIntensity) + ' grams';
        dataContainer.querySelector('.fossil-fuel').textContent =
            response.data.data.fossilFuelPercentage.toFixed(2) + '%';
        form.style.display = 'none';
        resultDiv.style.display = 'block';

        // Catboy API에서 이미지 가져오기
        const catboyResponse = await axios.get('https://api.waifu.pics/sfw/waifu');
        const imageUrl = catboyResponse.data.url;

        // 이미지 요소 생성 및 결과 영역에 추가
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = 'Anime character from Catboy API';
        imageElement.className = 'character-image';

        const existingImage = dataContainer.querySelector('.character-image');
        if (existingImage) {
            existingImage.remove();
        }
        dataContainer.appendChild(imageElement);
    } catch (error) {
        console.error(error);
        document.querySelector('.errors').textContent = 'Error fetching data for ' + region;
    }
}

function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionName);
 }


// Modify handleSubmit to include character image update
async function handleSubmit(e) {
    e.preventDefault();

    resultDiv.style.display = 'none';
    document.querySelector('.errors').textContent = '';

    regions.forEach((regionInput, index) => {
        const regionName = regionInput.value;
        if (regionName) {
            displayCarbonUsage(apiKey.value, regionName, `result${index + 1}`);
        }
    });
}

function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    
    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        resultDiv.style.display = 'none';
        loading.style.display = 'none';
        // clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        regions.forEach((regionInput, index) => {
            const regionName = regionInput.value;
            displayCarbonUsage(storedApiKey, regionName, `result${index + 1}`);
        });
    }
}

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
 }


form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();
