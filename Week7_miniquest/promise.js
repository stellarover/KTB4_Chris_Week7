//자바스크립트 비동기 처리 - 1번
const myFirstPromise = new Promise((resolve, reject) => {
  resolve("Hello, Promise!");
});

myFirstPromise.then((message) => {
  console.log(message);
});

//자바스크립트 비동기 처리 - 2번
const waitForMessage = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello, Async/Await!");
    }, 1000);
  });
};

const printMessage = async () => {
  const message = await waitForMessage();
  console.log(message);
};

printMessage();
