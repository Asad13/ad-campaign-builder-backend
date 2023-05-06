/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("groups", function (table) {
      table.increments("index", (options = { primaryKey: false }));
      table
        .uuid("id", (options = { primaryKey: true }))
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name").notNullable();
      table.timestamps(true, true);
    })
    .createTable("users_groups", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("group_id")
        .notNullable()
        .references("id")
        .inTable("groups")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users_groups").dropTable("groups");
};
