import React, { useState } from 'react';
import { Truck, MapPin, Calendar, Clock, Plus } from 'lucide-react';

interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: number;
  driver: string;
  status: 'available' | 'in-transit' | 'maintenance';
}

interface Trip {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  cost: number;
  distance: number;
}

export function Logistics() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'trips'>('vehicles');
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', number: 'MH-12-AB-1234', type: 'Truck', capacity: 10000, driver: 'Ramesh Kumar', status: 'available' },
    { id: '2', number: 'MH-12-CD-5678', type: 'Mini Truck', capacity: 5000, driver: 'Suresh Patel', status: 'in-transit' },
    { id: '3', number: 'MH-12-EF-9012', type: 'Truck', capacity: 15000, driver: 'Mahesh Singh', status: 'available' },
  ]);

  const [trips] = useState<Trip[]>([
    { id: '1', vehicleId: '1', vehicleNumber: 'MH-12-AB-1234', driver: 'Ramesh Kumar', from: 'Mumbai', to: 'Delhi', date: '2025-01-20', status: 'scheduled', cost: 25000, distance: 1400 },
    { id: '2', vehicleId: '2', vehicleNumber: 'MH-12-CD-5678', driver: 'Suresh Patel', from: 'Pune', to: 'Bangalore', date: '2025-01-19', status: 'in-progress', cost: 18000, distance: 850 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-transit': case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Logistics & Transport</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === 'vehicles' ? 'Add Vehicle' : 'Schedule Trip'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'available').length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">
                {vehicles.filter(v => v.status === 'in-transit').length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trips</p>
              <p className="text-2xl font-bold text-orange-600">
                {trips.filter(t => t.status !== 'completed').length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'vehicles', label: 'Vehicles', icon: Truck },
              { key: 'trips', label: 'Trips', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'vehicles' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Vehicle Fleet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{vehicle.number}</h4>
                        <p className="text-sm text-gray-600">{vehicle.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Driver:</span>
                        <span className="font-medium">{vehicle.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{vehicle.capacity} kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Trip Schedule</h3>
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{trip.vehicleNumber}</h4>
                        <p className="text-sm text-gray-600">Driver: {trip.driver}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{trip.from} → {trip.to}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{trip.date}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{trip.distance} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium">৳{trip.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}