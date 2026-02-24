import os
from google import genai
from dotenv import load_dotenv

load_dotenv()  # Loads GOOGLE_API_KEY from your .env file

# The client automatically looks for the GEMINI_API_KEY environment variable
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def translate_text(text, target_language="French"):
    # Using gemini-2.0-flash for speed and cost-efficiency
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Translate the following text to {target_language}: {text}"
    )
    return response.text

if __name__ == "__main__":
    user_input = input("Enter text to translate: ")
    if user_input.strip():
        print(f"Result: {translate_text(user_input)}")
    else:
        print("Please enter some text!")