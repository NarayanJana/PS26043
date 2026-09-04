import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Compass } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { submitChallenge } from '../../services/challengeService';
import { getCategories } from '../../services/categoryService';
import { DOMAINS } from '../../utils/constants';

const navItems = [
  { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/citizen/submit-challenge', label: 'Submit challenge', icon: FilePlus },
  { to: '/challenges', label: 'Explore challenges', icon: Compass },
];

export default function SubmitChallenge() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: DOMAINS[0],
    subCategory: '',
    district: '',
    location: '',
    latitude: '',
    longitude: '',
    peopleAffected: '',
    expectedSolution: '',
    additionalInfo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(DOMAINS);
  const [files, setFiles] = useState({
    photos: [],
    videos: [],
    documents: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data.categories.length > 0) {
          setCategories(res.data.categories.map((c) => c.name));
        }
      })
      .catch(() => { });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: Array.from(selectedFiles) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.district) {
      setError('Title, description, and district are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '') formData.append(key, value);
      });
      files.photos.forEach((file) => formData.append('photos', file));
      files.videos.forEach((file) => formData.append('videos', file));
      files.documents.forEach((file) => formData.append('documents', file));

      await submitChallenge(formData);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Submit a challenge
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Give as much detail as you can — it helps the AI route this to the
          right expertise faster.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-pulse/10 border border-pulse/30 text-pulse text-sm rounded-md px-4 py-3 mb-6">
            Challenge submitted. Redirecting to your dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Problem title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. No clean drinking water in Village X"
            required
          />

          <div>
            <label className="block text-sm text-inkMuted mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full bg-panel border border-panelLight rounded-md px-4 py-3 text-sm text-ink50 placeholder:text-inkMuted/60 focus:outline-none focus:border-signal transition-colors"
              placeholder="Describe the problem in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Domain" name="domain" value={form.domain} onChange={handleChange}>
              {categories.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Input
              label="Sub-category"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              placeholder="e.g. Irrigation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
  label="District"
  name="district"
  value={form.district}
  onChange={handleChange}
  required
>
  <option value="">Select District</option>
  <option value="Bokaro">Bokaro</option>
  <option value="Chatra">Chatra</option>
  <option value="Deoghar">Deoghar</option>
  <option value="Dhanbad">Dhanbad</option>
  <option value="Dumka">Dumka</option>
  <option value="East Singhbhum">East Singhbhum</option>
  <option value="Garhwa">Garhwa</option>
  <option value="Giridih">Giridih</option>
  <option value="Godda">Godda</option>
  <option value="Gumla">Gumla</option>
  <option value="Hazaribagh">Hazaribagh</option>
  <option value="Jamtara">Jamtara</option>
  <option value="Khunti">Khunti</option>
  <option value="Koderma">Koderma</option>
  <option value="Latehar">Latehar</option>
  <option value="Lohardaga">Lohardaga</option>
  <option value="Pakur">Pakur</option>
  <option value="Palamu">Palamu</option>
  <option value="Ramgarh">Ramgarh</option>
  <option value="Ranchi">Ranchi</option>
  <option value="Sahibganj">Sahibganj</option>
  <option value="Seraikela Kharsawan">Seraikela Kharsawan</option>
  <option value="Simdega">Simdega</option>
  <option value="West Singhbhum">West Singhbhum</option>
</Select>
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Village X, near the main canal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              placeholder="Optional"
            />
            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              placeholder="Optional"
            />
            <Input
              label="People affected"
              name="peopleAffected"
              type="number"
              value={form.peopleAffected}
              onChange={handleChange}
              placeholder="Estimated number"
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">Photos</label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-inkMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-panelLight file:text-ink50 file:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">Videos</label>
            <input
              type="file"
              name="videos"
              multiple
              accept="video/*"
              onChange={handleFileChange}
              className="w-full text-sm text-inkMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-panelLight file:text-ink50 file:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">Documents</label>
            <input
              type="file"
              name="documents"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-inkMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-panelLight file:text-ink50 file:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">
              Expected solution
            </label>
            <textarea
              name="expectedSolution"
              value={form.expectedSolution}
              onChange={handleChange}
              rows={3}
              className="w-full bg-panel border border-panelLight rounded-md px-4 py-3 text-sm text-ink50 placeholder:text-inkMuted/60 focus:outline-none focus:border-signal transition-colors"
              placeholder="If you have an idea of what might help, describe it..."
            />
          </div>

          <div>
            <label className="block text-sm text-inkMuted mb-2">
              Additional information
            </label>
            <textarea
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleChange}
              rows={3}
              className="w-full bg-panel border border-panelLight rounded-md px-4 py-3 text-sm text-ink50 placeholder:text-inkMuted/60 focus:outline-none focus:border-signal transition-colors"
              placeholder="Anything else worth knowing..."
            />
          </div>

          <Button type="submit" variant="primary" className="w-fit">
            {loading ? 'Submitting...' : 'Submit challenge'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}