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