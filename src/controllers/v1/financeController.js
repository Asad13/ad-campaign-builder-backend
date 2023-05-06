const { validationResult } = require("express-validator");
const financeService = require("../../services/v1/financeService");
const userService = require("../../services/v1/userService");
const _ = require("lodash");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const INVOICES_PER_PAGE = 6;

// Demo Data
const demoInvoices = [
  {
    id: "in_1MPJ0o2eZvKYlo2CzzsDFWly",
    created: new Date("2023-01-01").getTime(),
    description: "1-Year Subscription Standard License Buzzier",
    subtotal: 599.99,
    currency: "usd",
  },
  {
    id: "in_1MO9RX2eZvKYlo2CPcVSnuIN",
    created: new Date("2023-01-01").getTime(),
    description: "1-Year Subscription Standard License Buzzier",
    subtotal: 599.99,
    currency: "usd",
  },
  {
    id: "in_7GRP0o6eZvKYlo2CzzsUSHux",
    created: new Date("2023-01-01").getTime(),
    description: "2-Year Subscription Standard License Buzzier",
    subtotal: 1199.98,
    currency: "usd",
  },
];

const demoFullInvoices = [
  {
    id: "in_1MPJ0o2eZvKYlo2CzzsDFWly",
    created: new Date("2023-01-01").getTime(),
    subtotal: 599.99,
    currency: "usd",
    card_type: "Visa",
    last4: 4444,
    status: "paid",
    lines: {
      data: [
        {
          id: "il_1MOIEH2eZvKYlo2Cri0eVwc5",
          quantity: 1,
          description: "1-Year Subscription Standard License Buzzier",
          amount: 499.99,
          currency: "usd",
          tax_amounts: {
            tax_rate: 20,
            amount: 100,
          },
        },
      ],
    },
  },
  {
    id: "in_1MO9RX2eZvKYlo2CPcVSnuIN",
    created: new Date("2023-01-01").getTime(),
    subtotal: 599.99,
    currency: "usd",
    card_type: "Visa",
    last4: 4444,
    status: "paid",
    lines: {
      data: [
        {
          id: "il_1MOIEH2eZvKYlo2Cri0eVwc5",
          quantity: 1,
          description: "1-Year Subscription Standard License Buzzier",
          amount: 499.99,
          currency: "usd",
          tax_amounts: {
            tax_rate: 20,
            amount: 100,
          },
        },
      ],
    },
  },
  {
    id: "in_7GRP0o6eZvKYlo2CzzsUSHux",
    created: new Date("2023-01-01").getTime(),
    subtotal: 1199.98,
    currency: "usd",
    card_type: "Visa",
    last4: 4444,
    status: "paid",
    lines: {
      data: [
        {
          id: "il_1MOIEH2eZvKYlo2Cri0eVwc5",
          quantity: 1,
          description: "2-Year Subscription Standard License Buzzier",
          amount: 999.98,
          currency: "usd",
          tax_amounts: {
            tax_rate: 20,
            amount: 200,
          },
        },
      ],
    },
  },
];

const demoInvoiceInfos = [
  {
    id: "in_1MPJ0o2eZvKYlo2CzzsDFWly",
    card_type: "Mastercard",
    last4: "4444",
    user_id: "7d33e4e9-e5bb-47f8-9bbf-2954f7937ad5",
  },
  {
    id: "in_1MO9RX2eZvKYlo2CPcVSnuIN",
    card_type: "Mastercard",
    last4: "4444",
    user_id: "cbab54af-9bc7-4957-9f02-9d191551d9ff",
  },
  {
    id: "in_7GRP0o6eZvKYlo2CzzsUSHux",
    card_type: "Mastercard",
    last4: "4444",
    user_id: "4acdf323-54a1-4e36-b9ca-744287634e2e",
  },
];

const getDemoInvoiceInfo = (id) => {
  return demoInvoiceInfos.find((item) => item.id === id);
};

const getDemoInvoiceData = (id) => {
  return demoFullInvoices.find((item) => item.id === id);
};

/**
 * Get all cards of a customer(user)
 * @function
 * @name getAllCards
 * @param {object} req
 * @param {object} res
 */
const getAllCards = async (req, res) => {
  try {
    console.log("All Cards");

    const customer = await financeService.getCustomer(req.user.id);

    let cards = [];

    if (customer) {
      const customerStripe = await stripe.customers.retrieve(customer.id);

      const cardsList = await stripe.customers.listSources(
        customer.id,
        { object: "card" } //, limit: 3
      );

      cards = cardsList.data.map((card) => ({
        id: card.id,
        brand: card.brand,
        last4: card.last4,
        exp: `${card.exp_month.toString().length < 2 ? "0" : ""}${
          card.exp_month
        } / ${
          card.exp_year.toString().length <= 2
            ? card.exp_year
            : card.exp_year.toString().substring(2)
        }`,
        isDefault: card.id === customerStripe.default_source,
      }));

      const deleteCardIds = await financeService.getDeletedCardIds(
        customerStripe.id
      );

      for (let i = 0; i < cards.length; i++) {
        if (deleteCardIds.indexOf(cards[i].id) > -1) {
          cards.splice(i, 1);
        }
      }

      if (cards.length > 1) {
        const defaultCardIndex = cards.findIndex(
          (card) => card.id === customerStripe.default_source
        );
        if (defaultCardIndex !== 0) {
          const defaultCard = cards.find(
            (card) => card.id === customerStripe.default_source
          );
          cards.splice(defaultCardIndex, 1);
          cards.unshift(defaultCard);
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "All Cards",
      data: {
        numberOfCards: cards?.length ?? 0,
        cards: cards ?? [],
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Add new Card
 * @function
 * @name addCard
 * @param {object} req
 * @param {object} res
 */
const addCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Error in adding card" });
  }

  try {
    let customer = await financeService.getCustomer(req.user.id);

    let customerStripe = {};
    if (!customer) {
      // Create a customer on stripe
      customerStripe = await stripe.customers.create({
        email: req.body.emails[0],
      });
      // Save new customer to database(users_customers table)
      customer = await financeService.createCustomer({
        id: customerStripe.id,
        emails: JSON.stringify(req.body.emails),
        user_id: req.user.id,
      });
    } else {
      customerStripe = await stripe.customers.retrieve(customer.id);
    }

    const cardValues = _.pick(req.body, [
      "name",
      "number",
      "exp_month",
      "exp_year",
      "cvc",
      "address_line1",
      "address_city",
      "address_state",
      "address_zip",
      "address_country",
    ]);

    const token = await stripe.tokens.create({
      card: { ...cardValues },
    });

    // Add Card in stripe
    const card = await stripe.customers.createSource(customer.id, {
      source: process.env.STRIPE_SECRET_KEY.includes("test")
        ? "tok_mastercard"
        : token.id, // In Production => token.id
    });

    // If set as default card:
    let updatedCustomerStripe = { ...customerStripe };
    if (req.body.isDefault) {
      updatedCustomerStripe = await stripe.customers.update(customer.id, {
        default_source: card.id,
      });
    }

    // Save card id in customers_cards table
    await financeService.createCard({
      id: card.id,
      customer_id: customerStripe.id,
    }); //{customer_id, card_id}

    const newCard = {
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      exp: `${card.exp_month.toString().length < 2 ? "0" : ""}${
        card.exp_month
      } / ${
        card.exp_year.toString().length <= 2
          ? card.exp_year
          : card.exp_year.toString().substring(2)
      }`,
      isDefault: card.id === updatedCustomerStripe.id,
    };

    return res.status(200).json({
      status: true,
      message: "Card added successfully",
      data: {
        card: newCard,
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Error in adding card",
    });
  }
};

/**
 * Update information of an existing Card
 * @function
 * @name updateCard
 * @param {object} req
 * @param {object} res
 */
const updateCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ status: false, message: "Error in updating card" });
  }

  try {
    const card_id = req.params.id;
    const customer = await financeService.getCustomer(req.user.id);

    const cardValues = _.pick(req.body, [
      "name",
      "exp_month",
      "exp_year",
      "cvc",
      "address_line1",
      "address_city",
      "address_state",
      "address_zip",
      "address_country",
    ]);

    // Add Card in stripe
    const card = await stripe.customers.updateSource(customer.id, card_id, {
      ...cardValues,
    });

    // If set as default card:
    let updatedCustomerStripe = await stripe.customers.retrieve(customer.id);

    if (req.body.isDefault) {
      updatedCustomerStripe = await stripe.customers.update(customer.id, {
        default_source: card.id,
      });
    }

    const updatedCard = {
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      exp: `${card.exp_month.toString().length < 2 ? "0" : ""}${
        card.exp_month
      } / ${
        card.exp_year.toString().length <= 2
          ? card.exp_year
          : card.exp_year.toString().substring(2)
      }`,
      isDefault: card.id === updatedCustomerStripe.id,
    };

    return res.status(200).json({
      status: true,
      message: "Card updated successfully",
      data: {
        card: updatedCard,
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Error in updating card",
    });
  }
};

/**
 * Get all information of a specific card with ID
 * @function
 * @name getCard
 * @param {object} req
 * @param {object} res
 */
const getCard = async (req, res) => {
  try {
    console.log(`GET CARD ${req.params.id}`);
    const card_id = req.params.id;
    const customer = await financeService.getCustomer(req.user.id);

    const customerStripe = await stripe.customers.retrieve(customer.id);
    const cardData = await stripe.customers.retrieveSource(
      customer.id,
      card_id
    );

    const card = _.pick(cardData, [
      "id",
      "name",
      "exp_month",
      "exp_year",
      "cvc",
      "address_line1",
      "address_city",
      "address_state",
      "address_zip",
      "address_country",
      "last4",
    ]);

    card.emails = customer.emails;

    card.number = `${card.last4}`;
    delete card.last4;

    card.exp = `${card.exp_month.toString().length < 2 ? "0" : ""}${
      card.exp_month
    } / ${
      card.exp_year.toString().length <= 2
        ? card.exp_year
        : card.exp_year.toString().substring(2)
    }`;
    delete card.exp_month;
    delete card.exp_year;

    card.isDefault = card.id === customerStripe.default_source;

    return res.status(200).json({
      status: true,
      message: "Card Data",
      data: {
        card: card,
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Delete Card
 * @function
 * @name deleteCard
 * @param {object} req
 * @param {object} res
 */
const deleteCard = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Delete Card with ID: ${id}`);

    const deletedId = await financeService.deleteCard(id);

    const customer = await financeService.getCustomer(req.user.id);
    const customerStripe = await stripe.customers.retrieve(customer.id);

    let newDefaultCardId = null;
    if (deletedId === customerStripe.default_source) {
      newDefaultCardId = await financeService.getLatestCardId(customer.id);
      const updatedCustomer = await stripe.customers.update(customer.id, {
        default_source: newDefaultCardId,
      });
      console.log(
        `Default card of customer ${updatedCustomer?.id} is changed from ${deletedId} to ${updatedCustomer?.default_source}`
      );
    }

    return res.status(200).json({
      status: true,
      message: "Card deleted successfully",
      data: {
        card: {
          id: deletedId,
        },
        newDefaultCardId: newDefaultCardId,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Card deletion unsuccessful",
    });
  }
};

/**
 * Handle Get request of all tax information of a user
 * @function
 * @name getTaxInfo
 * @param {object} req
 * @param {object} res
 */
const getTaxInfo = async (req, res) => {
  try {
    console.log(`GET Tax info of ${req.user.id}`);

    const taxInfo = await financeService.getTaxInfo(req.user.id);

    return res.status(200).json({
      status: true,
      message: "User tax Information",
      data: {
        taxInfo: taxInfo
          ? {
              name: taxInfo?.name ?? "",
              address_line_one: taxInfo?.address_line_one ?? "",
              address_line_two: taxInfo?.address_line_two ?? "",
              vat_gst: taxInfo?.vat_gst ?? "",
            }
          : null,
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Handle post request to save tax information
 * @function
 * @name saveTaxInfo
 * @param {object} req
 * @param {object} res
 */
const saveTaxInfo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      message: "Error in saving tax information",
    });
  }

  try {
    const taxinfo = await financeService.getTaxInfo(req.user.id);

    const taxData = _.pick(req.body, [
      "name",
      "address_line_one",
      "address_line_two",
    ]);

    let newTaxInfo = {};
    if (!taxinfo) {
      taxData.user_id = req.user.id;
      newTaxInfo = await financeService.createTaxInfo(taxData);
    } else {
      newTaxInfo = await financeService.updateTaxInfo(taxData, req.user.id);
    }

    return res.status(200).json({
      status: true,
      message: "Tax Information saved successfully",
      data: {
        taxInfo: {
          name: newTaxInfo?.name ?? "",
          address_line_one: newTaxInfo?.address_line_one ?? "",
          address_line_two: newTaxInfo?.address_line_two ?? "",
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Error in saving tax information",
    });
  }
};

/**
 * Handle post request to save VAT/GST Number
 * @function
 * @name saveVAT_GST
 * @param {object} req
 * @param {object} res
 */
const saveVAT_GST = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      message: "Error in saving VAT/GST number",
    });
  }

  try {
    const taxinfo = await financeService.getTaxInfo(req.user.id);

    const taxData = _.pick(req.body, ["vat_gst"]);

    let newTaxInfo = {};
    if (!taxinfo) {
      taxData.user_id = req.user.id;
      newTaxInfo = await financeService.createTaxInfo(taxData);
    } else {
      newTaxInfo = await financeService.updateTaxInfo(taxData, req.user.id);
    }

    return res.status(200).json({
      status: true,
      message: "VAT/GST number saved successfully",
      data: {
        taxInfo: {
          vat_gst: newTaxInfo?.vat_gst ?? "",
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      message: "Error in saving VAT/GST number",
    });
  }
};

/**
 * Get all invoices(Purchase History) of a customer(user)
 * @function
 * @name getAllInvoices
 * @param {object} req
 * @param {object} res
 */
const getAllInvoices = async (req, res) => {
  try {
    console.log("All Invoices");

    const customer = await financeService.getCustomer(req.user?.id);

    const page = req.query?.page ?? 1;
    const offset = (page - 1) * INVOICES_PER_PAGE;

    const invoicesData = await stripe.invoices.list({
      customer: customer.id,
    });

    invoicesData.data.push(...demoInvoices); // Demo Data will be removed later

    let invoices = [];
    for (let i = offset; i < invoicesData.data.length; i++) {
      invoices.push({
        id: invoicesData?.data[i].id,
        date: invoicesData?.data[i].created,
        description: invoicesData?.data[i].description,
        total: invoicesData?.data[i].subtotal,
        currency: invoicesData?.data[i].currency,
      });
    }

    return res.status(200).json({
      status: true,
      message: "All Invoices",
      data: {
        numberOfInvoices: invoicesData?.data?.length ?? 0,
        invoices: invoices ?? [],
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * Get information of a specific invoice with ID
 * @function
 * @name getInvoice
 * @param {object} req
 * @param {object} res
 */
const getInvoice = async (req, res) => {
  try {
    console.log(`GET Invoice Information with ID: ${req.params?.id}`);
    const invoice_id = req.params?.id;

    const taxInfo = await financeService.getTaxInfo(req.user?.id);
    const userInfo = await userService.getUserData(req.user?.id);
    let invoiceInfo = await financeService.getInvoiceInfo(invoice_id);

    // Demo Data will be removed later
    if (!invoiceInfo) {
      invoiceInfo = getDemoInvoiceInfo(invoice_id);
    }

    let invoiceData;
    if (process.env.STRIPE_SECRET_KEY.includes("test")) {
      // Demo Data will be removed later
      invoiceData = getDemoInvoiceData(invoice_id);
    } else {
      invoiceData = await stripe.invoices.retrieve(invoice_id);
    }

    const invoice = {
      id: invoiceData?.id,
      date: invoiceData?.created,
      total: invoiceData?.subtotal,
      currency: invoiceData?.currency,
      card_type: invoiceInfo?.card_type,
      last4: invoiceInfo?.last4,
      status: invoiceData?.status,
      items: invoiceData?.lines?.data.map((item) => ({
        id: item?.id,
        quantity: item?.quantity,
        description: item?.description,
        amount: item?.amount,
        currency: item?.currency,
        tax_rate: item?.tax_amounts.tax_rate,
        tax_amount: item?.tax_amounts.amount,
      })),
    };

    invoice.billed_from = {
      company: process.env.COMPANY_NAME,
      address_line_one: process.env.COMPANY_ADDRESS_LINE_ONE,
      address_line_two: process.env.COMPANY_ADDRESS_LINE_TWO,
      city: process.env.COMPANY_ADDRESS_CITY,
      postcode: process.env.COMPANY_ADDRESS_POSTCODE,
      country: process.env.COMPANY_ADDRESS_COUNTRY,
    };

    invoice.billed_to = {
      company: userInfo?.company_name,
      address_line_one: taxInfo?.address_line_one,
      address_line_two: taxInfo?.address_line_two,
    };

    invoice.vat_gst = taxInfo?.vat_gst;

    return res.status(200).json({
      status: true,
      message: "Invoice Information",
      data: {
        invoice: invoice,
      },
    });
  } catch (e) {
    return res.json({
      status: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  getAllCards,
  addCard,
  getCard,
  updateCard,
  deleteCard,
  getTaxInfo,
  saveTaxInfo,
  saveVAT_GST,
  getAllInvoices,
  getInvoice,
};
