import { readFileSync } from 'fs';

const fs = require('fs');

const conf = require("./config.json");
const changes = readFileSync('./changes.txt', 'utf-8');

let newConfig = conf
let changesList = changes.split(/[\r\n]+/)

for (let indexChange = 0; indexChange < changesList.length; indexChange++){
  try {
    let path = changesList[indexChange].split(/: (.+)?/, 2);
    let newValue = path[1]
    let pathToSplit = new String (path[0].replace(/['"]+/g, ''))
    let splitedPath = pathToSplit.split(/[.]/)

    splitedPath = getAttributePath(splitedPath)

    let attributePath = splitedPath.toString();
    attributePath = attributePath.replace(/,/g, '')
    let oldValue = "newConfig" + attributePath

    eval(oldValue + "=" + newValue)

    console.log('Change number %s Successfull', indexChange + 1);
  } catch (error) {
    console.log('Error change number %s :  %s', indexChange + 1, error);
  }
}

fs.writeFile ("new-config.json", JSON.stringify(newConfig), function(err: any) {
  if (err) throw err;
    console.log('complete');
  }
);

function getAttributePath(attributePath: string[]) {
  for(let i = 0; i < attributePath.length; i++){
      if(attributePath[i].match(/.+\[\d+\]/)){
        let newVal = attributePath[i].split(/(?=\[)/)
        newVal[0] = "[\"" + newVal[0] + "\"]"
        attributePath.splice(i + 1, 0, newVal[0])
        attributePath.splice(i + 2, 0, newVal[1])
        attributePath.splice(i, 1)
      }else if(!attributePath[i].match(/\[\d+\]/)){
        attributePath[i] = "[\"" + attributePath[i] + "\"]"
      }
  };

  return attributePath;
}