import React, { useEffect, useRef } from 'react';

const LiveLog = ({ logs }) => {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-96">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 font-mono text-sm text-gray-400">
        Terminal / Logs
      </div>
      <div className="p-4 overflow-y-auto font-mono text-sm h-full space-y-1">
        {logs.length === 0 && <span className="text-gray-600">Waiting for logs...</span>}
        {logs.map((log, index) => (
          <div key={index} className="text-green-400">
            <span className="text-gray-500 mr-2">[{log.time}]</span>
            {log.message}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default LiveLog;
