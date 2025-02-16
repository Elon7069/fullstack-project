// function calculateFactorial(inputNumber){
//     let result = 1;
//     for(let i = 1; i <= inputNumber; i++) {

//         result *= i;
//     }

//     return result;
// }
// console.log(calculateFactorial(4));

// console.log("3!", calculateFactorial(3));
// console.log("10!", calculateFactorial(10));

// function calculateFactorial(inputNumber) {
//     let result = 1;
//     for(let i = 1; i <= inputNumber; i++) {

//         result *= i;
//     }

//     return result;
// }

// console.log("12!", calculateFactorial(12))





// function calculateFactorial(inputNumber) {
//     let result = 1;
//     for(let i = 1; i <= inputNumber; i++) {

//         result *= i
//     }
//     return result
// }

// console.log("7!", calculateFactorial(7));



// function calculatefactorial(inputNumber) {
//     if(inputNumber < 0) {
//         throw new Error("inputNumber shoould be greater than or equal to zero");
//     }
//     let result = 1;
//     for(let i = 1; i <= inputNumber; i++) {

//         result *= i
//     }
//     return result;
// }

function calculateFactorialUsingRecursion(inputNumber) {
    if(inputNumber < 0) {
        throw new Error("inputNumber should be greater than or equal to zero");
    }

    if(inputNumber === 0 || inputNumber === 1) {
        return 1;
    }

    return inputNumber * calculateFactorialUsingRecursion(inputNumber - 1);
}
console.log("5!", calculateFactorialUsingRecursion(5));
console.log("-1!", calculateFactorialUsingRecursion(1));

function calculateFactorialUsingRecursion(inputNumber) {
    if (inputNumber < 0) {
        throw new Error ("inputNumber should be greater than or equal to zero");
    }

    if (inputNumber === 0 || inputNumber ===1) {
        return 1;
    }
    return inputNumber* calculateFactorialUsingRecursion( inputNumber - 1);
}
console.log("10!", calculateFactorialUsingRecursion(10));
