/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("screen_radius", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("address");
      table.string("town");
      table.string("state");
      table.string("postcode", 32);
      table.string("metric", 32);
      table.float("radius");
      table.json("center");
      table
        .uuid("campaign_id")
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    })
    .createTable("screen_draw_area", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.json("points");
      table.double("area");
      table
        .uuid("campaign_id")
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("screen_draw_area").dropTable("screen_radius");
};
