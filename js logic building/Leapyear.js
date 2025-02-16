// function isLeapYear(year) {
//     if ( year % 4 === 0) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

function isLeapYear(year) {
    if (year % 4 === 0 ) {
        return true;
    }
    return false;
}
console.log("isLeapyear(2019)", isLeapYear(2019));
console.log("isLeapYear(2024)", isLeapYear(2024));
console.log("isLeapYear(2022)", isLeapYear(2022));