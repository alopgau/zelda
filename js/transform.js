const xml2js = require("xml2js")
const fs = require("fs")
const Papa = require("papaparse")
const convertXML = async () => {

    const xml = fs.readFileSync("../data/juegos.xml", "utf-8")
    try {
        const result = await xml2js.parseStringPromise(xml);

        const juegosArray = result.saga.juego.map(juego => ({
            id: juego.$?.id || "",
            titulo: juego.titulo?.[0] || "",
            desarrolladora: juego.desarrolladora?.[0] || "",
            publicadora: juego.publicadora?.[0] || "",
            plataforma: juego.plataforma?.[0] || "",
            anio: Number(juego.anio?.[0] || ""),
            puntuacion: Number(juego.puntuacion?.[0]) || ""
        }));

        fs.writeFileSync("../data/juegos.json", JSON.stringify(juegosArray, null, 2))
    } catch (error) {
        console.error('Error al convertir:', error);
    }
};

const convertCSV = () => {
    const json = fs.readFileSync("../data/juegos.json", "utf-8")
    const data = JSON.parse(json)
    const csv = Papa.unparse(data, {
        quotes: false,
        delimiter: ",",
        header: true,
        newline: "\n"
    })
    fs.writeFileSync("../data/juegos.csv", csv, "utf-8")
}
convertXML();
convertCSV()