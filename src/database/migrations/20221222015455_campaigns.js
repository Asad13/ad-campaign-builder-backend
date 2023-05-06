/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("campaign_statuses", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name").notNullable();
    })
    .createTable("screen_selections", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name").notNullable();
    })
    .alterTable("campaign_files", function (table) {
      table.dropColumn("campaign_id");
    })
    .alterTable("campaigns", function (table) {
      table.dropColumns(
        "id",
        "categories",
        "subcategories",
        "start_date",
        "end_date",
        "weekdays",
        "start_times",
        "end_times",
        "budget",
        "uploads",
        "people",
        "uid"
      );
      table.renameColumn("campaign_name", "name");
      table.renameColumn("campaign_id", "id");
      table
        .integer("status_id")
        .references("id")
        .inTable("campaign_statuses")
        .onDelete("CASCADE");
      table
        .integer("screen_selection_id")
        .references("id")
        .inTable("screen_selections")
        .onDelete("CASCADE");
    })
    .alterTable("campaign_files", function (table) {
      table
        .uuid("campaign_id")
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    })
    .createTable("campaign_budgets", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.double("value").notNullable();
      table
        .uuid("campaign_id")
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    })
    .createTable("target_categories", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name").notNullable();
    })
    .createTable("target_subcategories", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name").notNullable();
      table
        .integer("category_id")
        .notNullable()
        .references("id")
        .inTable("target_categories")
        .onDelete("CASCADE");
    })
    .createTable("campaigns_target_categories", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table
        .uuid("campaign_id")
        .notNullable()
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
      table
        .integer("category_id")
        .notNullable()
        .references("id")
        .inTable("target_categories")
        .onDelete("CASCADE");
    })
    .createTable("campaigns_target_subcategories", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table
        .uuid("campaign_id")
        .notNullable()
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
      table
        .integer("subcategory_id")
        .notNullable()
        .references("id")
        .inTable("target_subcategories")
        .onDelete("CASCADE");
    })
    .createTable("scheduling", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.boolean("publish_dates_isforever").notNullable().defaultTo(true);
      table.json("publish_dates_custom");
      table.boolean("dow_iseveryday").notNullable().defaultTo(true);
      table.json("dow_custom");
      table.boolean("playtimes_isallday").notNullable().defaultTo(true);
      table.json("playtimes_custom");
      table
        .uuid("campaign_id")
        .notNullable()
        .references("id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    })
    .createTable("roles", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table.string("name").notNullable();
    })
    .alterTable("users", function (table) {
      table.dropColumns("id", "field", "category");
      table.renameColumn("owner", "name");
      table.renameColumn("uid", "id");
      table.renameColumn("image_path", "profile_pic");
      table.renameColumn("company", "company_name");
      table.renameColumn("verified", "is_verified");
      table
        .integer("role_id")
        .references("id")
        .inTable("roles")
        .onDelete("CASCADE");
      table
        .integer("category_id")
        .references("id")
        .inTable("target_categories")
        .onDelete("CASCADE");
      table
        .integer("subcategory_id")
        .references("id")
        .inTable("target_subcategories")
        .onDelete("CASCADE");
    })
    .createTable("users_campaigns", function (table) {
      table.increments("id", (options = { primaryKey: true }));
      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .uuid("campaign_id")
        .notNullable()
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
  return knex.schema
    .alterTable("campaign_files", function (table) {
      table.dropColumn("campaign_id");
    })
    .dropTable("campaign_budgets")
    .dropTable("users_campaigns")
    .dropTable("scheduling")
    .dropTable("campaigns_target_categories")
    .dropTable("campaigns_target_subcategories")
    .alterTable("campaigns", function (table) {
      table.renameColumn("name", "campaign_name");
      table.renameColumn("id", "campaign_id");
      table.dropColumn("status_id");
      table.dropColumn("screen_selection_id");
    })
    .alterTable("users", function (table) {
      table.renameColumn("name", "owner");
      table.renameColumn("id", "uid");
      table.renameColumn("profile_pic", "image_path");
      table.renameColumn("company_name","company");
      table.renameColumn("is_verified", "verified");
      table.dropColumn("role_id");
      table.dropColumn("category_id");
      table.dropColumn("subcategory_id");
    })
    .alterTable("users", function (table) {
      table.string("field");
      table.string("category");
      table.increments("id",options={primaryKey: false});
    })
    .dropTable("roles")
    .alterTable("campaigns", function (table) {
      table.increments("id", (options = { primaryKey: false }));
      table.specificType("categories", "text ARRAY");
      table.json("subcategories").notNullable();
      table.string("start_date", 50).notNullable();
      table.string("end_date", 50).notNullable();
      table.json("weekdays").notNullable();
      table.string("start_times").notNullable();
      table.string("end_times").notNullable();
      table.specificType("uploads", "text ARRAY");
      table.string("people").notNullable();
      table.uuid("uid").references("uid").inTable("users").onDelete("CASCADE");
    })
    .alterTable("campaign_files", function (table) {
      table
        .uuid("campaign_id")
        .references("campaign_id")
        .inTable("campaigns")
        .onDelete("CASCADE");
    })
    .dropTable("target_subcategories")
    .dropTable("target_categories")
    .dropTable("screen_selections")
    .dropTable("campaign_statuses");
};
