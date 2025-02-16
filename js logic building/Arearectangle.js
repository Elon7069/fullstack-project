function calculateArea(lengh, width) {
    if(length <= 0) {
        throw new RangeError("Length should be a positive number")
    }

    if(width <= 0) {
        throw new RangeError("width should be a positive number")
    }

       const area = lengh * width; {
        console.log("Area of a rectangle is", area);
    }
}

calculateArea (5, 5)