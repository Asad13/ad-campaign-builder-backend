/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("target_categories").del();
  await knex("target_categories").insert([
    { id: 1, name: "Personal Care & Services" },
    { id: 2, name: "Automotive" },
    { id: 3, name: "Health & Medical" },
    { id: 4, name: "Home & Garden" },
    { id: 5, name: "Travel & Transportation" },
    { id: 6, name: "Education" },
    { id: 7, name: "Professional Services & Government" },
    { id: 8, name: "Legal & Financial Services" },
    { id: 9, name: "Retail & Merchants" },
    { id: 10, name: "Hospitality & Entertainment" }
  ]);

  await knex("target_subcategories").del();
  await knex("target_subcategories").insert([
    { id: 1, name: "Animal Care & Supplies", category_id: 1 },
    { id: 2, name: "Barber & Beauty Salons", category_id: 1 },
    { id: 3, name: "Beauty Supplies", category_id: 1 },
    { id: 4, name: "Dry Cleaners & Laundromats", category_id: 1 },
    { id: 5, name: "Exercise & Fitness (Gyms)", category_id: 1 },
    { id: 6, name: "Massage & Body Works", category_id: 1 },
    { id: 7, name: "Nail Salons", category_id: 1 },
    { id: 8, name: "Shoe Repairs", category_id: 1 },
    { id: 9, name: "Tailors", category_id: 1 },
    { id: 10, name: "Auto Accessories", category_id: 2 },
    { id: 11, name: "Auto Dealers - New", category_id: 2 },
    { id: 12, name: "Auto Dealers - Old", category_id: 2 },
    { id: 13, name: "Detail & Carwash", category_id: 2 },
    { id: 14, name: "Gas Stations", category_id: 2 },
    { id: 15, name: "Motorcycles Sales & Repair", category_id: 2 },
    { id: 16, name: "Rental & Leasing", category_id: 2 },
    { id: 17, name: "Service, Repair & Parts", category_id: 2 },
    { id: 18, name: "Towing", category_id: 2 },
    { id: 19, name: "Acupuncture", category_id: 3 },
    { id: 20, name: "Assisted living & home health care", category_id: 3 },
    { id: 21, name: "Audiologists", category_id: 3 },
    { id: 22, name: "Chiropractic", category_id: 3 },
    { id: 23, name: "Clinics & Medical Centers", category_id: 3 },
    { id: 24, name: "Dental", category_id: 3 },
    { id: 25, name: "Diet & Nutrition", category_id: 3 },
    { id: 26, name: "Laboratory, Imaging & Diagnostics", category_id: 3 },
    { id: 27, name: "Massage therapy", category_id: 3 },
    { id: 28, name: "Mental Health", category_id: 3 },
    { id: 29, name: "Nurse", category_id: 3 },
    { id: 30, name: "Optical", category_id: 3 },
    { id: 31, name: "Pharmacy, Drug & Vitamin Stores", category_id: 3 },
    { id: 32, name: "Physical therapy", category_id: 3 },
    { id: 33, name: "Physicians & Assistants", category_id: 3 },
    { id: 34, name: "Podiatry", category_id: 3 },
    { id: 35, name: "Social Worker", category_id: 3 },
    { id: 36, name: "Animal Hospital", category_id: 3 },
    { id: 37, name: "Veterinary & Animal Surgeons", category_id: 3 },
    { id: 38, name: "Antiques & Collectibles", category_id: 4 },
    { id: 39, name: "Cleaning", category_id: 4 },
    { id: 40, name: "Crafts, Hobbies & Sports", category_id: 4 },
    { id: 41, name: "Flower shops", category_id: 4 },
    { id: 42, name: "Home Furnishing", category_id: 4 },
    { id: 43, name: "Home Goods", category_id: 4 },
    { id: 44, name: "Home improvement & repairs", category_id: 4 },
    { id: 45, name: "Landscape & Lawn services", category_id: 4 },
    { id: 46, name: "Pest control", category_id: 4 },
    { id: 47, name: "Pool supplies & service", category_id: 4 },
    { id: 48, name: "Security System & services", category_id: 4 },
    { id: 49, name: "Hotel, Motel & Extended Stay", category_id: 5 },
    { id: 50, name: "Moving & Storage", category_id: 5 },
    { id: 51, name: "Packaging & Shipping", category_id: 5 },
    { id: 52, name: "Car rentals & Transportation", category_id: 5 },
    { id: 53, name: "Travel & tourism", category_id: 5 },
    { id: 54, name: "Adult & continuing education", category_id: 6 },
    { id: 55, name: "Early Childhood Education", category_id: 6 },
    { id: 56, name: "Educational Resources", category_id: 6 },
    { id: 57, name: "Other Educational", category_id: 6 },
    { id: 58, name: "Civic groups", category_id: 7 },
    { id: 59, name: "Funeral service providers & cemetaries", category_id: 7},
    { id: 60, name: "Utility Companies", category_id: 7 },
    { id: 61, name: "Architects, Landscape Architects", category_id: 7 },
    { id: 62, name: "Blasting & Demolition", category_id: 7 },
    { id: 63, name: "Building Materials & Supplies", category_id: 7 },
    { id: 64, name: "Construction Companies", category_id: 7 },
    { id: 65, name: "Electricians", category_id: 7 },
    { id: 66, name: "Engineer, Survey", category_id: 7 },
    { id: 67, name: "Environmental assessments", category_id: 7 },
    { id: 68, name: "Inspectors", category_id: 7 },
    { id: 69, name: "Plaster & Concrete", category_id: 7 },
    { id: 70, name: "Plumbers", category_id: 7 },
    { id: 71, name: "Roofers", category_id: 7 },
    { id: 72, name: "Import & Export", category_id: 7 },
    { id: 73, name: "Accountants", category_id: 8 },
    { id: 74, name: "Attorneys", category_id: 8 },
    { id: 75, name: "Financial Institutions", category_id: 8 },
    { id: 76, name: "Financial Services", category_id: 8 },
    { id: 77, name: "Insurance", category_id: 8 },
    { id: 78, name: "Other legal", category_id: 8 },
    { id: 79, name: "Gift Shops", category_id: 9 },
    { id: 80, name: "Clothing & accessories", category_id: 9 },
    { id: 81, name: "Department stores, sporting goods", category_id: 9 },
    { id: 82, name: "General", category_id: 9 },
    { id: 83, name: "Jewelry", category_id: 9 },
    { id: 84, name: "Shoes", category_id: 9 },
    { id: 85, name: "Wholesale", category_id: 9 },
    { id: 86, name: "Manufacturing", category_id: 9 },
    { id: 87, name: "Desserts, catering & supplies", category_id: 10 },
    { id: 88, name: "Fast Food & Carry out", category_id: 10 },
    { id: 89, name: "Grocery, Beverage & Tobacco", category_id: 10 },
    { id: 90, name: "Restaurants", category_id: 10 },
    { id: 91, name: "Bars", category_id: 10 },
    { id: 92, name: "Nightclubs", category_id: 10 },
    { id: 93, name: "Artists, writers", category_id: 10 },
    { id: 94, name: "Event planners & supplies", category_id: 10 },
    { id: 95, name: "Golf courses", category_id: 10 },
    { id: 96, name: "Movies", category_id: 10 },
    { id: 97, name: "Production", category_id: 10 }
  ]);

  await knex("screen_selections").del();
  await knex("screen_selections").insert([
    { id: 1, name: "radius" },
    { id: 2, name: "area" },
  ]);

  await knex("roles").del();
  await knex("roles").insert([
    { id: 1, name: "admin", desc: "Manage the account and users, can create and edit templates and versions" },
    { id: 2, name: "creator", desc: "Can create and edit templates and versions" }
  ]);

  await knex("campaign_statuses").del();
  await knex("campaign_statuses").insert([
    { id: 1, name: "pending" },
    { id: 2, name: "active" },
    { id: 3, name: "scheduled" },
    { id: 4, name: "completed" },
    { id: 5, name: "archived" }
  ]);
};
