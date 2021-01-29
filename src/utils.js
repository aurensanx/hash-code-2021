const fs = require('fs');

// read file
const readFileInput = fileName => fs.readFileSync('sampledata/in/' + fileName + '.in', 'utf8');

// write file
const writeFile = ({ dataOutput, fileName }) => fs.writeFile('sampledata/out/' + fileName + '.out', dataOutput, err => {
  if (err) {
    return console.log(err);
  }
  console.log(`The ${fileName} file was saved!`);
});

// preprocessing data
// assuming one line of header and the rest of data, with the last line empty
const head = ([first]) => first; // first
const tail = ([first, ...rest]) => rest; // all but first
const init = array => array.slice(0, -1); // all but last
const getFileArray = fileName => readFileInput(fileName).split(/\r?\n/);
const getHeadData = fileArray => head(fileArray);
const getBodyData = fileArray => init(tail(fileArray));

const readFile = fileName => {
  const fileArray = getFileArray(fileName);
  return { headData: getHeadData(fileArray), bodyData: getBodyData(fileArray)};
};

// export useful data
module.exports = {readFile, writeFile};
