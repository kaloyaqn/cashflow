"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

export function RegisterForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call our server-side registration API route at /api/register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      // Log the raw response text for debugging
      const rawText = await res.text();
      console.log("Raw response text:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error("Could not parse JSON:", err);
        throw new Error("Server returned non-JSON response.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      // If data.user exists, we assume instant sign-in is enabled.
      if (data?.user) {
        console.log("Registration successful, signing in...");
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (!result.error) {
          router.push("/dashboard");
        } else {
          setError("Automatic sign-in failed: " + result.error);
        }
      } else {
        setError("Please check your email to confirm your account before logging in.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Започни да пеститиш</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Попълни нужните данни.
        </p>
      </div>
      <div className="grid gap-6">
        {error && (
          <Alert variant={error.includes("check your email") ? "info" : "destructive"}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-row gap-3">
          <div>
            <Label htmlFor="firstname">Име</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              id="firstname"
              type="text"
              placeholder="Иван"
              className="mt-2"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="lastname">Фамилия</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              id="lastname"
              type="text"
              placeholder="Иванов"
              className="mt-2"
              disabled={loading}
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={loading}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Парола</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Регистрация..." : "Регистрирай се"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Или влезте с
          </span>
        </div>
        <Button type="button" variant="outline" className="w-full" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Влезте с GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Имате профил?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Влез
        </Link>
      </div>
    </form>
  );
}
