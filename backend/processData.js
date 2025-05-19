const fs = require('fs');
const { type } = require('os');

const directoryPath = "C:\\Users\\fluffy\\Desktop\\dataset"
const fileList = fs.readdirSync(directoryPath);
let csvFile= ""

const carType = new Map();
const carBrand = new Map();

// console.log("files and folders in dir: ",fileList)

for (const name of fileList){
    const fileName = name.split("_")
    // console.log(fileName[fileName.length-2])
    carType.set(fileName[fileName.length-2],name)
    carBrand.set(fileName[0],name)

    csvFile += `gs://cars_raw/${name},${fileName[0]},${fileName[fileName.length-2]}\n`
}

// console.log(carMap)

carMap.forEach((value,key)=>{
    console.log(`${key}: ${value.length}`)
})

// console.log(first)

// for (type in carMap.keys){
//     console.log(type.)
// }

// fs.writeFile("test.text",csvFile,()=>{
//     console.log("file written")
// })