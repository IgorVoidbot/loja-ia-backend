import os

import openai
from django.conf import settings


def generate_product_description(product_name):
    fallback = (
        "Descricao confidencial nao disponivel no momento. "
        "Contate o suporte da Loja IA."
    )

    system_prompt = (
        "Voce e um Copywriter Especialista em E-commerce Tech/Cyberpunk. "
        "Seu tom e futurista, persuasivo e conciso."
    )

    user_prompt = (
        "Crie uma descricao de produto para e-commerce a partir do nome abaixo. "
        "Siga exatamente esta estrutura, sem rotulos como 'Headline:' ou 'CTA:'.\n\n"
        "Estrutura obrigatoria:\n"
        "1) Uma headline de impacto (uma unica linha).\n"
        "2) Um paragrafo curto destacando dor/solucao.\n"
        "3) Uma lista com exatamente 3 bullet points com especificacoes tecnicas ficticias, "
        "mas plausiveis para o produto.\n"
        "4) Um call to action final sutil (uma unica linha).\n\n"
        f"Produto: {product_name}"
    )

    try:
        api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        if not api_key:
            return fallback

        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=400,
            temperature=0.7,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        content = response.choices[0].message.content
        return content.strip() if content else fallback
    except Exception:
        return fallback