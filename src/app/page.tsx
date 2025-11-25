import { CustomButton, CustomStack, ThemeToggle } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <CustomStack gap="md" align="center">
        <h1 className="text-2xl font-bold">Notes App</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <CustomButton variant="filled">Sign in</CustomButton>
          </Link>
          <Link href="/register">
            <CustomButton variant="outline">Sign up</CustomButton>
          </Link>
        </div>
      </CustomStack>
    </div>
  );
}
