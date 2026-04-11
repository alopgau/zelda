import { db } from "./firebase.js";
import { readData } from "./api.js";
let category = undefined
const readCategory = () => {
    const categorySelect = document.querySelector("#searchtarget")
    return categorySelect.value
}
const searchBar = document.querySelector("#searchbar")
searchBar.addEventListener("focus", () => {
    category = readCategory()
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
searchBar.addEventListener("input", () => {
    debounce(searchAPI, 2000)
})

