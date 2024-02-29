const { User } = require("../../db");

const allUsers = async () => {
  try {
    const response = await User.findAll({
      attributes: ['id', 'name', 'surName', 'email', 'rol', "password", "country", "phone","address","banned"] 
    });

    const mappedUsers = response.map((user) => ({
      id: user.id,
      name: user.name,
      surName: user.surName,
      email: user.email,
      rol: user.rol,
      password: user.password,
      country: user.country,
      phone: user.phone,
      address: user.address,
      banned: user.banned


    }));

    return mappedUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; 
  }
};

module.exports = {
  allUsers,
};
