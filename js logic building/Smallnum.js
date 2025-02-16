// function checkSmallestNumber(a, b, c) {
//     if (a < b && a < c) {
//         return(a);
//     }
//     if (b < c && b < a) {
//         return(b)  ;  
//     }
//     if (c < b && c < a) {
//         return(c);
//     }
// }
// console.log(checkSmallestNumber(5, 9, 4))
// function SmallestNumberAmong3 (a, b, c) {
//     if ( a < b && a < c) {
//         return a;
//     }
//     else if ( b < a && b < c) {
//         return b;
//     }
//     else if ( c < a && c < b)  {
//         return c;
//     }
// }

// function SmallestOfThree(a, b, c) {
//     let smallestNumber = a;
//     if(b < smallestNumber) {
//         smallestNumber = b;
//     }
//     if(c < smallestNumber) {
//         smallestNumber = c;
//     }
//     if (a < smallestNumber) {
//         smallestNumber = a;
//     }
//     return smallestNumber;
//}
// console.log(SmallestOfThree(5, -5, 0))
// console.log(SmallestOfThree(5, 5, 0))
// console.log(SmallestOfThree(3, 3, 6))

function smallestNumber(a, b, c) {
    let smallestNumber = a;
    if (b < smallestNumber) {
        smallestNumber = b;
    }
    if (c < smallestNumber) {
        smallestNumber = c;
    }
    if (a < smallestNumber) {
        smallestNumber = a;
    }

    return smallestNumber;
}

console.log(smallestNumber(3, 4, 7))
console.log(smallestNumber(3, 3, 1))
console.log(smallestNumber(3, 3, 4))
console.log(smallestNumber(0, 0, 0))
console.log(smallestNumber(-1, 0, -2))