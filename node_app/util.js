const dayjs = require('dayjs');
require('dayjs/locale/de')

function getNow() {
    return dayjs();
}

function getHour(start, end, rest) {
    let ms = end - start;
    if (rest) {
        ms -= 1000 * 90 * 60;
    }
    if (ms > 0) {
        return Math.floor(ms / 1000 / 60 / 60 * 10 + Number.EPSILON) / 10;
    }
    return 0;
}

function calculator(checkin) {
    checkin.forEach((c) => {
        c.hour = 0;
        if (c.clockIn != null && c.clockOut != null) {
            let s = dayjs(c.clockIn);
            let e = dayjs(c.clockOut);
            let restS = dayjs(c.clockIn).set('hour', 4).set('minute', 0).set('second', 0);
            let restE = dayjs(c.clockIn).set('hour', 5).set('minute', 30).set('second', 0);
            let rest = s.valueOf() < restS.valueOf() && restE.valueOf() < e.valueOf();
            c.hour = getHour(s.valueOf(), e.valueOf(), rest);
            c.rest = null;
            if (rest) {
                c.rest = restS.toLocaleString() + "~" + restE.toLocaleString();
            }
        }
    });
    return checkin;
}

function handleDate() {
    let today = dayjs().subtract(1, 'day').set('hour', 16).set('minute', 0).set('second', 0);
    let endDate = today.add(1, 'day');
    if(dayjs().valueOf() > endDate.valueOf()){
        today = endDate;
        endDate = endDate.add(1, 'day');
    }
    return {today, endDate};
}

function convert(datetime){
    if (dayjs(datetime).toISOString() === datetime) {
        return dayjs(datetime);
    }
    return dayjs(datetime).subtract(8, 'hour');
}

module.exports = {
    getNow: getNow,
    getHour: getHour,
    calculator: calculator,
    handleDate: handleDate,
    convert: convert,
}
