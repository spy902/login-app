import { FC } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "helper/validate";
import * as Images from "../assets";

import styles from "styles/Username.module.css";

const Password: FC = () => {
  // initial values
  const formik = useFormik<{
    password: string;
  }>({
    initialValues: {
      password: ""
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  return (
    <>
      <div className="container">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center min-h-screen">
          <div className={styles.glass}>
            <div id="title" className="flex flex-col items-center">
              <h4 className="text-5xl font-bold">Hello Again!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Explore more by connecting with us.
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div id="profile" className="flex justify-center py-4">
                <img
                  src={Images.ProfileImg}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </div>

              <div id="textbox" className="flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("password")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Password"
                />
                <button className={styles.btn} type="submit">
                  Sign In
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Forgot Password?{" "}
                  <Link className="text-red-500" to="/recovery">
                    Recover Now
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

export default Password;
