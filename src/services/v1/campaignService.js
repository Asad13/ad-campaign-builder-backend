const db = require("../../database/db");

const SCREEN_SELECTION_BY_RADIUS = 1;
const SCREEN_SELECTION_BY_AREA = 2;

/**
 * Get the number of campaigns
 * @function
 * @name getCampaignsCount
 * @param {[string]} ids - User IDs
 */
const getCampaignsCount = async (ids) => {
  const counts = await db("users_campaigns").count("campaign_id").whereIn("user_id", ids);
  return counts[0].count;
};

/**
 * Get the campaign with the provided ID
 * @function
 * @name getAllCampaigns
 * @param {string} id - Campaign ID
 */
const getCampaign = async (id) => {
  const campaigns = await db("campaigns")
    .select("name", "status_id", "screen_selection_id")
    .from("campaigns")
    .where({
      id: id,
    });

  return campaigns[0];
};

/**
 * Get Status Id of Campaign
 * @function
 * @name getCampaignStatusId
 * @param {string} status - Campaign Status Name
 */
const getCampaignStatusId = async (status) => {
  const ids = await db("campaign_statuses")
    .select("id")
    .from("campaign_statuses")
    .where({
      name: status,
    });
  return ids[0].id;
};

/**
 * Get Campaign Status
 * @function
 * @name getCampaignStatus
 * @param {number} id - Campaign Status_id
 */
const getCampaignStatus = async (id) => {
  const statuses = await db("campaign_statuses")
    .select("name")
    .from("campaign_statuses")
    .where({
      id: id,
    });
  return statuses[0].name;
};

/**
 * Get Categories of a campaign
 * @function
 * @name getCampaignCategories
 * @param {string} id - Campaign id
 */
const getCampaignCategories = async (id) => {
  const categories = await db("campaigns_target_categories")
    .select("category_id")
    .from("campaigns_target_categories")
    .where({
      campaign_id: id,
    });
  return categories.map((category) => category.category_id);
};

/**
 * Delete categories of a campaign
 * @function
 * @name deleteCampaignCategories
 * @param {string} id - Campaign id
 */
const deleteCampaignCategories = async (id) => {
  await db("campaigns_target_categories").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Add Category id and Campaign id in campaigns_target_categories table
 * @function
 * @name addCampaignsTargetCategories
 * @param {object[]} categories - Array of objects containing campaign_id and category_id
 */
const addCampaignsTargetCategories = async (categories) => {
  await db("campaigns_target_categories").insert(categories);
};

/**
 * Get Subcategories of a campaign
 * @function
 * @name getCampaignSubcategories
 * @param {string} id - Campaign id
 */
const getCampaignSubcategories = async (id) => {
  const subcategories = await db("campaigns_target_subcategories")
    .select("subcategory_id")
    .from("campaigns_target_subcategories")
    .where({
      campaign_id: id,
    });
  return subcategories.map((subcategory) => subcategory.subcategory_id);
};

/**
 * Delete subcategories of a campaign
 * @function
 * @name deleteCampaignSubategories
 * @param {string} id - Campaign id
 */
const deleteCampaignSubategories = async (id) => {
  await db("campaigns_target_subcategories").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Add Category id and Campaign id in campaigns_target_subcategories table
 * @function
 * @name addCampaignsTargetSubcategories
 * @param {object[]} subcategories - Array of objects containing campaign_id and subcategory_id
 */
const addCampaignsTargetSubcategories = async (subcategories) => {
  await db("campaigns_target_subcategories").insert(subcategories);
};

/**
 * Get Screen Selection Id of the Campaign
 * @function
 * @name getCampaignScreenSelectionId
 * @param {string} screenSelection - radius/area
 */
const getCampaignScreenSelectionId = async (screenSelection) => {
  const ids = await db("screen_selections")
    .select("id")
    .from("screen_selections")
    .where({
      name: screenSelection,
    });
  return ids[0].id;
};

/**
 * Get Campaign's Screen Selection type
 * @function
 * @name getCampaignScreenSelection
 * @param {number} id - Campaign Status_id
 * @returns {string} Campaign's Screen Selection type (radius or area)
 */
const getCampaignScreenSelection = async (id) => {
  const statuses = await db("screen_selections")
    .select("name")
    .from("screen_selections")
    .where({
      id: id,
    });
  return statuses[0].name;
};

/**
 * Get Scheduling of a campaign
 * @function
 * @name getScheduling
 * @param {string} id - Campaign id
 */
const getScheduling = async (id) => {
  const schedulings = await db("scheduling")
    .select(
      "publish_dates_isforever",
      "publish_dates_custom",
      "dow_iseveryday",
      "dow_custom",
      "playtimes_isallday",
      "playtimes_custom"
    )
    .from("scheduling")
    .where({
      campaign_id: id,
    });
  return schedulings[0];
};

/**
 * Add Scheduling information of a campaign in scheduling table
 * @function
 * @name addScheduling
 * @param {object} scheduling - Object containing Scheduling information of a campaign
 */
const addScheduling = async (scheduling) => {
  await db("scheduling").insert(scheduling);
};

/**
 * Update Scheduling information of a campaign in scheduling table
 * @function
 * @name updateScheduling
 * @param {string} id - Campaign id
 * @param {object} scheduling - Object containing Scheduling information of a campaign
 */
const updateScheduling = async (id, scheduling) => {
  await db("scheduling")
    .where({
      campaign_id: id,
    })
    .update({
      ...scheduling,
    });
};

/**
 * Delete Scheduling Info of a campaign
 * @function
 * @name deleteScheduling
 * @param {string} id - Campaign id
 */
const deleteScheduling = async (id) => {
  await db("scheduling").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Get Budget of a campaign
 * @function
 * @name getCampaignBudget
 * @param {string} id - Campaign id
 */
const getCampaignBudget = async (id) => {
  const budgets = await db("campaign_budgets")
    .select("value")
    .from("campaign_budgets")
    .where({
      campaign_id: id,
    });
  return budgets[0]?.value;
};

/**
 * Add budget information of a campaign in campaign_budgets table
 * @function
 * @name addCampaignBudget
 * @param {object} budget - Object containing budget and campaign id of a campaign
 */
const addCampaignBudget = async (budget) => {
  await db("campaign_budgets").insert(budget);
};

/**
 * Update budget information of a campaign in campaign_budgets table
 * @function
 * @name updateCampaignBudget
 * @param {string} id - Campaign id
 * @param {object} budget - budget value
 */
const updateCampaignBudget = async (id, budget) => {
  await db("campaign_budgets")
    .where({
      campaign_id: id,
    })
    .update({
      value: budget,
    });
};

/**
 * Delete Budget for a campaign
 * @function
 * @name deleteCampaignBudget
 * @param {string} id - Campaign id
 */
const deleteCampaignBudget = async (id) => {
  await db("campaign_budgets").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Get First Creative of a Campaign
 * @function
 * @name getCreative
 * @param {string} id - Campaign id
 */
const getFirstImagePath = async (id) => {
  const creatives = await db("campaign_files")
    .select("file")
    .from("campaign_files")
    .limit(1)
    .where({
      campaign_id: id,
    })
    .whereLike("mimetype", "%image%");
  return creatives[0]?.file;
};

/**
 * Get Creatives of a Campaign
 * @function
 * @name getCreatives
 * @param {string} id - Campaign id
 */
const getCreatives = async (id) => {
  const creatives = await db("campaign_files")
    .select("*")
    .from("campaign_files")
    .where({
      campaign_id: id,
    });
  return creatives;
};

/**
 * Update campaign_id of creatives
 * @function
 * @name updateCreatives
 * @param {string} id - Creatives ID
 * @param {string} campaign_id - Campaign ID
 */
const updateCreatives = async (id, campaign_id) => {
  await db("campaign_files")
    .where({
      id: id,
    })
    .update({
      campaign_id: campaign_id,
    });
};

/**
 * Delete creatives of a campaign
 * @function
 * @name deleteCreatives
 * @param {string} id - Campaign ID
 */
const deleteCreatives = async (id) => {
  await db("campaign_files").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Get All the campaign ids of a user
 * @function
 * @name getCampaignsOFUsers
 * @param {[string]} ids - User IDs
 * @param {number} limit - Number of campaigns to fetch
 * @param {number} offset - starting position of campaign
 */
const getCampaignsOfUsers = async (ids, limit, offset) => {
  let campaign_ids = [];
  if (offset) {
    campaign_ids = await db("users_campaigns")
      .select("campaign_id")
      .from("users_campaigns")
      .limit(limit)
      .offset(offset)
      .whereIn("user_id", ids);
  } else {
    campaign_ids = await db("users_campaigns")
      .select("campaign_id")
      .from("users_campaigns")
      .limit(limit)
      .whereIn("user_id", ids);
  }
  return campaign_ids;
};

/**
 * Add campaign id of a campaign and user id of the creator in users_campaigns table
 * @function
 * @name addUsersCampaigns
 * @param {object} users_campaigns - Object containing campaign id of a campaign and user id of the creator
 */
const addUsersCampaigns = async (users_campaigns) => {
  await db("users_campaigns").insert(users_campaigns);
};

/**
 * Delete Campaigns of Users
 * @function
 * @name deleteUsersCampaigns
 * @param {string} id - Campaign ID
 */
const deleteUsersCampaigns = async (id) => {
  await db("users_campaigns").del(["*"]).where({
    campaign_id: id,
  });
};


/**
 * Get draw area informations of a campaign from screen_draw_area table
 * @function
 * @name getScreenDrawAreas
 * @param {string} campaign_id - Campaign's ID
 */
const getScreenDrawAreas = async (campaign_id) => {
  const drawAreas = await db("screen_draw_area")
    .select("points","area")
    .from("screen_draw_area")
    .where({
      campaign_id: campaign_id,
    });
  return drawAreas[0]; // Only single draw area for now
};

/**
 * Saves new draw area information of a campaign in screen_draw_area table
 * @function
 * @name addScreenDrawAreas
 * @param {object} drawAreas - Contains draw area informations of campaign
 */
const addScreenDrawAreas = async (drawAreas) => {
  await db("screen_draw_area").insert(drawAreas);
};

/**
 * Delete draw area information of a campaign from screen_draw_area table
 * @function
 * @name deleteScreenDrawAreas
 * @param {string} id - Campaign ID
 */
const deleteScreenDrawAreas = async (id) => {
  await db("screen_draw_area").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Get radius informations of a campaign from screen_radius table
 * @function
 * @name getScreenRadiuses
 * @param {string} campaign_id - Campaign's ID
 */
const getScreenRadiuses = async (campaign_id) => {
  const radiuses = await db("screen_radius")
    .select("address","town","state","postcode","metric","radius","center")
    .from("screen_radius")
    .where({
      campaign_id: campaign_id,
    });
  return radiuses;
};

/**
 * Saves new radius information of a campaign in screen_radius table
 * @function
 * @name addScreenRadiuses
 * @param {[object]} radiuses - Array Containing radius informations of campaign
 */
const addScreenRadiuses = async (radiuses) => {
  await db("screen_radius").insert(radiuses);
};

/**
 * Delete radius information of a campaign from screen_radius table
 * @function
 * @name deleteScreenRadiuses
 * @param {string} id - Campaign ID
 */
const deleteScreenRadiuses = async (id) => {
  await db("screen_radius").del(["*"]).where({
    campaign_id: id,
  });
};

/**
 * Saves new campaign in database(postgres) in table campaigns
 * @function
 * @name createCampaign
 * @param {object} campaign - Contains Campaign information
 */
const createCampaign = async (campaign) => {
  const status_id = await getCampaignStatusId(campaign.status);

  const campaigns = await db("campaigns").insert(
    {
      name: campaign.name,
      status_id: status_id,
      screen_selection_id: campaign.screen_selection_id,
    },
    ["*"]
  );

  const newCampaign = campaigns[0];

  if (campaign.screen_selection_id === SCREEN_SELECTION_BY_RADIUS) {
    const radiuses = campaign.radius.map(item => {
      return {
        address: item?.address,
        town: item?.town,
        state: item?.state,
        postcode: item?.postcode,
        metric: item?.metric,
        radius: item?.radius,
        center: item?.center,
        campaign_id: newCampaign.id,
      }
    });

    await addScreenRadiuses(radiuses);

  } else if (campaign.screen_selection_id === SCREEN_SELECTION_BY_AREA) {
    const drawAreas = {}; // Only one area for now
    drawAreas.area = campaign.draw.area;
    drawAreas.points = JSON.stringify(campaign.draw.points);
    drawAreas.campaign_id = newCampaign.id;

    await addScreenDrawAreas(drawAreas);
  }

  const categories = campaign.categories.map((category) => {
    return { campaign_id: newCampaign.id, category_id: category };
  });
  await addCampaignsTargetCategories(categories);

  const subcategories = campaign.subcategories.map((subcategory) => {
    return { campaign_id: newCampaign.id, subcategory_id: subcategory };
  });
  await addCampaignsTargetSubcategories(subcategories);

  const scheduling = { campaign_id: newCampaign.id };

  scheduling.publish_dates_isforever = campaign.publish_dates_isforever;
  if (!campaign.publish_dates_isforever) {
    scheduling.publish_dates_custom = campaign.publish_dates_custom;
  }

  scheduling.dow_iseveryday = campaign.dow_iseveryday;
  if (!campaign.dow_iseveryday) {
    scheduling.dow_custom = campaign.dow_custom;
  }

  scheduling.playtimes_isallday = campaign.playtimes_isallday;
  if (!campaign.playtimes_isallday) {
    scheduling.playtimes_custom = campaign.playtimes_custom;
  }

  await addScheduling(scheduling);

  const budget = { campaign_id: newCampaign.id, value: campaign.budget };
  await addCampaignBudget(budget);

  campaign.creatives.forEach(async (creative) => {
    await updateCreatives(creative, newCampaign.id);
  });

  const users_campaigns = {
    user_id: campaign.uid,
    campaign_id: newCampaign.id,
  };
  await addUsersCampaigns(users_campaigns);

  return newCampaign;
};

/**
 * Update Campaign Service
 * @function
 * @name updateCampaign
 * @param {object} campaign - Contains Campaign information
 * @param {string} id - Campaign ID
 */
const updateCampaign = async (campaign, id) => {
  const status_id = await getCampaignStatusId(campaign.status);

  const campaigns = await db("campaigns")
    .where({
      id: id,
    })
    .update(
      {
        name: campaign.name,
        status_id: status_id,
        screen_selection_id: campaign.screen_selection_id,
      },
      ["*"]
    );

  const updatedCampaign = campaigns[0];
  
  await deleteScreenRadiuses(updatedCampaign.id);
  await deleteScreenDrawAreas(updatedCampaign.id);
  if (campaign.screen_selection_id === SCREEN_SELECTION_BY_RADIUS) {
    const radiuses = campaign.radius.map(item => {
      return {
        address: item?.address,
        town: item?.town,
        state: item?.state,
        postcode: item?.postcode,
        metric: item?.metric,
        radius: item?.radius,
        center: item?.center,
        campaign_id: updatedCampaign.id,
      }
    });

    await addScreenRadiuses(radiuses);

  } else if (campaign.screen_selection_id === SCREEN_SELECTION_BY_AREA) {
    const drawAreas = {}; // Only one area for now
    drawAreas.area = campaign.draw.area;
    drawAreas.points = JSON.stringify(campaign.draw.points);
    drawAreas.campaign_id = updatedCampaign.id;

    await addScreenDrawAreas(drawAreas);
  }

  await deleteCampaignCategories(id);
  const categories = campaign.categories.map((category) => {
    return { campaign_id: id, category_id: category };
  });
  await addCampaignsTargetCategories(categories);

  await deleteCampaignSubategories(id);
  const subcategories = campaign.subcategories.map((subcategory) => {
    return { campaign_id: id, subcategory_id: subcategory };
  });
  await addCampaignsTargetSubcategories(subcategories);

  const scheduling = {};

  scheduling.publish_dates_isforever = campaign.publish_dates_isforever;
  if (!campaign.publish_dates_isforever) {
    scheduling.publish_dates_custom = campaign.publish_dates_custom;
  }

  scheduling.dow_iseveryday = campaign.dow_iseveryday;
  if (!campaign.dow_iseveryday) {
    scheduling.dow_custom = campaign.dow_custom;
  }

  scheduling.playtimes_isallday = campaign.playtimes_isallday;
  if (!campaign.playtimes_isallday) {
    scheduling.playtimes_custom = campaign.playtimes_custom;
  }

  await updateScheduling(id, scheduling);

  await updateCampaignBudget(id, campaign.budget);

  campaign.creatives.forEach(async (creative) => {
    await updateCreatives(creative, id);
  });

  return updatedCampaign;
};

/**
 * Delete Campaign
 * @function
 * @name deleteCampaign
 * @param {string} id - Campaign ID
 */
const deleteCampaign = async (id) => {
  await deleteCampaignCategories(id);
  await deleteCampaignSubategories(id);
  await deleteScheduling(id);
  await deleteCampaignBudget(id);
  await deleteCreatives(id);
  await deleteUsersCampaigns(id);
  await deleteScreenRadiuses(id);
  await deleteScreenDrawAreas(id);

  await db("campaigns").del(["*"]).where({
    id: id,
  });
};

module.exports = {
  getCampaignsCount,
  getCampaign,
  createCampaign,
  getCampaignsOfUsers,
  getCampaignStatus,
  getScheduling,
  getFirstImagePath,
  getCampaignCategories,
  getCampaignSubcategories,
  getScreenRadiuses,
  getScreenDrawAreas,
  getCampaignScreenSelection,
  getCampaignBudget,
  getCreatives,
  updateCampaign,
  deleteCampaign,
};
