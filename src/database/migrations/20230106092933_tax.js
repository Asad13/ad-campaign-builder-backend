/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("users_tax_info", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name");
      table.string("address_line_one");
      table.string("address_line_two");
      table.bigint("vat_gst",15)
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users_tax_info");
};
