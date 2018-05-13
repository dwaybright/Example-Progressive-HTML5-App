Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

if (Number.parseInt === undefined) {
    Number.parseInt = window.parseInt;
}