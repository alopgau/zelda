import { db } from "./firebase.js";
import { getAPIData } from "./api.js";

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
    const categories = readCategory()
})
const debounce = (func, delay) => {
    let timeout;
    return function (args) {

        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}
searchBar.addEventListener("input", (e) => {
    const data = debounce((e) => searchAPI(categories, e), 2000)

})
const searchAPI = (categories, e) => {
    const search = e.target.trim()
    const resultsSection = document.querySelector(".search__results")
    categories.forEach(category => {
        const data = getAPIData(category, search)
        switch (category) {
            case games:
                data.data.forEach((game) => {
                    resultsSection.innerHTML += `<article class="card">
                <h1 class="card__title">${game.name}</h1>
                <p class="card__description">${game.description}</p>
                <time class="game__date">${game.released__date}</time>`
                })
                break;
            case characters:
                data.data.forEach((character) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${character.name}</h1>
                    <p class="card__description">${character.description}</p>
                    <p class="character__gender">${character.gender}</p>
                    <p class="character__race">${character.race}</p>`
                })
                break;
            case dungeons:
                data.data.forEach((dungeon) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${dungeon.name}</h1>
                    <p class="card__description">${dungeon.description}</p>`


                })
                break;
            case bosses:
                data.data.forEach((boss) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${boss.name}</h1>
                    <p class="card__description">${boss.description}</p>`

                })
                break;
            case places:
                data.data.forEach((place) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${place.name}</h1>
                    <p class="card__description">${place.description}</p>`

                })
            case items:
                data.data.forEach((item) => {
                    resultsSection.innerHTML += `<article class="card">
                    <h1 class="card__title">${item.name}</h1>
                    <p class="card__description">${item.description}</p>`

                })
                break

            default:
                break;
        }
    })

}