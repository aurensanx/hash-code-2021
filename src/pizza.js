// const { countBy } = require('lodash');
const stdio = require('stdio');
const {readFile, writeFile} = require('./utils');

const opts = stdio.getopt({
  fileNames: {key: 'f', args: 1, description: 'Files to process', default: 'a_example'},
});


// here goes the solution to the problem. Only modify this
const solveProblem = fileName => {
  // preprocessing data specific problem
  const { headData, bodyData } = readFile(fileName);
  const [M, T2, T3, T4] = headData.split(' ').map(h => parseInt(h));
  const pizzas = bodyData.map(d => d.split(' '));
  let deliveriesT2 = 0;
  let deliveriesT3 = 0;
  let deliveriesT4 = 0;
  let deliveredPizzas = '';
  let pizzaCount = 0;

  for (let i = pizzaCount; i < M; i += 4) {
    if (i + 3 < M && deliveriesT4 < T4) {
      pizzaCount += 4;
      deliveriesT4++;
      deliveredPizzas += `4 ${i} ${i+1} ${i+2} ${i+3}\n`;
    } else {
      break;
    }
  }

  for (let i = pizzaCount; i < M; i += 3) {
    if (i + 2 < M && deliveriesT3 < T3) {
      pizzaCount += 3;
      deliveriesT3++;
      deliveredPizzas += `3 ${i} ${i+1} ${i+2}\n`;
    } else {
      break;
    }
  }

  for (let i = pizzaCount; i < M; i += 2) {
    if (i + 1 < M && deliveriesT2 < T2) {
      pizzaCount += 2;
      deliveriesT2++;
      deliveredPizzas += `2 ${i} ${i+1}\n`;
    } else {
      break;
    }
  }

  return (deliveriesT2 + deliveriesT3 + deliveriesT4) + '\n' + deliveredPizzas;
};

// solve for all files
(opts.args || opts.fileNames.split(',')).forEach(fileName => {
  const dataOutput = solveProblem(fileName.trim());
  // escribir respuesta
  writeFile({dataOutput, fileName});
});


