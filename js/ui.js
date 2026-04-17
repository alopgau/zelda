import { db } from "./firebase.js";
import { getAPIData } from "./api.js";

let categories = undefined

const loadCards = (data, category, resultsSection) => {
    switch (category) {
        case "games":
            data.data.forEach((game) => {
                resultsSection.innerHTML += `<article class="card">
                <h1 class="card__title">${game.name}</h1>
                <p class="card__description">${game.description}</p>
                <time class="game__date">Fecha salida: ${game.released_date}</time>
                <button class="card__button">Añadir a Favoritos</button>`
            })
            break;
        case "characters":
            data.data.forEach((character) => {
                resultsSection.innerHTML += `<article class="card" data-type="character">
                    <h1 class="card__title">${character.name}</h1>
                    <p class="card__description">${character.description}</p>
                    <p class="character__gender">${character.gender}</p>
                    <p class="character__race">${character.race}</p>
                    <button class="card__button">Añadir a Favoritos</button>`
            })
            break;
        case "dungeons":
            data.data.forEach((dungeon) => {
                resultsSection.innerHTML += `<article class="card" data-type="dungeon">
                        <h1 class="card__title">${dungeon.name}</h1>
                        <p class="card__description">${dungeon.description}</p>
                        <button class="card__button">Añadir a Favoritos</button>`
            })
            break;
        case "bosses":
            data.data.forEach((boss) => {
                resultsSection.innerHTML += `<article class="card" data-type="boss">
                            <h1 class="card__title">${boss.name}</h1>
                            <p class="card__description">${boss.description}</p>
                            <button class="card__button">Añadir a Favoritos</button>`

            })
            break;
        case "places":
            data.data.forEach((place) => {
                resultsSection.innerHTML += `<article class="card" data-type="place">
                                <h1 class="card__title">${place.name}</h1>
                                <p class="card__description">${place.description}</p>
                                <button class="card__button">Añadir a Favoritos</button>`

            })
            break;
        case "items":
            data.data.forEach((item) => {
                resultsSection.innerHTML += `<article class="card" data-type="item">
                                    <h1 class="card__title">${item.name}</h1>
                                    <p class="card__description">${item.description}</p>
                                    <button class="card__button">Añadir a Favoritos</button>`
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
const searchBar = document.querySelector("#searchbar")
searchBar.addEventListener("focus", () => {
    categories = readCategory()
})
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
searchBar.addEventListener("input", (e) => debouncedSearch(categories, e))
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

}
const getLS = () => {
    const data = localStorage.getItem("favoritesData");
    return data ? JSON.parse(data) : [];
};

const addToFavorites = (e) => {
    const data = getLS()
    const card = e.target.parentElement
    const cardChildren = card.children.filter((it) => it != e.target)
    const title = cardChildren[0]
    const description = cardChildren[1]
    let gameDate = undefined
    let characterGender = undefined
    let characterRace = undefined

    switch (card.dataset.type) {
        case "character":
            characterGender = cardChildren[2]
            characterRace = cardChildren[3]
            data.push({ title, description, gameDate, characterGender, characterRace })
            break;
        case "game":
            gameDate = cardChildren[2]
            data.push({ title, description, gameDate, characterGender, characterRace })

        default:
            data.push({ title, description, gameDate, characterGender, characterRace })
            break;
    }


    localStorage.setItem("favoritesData", JSON.stringify(data))
}
const loadFavorites = () => {

}