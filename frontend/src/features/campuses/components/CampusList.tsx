import React, { useEffect, useState } from 'react';
import { campusApi } from '../api/campusApi';
import type { Campus } from '../types';

export const CampusList: React.FC = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // बैकएंड से कैंपस लोड करने का फ़ंक्शन
  const loadCampuses = async () => {
    try {
      setLoading(true);
      const data = await campusApi.getCampuses();
      setCampuses(data);
      setError(null);
    } catch (err) {
      setError('कैंपस डेटा लोड करने में विफलता हुई। कृपया बैकएंड सर्वर की जांच करें।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampuses();
  }, []);

  // कैंपस डिलीट करने का हैंडलर
  const handleDelete = async (id: number) => {
    if (window.confirm('क्या आप सचमुच इस कैंपस को डिलीट करना चाहते हैं?')) {
      try {
        await campusApi.deleteCampus(id);
        // डिलीट होने के बाद लिस्ट को रिफ्रेश करें
        setCampuses(campuses.filter(campus => campus.id !== id));
      } catch (err) {
        alert('कैंपस डिलीट करने में समस्या आई।');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">डेटा लोड हो रहा है...</div>;
  if (error) return <div className="p-6 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">कैंपस मैनेजमेंट (Campuses)</h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
          onClick={() => alert('नया कैंपस फॉर्म का काम अगले स्टेप में करेंगे!')}
        >
          + नया कैंपस जोड़ें
        </button>
      </div>

      {campuses.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500 shadow-sm">
          अभी तक कोई कैंपस नहीं जोड़ा गया है। शुरू करने के लिए "नया कैंपस जोड़ें" पर क्लिक करें।
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold text-sm">
                <th className="p-4">कोड (Code)</th>
                <th className="p-4">कैंपस का नाम</th>
                <th className="p-4">लोकेशन</th>
                <th className="p-4">स्थिति (Status)</th>
                <th className="p-4 text-right">एक्शन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {campuses.map((campus) => (
                <tr key={campus.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-blue-600 font-bold">{campus.code}</td>
                  <td className="p-4 font-medium text-gray-900">{campus.name}</td>
                  <td className="p-4 text-gray-500">{campus.location || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      campus.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {campus.is_active ? 'एक्टिव' : 'इनएक्टिव'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => alert(`एडिट मोड (ID: ${campus.id}) जल्द आ रहा है!`)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      एडिट
                    </button>
                    <button 
                      onClick={() => handleDelete(campus.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      डिलीट
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};