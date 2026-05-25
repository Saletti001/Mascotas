const mammoth = require("mammoth");
const fs = require("fs");

async function extractFiles() {
    try {
        let result1 = await mammoth.extractRawText({path: "Proyecto_Genos_V10_1_Maestro.docx"});
        fs.writeFileSync("Proyecto_Genos_V10_1_Maestro.md", result1.value);
        console.log("Extracted Proyecto_Genos_V10_1_Maestro.docx");

        let result2 = await mammoth.extractRawText({path: "Proyecto_Genos_Coliseo_V10_2.docx"});
        fs.writeFileSync("Proyecto_Genos_Coliseo_V10_2.md", result2.value);
        console.log("Extracted Proyecto_Genos_Coliseo_V10_2.docx");
    } catch (e) {
        console.error(e);
    }
}

extractFiles();
