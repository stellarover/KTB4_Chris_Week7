//스코프 1번
let temperature = 25;
temperature = 30;
console.log(temperature);

const MAX_TEMPERATURE = 35;
// MAX_TEMPERATURE = 40; // TypeError: const는 재할당 불가

//스코프 - 2번
if (true) {
  let isRaining = true;
  console.log(isRaining);
}

// console.log(isRaining); // ReferenceError: 블록 밖에서 접근 불가

let isRainingOutside;

if (true) {
  isRainingOutside = true;
}

console.log(isRainingOutside);
