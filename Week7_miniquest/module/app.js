import { add as simpleAdd } from "./math.js";
import { add, subtract } from "./operations.js";
import User from "./userProfile.js";

//모듈 시스템 - 1번
console.log(simpleAdd(2, 3));

//모듈 시스템 - 2번
console.log(add(10, 5));
console.log(subtract(10, 5));

const user = new User("Chris", 27);
user.introduce();
