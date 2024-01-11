const mongoose = require("mongoose");
// connecting mongoose
// mongoose
//   .connect("mongodb://127.0.0.1/assignment2")
//   .then(() => {
//     console.log("db connected");
//   })
//   .catch(() => {
//     console.log("db failed");
//   });

// making schema
const newSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    dob: String,
  },
  {
    timestamps: true,
  }
);

const details = mongoose.model("details", newSchema);
module.exports = details;
