import React from 'react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Demonstration Environment</p>
      <p>This is a simulated environment. All operations are mocked and no real data is being changed.</p>
    </div>
  );
};
