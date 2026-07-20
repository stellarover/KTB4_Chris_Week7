//블로킹/논블로킹, 동기/비동기 - 1번
console.log("Start");
console.log("Processing");
console.log("End");

//블로킹/논블로킹, 동기/비동기 - 2번
console.log("Start");

setTimeout(() => {
    console.log("Async Operation Complete");
}, 1000);

console.log("End");
