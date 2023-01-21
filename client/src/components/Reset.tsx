import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "helper/validate";

import styles from "styles/Username.module.css";

const Reset: FC = () => {
  // initial values
  const formik = useFormik<{
    password: string;
    confirm_password: string;
  }>({
    initialValues: {
      password: "",
      confirm_password: ""
    },
    validate: resetPasswordValidation,
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
              <h4 className="text-5xl font-bold">Reset!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Enter new password.
              </span>
            </div>

            <form className="py-20" onSubmit={formik.handleSubmit}>
              <div id="textbox" className="flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("password")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Password"
                />
                <input
                  {...formik.getFieldProps("confirm_password")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Confirm Password"
                />
                <button className={styles.btn} type="submit">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reset;
