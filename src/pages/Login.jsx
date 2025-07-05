import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2,
  Mail,
  Lock,
  Trash2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

function Login() {
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (loginError) {
      toast({
        title: "Login Gagal",
        description: loginError,
        variant: "destructive",
      });
    }
  }, [loginError, toast]);

  const onSubmit = (values) => {
    login(values);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-white shadow-xl">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
              <Trash2 className="h-8 w-8" />
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="absolute h-2 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 top-0 left-0 right-0"></div>

          <CardHeader className="pt-6 pb-4 text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              TrashValue Admin
            </CardTitle>
            <CardDescription className="text-gray-500">
              Masuk ke dashboard admin untuk mengelola sistem
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 py-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative flex items-center mt-1.5">
                  <div className="absolute left-3 flex h-10 w-5 items-center justify-center text-gray-400">
                    <Mail className="h-[18px] w-[18px]" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gmail.com"
                    className={`pl-10 h-11 rounded-lg bg-gray-50 border-gray-200 focus-visible:ring-green-500 ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    {...register("email")}
                    disabled={isLoggingIn}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <div className="absolute right-3 flex h-10 w-5 items-center justify-center text-red-500">
                      <AlertCircle className="h-[18px] w-[18px]" />
                    </div>
                  )}
                </div>
                <div className="min-h-[20px] mt-1">
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative flex items-center mt-1.5">
                  <div className="absolute left-3 flex h-10 w-5 items-center justify-center text-gray-400">
                    <Lock className="h-[18px] w-[18px]" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 h-11 rounded-lg bg-gray-50 border-gray-200 focus-visible:ring-green-500 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    {...register("password")}
                    disabled={isLoggingIn}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <div className="absolute right-3 flex h-10 w-5 items-center justify-center text-red-500">
                      <AlertCircle className="h-[18px] w-[18px]" />
                    </div>
                  )}
                </div>
                <div className="min-h-[20px] mt-1">
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md mt-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Masuk</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pb-6 pt-1 px-6 sm:px-8">
            <div className="w-full h-px bg-gray-100"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Dengan masuk, Anda menyetujui{" "}
                <a
                  href="#"
                  className="text-green-600 hover:underline font-medium"
                >
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a
                  href="#"
                  className="text-green-600 hover:underline font-medium"
                >
                  Kebijakan Privasi
                </a>{" "}
                kami.
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/90">
            &copy; {new Date().getFullYear()} TrashValue Admin Panel. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
