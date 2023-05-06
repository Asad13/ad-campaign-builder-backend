/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("users", function (table) {
        table.boolean("is_deleted").notNullable().defaultTo(false);
    }).alterTable("users_groups", function (table) {
        table.boolean("is_deleted").notNullable().defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("is_deleted");
    }).alterTable("users_groups", function (table) {
        table.dropColumn("is_deleted");
    });
};
