import google.generativeai as genai

genai.configure(api_key="AIzaSyAyG8MVA_R2nFWpyf3YrZgsPv3GKHIgry4")

model = genai.GenerativeModel("gemini-2.5-flash")

def run(prompt: str) -> str:
    """Takes a prompt as input and returns Gemini's response text."""
    response = model.generate_content(prompt)
    return response.text
