const bluebird = require('bluebird');
const sleep = require('sleep');
const child_process = require("child_process");

const verifyModel = async (call, callback) => {
    console.log(call.request);
    await bluebird.delay(3000);
    child_process.execSync("sleep 3");
    callback(null, { reply: 'success!' });
};

module.exports = { verifyModel };