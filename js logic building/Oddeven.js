// function checkIfEvenOrOdd(n) {
//     const remainder = n % 2; 
//     if (remainder === 0) {
//         return "Even";
//     }
//     else {
//         return "Odd";
//     }
// }

// console.log(checkIfEvenOrOdd(9));
// console.log("114 is ", checkIfEvenOrOdd(114));

function checkIfEvenOrOdd(n) {
    return n % 2 === 0? "even" : "odd";
}
console.log(checkIfEvenOrOdd(5));
console.log(checkIfEvenOrOdd(10));