const { StatusCodes } = require("http-status-codes");
const { generateJwt } = require("../../utils");
const { generateAPIError } = require("../../errors/apiError");
const User = require("../../models/User");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw generateAPIError("Email already exist", StatusCodes.BAD_REQUEST);
  }

  const user = await User.create({ name, email, password });

  const tokenUser = { name: user.name, userId: user._id, email: email };

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Register successfully",
    data: { user: tokenUser },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email)
    throw generateAPIError("Please provide Email", StatusCodes.BAD_REQUEST);

  if (!password)
    throw generateAPIError("Please provide Password", StatusCodes.BAD_REQUEST);

  const user = await User.findOne({ email });
  if (!user)
    throw generateAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);

  isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    throw generateAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);

  const tokenUser = { name: user.name, userId: user._id, email: email };
  const token = generateJwt(tokenUser, process.env.JWT_LIFETIME);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Login successfully",
    data: { user: tokenUser, token: token },
  });
};

module.exports = { register, login };
