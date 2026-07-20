export default class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    introduce() {
        console.log('이름: $(this.name), 나이: ${this.age}');
    }
}