import os

import openai
from django.conf import settings


def generate_product_description(product_name):
    prompt = (
        "Escreva uma descricao de vendas persuasiva e curta para o produto: "
        f"{product_name}"
    )
    try:
        api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        if not api_key:
            return ""
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return ""
