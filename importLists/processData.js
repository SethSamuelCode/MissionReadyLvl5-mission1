const fs = require("fs");

const directoryPath = "C:\\Users\\fluffy\\Desktop\\dataset";
const fileList = fs.readdirSync(directoryPath);
let csvFile = "";

const carType = new Map();
const carBrand = new Map();

for (const name of fileList) {
  const fileName = name.split("_");
  carType.set(fileName[fileName.length - 2], name);
  carBrand.set(fileName[0], name);
  csvFile += `gs://cars_raw/${name},${fileName[0]},${fileName[fileName.length - 2]}\n`;
}
carType.forEach((value, key) => {
  console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

console.log("---------------------------------------------")

carBrand.forEach((value, key) => {

console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

fs.writeFile("csv.csv",csvFile,()=>{
    console.log("file written")
})
