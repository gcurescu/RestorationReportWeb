import { render } from '@testing-library/react';
import { Hero } from '../Hero';

// Mock the EmailSignup component
jest.mock('../../forms/EmailSignup', () => ({
  EmailSignup: ({ id }) => <div data-testid={`email-signup-${id}`}>Email Signup Mock</div>
}));

// Mock matchMedia for reduced motion detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Hero', () => {
  it('renders hero content correctly', () => {
    const { container } = render(<Hero />);
    expect(container).toMatchSnapshot();
  });

  it('renders main heading', () => {
    render(<Hero />);
    const heading = document.querySelector('h1');
    expect(heading).toHaveTextContent('Create claim-ready restoration reports in minutes.');
  });

  it('renders subheading', () => {
    render(<Hero />);
    const subheading = document.querySelector('p');
    expect(subheading).toHaveTextContent('Generate Water, Fire, and Mold reports your adjuster can approve on first pass.');
  });

  it('includes email signup form', () => {
    render(<Hero />);
    expect(document.querySelector('[data-testid="email-signup-signup"]')).toBeInTheDocument();
  });

  it('includes product preview image', () => {
    render(<Hero />);
    const image = document.querySelector('img[alt*="restoration report preview"]');
    expect(image).toBeInTheDocument();
  });

  it('respects reduced motion preferences', () => {
    // Mock reduced motion preference
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(), 
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<Hero />);
    
    // When reduced motion is preferred, video should not be rendered
    const video = document.querySelector('video');
    expect(video).toBeNull();
  });
});
