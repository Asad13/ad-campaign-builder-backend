/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("campaign_files", function (table) {
        table.increments("id",options={primaryKey: true});
        table.string("file").notNullable();
        table.integer("size").notNullable();
        table.string("mimetype").notNullable();
        table.string("extension").notNullable();
        table.boolean("is_deleted").notNullable().defaultTo(false);
        table.uuid("campaign_id")
        .references("campaign_id")
        .inTable("campaigns")
        .onDelete("CASCADE");
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("campaign_files");
};
