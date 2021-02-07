const stdio = require('stdio');
const {remove} = require('lodash');
const {cloneDeep} = require('lodash');
const {readFile, writeFile} = require('./utils');

const opts = stdio.getopt({
  fileNames: {key: 'f', args: 1, description: 'Files to process', default: 'a_example'},
  // a_example b_little_bit_of_everything c_many_ingredients d_many_pizzas e_many_teams
});

// sort desc by number of ingredients
const sortPizzas1 = (a, b) => {
  return +b[1] - a[1];
};

const sortPizzas2 = (a, b) => {
  const [aIndex, aI, ...aIngredients] = a;
  const [bIndex, bI, ...bIngredients] = b;
  const repeatedIngredients = aIngredients.reduce((acc, next) => {
    return acc + bIngredients.indexOf(next) > -1;
  }, 0);
  return repeatedIngredients === 0 ? 1 : 0;
};

// here goes the solution to the problem. Only modify this
const solveProblem = fileName => {
  // preprocessing data specific problem
  const {headData, bodyData} = readFile(fileName);
  const [M, T2, T3, T4] = headData.split(' ').map(h => parseInt(h));
  const pizzas = bodyData.map(d => d.split(' ')).map((pizza, i) => {
    pizza.unshift(i);
    return pizza;
  });

  pizzas.sort(sortPizzas1);
  // pizzas.sort(sortPizzas2);

  let score = 0;
  let deliveriesT2 = 0;
  let deliveriesT3 = 0;
  let deliveriesT4 = 0;

  let i2next = 0;

  for (let i = 0; i + 1 < M; i++) {
    console.log(i);
    let i2 = getNumberOfUniqueIngredients([pizzas[i], pizzas[i + 1]]);
    let k = i + 1;
    for (let j = i + 2; j + 1 < Math.min(M, i + 100); j++) {
      i2next = getNumberOfUniqueIngredients([pizzas[i], pizzas[j]]);
      if (i2next > i2) {
        i2 = i2next;
        const aux = pizzas[k];
        pizzas[k] = pizzas[j];
        pizzas[j] = aux;
      }
    }
  }

  // maximize assigning to teams of 2, 3 or 4
  for (let i = 0; i < M; i) {
    const i2 = i + 1 < M ? getNumberOfUniqueIngredients([pizzas[i], pizzas[i + 1]]) : 0;
    const i3 = i + 2 < M ? getNumberOfUniqueIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2]]) : 0;
    const i4 = i + 3 < M ? getNumberOfUniqueIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2], pizzas[i + 3]]) : 0;
    if (i4 > i3 && i4 > i2 && deliveriesT4 < T4) {
      assignTeamToPizzas(4, i, pizzas);
      i += 4;
      deliveriesT4++;
      score += Math.pow(i4, 2);
    } else if (i3 > i2 && deliveriesT3 < T3) {
      assignTeamToPizzas(3, i, pizzas);
      i += 3;
      deliveriesT3++;
      score += Math.pow(i3, 2);
    } else if (i2 > 0 && deliveriesT2 < T2) {
      assignTeamToPizzas(2, i, pizzas);
      i += 2;
      deliveriesT2++;
      score += Math.pow(i2, 2);
    } else {
      remove(pizzas, (pizza, n) => n >= i);
      break;
    }
  }

  return {outputData: getOutputData({pizzas, deliveries: deliveriesT2 + deliveriesT3 + deliveriesT4}), score: score};
};

const assignTeamToPizzas = (n, i, pizzas) => {
  for (let j = i; j < i + n; j++) {
    pizzas[j].unshift(n);
  }
};

const shuffle = array => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 < currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getOutputData = ({pizzas, deliveries}) => {
  let deliveredPizzas = '';

  for (let i = 0; i < pizzas.length; i) {
    const n = pizzas[i][0];
    deliveredPizzas += `${n} ${pizzas.slice(i, i + n).map(pizza => pizza[1]).join(' ')}\n`;
    i += n;
  }

  return deliveries + '\n' + deliveredPizzas;
};

const getNumberOfUniqueIngredients = pizzas => {
  const uniqueIngredients = [];
  pizzas.forEach(pizza => {
    const [id, i, ...ingredients] = pizza;
    ingredients.forEach(ingredient => {
      if (uniqueIngredients.indexOf(ingredient) === -1) {
        uniqueIngredients.push(ingredient);
      }
    });
  });
  return uniqueIngredients.length;
};

// solve for all files
(opts.args || opts.fileNames.split(',')).forEach(fileName => {
  console.log(`Solving for ${fileName}`);
  const {outputData, score} = solveProblem(fileName.trim());
  console.log({score, fileName});
  // escribir respuesta
  writeFile({outputData, fileName});
});


