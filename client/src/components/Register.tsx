import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "helper/validate";
import { convertToBase64 } from "helper/convert";
import * as Images from "../assets";

import styles from "styles/Username.module.css";

const Register: FC = () => {
  const [file, setFile] = useState<any>();

  // initial values
  const formik = useFormik<{
    email: string;
    username: string;
    password: string;
  }>({
    initialValues: {
      email: "",
      username: "",
      password: ""
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, { profile: file || "" });
      console.log(values);
    }
  });

  /** file upload */
  const onUpload = async (e: any) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <>
      <div className="container">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center min-h-screen">
          <div className={styles.glass}>
            <div id="title" className="flex flex-col items-center">
              <h4 className="text-5xl font-bold">Register!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Happy to join you!
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div id="profile_wrapper" className="flex justify-center py-4">
                <label htmlFor="profile">
                  <img
                    src={file || Images.ProfileImg}
                    className={styles.profile_img}
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                />
              </div>

              <div id="textbox" className="flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("email")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Email*"
                />
                <input
                  {...formik.getFieldProps("username")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Username*"
                />
                <input
                  {...formik.getFieldProps("password")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Password*"
                />
                <button className={styles.btn} type="submit">
                  Register
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Already Registered?{" "}
                  <Link className="text-red-500" to="/">
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
