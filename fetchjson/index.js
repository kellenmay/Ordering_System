function greet(person, date) {
    console.log("hello ".concat(person, ", today is ").concat(date.toDateString()));
}
greet("Brendan", new Date());
