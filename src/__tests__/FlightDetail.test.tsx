import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlightDetail from '../components/FlightDetail';
import { fetchFlightDetails } from '../api';

// Mock the API module
vi.mock('../api', () => ({
  fetchFlightDetails: vi.fn(),
}));

const mockFlight = {
  id: '1',
  flightNumber: 'AA123',
  airline: 'American Airlines',
  origin: 'JFK',
  destination: 'LAX',
  departureTime: '2024-03-15T10:00:00Z',
  status: 'On Time',
  gate: 'A1',
};

describe('FlightDetail', () => {
  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlightDetail />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders flight details after loading', async () => {
    (fetchFlightDetails as any).mockResolvedValueOnce(mockFlight);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlightDetail />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Flight AA123')).toBeInTheDocument();
      expect(screen.getByText('American Airlines')).toBeInTheDocument();
      expect(screen.getByText('JFK')).toBeInTheDocument();
      expect(screen.getByText('LAX')).toBeInTheDocument();
      expect(screen.getByText('On Time')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    (fetchFlightDetails as any).mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlightDetail />} />
        </Routes>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/unable to fetch flight details/i)).toBeInTheDocument();
      expect(screen.getByText('Back to Flight Board')).toBeInTheDocument();
    });
  });
});