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

### CLI Application
- To run our `cli.py` file, type `python .\Agentic-AI-Course\01-Setup\Backend\cli.py` in terminal and hit enter.

### Next Frontend (localhost:3000) → POST request → Backend (localhost:8000)

### Setup Backend using FastAPI
1. Copy `main.py` and paste it in your project(prefer same structure to avoid issues). For details, follow video.

To run the FastAPI app:
```bash
export GROQ_API_KEY=your-api-key
uvicorn main:app --reload


To use this API:

1. Start a new session:
   ```bash
   curl -X POST http://localhost:8000/start-session
   ```
   Returns: `{"session_id": "uuid-here"}`

2. Send messages:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"message": "Hello", "session_id": "your-session-id"}' http://localhost:8000/chat
   ```
   Returns: `{"response": "Hi!", "session_id": "your-session-id"}`


```

### Setup Frontend using ReactJS
- Install NodeJS
- Create react app. It will create a default basic structure for you. Next you just have to replace the file App.js
- `npx create-react-app groq-chat-frontend
cd groq-chat-frontend`

2. Install all required dependencies:
```bash
npm install axios react-bootstrap bootstrap @popperjs/core react-syntax-highlighter
```

- Replace the contents of src/App.js and src/App.css with the code below

```jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Badge,
  Stack,
  ListGroup,
  Spinner
} from 'react-bootstrap';

function App() {
  // State declarations
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Start new session
  const startNewSession = async () => {
    try {
      const response = await axios.post('http://localhost:8000/start-session');
      setSessionId(response.data.session_id);
      setChatHistory([]);
      setError('');
    } catch (err) {
      setError('Failed to start new session');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;

    setIsLoading(true);
    setError('');

    try {
      setChatHistory(prev => [...prev, { role: 'user', content: message }]);
      
      const response = await axios.post('http://localhost:8000/chat', {
        message: message,
        session_id: sessionId
      });

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
      
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    startNewSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Format content with syntax highlighting
  const formatContent = (content) => {
    const codeBlocks = content.split(/```(\w+)?/);
    return codeBlocks.map((block, index) => {
      if (index % 2 === 1) {
        const language = codeBlocks[index] || 'javascript';
        return (
          <SyntaxHighlighter 
            key={index}
            language={language}
            style={atomDark}
            className="code-block"
          >
            {codeBlocks[index + 1]}
          </SyntaxHighlighter>
        );
      }
      return <div key={index} className="text-content">{block}</div>;
    });
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">AI Chat Assistant</h1>
      <Card className="shadow-lg">
        <Card.Body className="p-0">
          <div className="chat-messages" style={{ height: '60vh', overflowY: 'auto', padding: '1rem' }}>
            <ListGroup variant="flush">
              {chatHistory.map((msg, index) => (
                <ListGroup.Item 
                  key={index}
                  className={`d-flex flex-column ${msg.role === 'user' ? 'align-items-end' : ''}`}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Card 
                    className={`mb-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}
                    style={{ maxWidth: '80%' }}
                  >
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted small">
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </Card.Subtitle>
                      <div className="message-content">
                        {formatContent(msg.content)}
                      </div>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
              {isLoading && (
                <ListGroup.Item className="d-flex justify-content-center">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          <Form onSubmit={handleSubmit} className="p-3 border-top">
            <Stack direction="horizontal" gap={3}>
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                style={{ minWidth: '100px' }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Stack>
          </Form>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <Badge bg="secondary">Session ID: {sessionId}</Badge>
          <Button 
            variant="outline-primary" 
            onClick={startNewSession}
            size="sm"
          >
            New Session
          </Button>
        </Card.Footer>
      </Card>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default App;
```

1. Make sure you have Bootstrap CSS imported in your src/index.js:
```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
```

2. Start your development server:
```bash
npm start
```