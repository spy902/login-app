import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

import ENV from "../config.js";

/** Middleware for verifying user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    //Check if user exist
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user." });
    next();
  } catch (error) {
    res.status(404).send({ error: "Authentication error." });
  }
}

/** POST: http://localhost:8000/api/register
 * @param : { 
   "username": "admin",
   "password": "admin123",
   "email": "admin@admin.com",
   "first_name": "Admin",
   "last_name": "Admin",
   "mobile": "1234567890",
   "assress": "St. Street Admin Road", 
   "profile": ""
   }
 */

export const register = async (req, res) => {
  try {
    const { username, password, email, profile } = req.body;
    //Check existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Please use unique username" });

        resolve();
      });
    });

    //Check existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Please use unique email" });

        resolve();
      });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                email,
                profile: profile || ""
              });

              // return result as response
              user
                .save()
                .then((result) =>
                  res
                    .status(201)
                    .send({ message: "User register successfully" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password"
              });
            });
        }
      })
      .catch(() => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

/** POST: http://localhost:8000/api/login
 * @param : { 
   "username": "admin",
   "password": "admin123",
   }
 */

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have password." });

            //Create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login successful...!",
              username: user.username,
              token
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match." });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

/** GET: http://localhost:8000/api/user/admin */

export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid username" });
    UserModel.findOne({ username }, (err, user) => {
      if (err) return res.status(500).send({ err });
      if (!user)
        return res.status(501).send({ error: "Couldn't find the user." });

      /**Remove password
       * Mongoose return unnessary data with object to convert into json
       */
      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    res.status(404).send({ error: "Cannot find user data." });
  }
};

/** PUT: http://localhost:8000/api/updateUser
    * @param: {
        "id": "<userid>"
    }
    body : {
    "first_name": "Admin",
    "last_name": "Admin",
    "mobile": "1234567890",
    "assress": "St. Street Admin Road", 
    "profile": ""
    }
 */

export const updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      //Update the data
      UserModel.updateOne(
        {
          _id: userId
        },
        body,
        (err, data) => {
          if (err) throw err;
          return res.status(201).send({ msg: "User updated." });
        }
      );
    } else {
      return res.status(401).send({ error: "User not found." });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

/** GET: http://localhost:8000/api/generateOTP */

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

/** GET: http://localhost:8000/api/verifyOTP */

export const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset OTP value
    req.app.locals.resetSession = true; //start session for reset password
    return res.status(201).send({ msg: "Verify successfullly." });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

/** GET: http://localhost:8000/api/createResetSession */
/**Successfully redirect user when OTP is valid */
export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // allow access to this route only once
    return res.status(201).send({ msg: "Access granted" });
  }
  return res.status(440).send({ error: "Session expired." });
};

/** PUT: http://localhost:8000/api/resetPassword */
/** Update password when we have valid session */
export const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired" });

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                (err, data) => {
                  if (err) throw err;
                  req.app.locals.resetSession = false; //reset session
                  return res.status(201).send({ msg: "Record updated." });
                }
              );
            })
            .catch((e) => {
              return res.status(500).send({
                error: "Unable to hashed password."
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not found." });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};
