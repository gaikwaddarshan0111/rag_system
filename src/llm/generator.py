import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


load_dotenv()

hf_token = os.getenv("HF_TOKEN")

client = InferenceClient(
    api_key=hf_token
)

def generate_answer(prompt):

    reponse = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=300
    )

    return reponse.choices[0].message.content