const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URL;
console.log(`Database url:${url}`);
mongoose
  .connect(url)
  .then((result) => console.log("Connected to Mongodb"))
  .catch((error) => console.log("Error connection to Mongodb", error.message));

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    require: true,
  },
  number: {
    type: String,
    minLength: 8,
    //phone number must be 123-123(min 3 digit before and after -) formate
    validate: {
      validator: function (phoneNumber) {
        if (!phoneNumber.includes("-")) {
          return false;
        } else if (phoneNumber.includes("-")) {
          let splitDashWord = phoneNumber.split("-");
          if (
            splitDashWord.length > 2 || //10-22-334455 invalid
            splitDashWord[0].length < 2 || //1-22334455 invalid
            splitDashWord[1].length < 1 // 1234556 invalid
          ) {
            return false;
          }
        }
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id;
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
