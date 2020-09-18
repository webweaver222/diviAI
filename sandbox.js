const arr = [6, 4, 0, 2];

const rarr = arr => {
  if (arr.length === 0) return null;

  const rnd = Math.floor(Math.random() * arr.length);

  console.log(arr[rnd]);

  return rarr([...arr.slice(0, rnd), ...arr.slice(rnd + 1)]);
};

console.log(rarr(arr));
