import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Search } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import ChallengeCard from '../../components/common/ChallengeCard';
import { getChallenges } from '../../services/challengeService';
import { getUniversities } from '../../services/universityService';
import { getCategories } from '../../services/categoryService';
import { DOMAINS } from '../../utils/constants';
import { TIMELINE_STAGES } from '../../utils/timelineUtils';

const initialFilters = {
  search: '',
  domain: '',
  district: '',
  priority: '',
  status: '',
  university: '',
  industryInvolvement: '',
  dateFrom: '',
  dateTo: '',
};

export default function ChallengeExplorer() {
  const [filters, setFilters] = useState(initialFilters);
  const [challenges, setChallenges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [categories, setCategories] = useState(DOMAINS);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniversities()
      .then((res) => setUniversities(res.data.universities))
      .catch(() => { });
    getCategories()
      .then((res) => {
        if (res.data.categories.length > 0) {
          setCategories(res.data.categories.map((c) => c.name));
        }
      })
      .catch(() => { });
  }, []);

  const fetchChallenges = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') params[key] = value;
      });
      const { data } = await getChallenges(params);
      setChallenges(data.challenges);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchChallenges(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setTimeout(() => fetchChallenges(1), 0);
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-panelLight">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GitBranch size={20} className="text-signal" />
            <span className="font-display font-semibold text-lg text-ink50">SocioSolve</span>
          </Link>
          <Link to="/dashboard" className="text-sm text-inkMuted hover:text-ink50">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink50 mb-1">
          Challenge Explorer
        </h1>
        <p className="text-sm text-inkMuted mb-8">
          Browse every challenge currently in the pipeline.
        </p>

        <form
          onSubmit={applyFilters}
          className="bg-panel border border-panelLight rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="md:col-span-4">
            <Input
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search title or description..."
            />
          </div>

          <Select label="Domain" name="domain" value={filters.domain} onChange={handleFilterChange}>
            <option value="">All domains</option>
            {categories.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Input
            label="District"
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
            placeholder="Any district"
          />

          <Select label="Priority" name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">Any priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>

          <Select label="Status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Any status</option>
            {TIMELINE_STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
            <option value="rejected">Rejected</option>
          </Select>

          <Select
            label="University"
            name="university"
            value={filters.university}
            onChange={handleFilterChange}
          >
            <option value="">Any university</option>
            {universities.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </Select>

          <Select
            label="Industry involvement"
            name="industryInvolvement"
            value={filters.industryInvolvement}
            onChange={handleFilterChange}
          >
            <option value="">Any</option>
            <option value="true">Involved</option>
            <option value="false">Not involved</option>
          </Select>

          <Input
            label="From date"
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />

          <div className="md:col-span-4 flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" icon={false}>
              <Search size={15} /> Apply filters
            </Button>
            <Button type="button" variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </form>

        {loading ? (
          <p className="text-sm text-inkMuted">Loading challenges...</p>
        ) : challenges.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-inkMuted">
              No challenges match these filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((c) => (
                <ChallengeCard key={c._id} challenge={c} />
              ))}
            </div>

            <div className="flex items-center justify-between mt-10">
              <p className="text-xs text-inkMuted font-mono">
                Page {pagination.page} of {totalPages} · {pagination.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => fetchChallenges(pagination.page - 1)}
                  className={pagination.page <= 1 ? 'opacity-40 pointer-events-none' : ''}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => fetchChallenges(pagination.page + 1)}
                  className={
                    pagination.page >= totalPages ? 'opacity-40 pointer-events-none' : ''
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}