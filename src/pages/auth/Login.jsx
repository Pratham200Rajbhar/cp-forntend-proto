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
        toast.success('Login successful!');
        
        // Navigate based on user role
        const redirectPath = result.user.role === 'admin' ? '/admin/dashboard' : 
                            result.user.role === 'teacher' ? '/teacher/dashboard' : 
                            '/';
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-sky-600 rounded-2xl mb-4">
            <CheckSquare className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Smart Attendance System
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <Input
              label="Email Address"
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
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                {...register('rememberMe')}
              />
              <a
                href="#"
                className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
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
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Admin:</strong> admin@attendance.com / admin123</p>
              <p><strong>Teacher:</strong> teacher@example.com / password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 Smart Attendance System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

