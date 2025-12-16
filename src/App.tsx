// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { TaskProvider } from './context/TaskContext';
import { Login } from './components/Login/Login';
import { Layout } from './components/Layout/Layout';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TaskProvider>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/kanban" element={<Layout />} />
          </Routes>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;