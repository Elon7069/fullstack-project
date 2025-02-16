function reverseAString(inputString) {
    if(typeof inputString !== 'string') {
        throw new Error("Olny strings are allowed");
    }
    let result = "";
    for(let i = inputString.length - 1; i >= 0; i--) {
        result += inputString[i];
        result = result + inputString[i];
    }

    return result;
}

console.log(reverseAString("PUSHKARSINGH"))
console.log(reverseAString("PUSHKAR SINGH"))
console.log(reverseAString("12235"))