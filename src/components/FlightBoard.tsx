import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Flight } from '../types';
import { fetchFlights } from '../api';

const REFRESH_INTERVAL = 30000; // 30 seconds

const FlightBoard = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadFlights = async () => {
    try {
      const data = await fetchFlights();
      setFlights(data);
      setError(null);
    } catch (err) {
      setError('Unable to fetch flight data. Please try again later.');
      toast.error('Error loading flights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
    const interval = setInterval(loadFlights, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-600 bg-green-100';
      case 'delayed':
        return 'text-red-600 bg-red-100';
      case 'boarding':
        return 'text-blue-600 bg-blue-100';
      case 'departed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadFlights}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <Plane className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Live Flight Status</h2>
        </div>
        <button
          onClick={loadFlights}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Airline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map((flight) => (
              <tr
                key={flight.id}
                onClick={() => navigate(`/flight/${flight.id}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {flight.flightNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.airline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flight.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(flight.departureTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(flight.status)}`}>
                    {flight.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightBoard;