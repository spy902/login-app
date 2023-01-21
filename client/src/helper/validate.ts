import toast from "react-hot-toast";

/** Validateb login page username */
export async function passwordValidate(values: { password: string }) {
  const errors = passwordVerify({}, values);
  return errors;
}

/** Validateb login page username */
export async function usernameValidate(values: { username: string }) {
  const errors = usernameVerify({}, values);
  return errors;
}

/** Validate reset password */
export async function resetPasswordValidation(values: {
  password: string;
  confirm_password: string;
}) {
  const errors = passwordVerify({}, { password: values.password });
  if (values.password !== values.confirm_password) {
    errors.exist = toast.error("Password does not match.");
  }
  return errors;
}

/** Validate register form */
export async function registerValidate(values: {
  email: string;
  username: string;
  password: string;
}) {
  const errors = usernameVerify({}, { username: values.username });
  passwordVerify(errors, { password: values.password });
  emailVerify(errors, { email: values.email });
  return errors;
}

/** Validate profile page */
export async function profileValidate(values: {
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address: string;
}) {
  const errors = emailVerify({}, { email: values.email });
  return errors;
}

/** Validate password */
function passwordVerify(error: any = {}, values: { password: string }) {
  const specialChars = /[`~!@#$%^&*()-_+{}[\]\\|,.//?;':"]/g;
  if (!values.password) {
    error.password = toast.error("Password required...");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong password");
  } else if (values.password.length < 4) {
    error.password = toast.error(
      "Password must be more than or equal to 4 characters long"
    );
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character");
  }
  return error;
}

/** Validate username */
function usernameVerify(error: any = {}, values: { username: string }) {
  if (!values.username) {
    error.username = toast.error("Username required...");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid username");
  }
  return error;
}

/** Validate email */
function emailVerify(error: any = {}, values: { email: string }) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&/'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
  if (!values.email) {
    error.email = toast.error("Email required...");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Invalid email");
  } else if (!emailRegex.test(values.email)) {
    error.email = toast.error("Invalid email address.");
  }
  return error;
}
