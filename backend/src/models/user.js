const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
      },
});

UserSchema.pre("save", async function (next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

class User {
    constructor(model) {
        this.model = model;
      }
      async create(data) {
        try {
            console.log("Creating user:", data);
            const user = new this.model(data);
            return await user.save();
            }
        catch (error) {
            console.error("Error creating user:", error);
            throw new Error('Error creating user: ' + error.message);
        }
      }
      async login(username, password) {
        try {
          const user = await this.model.findOne({ username });
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            return user;
        }
        catch (error) {
            console.error("Error logging in:", error);
            throw new Error('Error logging in: ' + error.message);
        }
    }
}

module.exports = new User(mongoose.model("User", UserSchema));
