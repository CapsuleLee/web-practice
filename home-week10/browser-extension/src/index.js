import axios from 'axios';

// form fields
const form = document.querySelector('.form-data');
const regions = [
    document.getElementById('region1'),
    document.getElementById('region2'),
    document.getElementById('region3')
];
const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const resultDiv = document.querySelector('.result');
const clearBtn = document.querySelector('.clear-btn');

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
