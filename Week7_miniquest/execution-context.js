//Execution Context - 1번
const message = "Hello, JavaScript!";

const showMessage = () => {
    let message = "Hello, ES6!";
    console.log(message);
};

showMessage();

//Execution Context - 2번
const color = "blue";

const firstLevel = () => {
    let color = "red";

    const secondLevel = () => {
        let color = "green";
        console.log(color);
    };

    secondLevel();
    console.log(color);
};


firstLevel();
console.log(color);