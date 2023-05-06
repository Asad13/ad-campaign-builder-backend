/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users_customers", function (table) {
      table.string("id", (options = { primaryKey: true })).unique();
      table.json("emails");
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    })
    .createTable("customers_cards", function (table) {
      table.string("id", (options = { primaryKey: true })).unique();
      table.boolean("is_deleted").defaultTo(false);
      table
        .string("customer_id")
        .references("id")
        .inTable("users_customers")
        .onDelete("CASCADE");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("customers_cards").dropTable("users_customers");
};
