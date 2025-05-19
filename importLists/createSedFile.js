const { log } = require('console')
const fs = require('fs')
const { CodeChallengeMethod } = require('google-auth-library')

const file = fs.readFileSync("counts",'utf-8')

const fileLines= file.split('\n')

fileLines.forEach((line)=>{
    const [tag,count]= line.split(":")

    if (count<1000){
        console.log(`sed -i '/${tag}/d' renamed.csv`)
    }
})