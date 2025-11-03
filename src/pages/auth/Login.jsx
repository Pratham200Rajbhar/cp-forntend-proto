import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import toast from 'react-hot-toast';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : 
                        user?.role === 'teacher' ? '/teacher/dashboard' : 
                        '/';
    return <Navigate to={redirectPath} replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success('Welcome back!');
        
        // Navigate based on user role
        const redirectPath = result.user.role === 'admin' ? '/admin/dashboard' : 
                            result.user.role === 'teacher' ? '/teacher/dashboard' : 
                            '/';
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
            <CheckSquare className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SmartAttend
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              placeholder="admin@attendance.com"
              icon={Mail}
              error={errors.email?.message}
              fullWidth
              {...register('email')}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              fullWidth
              {...register('password')}
            />

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <Checkbox
                label="Remember me"
                {...register('rememberMe')}
              />
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              className="mt-6"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Demo Credentials
            </p>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <p><span className="font-medium">Admin:</span> admin@attendance.com / admin123</p>
              <p><span className="font-medium">Teacher:</span> teacher@example.com / password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          © 2025 SmartAttend. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
