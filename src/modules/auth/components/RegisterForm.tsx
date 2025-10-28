import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF, FaXTwitter, FaApple } from "react-icons/fa6";
import { UserRoleName } from "../constants/userRoles";
import { useNavigate } from "react-router-dom";
// import RegisterLoginToggleBtn from "../../../components/UI/Toggles/RegisterLoginToggle";

// eslint-disable-next-line react-refresh/only-export-components
export const registerSchema = z
  .object({
    // name: z.string().min(1, "Name is required"),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .regex(/^\d+$/, "Mobile number must be numeric"),
    pass_hash: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    isTermAndPrivarcyEnable: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the Terms and Privacy Policy",
      }),
    }),
    role: z.nativeEnum(UserRoleName),
  })
  .refine((data) => data.pass_hash === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);
  // const [isRegister, setIsRegister] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const Navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      {/* Form */}
      <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value="SELLER" {...register("role")} />

        {/* <div className="flex-1">
          <input
            {...register("name")}
            placeholder="Name"
            className="form-input-style"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div> */}

        <div className="flex-1">
          <input
            {...register("mobile")}
            placeholder="Mobile number"
            className="form-input-style w-full"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            {...register("pass_hash")}
            type={showPasswords ? "text" : "password"}
            placeholder="Password"
            className="form-input-style"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPasswords ? (
              <IoEyeOutline size={18} />
            ) : (
              <IoEyeOffOutline size={18} />
            )}
          </button>
          {errors.pass_hash && (
            <p className="text-red-500 text-sm">{errors.pass_hash.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showPasswords ? "text" : "password"}
            placeholder="Confirm password"
            className="form-input-style"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPasswords ? (
              <IoEyeOutline size={18} />
            ) : (
              <IoEyeOffOutline size={18} />
            )}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            {...register("isTermAndPrivarcyEnable")}
            className="mt-1"
          />
          <span>
            I agree with{" "}
            <a href="#" className="text-blue-600 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.isTermAndPrivarcyEnable && (
          <p className="text-red-500 text-sm">
            {errors.isTermAndPrivarcyEnable.message}
          </p>
        )}

        <button type="submit" className="btn-primary w-full">
          Register
        </button>
      </form>

      {/* FORM */}

      {/* Text Divider */}
      <div className="flex items-center justify-center mt-6 w-full">
        <hr className="border-t border-[#EAECF0] w-2/5" />
        <span className="px-3 text-sm text-[#475467] whitespace-nowrap">
          Or register with
        </span>
        <hr className="border-t border-[#EAECF0] w-2/5" />
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-4 mt-4 w-full">
        <button className="border border-[#D0D5DD] px-12 py-2.5 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer">
          <FaGoogle className="text-[#EA4335] text-xl" />
        </button>
        <button className="border border-[#D0D5DD] px-12 py-2.5 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer">
          <FaFacebookF className="text-[#1877F2] text-xl" />
        </button>
        <button className="border border-[#D0D5DD] px-12 py-2.5 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer">
          <FaXTwitter className="text-xl" />
        </button>
        <button className="border border-[#D0D5DD] px-12 py-2.5 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer">
          <FaApple className="text-xl" />
        </button>
      </div>

      {/* Already have an account */}
      <div>
        <p className="text-center text-sm mt-6 w-full">
          Already have an account?{" "}
          <button
            type="button"
            // onClick={() => setIsRegister(false)}
            onClick={() => Navigate("/login")}
            className="text-[#7F56D9] "
          >
            Login
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
