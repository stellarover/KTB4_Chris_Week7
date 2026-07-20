//프로그래밍 패러다임 - 1번
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(sum);

//프로그래밍 패러다임 - 2번
const doubled = numbers.map((num) => num * 2);
console.log(doubled);
