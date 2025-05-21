// This script processes a directory of car dataset files, extracts car brand and type from filenames,
// generates a CSV file for further processing, and prints shell commands to count occurrences by brand and type.
const fs = require("fs");

// Path to the directory containing the dataset files
const directoryPath = "C:\\Users\\fluffy\\Desktop\\dataset";
// Read all filenames in the dataset directory
const fileList = fs.readdirSync(directoryPath);
let csvFile = "";

// Maps to store car types and brands extracted from filenames
const carType = new Map();
const carBrand = new Map();

// Iterate over each file in the directory
for (const name of fileList) {
  // Split filename by underscore to extract brand and type
  const fileName = name.split("_");
  // Map car type (second to last part) to filename
  carType.set(fileName[fileName.length - 2], name);
  // Map car brand (first part) to filename
  carBrand.set(fileName[0], name);
  // Append a line to the CSV string: gs path, brand, type
  csvFile += `gs://cars_raw/${name},${fileName[0]},${fileName[fileName.length - 2]}\n`;
}
// Print shell commands to count occurrences of each car type in the CSV
carType.forEach((value, key) => {
  console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

console.log("---------------------------------------------")

// Print shell commands to count occurrences of each car brand in the CSV
carBrand.forEach((value, key) => {

console.log(` echo "${key}:" $(grep -c ${key} csv.csv)`)
});

// Write the generated CSV string to a file
fs.writeFile("csv.csv",csvFile,()=>{
    console.log("file written")
})
