const knex = require("./knex.js");

function db() {
    return knex("checkIn");
}

// *** queries *** //

function getAll() {
    return db().select().orderBy("id");
}

function getOneDay(start, end, limit = 0) {
    let result = db().select().whereBetween("clockIn", [start, end]);
    if (limit > 0) {
        result = result.orderBy([
            {column: 'clockIn', order: 'asc'},
            {column: 'id', order: 'asc'}
        ]).limit(limit).offset(0);
    }
    return result;
}

function checkClockIn(start, end, employeeNumber) {
    return db().select().whereBetween("clockIn", [start, end])
        .andWhere("clockOut", null)
        .andWhere("employeeNumber", employeeNumber).orderBy([
            {column: 'id', order: 'desc'}
        ]);
}

function checkClockOut(start, end, employeeNumber) {
    return db().select().whereBetween("clockOut", [start, end])
        .andWhere("employeeNumber", employeeNumber);
}

function checkRemedyClockIn(start, end, employeeNumber) {
    return db().select().whereBetween("clockOut", [start, end])
        .andWhere("clockIn", null)
        .andWhere("employeeNumber", employeeNumber);
}

function getSingle(showID) {
    return db().where("id", parseInt(showID)).select();
}

function getNoClockOut(start, end) {
    return db().whereBetween("clockIn", [start, end]).where("clockOut", null);
}

function addClockIn(clockIn) {
    clockIn.clockIn = knex.fn.now();
    return db().insert(clockIn, "id");
}

function addClockOut(clockOut) {
    clockOut.clockOut = knex.fn.now();
    return db().insert(clockOut, "id");
}

function updateClockOut(showID, clockOut) {
    clockOut.clockOut = knex.fn.now();
    return db().where("id", showID).update(clockOut).then();
}

function remedyClockIn(showID, clockIn) {
    return db().where("id", showID).update(clockIn).then();
}

function remedyClockOut(showID, clockOut) {
    return db().where("id", showID).update(clockOut).then();
}

module.exports = {
    getAll: getAll,
    getOneDay: getOneDay,
    getSingle: getSingle,
    getNoClockOut: getNoClockOut,
    addClockIn: addClockIn,
    addClockOut: addClockOut,
    checkClockIn: checkClockIn,
    checkClockOut: checkClockOut,
    checkRemedyClockIn: checkRemedyClockIn,
    updateClockOut: updateClockOut,
    remedyClockIn: remedyClockIn,
    remedyClockOut: remedyClockOut,
}
