const xml2js = require("xml2js")
const fs = require("fs")
const convertXML = async () => {

    const xml = fs.readFileSync("../data/juegos.xml", "utf-8")
    try {
        const result = await xml2js.parseStringPromise(xml);

        fs.writeFileSync("../data/juegos.json", JSON.stringify(result, null, 2))
    } catch (error) {
        console.error('Error al convertir:', error);
    }
};
convertXML();