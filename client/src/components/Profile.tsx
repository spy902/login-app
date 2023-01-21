import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidate } from "helper/validate";
import { convertToBase64 } from "helper/convert";
import * as Images from "../assets";

import styles from "styles/Username.module.css";
import extend from "styles/Profile.module.css";

const Profile: FC = () => {
  const [file, setFile] = useState<any>();

  // initial values
  const formik = useFormik<{
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    address: string;
  }>({
    initialValues: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "admin@admin.com",
      address: ""
    },
    validate: profileValidate,
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
          <div className={`${styles.glass} ${extend.glass}`}>
            <div id="title" className="flex flex-col items-center">
              <h4 className="text-5xl font-bold">Profile!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                You can update the details.
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div id="profile_wrapper" className="flex justify-center py-4">
                <label htmlFor="profile">
                  <img
                    src={file || Images.ProfileImg}
                    className={`${styles.profile_img} ${extend.profile_img}`}
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
                <div className="name flex w-3/4 gap-10">
                  <input
                    {...formik.getFieldProps("first_name")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="First Name"
                  />
                  <input
                    {...formik.getFieldProps("last_name")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="Last Name"
                  />
                </div>
                <div className="name flex w-3/4 gap-10">
                  <input
                    {...formik.getFieldProps("mobile")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="Mobile No."
                  />
                  <input
                    {...formik.getFieldProps("email")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="Email*"
                  />
                </div>
                <input
                  {...formik.getFieldProps("address")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Address"
                />
                <button className={styles.btn} type="submit">
                  Update
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Come back later |{" "}
                  <Link className="text-red-500" to="/">
                    Logout
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

export default Profile;
