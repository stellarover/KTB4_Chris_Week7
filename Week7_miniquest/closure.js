//클로저 - 1번
const createCounter = () => {
    let count = 0;

    return {
        increment() {
            count++;
            return count;
        },

        decreament() {
            count--;
            return count;
        },

        getCount() {
            return count;
        },
    };
};

const counter = createCounter();

console.log(counter.increment());
console.log(counter.increment());
console.log(counter.decreament());
console.log(counter.getCount());

//클로저 - 2번
const messageMaker = (startMessage) => {
    return function makeMessage(additionalMessage) {
        return startMessage + additionalMessage;
    };
};

const makeHelloMessage = messageMaker("Hello, ");
console.log(makeHelloMessage("JavaScript!"));
