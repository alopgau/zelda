import { db } from "./firebase.js";
import { getAPIData } from "./api.js";

let categories = undefined

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
        switch (category) {
            case "games":
                data.data.forEach((game) => {
                    resultsSection.innerHTML += `<article class="card">
                <h1 class="card__title">${game.name}</h1>
                <p class="card__description">${game.description}</p>
                <time class="game__date">${game.released__date}</time>`
                })
                break;
            case "characters":
                data.data.forEach((character) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${character.name}</h1>
                    <p class="card__description">${character.description}</p>
                    <p class="character__gender">${character.gender}</p>
                    <p class="character__race">${character.race}</p>`
                })
                break;
            case "dungeons":
                data.data.forEach((dungeon) => {
                    resultsSection.innerHTML += `<article class="card">
                        <h1 class="card__title">${dungeon.name}</h1>
                        <p class="card__description">${dungeon.description}</p>`
                })
                break;
            case "bosses":
                data.data.forEach((boss) => {
                    resultsSection.innerHTML += `<article class="card">
                            <h1 class="card__title">${boss.name}</h1>
                            <p class="card__description">${boss.description}</p>`

                })
                break;
            case "places":
                data.data.forEach((place) => {
                    resultsSection.innerHTML += `<article class="card">
                                <h1 class="card__title">${place.name}</h1>
                                <p class="card__description">${place.description}</p>`

                })
            case "items":
                data.data.forEach((item) => {
                    resultsSection.innerHTML += `<article class="card">
                                    <h1 class="card__title">${item.name}</h1>
                                    <p class="card__description">${item.description}</p>`
                })
                break;

            default:
                break;
        }
    })

}
