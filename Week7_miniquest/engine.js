// 자바스크립트 엔진 - 1번
/*
웹 페이지에서 HTML이 로드되면 브라우저는 script 태그를 만나 자바스크립트 코드를 실행한다.
이때 자바스크립트 엔진은 코드를 해석하고 실행 가능한 형태로 변환한 뒤 실행한다.

자바스크립트 엔진은 콜 스택을 사용하여 실행 컨텍스트를 관리하고,
비동기 작업은 브라우저의 Web API, Callback Queue, Event Loop와 함께 처리된다.
*/

// 자바스크립트 엔진 - 2번

// 1. let 키워드를 사용한 변수의 호이스팅 확인하기
console.log(messageLet); // 무엇이 출력될까요?
let messageLet = "Hello with let!";

// 2. const 키워드를 사용한 변수의 호이스팅 확인하기
console.log(messageConst); // 무엇이 출력될까요?
const messageConst = "Hello with const!";

// 3. 화살표 함수의 호이스팅 확인하기
console.log(greet()); // 무엇이 출력될까요?
const greet = () => "Hello, Arrow Function!";
