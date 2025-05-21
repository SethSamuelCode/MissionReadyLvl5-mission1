const fs = require("fs");

const directoryPath = "C:\\Users\\fluffy\\Desktop\\dataset";
const fileList = fs.readdirSync(directoryPath);
let csvFile = "";
const csvArray = []

const carType = new Map();
const carBrand = new Map();
const carCountOb ={}

const csvFileName  = `${new Date().toUTCString()}DataProcessed.csv`

// console.log("files and folders in dir: ",fileList)

for (const name of fileList) {
  const fileName = name.split("_");
  // console.log(fileName[fileName.length-2])
  carType.set(fileName[fileName.length - 2], name);
  carBrand.set(fileName[0], name);

  csvFile += `gs://cars_raw/${name},${fileName[0]},${fileName[fileName.length - 2]}\n`;
}

// console.log(carMap)

carType.forEach((value, key) => {
  console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

console.log("---------------------------------------------")

carBrand.forEach((value, key) => {
//   console.log(`${key}: ${value.length}`);
console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

// console.log(first)

// for (type in carMap.keys){
//     console.log(type.)
// }

fs.writeFile("csv.csv",csvFile,()=>{
    console.log("file written")
})
