// src/modules/user/auth/components/ui/RegisterForm.tsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF, FaXTwitter, FaApple } from "react-icons/fa6";
import { UserRoleName } from "../../constants/userRoles";

// Schema
export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
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
    role: z.nativeEnum(UserRoleName, {
      errorMap: () => ({
        message: "User role is required",
      }),
    }),
  })
  .refine((data) => data.pass_hash === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  onSwitch: () => void;
}

const RegisterForm = ({ onSubmit, onSwitch }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
         {/* 👇 Hidden Default Role */}
         <input type="hidden" value="SELLER" {...register("role")} />
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="form-input-style"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("mobile")}
            placeholder="Mobile number"
            className="form-input-style"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            {...register("pass_hash")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form-input-style pr-10"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
          </button>
          {errors.pass_hash && (
            <p className="text-red-500 text-sm">{errors.pass_hash.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="form-input-style pr-10"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
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

      {/* Social login */}
      <div className="flex items-center justify-center mt-6">
        <hr className="border-t border-gray-200 w-full" />
        <span className="px-3 text-sm text-gray-500">Or register with</span>
        <hr className="border-t border-gray-200 w-full" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaGoogle className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-blue-600">
          <FaFacebookF className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaXTwitter className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaApple className="text-lg" />
        </button>
      </div>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#7F56D9] underline">
          Login
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
