process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../app')
const knex = require('../db/knex')

chai.use(chaiHttp)

describe('API Routes', () => {
    beforeEach(() =>
        knex.migrate
            .rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
    )

    afterEach(() => knex.migrate.rollback())

    describe('GET /api/v1/checkin/list', () => {
        it('should return all checkin/list', (done) => {
            chai
                .request(server)
                .get('/api/v1/checkin/list')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json // jshint ignore:line
                    res.body.should.be.a('array')
                    res.body.length.should.equal(38)
                    res.body[0].should.have.property('id')
                    res.body[0].id.should.equal(1)
                    res.body[0].should.have.property('employeeNumber')
                    res.body[0].employeeNumber.should.equal(1110001)
                    res.body[0].should.have.property('clockIn')
                    should.equal(res.body[0].clockIn, null)
                    res.body[0].should.have.property('clockOut')
                    res.body[0].clockOut.should.equal('2022-01-03T00:33:00.000Z')
                    res.body[0].should.have.property('hour')
                    res.body[0].hour.should.equal(0)
                    done()
                })
        })
    });
    describe('GET /api/v1/checkin/oneDay/2022-01-03', () => {
        it('should return oneDay checkin/list', (done) => {
            chai
                .request(server)
                .get('/api/v1/checkin/oneDay/2022-01-03')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json // jshint ignore:line
                    res.body.should.be.a('array')
                    res.body.length.should.equal(21)
                    res.body[0].should.have.property('id')
                    res.body[0].id.should.equal(3)
                    res.body[0].should.have.property('employeeNumber')
                    res.body[0].employeeNumber.should.equal(1110003)
                    res.body[0].should.have.property('clockIn')
                    res.body[0].clockIn.should.equal('2022-01-03T00:00:00.000Z')
                    res.body[0].should.have.property('clockOut')
                    res.body[0].clockOut.should.equal('2022-01-03T09:33:00.000Z')
                    res.body[0].should.have.property('hour')
                    res.body[0].hour.should.equal(8)
                    res.body[0].should.have.property('rest')
                    res.body[0].rest.should.equal('Mon, 03 Jan 2022 04:00:00 GMT~Mon, 03 Jan 2022 05:30:00 GMT')
                    done()
                })
        })
    });
    describe('GET /api/v1/checkin/oneDayTopFive/2022-01-03', () => {
        it('should return oneDayTopFive checkin/list', (done) => {
            chai
                .request(server)
                .get('/api/v1/checkin/oneDayTopFive/2022-01-03')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json // jshint ignore:line
                    res.body.should.be.a('array')
                    res.body.length.should.equal(5)
                    res.body[0].should.have.property('id')
                    res.body[0].id.should.equal(3)
                    res.body[0].should.have.property('employeeNumber')
                    res.body[0].employeeNumber.should.equal(1110003)
                    res.body[0].should.have.property('clockIn')
                    res.body[0].clockIn.should.equal('2022-01-03T00:00:00.000Z')
                    res.body[0].should.have.property('clockOut')
                    res.body[0].clockOut.should.equal('2022-01-03T09:33:00.000Z')
                    res.body[0].should.have.property('hour')
                    res.body[0].hour.should.equal(8)
                    res.body[0].should.have.property('rest')
                    res.body[0].rest.should.equal('Mon, 03 Jan 2022 04:00:00 GMT~Mon, 03 Jan 2022 05:30:00 GMT')
                    done()
                })
        })
    });
    describe('GET /api/v1/checkin/noClockOut/2022-01-03/2022-01-05', () => {
        it('should return noClockOut checkin/list', (done) => {
            chai
                .request(server)
                .get('/api/v1/checkin/noClockOut/2022-01-03/2022-01-05')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json // jshint ignore:line
                    res.body.should.be.a('array')
                    res.body.length.should.equal(3)
                    res.body[0].should.have.property('id')
                    res.body[0].id.should.equal(10)
                    res.body[0].should.have.property('employeeNumber')
                    res.body[0].employeeNumber.should.equal(1110010)
                    res.body[0].should.have.property('clockIn')
                    res.body[0].clockIn.should.equal('2022-01-03T00:40:00.000Z')
                    res.body[0].should.have.property('clockOut')
                    should.equal(res.body[0].clockOut, null)
                    done()
                })
        })
    });
    describe('POST /api/v1/checkin/clockIn', () => {
        it('should clockIn', (done) => {
            chai
                .request(server)
                .post('/api/v1/checkin/clockIn')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    // res.should.have.status(200)
                    // res.should.be.json // jshint ignore:line
                    // res.body.should.be.a('object')
                    // res.body[0].should.have.property('employeeNumber')
                    // res.body[0].employeeNumber.should.equal(1110099)
                    // res.body[0].should.have.property('clockOut')
                    // should.equal(res.body[0].clockOut, null)
                    done()
                })
        })
        it('should not clockIn over work off time', (done) => {
            chai
                .request(server)
                .post('/api/v1/checkin/clockIn')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    res.should.have.status(409)
                    done()
                })
        })
        it('should not clockIn', (done) => {
            chai
                .request(server)
                .post('/api/v1/checkin/clockIn')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    // res.should.have.status(204)
                    done()
                })
        })
    });
    describe('PUT /api/v1/checkin/clockOut', () => {
        it('should clockOut', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/clockOut')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    // res.should.have.status(200)
                    // res.should.be.json // jshint ignore:line
                    // res.body.should.be.a('object')
                    // res.body[0].should.have.property('employeeNumber')
                    // res.body[0].employeeNumber.should.equal(1110099)
                    // res.body[0].should.have.property('clockOut')
                    // should.equal(res.body[0].clockOut, null)
                    done()
                })
        })
        it('should not clockIn over work off time', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/clockOut')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    res.should.have.status(409)
                    done()
                })
        })
        it('should not clockIn', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/clockOut')
                .send({
                    "employeeNumber": 1110099
                })
                .end((err, res) => {
                    // res.should.have.status(204)
                    done()
                })
        })
    });
    describe('PUT /api/v1/checkin/remedyClockIn', () => {
        it('should remedyClockIn', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockIn')
                .send({
                    "employeeNumber": 1110002,
                    "datetime": '2022-01-03T00:40:00.000Z'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    // res.should.be.json // jshint ignore:line
                    // res.body.should.be.a('object')
                    // res.body[0].should.have.property('employeeNumber')
                    // res.body[0].employeeNumber.should.equal(1110099)
                    // res.body[0].should.have.property('clockOut')
                    // should.equal(res.body[0].clockOut, null)
                    done()
                })
        })
        it('should not clockIn over work off time', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockIn')
                .send({
                    "employeeNumber": 1110002,
                    "datetime": '2022-01-03T16:40:00.000Z'
                })
                .end((err, res) => {
                    res.should.have.status(409)
                    done()
                })
        })
        it('should not clockIn', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockIn')
                .send({
                    "employeeNumber": 1110002,
                    "datetime": '2022-01-03T00:40:00.000Z'
                })
                .end((err, res) => {
                    res.should.have.status(204)
                    done()
                })
        })
    });
    describe('PUT /api/v1/checkin/remedyClockOut', () => {
        it('should remedyClockOut', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockOut')
                .send({
                    "employeeNumber": 1110010,
                    "datetime" : "2022-01-03 16:39:31"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    // res.should.be.json // jshint ignore:line
                    // res.body.should.be.a('object')
                    // res.body[0].should.have.property('employeeNumber')
                    // res.body[0].employeeNumber.should.equal(1110099)
                    // res.body[0].should.have.property('clockOut')
                    // should.equal(res.body[0].clockOut, null)
                    done()
                })
        })
        it('should not clockOut over 23:59', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockOut')
                .send({
                    "employeeNumber": 1110002,
                    "datetime": '2022-01-03T16:40:00.000Z'
                })
                .end((err, res) => {
                    res.should.have.status(409)
                    done()
                })
        })
        it('should not clockOut', (done) => {
            chai
                .request(server)
                .put('/api/v1/checkin/remedyClockOut')
                .send({
                    "employeeNumber": 1110010,
                    "datetime" : "2022-01-03 16:39:31"
                })
                .end((err, res) => {
                    res.should.have.status(204)
                    done()
                })
        })
    });
})
