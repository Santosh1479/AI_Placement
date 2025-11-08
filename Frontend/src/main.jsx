import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PageWrapper from './components/PageWrapper';
import Card from './components/Card';
import Button from './components/Button';

const YourPage = () => {
  return (
    <PageWrapper>
      <Card className="m-4">
        <h1>Your Content</h1>
        <Button onClick={() => console.log('clicked')}>
          Click Me
        </Button>
      </Card>
    </PageWrapper>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
