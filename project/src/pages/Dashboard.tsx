import { useEffect, useState } from 'react';
import { supabase, Student } from '../lib/supabase';
import { Users, UserCheck, Clock } from 'lucide-react';

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolled: 0,
    pending: 0,
    total: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('NewStudent')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrolledStudents = data?.filter(s => s.enrollment_status === 'Enrolled') || [];
      setStudents(enrolledStudents);

      const pendingCount = data?.filter(s => s.enrollment_status === 'Pending').length || 0;
      const enrolledCount = enrolledStudents.length;

      setStats({
        enrolled: enrolledCount,
        pending: pendingCount,
        total: data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-700">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-6 shadow-md border border-amber-200">
          <p className="text-amber-700 text-xs font-semibold uppercase mb-1">STEM STUDENTS</p>
          <p className="text-5xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-6 shadow-md border border-amber-200">
          <p className="text-amber-700 text-xs font-semibold uppercase mb-1">ABM STUDENTS</p>
          <p className="text-5xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-6 shadow-md border border-amber-200">
          <p className="text-amber-700 text-xs font-semibold uppercase mb-1">TVL-ICT STUDENTS</p>
          <p className="text-5xl font-bold text-gray-800">0</p>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-6 shadow-md border border-amber-200">
          <p className="text-amber-700 text-xs font-semibold uppercase mb-1">HUMSS STUDENTS</p>
          <p className="text-5xl font-bold text-gray-800">0</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-lg shadow-md overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold text-gray-700 uppercase">Recent Enrollment Applications:</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No enrolled students yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Strand
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    YearLevel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-800">{student.fname} {student.lname}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{student.strand}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{student.yearlevel}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{student.semester}</td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-gray-800">
                        {student.enrollment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white/80 rounded-lg shadow-md p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">No. of Enrollment Applications:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Pending:</span>
            <span className="font-semibold">{stats.pending}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Enrolled:</span>
            <span className="font-semibold">{stats.enrolled}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
