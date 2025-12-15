// src/App.tsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/Layout/Layout';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TaskProvider>
        <GlobalStyles />
        <Layout />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;