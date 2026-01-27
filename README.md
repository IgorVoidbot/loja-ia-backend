# 🦾 Loja.IA - E-commerce Cyberpunk GenAI-Native

> Plataforma de e-commerce futurista que utiliza Inteligência Artificial Generativa para criar descrições de produtos persuasivas em tempo real, com arquitetura robusta para ambientes efêmeros.

![Status](https://img.shields.io/badge/Status-Em_Produção-00ff00?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)

## 🚀 Sobre o Projeto

A **Loja.IA** não é apenas um e-commerce. É uma prova de conceito de **Engenharia de Prompt** integrada a sistemas transacionais. O sistema resolve o problema de cadastro manual de produtos delegando a criatividade para uma IA configurada com a persona de um "Copywriter Cyberpunk".

### ✨ Diferenciais Técnicos

* **🤖 GenAI-Native:** Integração profunda com **OpenAI (GPT-4o)** via Backend. Ao cadastrar um produto (ex: "Camisa 404"), o sistema gera automaticamente descrições técnicas e criativas, bullet points e argumentos de venda.
* **☁️ Arquitetura Híbrida de Storage:**
    * **Cloudinary:** Para persistência de mídia (imagens) em nuvem, contornando o *Ephemeral File System* do Render.
    * **WhiteNoise:** Para servir arquivos estáticos (CSS/JS) de alta performance.
* **⚡ Frontend Otimizado:** Construído com **Next.js App Router** e **Server Components** para SEO máximo e carregamento instantâneo.
* **🛡️ Segurança:** Gerenciamento rigoroso de variáveis de ambiente (`python-decouple`) e configuração de CORS dinâmica para proteção da API.

## 🛠️ Tech Stack

### Backend
- **Framework:** Django Rest Framework (DRF)
- **Database:** PostgreSQL (Production) / SQLite (Dev)
- **AI Integration:** OpenAI API (Custom System Prompts)
- **Media Storage:** Cloudinary
- **Deploy:** Render

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Cyberpunk Aesthetic)
- **Hosting:** Vercel

## 🧠 Exemplo de Engenharia de Prompt

O backend utiliza um *System Role* específico para manter a consistência da marca:

```python
{
    "role": "system",
    "content": "Você é um Copywriter Especialista em E-commerce Cyberpunk. Seu tom é futurista, persuasivo e conciso."
}
