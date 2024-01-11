const bcrypt = require("bcrypt");
const saltround = 10;
const jwt = require("jsonwebtoken");
const details = require("../mongoDB/mongoDB");

let arry = [];

// register page
const register = async (req, res) => {
  const data = req.body;

  const storeData = {
    name: data.name,
    email: data.email,
    password: data.password,
    dob: data.dob,
  };
  // console.log("line 16", storeData);

  // finding user is alredy register or not

  let findAcc = arry.find((item) => item.email == data.email);
  if (findAcc) {
    return res.send({ msg: "email alredy exist, try new email" });
  }
  // else run this part

  // making password encryption to protect security
  const hashpass = bcrypt.hashSync(data.password, saltround);
  console.log("haspass", hashpass);
  data.password = hashpass;
  // push the encrypted pawword into array in order to save in mongodb server
  arry.push(data);
  const token = jwt.sign({ user: data.email }, process.env.secretkey, {
    expiresIn: "360000",
  });
  console.log("successfull register", data);
  console.log("jwat token", token);

  // add register user data into mongodb server
  await details.insertMany([data]);
  return res.send({ msg: "user successfull register", jwttoken: token });
};

// login page
const login = (req, res) => {
  const logindata = req.body;

  // finding login user deatails in mongo server he/she is register or not
  let findAcc = arry.find((item) => item.email == logindata.email);

  // if not find the send response to enter right details
  if (!findAcc) {
    return res.send({ msg: "enter right email" });
    // console.log("enter right email");

    // otherwise run thtis part and user will login successful with correct details
  } else {
    let validate = bcrypt.compareSync(logindata.password, findAcc.password);
    if (validate) {
      const token = jwt.sign({ user: logindata.email }, process.env.secretkey, {
        expiresIn: "360000",
      });
      return res.send({ msg: "user login successfull", jwttoken: token });
      // console.log("user login successfull");
    } else {
      return res.send({ msg: "enter correct password" });
      // console.log("enter correct password");
    }
  }
};

module.exports = { register, login };
