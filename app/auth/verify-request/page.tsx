export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A sign in link has been sent to your email address.
          </p>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            If you don't see it, check your spam folder. If you still don't see it,{' '}
            <a href="/auth/signin" className="font-medium text-primary hover:text-primary/80">
              try again
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
