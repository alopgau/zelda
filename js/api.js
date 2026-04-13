export async function getAPIData(category, search) {
    try {
        const response = await fetch(`https://zelda.fanapis.com/api/${category}?name=${search}`)
        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        return data
    } catch (error) {
        const modal = document.querySelector(".error__modal")
        modal.classList.toggle("hidden")
    }

} 