/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id",options={primaryKey: false});
        table.uuid("uid",options={primaryKey: true}).defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("image_path");
        table.string("owner");
        table.string("field");
        table.string("category");
        table.string("company");
        table.string("email").unique();
        table.string("password", 1024);
        table.boolean("verified").defaultTo(false);
        table.timestamps(true, true);
    })
    .createTable("campaigns", function (table) {
        table.increments("id",options={primaryKey: false});
        table.uuid("campaign_id",options={primaryKey: true}).defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("campaign_name");
        table.specificType('categories', 'text ARRAY');
        table.json("subcategories");
        table.string("start_date", 50);
        table.string("end_date", 50);
        table.json("weekdays");
        table.string("start_times");
        table.string("end_times");
        table.specificType("uploads", 'text ARRAY');
        table.string("budget");
        table.string("people");
        table.uuid("uid")
        .references("uid")
        .inTable("users")
        .onDelete("CASCADE");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("campaigns").dropTable("users");
};
