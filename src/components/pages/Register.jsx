import { ImFilePicture } from "react-icons/im";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, signUpNewUser } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Register() {
  const navigate = useNavigate();

  const schema = yup
    .object()
    .shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords dont match")
        .required(),
      photo: yup
        .mixed()
        .test("fileSize", "Profile picture is required", (value) => {
          return value && value[0]?.size < 10000000;
        })
        .test("type", "File must be a valid image or video format", (value) => {
          if (value[0]) {
            if (
              value[0].type == "image/jpeg" ||
              value[0].type == "image/png" ||
              value[0].type == "image/jpg"
            ) {
              return value;
            }
          }
        })
        .default(null)
        .required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = async (data) => {
    try {
      await signUpNewUser(data);
      onAuthStateChanged(auth, (user) => {
        console.log(user);
      });
      navigate("/Mulligan/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form action="" onSubmit={handleSubmit(submitHandler)}>
        <input
          type="text"
          placeholder="name"
          className={errors.name ? "input-error text-input" : "text-input"}
          autoComplete="off"
          {...register("name")}
        />
        {errors.name && errors.name.message}

        <input
          type="text"
          placeholder="email"
          className={errors.email ? "input-error text-input" : "text-input"}
          autoComplete="off"
          {...register("email")}
          />
          {errors.email && errors.email.message}

        <input
          type="password"
          placeholder="password"
          className={errors.password ? "input-error text-input" : "text-input"}
          autoComplete="off"
          {...register("password")}
        />
        {errors.password && errors.password.message}

        <input
          type="password"
          placeholder="Confirm Password"
          className={
            errors.confirmPassword ? "input-error text-input" : "text-input"
          }
          autoComplete="off"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && errors.confirmPassword.message}

        <input
          type="file"
          id="photo"
          style={{ display: "none" }}
          {...register("photo")}
        />
        <label
          htmlFor="photo"
          style={{ cursor: "pointer" }}
          className={errors.photo ? "input-error" : ""}
        >
          <ImFilePicture /> Profile Picture
        </label>
        {errors.photo && errors.photo.message}

        <label htmlFor="Sign-up" className="log-in-btn">
          Sign Up
        </label>
        <input type="submit" id="Sign-up" style={{ display: "none" }} />
        <p>
          Already have an account? <Link to={"/login"}>Login Here</Link>{" "}
        </p>
      </form>
    </div>
  );
}

export default Register;
