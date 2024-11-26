'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { Input } from '@/components/shared/ui/core/input';
import { Alert, AlertDescription } from '@/components/shared/ui/feedback/alert';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shared/ui/core/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(dataResponse.error || 'Something went wrong');
      }

      setSuccess('If an account exists with this email, you will receive a password reset link');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while processing your request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Forgot your password?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <Form onSubmit={handleFormSubmit(handleSubmit)} className="mt-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <FormItem>
          <FormLabel>Email address</FormLabel>
          <FormControl>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <FormMessage variant="destructive">{errors.email.message}</FormMessage>
            )}
          </FormControl>
        </FormItem>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                Sending reset link... <Loader2 className="w-4 h-4 ml-2" />
              </span>
            ) : (
              'Send reset link'
            )}
          </Button>

          <div className="text-center">
            <a
              href="/auth/signin"
              className="text-sm text-blue-600 hover:underline"
            >
              Back to sign in
            </a>
          </div>
        </div>
      </Form>
    </div>
  );
}
