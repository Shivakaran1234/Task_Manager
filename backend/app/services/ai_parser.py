import requests
from app.config import GROQ_API_KEY
from typing import Any
import json
import os

# Check if we're in debug mode (GROQ_API_KEY missing)
DEBUG_MODE = not GROQ_API_KEY or os.getenv("DEBUG_MODE") == "true"

def parse_brain_dump(text: str):
    prompt = f"""
Convert this text into task JSON array:
{text}

Format:
[
 {{
  "title":"",
  "category":"Work|Personal|Urgent",
  "priority":"High|Medium|Low",
  "estimated_minutes":0,
  "due_date":"YYYY-MM-DD or null"
 }}
]
"""

    # Debug mode: return mock response if API key is missing
    if DEBUG_MODE:
        # Parse the text to extract potential tasks as a fallback
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        mock_tasks = [
            {
                "title": line[:50] if len(line) <= 50 else line[:47] + "...",
                "category": "Work",
                "priority": "Medium",
                "estimated_minutes": 30,
                "due_date": None
            }
            for line in lines[:3]  # Limit to 3 tasks
        ]
        return json.dumps(mock_tasks)

    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model":"llama-3.3-70b-versatile",
            "messages":[{"role":"user","content":prompt}],
            "temperature":0.2
        }
    )
    # Check for HTTP errors
    try:
        res.raise_for_status()
    except Exception as e:
        raise RuntimeError(f"AI provider error: {e} - response: {res.text}")

    data: Any = res.json()
    try:
        content = data["choices"][0]["message"]["content"]
        if not content or not content.strip():
            raise RuntimeError(f"AI returned empty content. Full response: {data}")
        
        # Extract JSON array from the response (which may contain surrounding text)
        # Find the first '[' and match the closing ']' properly
        start_idx = content.find('[')
        if start_idx == -1:
            raise RuntimeError(f"No JSON array found in AI response: {content}")
        
        # Find the matching closing bracket by counting brackets
        bracket_count = 0
        end_idx = -1
        for i in range(start_idx, len(content)):
            if content[i] == '[':
                bracket_count += 1
            elif content[i] == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end_idx = i
                    break
        
        if end_idx == -1:
            raise RuntimeError(f"No matching closing bracket found in AI response")
        
        json_str = content[start_idx:end_idx + 1]
        
        # Validate by parsing
        try:
            json.loads(json_str)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Extracted JSON is invalid: {e} - extracted: {json_str}")
        
        return json_str
    except KeyError as e:
        raise RuntimeError(f"Unexpected AI response format: missing key {e} - data: {data}")
