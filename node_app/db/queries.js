const knex = require('./knex.js')

function Shows() {
  return knex('shows')
}

// *** queries *** //

function getAll() {
  return Shows().select()
}

function getSingle(showID) {
  return Shows().where('id', parseInt(showID)).first()
}

function add(show) {
  return Shows().insert(show, 'id')
}

module.exports = {
  getAll: getAll,
  getSingle: getSingle,
  add: add,
}
