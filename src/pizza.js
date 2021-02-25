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

  for (let i = 0; i + 1 < M; i++) {
    // TODO number of ingredientes for 2, 3 and 4
    let {unique: uniqueI2, total: totalI2} = getNumberOfIngredients([pizzas[i], pizzas[i + 1]]);
    let k = i + 1;
    for (let j = i + 2; j + 1 < Math.min(M, i + 100); j++) {
      let {unique: uniqueI2next, total: totalI2next} = getNumberOfIngredients([pizzas[i], pizzas[j]]);
      if (uniqueI2next > uniqueI2 || (uniqueI2next === uniqueI2 && totalI2next < totalI2)) {
        uniqueI2 = uniqueI2next;
        const aux = pizzas[k];
        pizzas[k] = pizzas[j];
        pizzas[j] = aux;
      }
    }
  }

  // let { deliveriesT2, deliveriesT3, deliveriesT4, score } = solve1(M, pizzas, T2, T3, T4);
  let { deliveriesT2, deliveriesT3, deliveriesT4, score } = solve2(M, pizzas, T2, T3, T4);

  return {outputData: getOutputData({pizzas, deliveries: deliveriesT2 + deliveriesT3 + deliveriesT4}), score: score};
};

const assignTeamToPizzas = (n, i, pizzas) => {
  for (let j = i; j < i + n; j++) {
    pizzas[j].unshift(n);
  }
};

const solve1 = (M, pizzas, T2, T3, T4) => {
  let deliveriesT2 = 0;
  let deliveriesT3 = 0;
  let deliveriesT4 = 0;
  let score = 0;
  for (let i = 0; i < M; i) {
    console.log(i);
    const {unique: i2 = 0} = i + 1 < M ? getNumberOfIngredients([pizzas[i], pizzas[i + 1]]) : 0;
    const {unique: i3 = 0} = i + 2 < M ? getNumberOfIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2]]) : 0;
    const {unique: i4 = 0} = i + 3 < M ? getNumberOfIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2], pizzas[i + 3]]) : 0;
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
  return { deliveriesT2, deliveriesT3, deliveriesT4, score };
};

const solve2 = (M, pizzas, T2, T3, T4) => {
  let deliveriesT2 = 0;
  let deliveriesT3 = 0;
  let deliveriesT4 = 0;
  let score = 0;
  for (let i = 0; i < M; i) {
    if (i + 3 < M) {
      const {unique: i2a1 = 0} = getNumberOfIngredients([pizzas[i], pizzas[i + 1]]);
      const {unique: i2a2 = 0} = getNumberOfIngredients([pizzas[i + 2], pizzas[i + 3]]);
      const {unique: i2b1 = 0} = getNumberOfIngredients([pizzas[i], pizzas[i + 2]]);
      const {unique: i2b2 = 0} = getNumberOfIngredients([pizzas[i + 1], pizzas[i + 3]]);
      const {unique: i2c1 = 0} = getNumberOfIngredients([pizzas[i], pizzas[i + 3]]);
      const {unique: i2c2 = 0} = getNumberOfIngredients([pizzas[i + 1], pizzas[i + 2]]);
      const {unique: i3 = 0} = getNumberOfIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2]]);
      const {unique: i4 = 0} = getNumberOfIngredients([pizzas[i], pizzas[i + 1], pizzas[i + 2], pizzas[i + 3]]);

      const s2a = Math.pow(i2a1, 2) + Math.pow(i2a2, 2);
      const s2b = Math.pow(i2b1, 2) + Math.pow(i2b2, 2);
      const s2c = Math.pow(i2c1, 2) + Math.pow(i2c2, 2);
      const s2 = Math.max(s2a, s2b, s2c);
      const s3 = Math.pow(i3, 2);
      const s4 = Math.pow(i4, 2);

      if (((s4 > s3 && s4 > s2) || deliveriesT2 + 1 >= T2) && deliveriesT4 < T4) {
        assignTeamToPizzas(4, i, pizzas);
        i += 4;
        deliveriesT4++;
        score += s4;
      } else if ((s3 > s2 || deliveriesT2 + 1 >= T2) && deliveriesT3 < T3) {
        assignTeamToPizzas(3, i, pizzas);
        i += 3;
        deliveriesT3++;
        score += s3;
      } else if (deliveriesT2 + 1 < T2) {
        if (s2c > s2b && s2c > s2a) {
          const aux = pizzas[i + 1];
          pizzas[i + 1] = pizzas[i + 3];
          pizzas[i + 3] = aux;
          score += s2c;
        } else if (s2b > s2c && s2b > s2a) {
          const aux = pizzas[i + 1];
          pizzas[i + 1] = pizzas[i + 2];
          pizzas[i + 2] = aux;
          score += s2b;
        } else {
          score += s2a;
        }
        assignTeamToPizzas(2, i, pizzas);
        i += 2;
        deliveriesT2++;
        assignTeamToPizzas(2, i, pizzas);
        i += 2;
        deliveriesT2++;
      } else {
        remove(pizzas, (pizza, n) => n === i);
        M--;
      }
    } else {
      remove(pizzas, (pizza, n) => n === i);
      M--;
    }
  }
  return { deliveriesT2, deliveriesT3, deliveriesT4, score };
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

const getNumberOfIngredients = pizzas => {
  const uniqueIngredients = [];
  let total = 0;
  pizzas.forEach(pizza => {
    const [id, i, ...ingredients] = pizza;
    total += +i;
    ingredients.forEach(ingredient => {
      if (uniqueIngredients.indexOf(ingredient) === -1) {
        uniqueIngredients.push(ingredient);
      }
    });
  });
  return {unique: uniqueIngredients.length, total};
};

// solve for all files
(opts.args || opts.fileNames.split(',')).forEach(fileName => {
  console.log(`Solving for ${fileName}`);
  const {outputData, score} = solveProblem(fileName.trim());
  console.log({score, fileName});
  // escribir respuesta
  writeFile({outputData, fileName});
});


