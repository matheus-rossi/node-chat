const moment = require("moment");
// moment.locale("pt-BR");

// const date = new moment();
// console.log(date.format("DD - MMM - YYYY"));


const createdAt = 1234;
const date = moment(createdAt);
console.log(date.format("h:mm a"));