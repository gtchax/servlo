import mongoose from "mongoose";
import { PasswordManager } from "../services/password";

interface IUser {
  name: string;
  email: string;
  password: string;
}

// describes the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: IUser): UserDoc;
}

// describes the properties of a User Document
interface UserDoc extends mongoose.Document<UserDoc> {
  name: string;
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },   
  },
  {
    toJSON: {
      transform: function (_, obj) {
        obj.id = obj._id;      
        delete obj.password;
        delete obj._id;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { UserModel, User };
