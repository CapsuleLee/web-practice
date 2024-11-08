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
   



// async function displayCarbonUsage(apiKey, region){
//     try {
//         await axios
//         .get('https://api.co2signal.com/v1/latest', {
//         params: {
//         countryCode: region,
//         },
//         headers: {
//         //please get your own token from CO2Signal https://www.co2signal.com/
//         'auth-token': apiKey,
//         },
//         })
//         .then((response) => {
//         let CO2 = Math.floor(response.data.data.carbonIntensity);
//         calculateColor(CO2);
//         loading.style.display = 'none';
//         form.style.display = 'none';
//         myregion.textContent = region;
//         usage.textContent =
//         Math.round(response.data.data.carbonIntensity) + ' grams (grams C02 emitted per kilowatt hour)';
//         fossilfuel.textContent =
//         response.data.data.fossilFuelPercentage.toFixed(2) +
//         '% (percentage of fossil fuels used to generate electricity)';
//         results.style.display = 'block';
//         });
//         } catch (error) {
//         console.log(error);
//         loading.style.display = 'none';
//         results.style.display = 'none';
//         errors.textContent = 'Sorry, we have no data for the region you have requested.';
//         }
// }
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
        
        resultDiv.style.display = 'block';  // 결과 창 보이기
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


function handleSubmit(e) {
    e.preventDefault();
    resultDiv.style.display = 'none';  // 초기에는 숨기기
    document.querySelector('.errors').textContent = '';

    regions.forEach((regionInput, index) => {
        const regionName = regionInput.value;
        if (regionName) {
            displayCarbonUsage(apiKey.value, regionName, `result${index + 1}`);
        }
    });
    setUpUser(apiKey.value, region.value);
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
