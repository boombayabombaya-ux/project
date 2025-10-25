import { useEffect, useState } from 'react';
import { supabase, Student } from '../lib/supabase';
import { Search } from 'lucide-react';

export default function RegularStudent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortStrand, setSortStrand] = useState('');
  const [sortYearLevel, setSortYearLevel] = useState('');
  const [sortSemester, setSortSemester] = useState('');

  useEffect(() => {
    fetchRegularStudents();
  }, []);

  const fetchRegularStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('NewStudent')
        .select('*')
        .neq('strand', 'ALS')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching regular students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id || null);
    setEditForm(student);
  };

  const handleUpdate = async () => {
    if (!editForm || !editingId) return;

    try {
      const { error } = await supabase
        .from('NewStudent')
        .update({
          lname: editForm.lname,
          fname: editForm.fname,
          mname: editForm.mname,
          strand: editForm.strand,
          semester: editForm.semester,
          yearlevel: editForm.yearlevel,
          enrollment_status: editForm.enrollment_status,
        })
        .eq('id', editingId);

      if (error) throw error;

      setStudents(
        students.map((s) => (s.id === editingId ? { ...s, ...editForm } : s))
      );
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  const handleDelete = async (studentId: number | undefined) => {
    if (!studentId) return;
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error } = await supabase
        .from('NewStudent')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      setStudents(students.filter((s) => s.id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-700">Regular Students</h1>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
          Search
        </button>
      </div>

      <div className="bg-white/80 rounded-lg shadow-md overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            List of All Regular Students:
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">SORT BY:</span>
            <select
              value={sortStrand}
              onChange={(e) => setSortStrand(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">STRAND</option>
              <option value="STEM">STEM</option>
              <option value="ABM">ABM</option>
              <option value="HUMSS">HUMSS</option>
              <option value="TVL-ICT">TVL-ICT</option>
            </select>
            <select
              value={sortYearLevel}
              onChange={(e) => setSortYearLevel(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">YEAR LEVEL</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
            <select
              value={sortSemester}
              onChange={(e) => setSortSemester(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">SEMESTER</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No regular students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Strand</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">YearLevel</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Semester</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white/50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {student.fname} {student.mname} {student.lname}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{student.strand}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{student.yearlevel}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{student.semester}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{student.enrollment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
