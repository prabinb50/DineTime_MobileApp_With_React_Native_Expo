import * as Yup from "yup";

// validation schema for forms
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-zA-Z]/, "Password can only contain letters")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character")
        .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .matches(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .required("Password is required"),
});

export default validationSchema;