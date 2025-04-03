import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

const RegisterForm = ({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.email, data.password))}
      className="space-y-4"
    >
      <input
        {...register("email")}
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      {errors.email && (
        <span className="text-red-500">{errors.email.message}</span>
      )}
      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
      />
      {errors.password && (
        <span className="text-red-500">{errors.password.message}</span>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
