const loadData = async (isSortData, isSeeMore) => {
    const res = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const json = await res.json();
    const data = json.data.tools;
    displayFeatures(data, isSortData, isSeeMore);
}

const displayFeatures = (data, isSortData, isSeeMore) => {
    const featuresContainer = document.getElementById('features-container');
    featuresContainer.innerHTML = '';
    const seeMoreButton = document.getElementById('see-more-button');

    if(isSortData) {
        data.sort((a, b) => {
            let dateA = new Date(a.published_in);
            let dateB = new Date(b.published_in);
            return dateA - dateB;
        });
    }
    
    if(data.length > 6 && !isSeeMore) {
        data = data.slice(0, 6);
        seeMoreButton.classList.remove('hidden');
    }
    else {
        seeMoreButton.classList.add('hidden');
    }

    data.forEach(feature => {
        const des = feature.features;
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="p-6 shadow-lg border rounded-xl">
            <div>
                <img src="${feature.image}" alt="" class="rounded-xl w-full">
            </div>
            <div class="mt-6">
                <h3 class="text-2xl font-bold mb-5">Features</h3>
                <ol class="list-decimal ps-4" id>
                    ${showFeatures(feature.features)}
                </ol>
                <hr class="mt-4 border">
                <div class="relative">
                    <h3 class="text-2xl font-bold my-4">${feature.name}</h3>
                    <p><i class="fa-regular fa-calendar-days"></i> <span class="ps-2">${feature.published_in}</span></p>
                    <div class="bg-red-100 w-10 h-10 rounded-full flex justify-center items-center hover:ring-4 hover:ring-red-400 hover:ring-offset-2 hover:bg-red-200 absolute top-[30%] left-[87%]" onclick="showDetails('${feature.id}')">
                        <div>
                            <i class="fa-solid fa-arrow-right text-2xl text-red-600"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        featuresContainer.appendChild(div);
        LoadingSpinner.classList.add('hidden');
    });
}

const showFeatures = (features) => {
    let str = ``;
    for(let i = 0; i < features.length; i++) {
        str += `<li>${features[i]}</li>`;
    }
    return str;
}

let sort = false;
let see = false;
const LoadingSpinner = document.getElementById('loading-spinner');
LoadingSpinner.classList.remove('hidden');

loadData(sort, see);

const SortByDate = () => {
    LoadingSpinner.classList.remove('hidden');
    sort = true;
    loadData(sort, see);
}

const seeMore = () => {
    LoadingSpinner.classList.remove('hidden');
    see = true;
    loadData(sort, see);
}

const showDetails =  async(id) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
    const json = await res.json();
    const data = json.data;

    console.log(data);
    const detailsBody = document.getElementById('details-body');
    detailsBody.innerHTML = `
        <div class="bg-red-50 border border-red-400 rounded-lg p-7">
            <h2 class="text-lg font-bold">${data.description}</h2>
            <div class="flex gap-5 mt-4">
                <div class="bg-white p-4 rounded-lg text-green-600 font-semibold flex flex-col justify-center text-center">
                    <p>${data.pricing[0].price}</p>
                    <p>${data.pricing[0].plan}</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-orange-500 font-semibold flex flex-col justify-center text-center">
                    <p>${data.pricing[1].price}</p>
                    <p>${data.pricing[1].plan}</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-rose-600 font-semibold flex flex-col justify-center text-center">
                    <p>${data.pricing[2].price}</p>
                    <p>${data.pricing[2].plan}</p>
                </div>
            </div>
            <div class="p-4 flex gap-10">
                <div>
                    <h3 class="text-lg font-bold -ml-4">Features</h3>
                    <ul class="list-disc">
                        ${showFeaturesSingle(data?.features || 'No data found')}
                    </ul>
                </div>
                <div>
                <h3 class="text-lg font-bold -ml-4">Integrations</h3>
                <ul class="list-disc">
                    ${showFeatures(data?.integrations || 'No data found')}
                </ul>
            </div>

            </div>
        </div>
        <div class="border p-8 rounded-lg">
            <div class="relative">
                <img src="${data.image_link[0]}" alt="" class="rounded-lg">
                <div class="px-4 py-1 text-white bg-red-600 rounded-lg w-36 font-bold text-center absolute left-[57%] top-2">
                    <p><span>${data.accuracy.score * 100}</span>% accuracy</p>
                </div>
            </div>
            <p class="text-center text-xl font-bold mt-8">${data.input_output_examples[0].input}</p>
            <p class="text-md mt-6">${data.input_output_examples[0].output}</p>
        </div>
    `;

    show_details_modal.showModal();
}

const showFeaturesSingle = (features) => {
    let str = ``;
    for(let key of Object.keys(features)) {
        str += `<li>${features[key].feature_name}</li>`;
    }
    console.log(str);
    return str;
} 




