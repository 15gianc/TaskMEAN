import role from "../models/role.js";

const user = async (req, res, next) => {
  const userRole = await role.findById(req.user.roleId);
  if (!userRole) return res.status(400).send({ message: "Role no found" });

  return userRole.name === "user"
    ? next()
    : res.status(400).send({ message: "Unauthorized user" });
};


export default user;