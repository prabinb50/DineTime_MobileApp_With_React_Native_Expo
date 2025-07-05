import * as Yup from "yup";

const guestFormSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Name is required"),

    phoneNumber: Yup.string()
        .required("Phone number is required").matches(/^[0-9]+$/, "Phone number must be digits")
        .min(10, "Phone number must be at least 10 digits"),
});

export default guestFormSchema;