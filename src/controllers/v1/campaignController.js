const { validationResult } = require("express-validator");
const _ = require("lodash");
const { getFileUrl } = require("../../database/aws_s3");
const campaignService = require("../../services/v1/campaignService");
const userService = require("../../services/v1/userService");

const CAMPAIGNS_PER_PAGE = 6;
const SCREEN_SELECTION_BY_RADIUS = 1;
const SCREEN_SELECTION_BY_AREA = 2;

/**
 * Get All Campaigns
 * @function
 * @name getAllCampaigns
 * @param {object} req
 * @param {object} res
 */
const getAllCampaigns = async (req, res) => {
  try {
    console.log("All Campaigns");

    const role_id = await userService.getUserRoleId(req?.user?.role);

    let count = 0;
    
    const ids = [];
    if(role_id === 1){
      const group_id = await userService.getGroupId(req.user.id);
      const allUsersIds = await userService.getAllUsersOfGroup(group_id);
      for(let i = 0; i < allUsersIds.length; i++){
        const isVerified = await userService.getUserIsVerified(allUsersIds[i]);
        
        if(!isVerified){
          allUsersIds.splice(i,1);
          i--;
        }
      }
      
      ids.push(...allUsersIds);
      count = await campaignService.getCampaignsCount(ids);
    }else if(role_id === 2){
      ids.push(req.user.id);
      count = await campaignService.getCampaignsCount(ids);
    }

    let offset = 0;
    let limit = CAMPAIGNS_PER_PAGE;
    if (count > CAMPAIGNS_PER_PAGE) {
      const page = req.query?.page ?? 0;
      offset = count - (page * CAMPAIGNS_PER_PAGE) - CAMPAIGNS_PER_PAGE;
      if(offset < 0){
        limit = CAMPAIGNS_PER_PAGE + offset;
        offset = 0;
      }
    }
    const campaign_ids = await campaignService.getCampaignsOfUsers(
      ids,
      limit,
      offset
    );

    const campaigns = [];
    for (let i = campaign_ids.length - 1; i >= 0; i--) {
      const campaign = { id: campaign_ids[i].campaign_id };
      const campaign_data = await campaignService.getCampaign(
        campaign_ids[i].campaign_id
      );
      campaign.name = campaign_data.name;
      campaign.status = await campaignService.getCampaignStatus(
        campaign_data.status_id
      );
      const imagePath = await campaignService.getFirstImagePath(
        campaign_ids[i].campaign_id
      );
      if (imagePath) {
        campaign.imageUrl = await getFileUrl(imagePath);
      }
      campaign.scheduling = await campaignService.getScheduling(
        campaign_ids[i].campaign_id
      );
      campaigns.push(campaign);
    }

    return res.status(200).json({
      status: true,
      message: "All Campaigns",
      data: {
        numberOfCampaigns: count ?? 0,
        campaigns: campaigns ?? [],
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Error fetching campaigns",
    });
  }
};

/**
 * Get Campaign Data using Campaign ID
 * @function
 * @name getCampaignData
 * @param {string} id - Campaign ID
 */
const getCampaignData = async (id) => {
  const campaign_data = await campaignService.getCampaign(id);
  const campaign = {};
  campaign.name = campaign_data.name;
  campaign.status_id = campaign_data.status_id;
  campaign.status = await campaignService.getCampaignStatus(
    campaign_data.status_id
  );
  campaign.categories = await campaignService.getCampaignCategories(id);
  campaign.subcategories = await campaignService.getCampaignSubcategories(id);

  campaign.screen_selection_id = campaign_data.screen_selection_id;
  if (campaign_data.screen_selection_id === SCREEN_SELECTION_BY_RADIUS) {
    campaign.addresses = await campaignService.getScreenRadiuses(id);
  } else if (campaign_data.screen_selection_id === SCREEN_SELECTION_BY_AREA) {
    campaign.drawAreas = await campaignService.getScreenDrawAreas(id);
  }

  const scheduling = await campaignService.getScheduling(id);
  campaign.publish_dates_isforever = scheduling.publish_dates_isforever;
  if (!campaign.publish_dates_isforever) {
    campaign.publish_dates_custom = scheduling.publish_dates_custom;
  }
  campaign.dow_iseveryday = scheduling.dow_iseveryday;
  if (!campaign.dow_iseveryday) {
    campaign.dow_custom = scheduling.dow_custom;
  }
  campaign.playtimes_isallday = scheduling.playtimes_isallday;
  if (!campaign.playtimes_isallday) {
    campaign.playtimes_custom = scheduling.playtimes_custom;
  }

  campaign.budget = await campaignService.getCampaignBudget(id);

  const creatives_data = await campaignService.getCreatives(id);
  const creatives = [];
  const creatives_info = [];
  for (let i = 0; i < creatives_data.length; i++) {
    creatives.push(creatives_data[i].id);
    const info = {};
    info.size = creatives_data[i].size;
    if (creatives_data[i].mimetype.includes("image")) {
      info.type = "image";
    } else {
      info.type = "video";
    }
    info.name =
      creatives_data[i].file.substring("campaigns/".length) +
      creatives_data[i].extension;
    creatives_info.push(info);
  }

  campaign.creatives = creatives;
  campaign.creatives_info = creatives_info;

  return campaign;
};

/**
 * Get Campaign with Campaign ID
 * @function
 * @name getCampaign
 * @param {object} req
 * @param {object} res
 */
const getCampaign = async (req, res) => {
  try {
    console.log("Get Campaign");
    const id = req.params.id;
    const campaign = await getCampaignData(id);

    return res.status(200).json({
      status: true,
      message: "Campaign",
      data: {
        campaign: campaign,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Error fetching campaign",
    });
  }
};

/**
 * Create New Campaign
 * @function
 * @name createCampaign
 * @param {object} req
 * @param {object} res
 */
const createCampaign = async (req, res) => {
  try {
    console.log("Save New Campaign");

    const campaign = _.pick(req.body, [
      "name",
      "categories",
      "subcategories",
      "screen_selection_id",
      "radius",
      "draw",
      "publish_dates_isforever",
      "publish_dates_custom",
      "dow_iseveryday",
      "dow_custom",
      "playtimes_isallday",
      "playtimes_custom",
      "creatives",
      "budget",
      "status",
    ]);
    campaign.uid = req.user.id;

    const newCampaign = await campaignService.createCampaign(campaign);

    return res.status(200).json({
      status: true,
      message: "New campaign created successfully",
      data: {
        id: newCampaign.id,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Campaign creation unsuccessful",
    });
  }
};

/**
 * Update Campaign
 * @function
 * @name updateCampaign
 * @param {object} req
 * @param {object} res
 */
const updateCampaign = async (req, res) => {
  try {
    console.log("Update Campaign");

    const id = req.params.id;
    const campaign = _.pick(req.body, [
      "name",
      "categories",
      "subcategories",
      "screen_selection_id",
      "radius",
      "draw",
      "publish_dates_isforever",
      "publish_dates_custom",
      "dow_iseveryday",
      "dow_custom",
      "playtimes_isallday",
      "playtimes_custom",
      "creatives",
      "budget",
      "status",
    ]);

    await campaignService.updateCampaign(campaign, id);
    const updatedCampaign = await getCampaignData(id);

    return res.status(200).json({
      status: true,
      message: "Campaign updated successfully",
      data: {
        campaign: updatedCampaign,
      },
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Campaign update unsuccessful",
    });
  }
};

/**
 * Delete Campaign
 * @function
 * @name updateCampaign
 * @param {object} req
 * @param {object} res
 */
const deleteCampaign = async (req, res) => {
  try {
    console.log("Delete Campaign");

    const id = req.params.id;
    await campaignService.deleteCampaign(id);

    return res.status(200).json({
      status: true,
      message: "Campaign deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: false,
      message: "Campaign deletion unsuccessful",
    });
  }
};

module.exports = {
  getAllCampaigns,
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};
