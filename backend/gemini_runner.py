import google.generativeai as genai

# Configure with your API key (hardcoded here, but best to use env variables)
genai.configure(api_key="AIzaSyAyG8MVA_R2nFWpyf3YrZgsPv3GKHIgry4")

# Try different models: "gemini-1.5-pro" or "gemini-1.0-pro"
model = genai.GenerativeModel("gemini-2.5-flash")

def run(prompt: str) -> str:
    """Takes a prompt as input and returns Gemini's response text."""
    response = model.generate_content(prompt)
    return response.text