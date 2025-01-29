import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlightBoard from '../components/FlightBoard';
import { fetchFlights } from '../api';

// Mock the API module
vi.mock('../api', () => ({
  fetchFlights: vi.fn(),
}));

const mockFlights = [
  {
    id: '1',
    flightNumber: 'AA123',
    airline: 'American Airlines',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2024-03-15T10:00:00Z',
    status: 'On Time',
  },
];

describe('FlightBoard', () => {
  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <FlightBoard />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders flight data after loading', async () => {
    (fetchFlights as any).mockResolvedValueOnce(mockFlights);

    render(
      <BrowserRouter>
        <FlightBoard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('AA123')).toBeInTheDocument();
      expect(screen.getByText('American Airlines')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
      expect(screen.getByText('On Time')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    (fetchFlights as any).mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <FlightBoard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/unable to fetch flight data/i)).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });
});