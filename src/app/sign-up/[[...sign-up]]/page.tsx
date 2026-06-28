import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-beige/30 flex items-center justify-center">
      <SignUp />
    </div>
  );
}
