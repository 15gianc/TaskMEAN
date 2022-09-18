import user from "../models/user.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send({ message: "Imcomplete data" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "The user already registered" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const roleId = await role.findOne({ name: "user" });
  if (!role) return res.status(400).send({ message: "No role was assigned" });

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: roleId._id,
    dbstatus: true,
  });

  const result = await userRegister.save();

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: result._id,
          name: result.name,
          roleId: result.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (error) {
    res.status(400).send({ message: "Register Error" });
  }
};

const registerAdminUser = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send({ message: "Imcomplete Data" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "The user is already registered" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: req.body.roleId,
    dbstatus: true,
  });

  const result = await userRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ result });
};

const listUsers = async (req, res) => {
  const userList = await user
    .find({
      $and: [
        { name: new RegExp(req.params["name"], "i") },
        { dbstatus: "true" },
      ],
    })
    .populate("roleId")
    .exec();

  return userList.length === 0
    ? res.status(400).send({ message: "Empty users list" })
    : res.status(200).send({ userList });
};

const listAllUser = async (req, res) => {
  const userList = await user
    .find({
      $and: [{ name: new RegExp(req.params["name"], "i") }],
    })
    .populate("roleId")
    .exec();
  return userList.length === 0
    ? res.status(400).send({ message: "Empty users list" })
    : res.status(200).send({ userList });
};

const findUser = async (req, res) => {
  const userFind = await user
    .findById({ _id: req.params["_id"] })
    .populate("roleId")
    .exec();

  return !userFind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ userFind });
};

const getUserRole = async (req, res) => {
  let userRole = await user
    .findOne({ email: req.params.email })
    .populate("roleId")
    .exec();

  if (userRole.length === 0)
    return res.status(400).send({ message: "No search results" });

  userRole = userRole.roleId.name;
  return res.status(200).send({ userRole });
};

const updateUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send({ message: "Imcomplete data" });

  const searchUser = await user.findById({ _id: req.body._id });
  if (req.body.email !== searchUser.email)
    return res
      .status(400)
      .send({ message: "The email should never be changed" });

  let pass = "";

  if (req.body.password) {
    const passHash = await bcrypt.compare(
      req.body.password,
      searchUser.password
    );
    if (!passHash) {
      pass = await bcrypt.hash(req.body.password, 10);
    } else {
      pass = searchUser.password;
    }
  } else {
    pass = searchUser.password;
  }

  // const existingUser = await user.findOne({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: pass,
  //   roleId: req.body.roleId,
  // });

  // if (!existingUser)
  //   return res.status(400).send({ message: "you didn't make any change" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error editing user" })
    : res.status(200).send({ message: "User updated" });
};

const updateUserNew = async (req, res) => {
  if (!req.body.name)
    return res.status(400).send({ message: "Incomplete data" });

  const searchUser = await user.findById({ _id: req.body._id });
  if (req.body.email !== searchUser.email)
    return res
      .status(400)
      .send({ message: "The email should never be changed" });

  let pass = "";

  if (req.body.password) {
    const passHash = await bcrypt.compare(
      req.body.password,
      searchUser.password
    );
    if (!passHash) {
      pass = await bcrypt.hash(req.body.password, 10);
    } else {
      pass = searchUser.password;
    }
  } else {
    pass = searchUser.password;
  }

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    password: pass,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error editing user" })
    : res.status(200).send({ message: "User updated" });
};


const deleteUser = async (req,res) =>  {
    if (!req.body._id) return res.status(400).send({message: "Incomplete data"});

    const userDelete = await user.findByIdAndDelete(req.body._id, {
        dbStatus: false,
    });

    return !userDelete 
    ? res.status(400).send({message: "User no found"})
    : res.status(200).send({message: "User deleted"})
};

const login = async (req,res) => {
    if (!req.body.email || !req.body.password)
    return res.status(400).send({message: "Imcomplete date"});

    const userLogin = await user.findOne({email: req.body.email});
    if (!userLogin) res.status(400).send({message: "Wrong email or password"});

    const hash = await bcrypt.compare(req.body.password, userLogin.password);
    if (!hash)
    return res.status(400).send({message: "Wrong email or password"});

    try {
        return res.status(200).json({
            token: jwt.sign({
                _id: userLogin._id,
                name: userLogin.name,
                roleId: userLogin.roleId,
                iat: moment().unix(),
            },
                process.env.SK_JWT            
            ),
        });
    } catch (error) {
        return res.status(400).send({message: "Login error"})
    }
};

const findUserNew = async (req, res) => {
  const userfind = await user
    .findById({ _id: req.user._id })
    .populate("roleId")
    .exec();
  return !userfind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ userfind });
};


export default {
  registerUser,
  registerAdminUser,
  listUsers,
  findUser,
  getUserRole,
  updateUser,
  updateUserNew,
  deleteUser,
  login,
  findUserNew,
  listAllUser
};
