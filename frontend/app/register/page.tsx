"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/api";

import { useAuthStore } from "../../store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Nao foi possivel criar a conta.");
      }

      const loginResponse = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Conta criada, mas falhou ao entrar.");
      }

      const data = await loginResponse.json();
      login(data.access, { name: trimmedName, email: trimmedEmail });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
        <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8">
          <h1 className="text-3xl font-semibold">Criar conta</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Complete seus dados para continuar.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Nome
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Seu nome"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(236,72,153,0.9)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Ja possui conta?{" "}
            <Link href="/login" className="text-white hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
