//함수형 패러다임 - 1번
const add = (a, b) => a + b;

const sum = add(2, 3);
console.log(sum);

//함수형 패러다임 - 2번
const sumArray = (arr) => {
    let total = 0;

    for (const num of arr) {
        total += num;
    }

    return total;
};

const total = sumArray([1, 2, 3, 4, 5]);
console.log(total);