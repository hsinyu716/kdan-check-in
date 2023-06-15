exports.up = (knex, _Promise) => {
    return knex.schema.createTable('checkIn', function (table) {
        table.increments().unique()
        table.integer('employeeNumber').notNullable()
        table.dateTime('clockIn')
        table.dateTime('clockOut')
    })
}

exports.down = (knex, _Promise) => {
    return knex.schema.dropTable('checkIn')
}
