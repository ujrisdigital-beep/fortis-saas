'use client';

interface StatusStep {
  key: string;
  label: string;
  icon: string;
  description: string;
}

interface CaseTrackerProps {
  currentStatus: string;
  updatedAt: string;
}

const statusSteps: StatusStep[] = [
  { key: 'RECEIVED', label: 'Received', icon: '📮', description: 'Complaint received and pending review' },
  { key: 'INVESTIGATING', label: 'Under Investigation', icon: '🔍', description: 'Case is being investigated' },
  { key: 'MDA_RESPONDED', label: 'MDA Responded', icon: '📨', description: 'Ministry has responded' },
  { key: 'RESOLVED', label: 'Resolved', icon: '✅', description: 'Case has been resolved' },
  { key: 'CLOSED', label: 'Closed', icon: '📁', description: 'Case closed' },
];

export default function CaseTracker({ currentStatus, updatedAt }: CaseTrackerProps) {
  const currentStepIndex = statusSteps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold text-lg mb-6">Case Progress</h3>

      <div className="space-y-1">
        {statusSteps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div key={step.key} className="flex items-start">
              {/* Timeline connector */}
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`w-0.5 flex-grow ${idx < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}`}
                    style={{ minHeight: '40px' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-6 ${isPending ? 'opacity-50' : ''}`}>
                <h4
                  className={`font-medium ${
                    isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                {isActive && (
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated: {new Date(updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
