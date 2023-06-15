const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');

const queries = require('../db/queries');

const util = require('../util');

router.get('/ping', async (req, res, next) => {
    res.status(200).json("pong");
});

router.get('/list', async (req, res, next) => {
    try {
        let checkin = await queries.getAll();
        checkin = util.calculator(checkin);
        res.status(200).json(checkin);
    } catch (error) {
        next(error);
    }
});

router.get('/oneDay/:date', async (req, res, next) => {
    try {
        let oneDay = dayjs(req.params.date).subtract(8, 'hour');
        let endDate = oneDay.add(1, 'day');
        let checkin = await queries.getOneDay(oneDay.toISOString(), endDate.toISOString());
        checkin = util.calculator(checkin);
        res.status(200).json(checkin);
    } catch (error) {
        next(error);
    }
});

router.get('/oneDayTopFive/:date', async (req, res, next) => {
    try {
        let oneDay = dayjs(req.params.date).subtract(8, 'hour');
        let endDate = oneDay.add(1, 'day');
        console.log(oneDay.toISOString(), endDate.toISOString())
        let checkin = await queries.getOneDay(oneDay.toISOString(), endDate.toISOString(), 5);
        checkin = util.calculator(checkin);
        res.status(200).json(checkin);
    } catch (error) {
        next(error);
    }
});

router.get('/noClockOut/:start/:end', async (req, res, next) => {
    try {
        let checkin = await queries.getNoClockOut(req.params.start, req.params.end);
        res.status(200).json(checkin);
    } catch (error) {
        next(error);
    }
});

router.post('/clockIn', async (req, res, next) => {
    try {
        let now = util.getNow();
        let off = dayjs().set('hour', 9).set('minute', 30);
        if (now.valueOf() > off.valueOf()) {
            res.status(409).json();
            return;
        }
        let {today, endDate} = util.handleDate();
        let checkin = await queries.checkClockIn(today, endDate, req.body.employeeNumber);
        if (checkin.length === 0) {
            let showID = await queries.addClockIn(req.body);
            let show = await queries.getSingle(showID);
            res.status(200).json(show);
        } else {
            res.status(204).json();
        }
    } catch (error) {
        next(error);
    }
});

router.put('/clockOut', async (req, res, next) => {
    try {
        let {today, endDate} = util.handleDate();
        let checkIn = await queries.checkClockIn(today, endDate, req.body.employeeNumber);
        let checkOut = await queries.checkClockOut(today, endDate, req.body.employeeNumber);
        if (checkIn.length === 0 && checkOut.length === 0) {
            let showID = await queries.addClockOut(req.body);
            let show = await queries.getSingle(showID);
            res.status(200).json(show);
        } else if (checkIn.length === 1 && checkOut.length === 0) {
            queries.updateClockOut(checkIn[0].id, req.body);
            let show = await queries.getSingle(checkIn[0].id);
            res.status(200).json(show);
        } else {
            res.status(204).json();
        }
    } catch (error) {
        next(error);
    }
});

router.put('/remedyClockIn', async (req, res, next) => {
    try {
        let specific = util.convert(req.body.datetime);
        let off = dayjs(req.body.datetime).set('hour', 9).set('minute', 30);
        if (specific.valueOf() > off.valueOf()) {
            res.status(409).json(req.body.datetime);
            return;
        }
        let end = off.set('hour', 16).set('minute', 0);
        let checkOut = await queries.checkClockOut(specific, end, req.body.employeeNumber);
        if (checkOut.length === 1) {
            req.body.clockIn = specific;
            queries.remedyClockIn(checkOut[0].id, {
                "employeeNumber": req.body.employeeNumber,
                "clockIn": specific
            });
            let show = await queries.getSingle(checkOut[0].id);
            res.status(200).json(show);
        } else {
            res.status(204).json();
        }
    } catch (error) {
        next(error);
    }
});

router.put('/remedyClockOut', async (req, res, next) => {
    try {
        let specific = util.convert(req.body.datetime);
        let off = specific.set('hour', 15).set('minute', 59);
        if (specific.valueOf() > off.valueOf()) {
            res.status(409).json();
            return;
        }
        let start = off.subtract(1, 'day').set('hour', 16).set('minute', 0);
        let checkin = await queries.checkClockIn(start, specific, req.body.employeeNumber);
        if (checkin.length === 1) {
            queries.remedyClockOut(checkin[0].id, {
                "employeeNumber": req.body.employeeNumber,
                "clockOut": specific
            });
            let show = await queries.getSingle(checkin[0].id);
            res.status(200).json(show);
        } else {
            res.status(204).json();
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
