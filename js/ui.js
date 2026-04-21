import { db } from "./firebase.js";
import { getAPIData } from "./api.js";
import { addDoc, collection, getDocs }
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
const loadIndex = () => {
    if (!document.querySelector("#searchbar")) return;
    const searchBar = document.querySelector("#searchbar")
    searchBar.addEventListener("input", (e) => debouncedSearch(categories, e))
    searchBar.addEventListener("focus", () => {
        categories = readCategory()
    })

}

let categories = undefined
let cardButton = undefined

const loadCards = (data, category, resultsSection) => {
    switch (category) {
        case "games":
            data.data.forEach((game) => {
                resultsSection.innerHTML += `<article class="card" data-type="game">
                <h1 class="card__title">${game.name}</h1>
                <p class="card__description">${game.description}</p>
                <time class="game__date">Fecha salida: ${game.released_date}</time>
                <button class="card__button">Añadir a Favoritos</button>
                </article>`
            })
            break;
        case "characters":
            data.data.forEach((character) => {
                resultsSection.innerHTML += `<article class="card" data-type="character">
                    <h1 class="card__title">${character.name}</h1>
                    <p class="card__description">${character.description}</p>
                    <p class="character__gender">${character.gender}</p>
                    <p class="character__race">${character.race}</p>
                    <button class="card__button">Añadir a Favoritos</button>
                </article>`
            })
            break;
        case "dungeons":
            data.data.forEach((dungeon) => {
                resultsSection.innerHTML += `<article class="card" data-type="dungeon">
                        <h1 class="card__title">${dungeon.name}</h1>
                        <p class="card__description">${dungeon.description}</p>
                        <button class="card__button">Añadir a Favoritos</button>
                        </article>`
            })
            break;
        case "bosses":
            data.data.forEach((boss) => {
                resultsSection.innerHTML += `<article class="card" data-type="boss">
                            <h1 class="card__title">${boss.name}</h1>
                            <p class="card__description">${boss.description}</p>
                            <button class="card__button">Añadir a Favoritos</button>
                            </article>`

            })
            break;
        case "places":
            data.data.forEach((place) => {
                resultsSection.innerHTML += `<article class="card" data-type="place">
                                <h1 class="card__title">${place.name}</h1>
                                <p class="card__description">${place.description}</p>
                                <button class="card__button">Añadir a Favoritos</button>
                                </article>`

            })
            break;
        case "items":
            data.data.forEach((item) => {
                resultsSection.innerHTML += `<article class="card" data-type="item">
                                    <h1 class="card__title">${item.name}</h1>
                                    <p class="card__description">${item.description}</p>
                                    <button class="card__button">Añadir a Favoritos</button>
                                    </article>`
            })
            break;

        default:
            break;

    }
}


const readCategory = () => {
    const checks = []
    const categorySelect = document.querySelectorAll(".option-checker__option")
    categorySelect.forEach(option => {
        if (option.checked) checks.push(option.value)
    })
    return checks
}

const debounce = (func, delay) => {
    let timeout;
    return function (...args) {

        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}
const debouncedSearch = debounce((categories, e) => {
    searchAPI(categories, e)
}, 2000)

const searchAPI = async (categories, e) => {
    const search = e.target.value.trim()
    const resultsSection = document.querySelector(".search__results")
    const promises = categories.map(category => getAPIData(category, search))
    const results = await Promise.all(promises)
    resultsSection.innerHTML = ""
    results.forEach((data, index) => {
        const category = categories[index]
        loadCards(data, category, resultsSection)

    })
    cardButton = document.querySelectorAll(".card__button")
    cardButton.forEach((it) => {
        it.addEventListener("click", addToFavorites)
    })

}

const addToFavorites = async (e) => {
    const card = e.target.parentElement
    const cardChildren = Array.from(card.children).filter((it) => it != e.target)
    const title = cardChildren[0].textContent
    const description = cardChildren[1].textContent
    let gameDate = null
    let characterGender = null
    let characterRace = null
    let type = card.dataset.type

    switch (type) {
        case "character":
            characterGender = cardChildren[2].textContent
            characterRace = cardChildren[3].textContent
            break;
        case "game":
            gameDate = cardChildren[2].textContent


        default:
            break;
    }
    try {
        await addDoc(collection(db, "favorites"), {
            title,
            description,
            gameDate,
            characterGender,
            characterRace,
            type,
            createdAt: serverTimestamp()
            
        });
    } catch (error) {
        console.error(error);
    }
};

const getFavorites = async () => {
    const snapshot = await getDocs(collection(db, "favorites"));

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};



const loadFavorites = async () => {

    if (!document.querySelector(".favorites__section")) return;
    const favoritesSection = document.querySelector(".favorites__section")
    const data = await getFavorites()
    data.forEach(card => {
        switch (card.type) {
            case "character":

                favoritesSection.innerHTML += `<article class="card" data-type="${card.type}" data-date="${card.createdAt}">
                <h1 class="card__title">${card.title}</h1>
                <p class="card__description">${card.description}</p>
                <p class="character__gender">${card.characterGender}</p>
                <p class="character__race">${card.characterRace}</p>
                </article>`

                break;

            case "game":

                favoritesSection.innerHTML += `<article class="card" data-type="${card.type}" data-date="${card.createdAt}">
                <h1 class="card__title">${card.title}</h1>
                <p class="card__description">${card.description}</p>
                <time class="game__date">${card.gameDate}</time>
                </article>`

                break;

            default:

                favoritesSection.innerHTML += `<article class="card" data-type="${card.type}" data-date="${card.createdAt}">
                <h1 class="card__title">${card.title}</h1>
                <p class="card__description">${card.description}</p>
                </article>`

                break;
        }
    })
    const filters = document.querySelectorAll(".filter")
    filters.forEach((filter) => {
        filter.addEventListener("click", filterByCategory)
    })

}
const filterByCategory = (e) => {
    const filter = e.target.name
    const favsSection = document.querySelector(".favorites__section")
    const favs = Array.from(favsSection.children)
    favs.forEach((fav) => {
        if (fav.dataset.type != filter) {
            fav.classList.toggle("hidden")
        }
    })

}

loadIndex();
loadFavorites();