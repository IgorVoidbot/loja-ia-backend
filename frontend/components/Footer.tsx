"use client";

import { Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Sobre a Loja
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            Curadoria premium, entregas rapidas e produtos selecionados para
            elevar seu estilo com confianca.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Ajuda
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>
              <a href="#" className="transition hover:text-white">
                Central de suporte
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Trocas e devolucoes
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Rastreamento
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Legal
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>
              <a href="#" className="transition hover:text-white">
                Politica de privacidade
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Termos de uso
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Cookies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Redes Sociais
          </h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <a
              href="#"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
