const kue = require("kue");

// To create Queue for parallel Jobs
const queue = kue.createQueue();

module.exports = queue;
