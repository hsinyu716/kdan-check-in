const dayjs = require('dayjs');
const jsonData = require("../member.json");

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('checkIn').del()
        .then(function () {
            jsonData.forEach(m => {
                if (m.clockIn !== null) {
                    m.clockIn = dayjs(m.clockIn).subtract(8, 'hour').format();
                }
                if (m.clockOut !== null) {
                    m.clockOut = dayjs(m.clockOut).subtract(8, 'hour').format();
                }
            });
            return knex('checkIn').insert(jsonData);
        });
};
