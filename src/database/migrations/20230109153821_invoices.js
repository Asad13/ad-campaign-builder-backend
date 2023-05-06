/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users_invoices", function (table) {
    table.string("id", (options = { primaryKey: true })).unique();
    table.string("card_type");
    table.string("last4");
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users_invoices");
};
