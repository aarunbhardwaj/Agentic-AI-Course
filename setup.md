Hi Everyone!
In the below steps, you'll be able to setup your system for AI Development course. 


### 1. Download VS Code
**Step:** Install the code editor
1. Visit [Visual Studio Code](https://code.visualstudio.com/)
2. Download the appropriate version for your OS (Windows/macOS/Linux)
3. Run the installer and follow default setup options

### 2. Install uv and Python 3.11
**Step:** Install the Python toolchain manager
```bash
# For macOS/Linux (in terminal):
curl -LsSf https://astral.sh/uv/install.sh | sh

# For Windows (in PowerShell):
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Step:** Install Python 3.11
```bash
uv python install 3.12
```

### 3. Create Virtual Environment
**Step:** Create and activate virtual environment
```bash
uv venv ai-env --python 3.11

# Activate environment:
# macOS/Linux:
source .venv/bin/activate

# Windows:
.\.venv\Scripts\activate
```

### 4. Install Libraries
**Step:** Install required packages
```bash
uv pip install -r ./requirements.txt
```

### 5. Git and GitHub Setup(For code versioning )
**Step:** Create account and repository
1. Create account at [github.com](https://github.com/)
2. Click "+" → "New repository"
3. Name it (e.g., "ai-course-project") and initialize with README

**Step:** Connect local project
```bash
git init
git remote add origin https://github.com/<your-username>/<repo-name>.git
git pull origin main
```

- Setup SSH access with Github
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
Now you'll see a path where ssh key files have been created. Most probably in your user account 
``` bash
C:\Users\user_name\.ssh
```
Here you'll find 2 files created 1. id_rsa and 2. id_rsa.pub

Copy content of id_rsa.pub .

- Next you need to open your github account and first click on your `profile name` (upper-corner right hand), and then click on `settings` . 
- Next window will have a list of menu items, select `SSH and GPG Keys` . 
- From new page, click `New SSH Key` and fill the form provided. Paste the content, you copied from your `id_rsa.pub` file. Once you submit, your ssh access has been setup.

### 6. Groq Account Setup
**Step:** Get API key
1. Visit [Groq Cloud](https://console.groq.com/)
2. Create account/login
3. Navigate to "API Keys" → "Create API Key"
4. Copy your new key

### 7. Environment Setup
**Step:** Create .env file
```bash
# In project root:
echo "GROQ_API_KEY=your_api_key_here" > .env
```

**Step:** 
```python
import os
from dotenv import load_dotenv

from groq import Groq
load_dotenv()
 

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
```

***Invoke the AI*** 
``` python
# Set the system prompt
system_prompt = {
    "role": "system",
    "content":
    "You are a helpful assistant. You reply with very short answers."
}

# Initialize the chat history
chat_history = [system_prompt]


# Get user input from the console
user_input = 'How are you'

  # Append the user input to the chat history
chat_history.append({"role": "user", "content": user_input})

response = client.chat.completions.create(model="llama3-70b-8192",
                                            messages=chat_history,
                                            max_tokens=100,
                                            temperature=1.2)
  # Append the response to the chat history
chat_history.append({
      "role": "assistant",
      "content": response.choices[0].message.content
  })
  # Print the response
print("Assistant:", response.choices[0].message.content)
```
### 8. MLflow Setup & Integration (For artefacts monitoring & evaluation)

**Step:** Install MLflow and configure tracking
```bash


# We have already installed mlflow in Step 4

uv pip install mlflow

 
```

**Step:** Configure MLflow Tracking (Choose one option)

**Option 1: Local Tracking (Simplest)**
```bash
# Create directory for MLflow experiments
mlflow server --host 127.0.0.1 --port 5000

```


**Step:** Add MLflow Configuration to .env
```bash
# Add these to your .env file
echo "MLFLOW_TRACKING_URI=http://localhost:5000" >> .env  # For server setup
```

**Step:** Update Notebook (ai-notebook.ipynb)
```python
import mlflow
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Initialize MLflow
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI"))

# Start experiment
with mlflow.start_run():
 
    
    # Log parameters
    mlflow.log_param("query", "how are you")
    mlflow.log_param("response", "response")
     
    
    # Log artifacts
    with open("model_info.txt", "w") as f:
        f.write(f"Model trained on {len(data.data)} samples")
    mlflow.log_artifact("model_info.txt")
```

### Final Project Structure
```
project-root/
├── mlruns/               # MLflow experiments (local)
├── mlartifacts/          # Model artifacts (if using server)
├── mlflow.db            # SQLite database (server setup)
├── ai-env/
├── .env
├── ai-notebook.ipynb
└── .git/
```

**Step:** Add MLflow-related items to .gitignore
```bash
# Add to .gitignore
echo "\n# MLflow" >> .gitignore
echo "mlruns/" >> .gitignore
echo "mlartifacts/" >> .gitignore
echo "mlflow.db" >> .gitignore
```

### Accessing MLflow UI
1. For local tracking:
```bash
mlflow ui --port 5001  # Access at http://localhost:5001
```

2. For server setup (already running on port 5000):
```bash
# Access at http://localhost:5000
```

---
