export async function getAPIData(category, search) {
    if (localStorage.getItem(`${category}${search}`)) {
        debugger
        const data = localStorage.getItem(`${category}${search}`)
        return JSON.parse(data)
    } else {
        try {
            const response = await fetch(`https://zelda.fanapis.com/api/${category}?name=${search}`)
            if (!response.ok) throw new Error(`Error ${response.status}`);

            const data = await response.json();
            localStorage.setItem(`${category}${search}`, data)
            return data
        } catch (error) {
            const card = document.querySelector(".error__card")
            card.classList.toggle("hidden")
        }

    }

} 