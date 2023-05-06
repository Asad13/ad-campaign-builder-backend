const db = require("../../database/db");

/**
 * Get a Customer
 * @function
 * @name getCustomer
 * @param {string} id - User's ID
 */
const getCustomer = async (id) => {
  const customers = await db("users_customers")
    .select("*")
    .from("users_customers")
    .where({
      user_id: id,
    });
  return customers[0];
};

/**
 * Saves stripe Customer information of users
 * @function
 * @name createCustomer
 * @param {object} data - Stripe Customer Information
 */
const createCustomer = async (data) => {
  const newCustomers = await db("users_customers").insert(
    {
      ...data,
    },
    ["*"]
  );

  return newCustomers[0];
};

/**
 * Saves Card information of customers
 * @function
 * @name createCard
 * @param {object} data - Card Information
 */
const createCard = async (data) => {
  const newCards = await db("customers_cards").insert(
    {
      ...data,
    },
    ["*"]
  );

  return newCards[0];
};

/**
 * Get Ids of deleted cards
 * @function
 * @name getDeletedCardIds
 * @param {string} id - Customer ID
 */
const getDeletedCardIds = async (id) => {
  const deletedCardIds = await db("customers_cards")
    .select("id")
    .from("customers_cards")
    .where({
      customer_id: id,
      is_deleted: true,
    });
  return deletedCardIds.map((deletedCardId) => deletedCardId.id);
};

/**
 * Get Ids of deleted cards
 * @function
 * @name getDeletedCardIds
 * @param {string} id - Customer ID
 */
const getLatestCardId = async (id) => {
  const cardIds = await db("customers_cards")
    .select("id")
    .from("customers_cards")
    .where({
      customer_id: id,
      is_deleted: false,
    })
    .orderBy("created_at", "desc")
    .limit(1);
  return cardIds[0]?.id;
};

/**
 * Delete Card (  Setting is_delete = true)
 * @function
 * @name deleteCard
 * @param {string} id - Card ID
 */
const deleteCard = async (id) => {
  const deleteCards = await db("customers_cards")
    .where({
      id: id,
    })
    .update(
      {
        is_deleted: true,
      },
      ["id"]
    );
  return deleteCards[0]?.id;
};

/**
 * Get Tax Information of a user from database
 * @function
 * @name getTaxInfo
 * @param {string} id - User ID
 */
const getTaxInfo = async (id) => {
  const taxInfos = await db("users_tax_info")
    .select("*")
    .from("users_tax_info")
    .where({
      user_id: id,
    });
  return taxInfos[0];
};

/**
 * Saves tax Information of a user to the database
 * @function
 * @name createTaxInfo
 * @param {object} taxInfo - Tax Information
 */
const createTaxInfo = async (taxData) => {
  const taxInfos = await db("users_tax_info").insert(
    {
      ...taxData,
    },
    ["*"]
  );

  return taxInfos[0];
};

/**
 * Updates tax Information of a user in the database
 * @function
 * @name updateTaxInfo
 * @param {object} taxInfo - Tax Information
 * @param {string} id - User ID
 */
const updateTaxInfo = async (taxData, id) => {
  const taxInfos = await db("users_tax_info")
    .where({
      user_id: id,
    })
    .update(
      {
        ...taxData,
      },
      ["*"]
    );

  return taxInfos[0];
};

/**
 * Get Information of a particular Invoice with its ID
 * @function
 * @name getInvoiceInfo
 * @param {string} id - Invoice ID
 */
const getInvoiceInfo = async (id) => {
  const invoiceInfos = await db("users_invoices")
    .select("*")
    .from("users_invoices")
    .where({
      id: id,
    });
  return invoiceInfos[0];
};

module.exports = {
  getCustomer,
  createCustomer,
  createCard,
  deleteCard,
  getDeletedCardIds,
  getTaxInfo,
  createTaxInfo,
  updateTaxInfo,
  getInvoiceInfo,
  getLatestCardId
};
