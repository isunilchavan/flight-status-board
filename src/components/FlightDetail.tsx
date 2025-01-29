import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Flight } from '../types';
import { fetchFlightDetails } from '../api';

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlightDetails = async () => {
    try {
      if (!id) return;
      const data = await fetchFlightDetails(id);
      setFlight(data);
      setError(null);
    } catch (err) {
      setError('Unable to fetch flight details. Please try again later.');
      toast.error('Error loading flight details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlightDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error || 'Flight not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Back to Flight Board
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Flight Board
          </button>
          <button
            onClick={loadFlightDetails}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <Plane className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Flight {flight.flightNumber}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Airline</h2>
              <p className="mt-1 text-lg text-gray-900">{flight.airline}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Origin</h2>
              <p className="mt-1 text-lg text-gray-900">{flight.origin}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Destination</h2>
              <p className="mt-1 text-lg text-gray-900">{flight.destination}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Departure Time</h2>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(flight.departureTime).toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <p className="mt-1 text-lg text-gray-900">{flight.status}</p>
            </div>
            {flight.gate && (
              <div>
                <h2 className="text-sm font-medium text-gray-500">Gate</h2>
                <p className="mt-1 text-lg text-gray-900">{flight.gate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;