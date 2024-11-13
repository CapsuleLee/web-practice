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
const imageElement = document.querySelector(".img img");

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

async function updateCharacterImage() {
    try {
        const response = await fetch("https://animechan.vercel.app/api/random");
        
        if (!response.ok) {
            throw new Error(`Animechan API error: ${response.statusText}`);
        }
        
        const animeData = await response.json();
        const characterName = animeData.character;
        const quote = animeData.quote;

        const naverClientId = "oX9oQXBGeZu1D1lXyWYY"; // 네이버 클라이언트 ID로 교체
        const naverClientSecret = "8T8sd7YTGn"; // 네이버 클라이언트 Secret으로 교체
        const naverEndpoint = `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(characterName)}&display=1&start=1`;

        const naverResponse = await fetch(naverEndpoint, {
            headers: {
                "X-Naver-Client-Id": naverClientId,
                "X-Naver-Client-Secret": naverClientSecret
            }
        });

        if (!naverResponse.ok) {
            throw new Error(`Naver API error: ${naverResponse.statusText}`);
        }

        const naverData = await naverResponse.json();
        if (naverData.items && naverData.items.length > 0) {
            const imageUrl = naverData.items[0].link;
            imageElement.src = imageUrl;
        } else {
            throw new Error("No images found in Naver API response");
        }

        document.querySelector("h1").innerText = `Welcome to ${characterName}'s World!`;
        document.querySelector("div").innerHTML += `<p>${quote}</p>`;
    } catch (error) {
        console.error("Error fetching character image:", error);
    }
}

async function displayCarbonUsage(apiKey, region, resultId) {
    try {
        if (!region) {
            throw new Error(`Region is undefined`);
        }

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
        resultDiv.style.display = 'block'; // 결과 창 보이기
    } catch (error) {
        console.error("Error fetching data:", error);
        document.querySelector('.errors').textContent = `Error fetching data for ${region || 'unknown region'}`;
    }
}

function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionName);
    updateCharacterImage();
 }


 function handleSubmit(e) {
    e.preventDefault();
    resultDiv.style.display = 'none'; // 초기에는 숨기기
    document.querySelector('.errors').textContent = '';

    regions.forEach((regionInput, index) => {
        const regionName = regionInput.value;
        if (regionName) {
            displayCarbonUsage(apiKey.value, regionName, `result${index + 1}`);
        } else {
            console.error(`Region ${index + 1} is undefined`);
        }
    });

    setUpUser(apiKey.value, regions.map(regionInput => regionInput.value).join(', '));
}


function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    //set icon to be generic green

    chrome.runtime.sendMessage({
        action: 'updateIcon',
            value: {
                color: 'green',
            },
     });
    
    //todo
    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        displayCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
 };

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    
    init();
 }


form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();
