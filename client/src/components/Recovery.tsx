import { FC } from "react";
import { Toaster } from "react-hot-toast";

import styles from "styles/Username.module.css";

const Recovery: FC = () => {
  return (
    <>
      <div className="container">
        {/* Toaster */}
        <Toaster position="top-center" reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center min-h-screen">
          <div className={styles.glass}>
            <div id="title" className="flex flex-col items-center">
              <h4 className="text-5xl font-bold">Recovery!</h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Enter OTP to recover password.
              </span>
            </div>

            <form className="pt-20">
              <div id="textbox" className="flex flex-col items-center gap-6">
                <div className="input text-center">
                  <div className="mb-4 text-sm text-gray-500">
                    Enter 6 digit OTP sent to your email address.
                  </div>
                  <input
                    className={styles.textbox}
                    type="text"
                    placeholder="OTP"
                  />
                </div>
                <button className={styles.btn} type="submit">
                  Sign In
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Can't get OTP?{" "}
                  <button className="text-red-500">Resend</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recovery;
