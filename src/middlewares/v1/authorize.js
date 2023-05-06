const jwt = require("jsonwebtoken");
const tokenGenerator = require("../../utils/jwt");
const redis_client = require("../../database/redis_connect");
const userService = require("../../services/v1/userService");


/**
 * Generates new Access and Refresh Token
 * @function
 * @name handleTokens
 * @param {object} id - User ID
 * @param {object} company_name - User's company name
 */
const createAccessToken = async (id, company_name, role) => {
  try {
    const payload = {
      sub: id,
      name: company_name,
      role: role,
      iat: Date.now(),
    };
  
    const accessToken = tokenGenerator.generateAccessToken(payload);

    return accessToken;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Generates new Access and Refresh Token
 * @function
 * @name handleTokens
 * @param {object} id - User ID
 * @param {object} company_name - User's company name
 */
const handleTokens = async (id, company_name, role) => {
  const payload = {
    sub: id,
    name: company_name,
    role: role,
    iat: Date.now(),
  };

  const accessToken = tokenGenerator.generateAccessToken(payload);
  const refreshToken = tokenGenerator.generateRefreshToken(payload);
  // save refresh token to redis
  try {
    console.log("connected to redis successfully");

    await redis_client.set(
      id.toString(),
      JSON.stringify({ token: refreshToken })
    );
    await redis_client.expire(id.toString(), process.env.REFRESH_TOKEN_MAX_AGE);
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
  }
};

/**
 * Verifies that the Access Token with user's request is valid or not
 * @function
 * @name verifyAccessToken
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
const verifyAccessToken = async (req, res, next) => {
  let accessToken = req.header("Authorization");

  if (!accessToken)
    return res.json({
      status: false,
      message: "Access denied,Inavild user.",
    });

  accessToken = accessToken.split(" ")[1].trim();

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );

    // varify blacklisted access token.
    let bl_data = await redis_client.get("BL_" + decoded.sub.toString());
    bl_data = JSON.parse(bl_data);
    if (bl_data?.token === accessToken) {
      return res.json({ status: false, message: "Session Finished" });
    }

    req.user = {
      id: decoded.sub,
      company_name: decoded.name,
      role: decoded.role,
    };
    req.token = accessToken;

    next();
  } catch (error) {
    return res.json({
      status: false,
      message: "Session Exipred",
    });
  }
};

/**
 * Verifies that the Refresh Token with user's request(httpOnly cookie) is valid or not
 * @function
 * @name verifyRefreshToken
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
const verifyRefreshToken = async (req, res, next) => {
  const { cookies } = req;
  let refreshToken = cookies?.token;

  if (!refreshToken)
    return res.status(401).json({
      status: false,
      message: "Access denied,Token not found.",
    });

  refreshToken = refreshToken.trim();

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    // Check for the refresh token in redis
    let data = await redis_client.get(decoded.sub.toString());
    data = await JSON.parse(data);
    if (!data)
      return res.status(400).json({
        status: false,
        message: "Access denied",
      });

    if (data.token !== refreshToken)
      return res.status(400).json({
        status: false,
        message: "Access denied",
      });
      
    req.user = {
      id: decoded.sub,
      company_name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Access denied",
    });
  }
};

/**
 * Verifies the user is admin or not
 * @function
 * @name verifyAdmin
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const role_id = await userService.getUserRoleFromUserTable(req?.user?.id);
    const role = await userService.getUserRole(role_id);
    if (role !== "admin") {
      return res.status(400).json({
        status: false,
        message: "Access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Access denied",
    });
  }
};

/**
 * Deletes refresh token when users' logs out and blacklists present Access Token
 * @function
 * @name deleteRefreshToken
 * @param {object} id - User ID
 * @param {object} accessToken - Last Access Token of the User
 */
const deleteRefreshToken = async (id, accessToken) => {
  await redis_client.del(id.toString());

  await redis_client.set(
    "BL_" + id.toString(),
    JSON.stringify({ token: accessToken })
  );
  await redis_client.expire(
    "BL_" + id.toString(),
    process.env.ACCESS_TOKEN_MAX_AGE
  );
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
  deleteRefreshToken,
  handleTokens,
  createAccessToken,
  verifyAdmin
};
