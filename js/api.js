export async function getAPIData(category, search) {
    if (localStorage.getItem(`${category}${search}`)) {
        const data = localStorage.getItem(`${category}${search}`)
        return JSON.parse(data)
    } else {
        try {
            const response = await fetch(`https://zelda.fanapis.com/api/${category}?name=${search}`)
            if (!response.ok) throw new Error(`Error ${response.status}`);

            const data = await response.json();
            localStorage.setItem(`${category}${search}`, JSON.stringify(data))
            return data
        } catch (error) {
            const resultsSection = document.querySelector(".results__section")
            resultsSection.innerHTML += `<article class='error__card'><p class='errorText'>Se produjo un error inesperado</p></article>`
            return []
        }

    }

} 