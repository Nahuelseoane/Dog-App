const API = 'https://api.thedogapi.com/v1/'
const API_KEY = 'live_4fFt7I560AIVBspNcHA0RXLXrG97N7jguRuXD42ffBsHs4O4OiqWPvL1u6HWbjYz'

const API_URL_RANDOM = [
    `${API}images/search`,
    '?',
    'limit=2',
].join('');
const API_URL_FAVORITES = `${API}favourites`;
const API_URL_FAVORITES_DELETE = (id) => `${API}favourites/${id}`;
const API_URL_UPLOAD = `${API}images/upload`;

const HTTP = {
    'OK': 200,
    'CREATED': 201,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'INTERNAL_SERVER_ERROR': 500,
    'SERVICE_UNAVAILABLE': 503,
    'GATEWAY_TIMEOUT': 504,
}

const spanError = document.getElementById('error');

const sectionFavorites = document.getElementById('favoriteDogs');
const sectionFavoritesCards = document.getElementById('favoriteDogsCards');


async function loadRandomDogs() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    console.log('Random')
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = `There was an error ${res.status}`
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavoriteDog(data[0].id)
        btn2.onclick = () => saveFavoriteDog(data[1].id)
    }

}

async function loadFavoriteDogs() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY,
        }
    });

    const data = await res.json();
    console.log('Favorites')
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = `There was an error ${res.status}`
    } else {

        sectionFavoritesCards.innerHTML = "";

        // const h2 = document.createElement('h2');
        // const h2Text = document.createTextNode('Favorite Dogs');
        // h2.appendChild(h2Text);

        // sectionFavorites.appendChild(h2);

        data.forEach(dog => {
            const newArticle = document.createElement('article');
            const newImg = document.createElement('img');
            const newBtn = document.createElement('button');
            const btnText = document.createTextNode('Remove')

            newBtn.appendChild(btnText);
            newBtn.onclick = () => deleteFavoriteDog(dog.id);

            newImg.src = dog.image.url;
            newArticle.appendChild(newImg);
            newArticle.appendChild(newBtn);
            newArticle.classList.add('dogCard')

            sectionFavoritesCards.appendChild(newArticle);
        });
    }
}


async function saveFavoriteDog(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
            "image_id": id,
            // "sub_id": null
        })
    });
    const data = await res.json();

    console.log('Save')
    console.log(res)

    if (res.status !== 200) {
        spanError.innerHTML = "Error: " + res.status + " " + data.message;
    } else {
        console.log('Dog saved');
        loadFavoriteDogs();
    }
}

async function deleteFavoriteDog(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: "DELETE",
        headers: {
            'X-API-KEY': API_KEY,
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Error: " + res.status + " " + data.message;
    } else {
        console.log('Dog deleted')
        loadFavoriteDogs();
    }

}

async function uploadDogPicture() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': API_KEY,
        },
        body: formData,
    });
    const data = await res.json();


    if (res.status !== 201) {
        spanError.innerHTML = "Error: " + res.status + " " + data.message;
        console.log({ data })
    } else {
        console.log('Picture uploaded')
        console.log({ data })
        console.log(data.url)
        saveFavoriteDog(data.id);
    }
}

loadRandomDogs();
loadFavoriteDogs();