import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header.jsx';

describe('Header', () => {
  it('does not render the help icon', () => {
    render(<Header />);
    // ensure lucide help icon not present by role or by its typical class
    const helpByTitle = screen.queryByTitle(/help/i);
    expect(helpByTitle).toBeNull();
    const helpByClass = document.querySelector('.lucide-circle-help');
    expect(helpByClass).toBeNull();
  });
});


