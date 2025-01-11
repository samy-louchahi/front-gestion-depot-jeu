import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { expect, test } from '@jest/globals';
import '@testing-library/jest-dom/extend-expect';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
});
