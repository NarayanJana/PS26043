import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GitBranch, MapPin, Users, FileText, Sparkles, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Timeline from '../../components/common/Timeline';
import { getChallengeById, triggerAnalysis } from '../../services/challengeService';
import { createProject } from '../../services/projectService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ChallengeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [creatingProject, setCreatingProject] = useState(false);

    useEffect(() => {
        getChallengeById(id)
            .then((res) => setChallenge(res.data.challenge))
            .catch((err) => setError(err.response?.data?.message || 'Could not load this challenge.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-ink flex items-center justify-center text-inkMuted">Loading...</div>;
    }

    if (error || !challenge) {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center text-red-400">
                {error || 'Challenge not found.'}
            </div>
        );
    }

    const hasAiAnalysis = Boolean(challenge.aiAnalysis?.analyzedAt);

    return (
        <div className="min-h-screen bg-ink">
            <header className="border-b border-panelLight">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <GitBranch size={20} className="text-signal" />
                        <span className="font-display font-semibold text-lg text-ink50">SocioSolve</span>
                    </Link>
                    <Link to="/challenges" className="text-sm text-inkMuted hover:text-ink50">
                        Back to explorer
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-xs uppercase text-inkMuted">
                                {challenge.domain}
                                {challenge.subCategory ? ` / ${challenge.subCategory}` : ''}
                            </span>
                            <StatusBadge status={challenge.status} />
                        </div>
                        <h1 className="font-display text-3xl font-semibold text-ink50 mb-4">
                            {challenge.title}
                        </h1>
                        <p className="text-inkMuted leading-relaxed">{challenge.description}</p>

                        <div className="flex items-center gap-6 text-sm text-inkMuted mt-6">
                            <span className="flex items-center gap-2">
                                <MapPin size={14} /> {challenge.district}
                                {challenge.location ? ` — ${challenge.location}` : ''}
                            </span>
                            <span className="flex items-center gap-2">
                                <Users size={14} /> {challenge.peopleAffected || 0} affected
                            </span>
                        </div>

                        {(challenge.latitude || challenge.longitude) && (
                            <div className="mt-4 bg-panel border border-panelLight rounded-lg h-40 flex items-center justify-center">
                                <p className="font-mono text-xs text-inkMuted">
                                    Map placeholder — {challenge.latitude}, {challenge.longitude}
                                </p>
                            </div>
                        )}
                    </div>

                    {(challenge.media?.photos?.length > 0 ||
                        challenge.media?.videos?.length > 0 ||
                        challenge.media?.documents?.length > 0) && (
                            <div>
                                <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
                                    Attachments
                                </h2>

                                {challenge.media.photos?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {challenge.media.photos.map((src) => (
                                            <img
                                                key={src}
                                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${src}`}
                                                alt="Challenge evidence"
                                                className="w-full h-28 object-cover rounded-md border border-panelLight"
                                            />
                                        ))}
                                    </div>
                                )}

                                {challenge.media.videos?.length > 0 && (
                                    <div className="flex flex-col gap-3 mb-4">
                                        {challenge.media.videos.map((src) => (
                                            <video
                                                key={src}
                                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${src}`}
                                                controls
                                                className="w-full rounded-md border border-panelLight"
                                            />
                                        ))}
                                    </div>
                                )}

                                {challenge.media?.documents?.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {challenge.media.documents.map((src, index) => (
                                            <a
                                                key={index}
                                                href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${src}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-signal hover:underline"
                                            >
                                                <FileText size={14} className="inline mr-2" />
                                                Document {index + 1}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                <div>
                    <h2 className="font-display text-lg font-semibold text-ink50 mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="text-signal" /> AI Analysis
                    </h2>
                    {!hasAiAnalysis ? (
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <p className="text-sm text-inkMuted mb-4">
                                This challenge hasn't been analyzed yet. Analysis normally
                                runs automatically within a few seconds of submission — if
                                it's been longer than that, trigger it manually below.
                            </p>
                            <button
                                onClick={async () => {
                                    setAnalyzing(true);
                                    try {
                                        const { data } = await triggerAnalysis(id);
                                        setChallenge(data.challenge);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setAnalyzing(false);
                                    }
                                }}
                                className="flex items-center gap-2 text-sm text-signal hover:underline"
                                disabled={analyzing}
                            >
                                <RefreshCw size={14} className={analyzing ? 'animate-spin' : ''} />
                                {analyzing ? 'Analyzing...' : 'Run AI analysis now'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-panel border border-panelLight rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">Summary</p>
                                <p className="text-sm text-ink50">{challenge.aiAnalysis.summary}</p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">Priority</p>
                                <p className="text-sm text-ink50">{challenge.aiAnalysis.priority}</p>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">Keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {challenge.aiAnalysis.keywords?.map((k) => (
                                        <span
                                            key={k}
                                            className="font-mono text-[11px] bg-panelLight rounded px-2 py-1 text-inkMuted"
                                        >
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">
                                    Required expertise
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {challenge.aiAnalysis.requiredExpertise?.map((k) => (
                                        <span
                                            key={k}
                                            className="font-mono text-[11px] bg-signal/10 text-signal rounded px-2 py-1"
                                        >
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {challenge.similarChallenges?.length > 0 && (
                    <div>
                        <h2 className="font-display text-lg font-semibold text-ink50 mb-4">
                            Similar challenges
                        </h2>
                        <div className="flex flex-col gap-3">
                            {challenge.similarChallenges.map((s) => {
                                const isDuplicate = s.similarity >= 65;
                                return (
                                    <Link
                                        key={s.challenge?._id}
                                        to={`/challenges/${s.challenge?._id}`}
                                        className={`flex items-center justify-between rounded-lg px-5 py-4 border transition-colors ${isDuplicate
                                            ? 'bg-signal/5 border-signal/30 hover:border-signal/60'
                                            : 'bg-panel border-panelLight hover:border-pulse/40'
                                            }`}
                                    >
                                        <div>
                                            {isDuplicate && (
                                                <p className="font-mono text-[10px] uppercase text-signal mb-1">
                                                    Potential duplicate
                                                </p>
                                            )}
                                            <span className="text-sm text-ink50">{s.challenge?.title}</span>
                                        </div>
                                        <span
                                            className={`font-mono text-xs ${isDuplicate ? 'text-signal' : 'text-pulse'
                                                }`}
                                        >
                                            Similarity: {Math.round(s.similarity)}%
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="font-display text-sm font-semibold text-ink50 mb-6">
                        Progress
                    </h2>
                    <Timeline status={challenge.status} />
                </div>

                {challenge.recommendedUniversities?.length > 0 && (
                    <div className="bg-panel border border-panelLight rounded-lg p-6">
                        <h3 className="font-display text-sm font-semibold text-ink50 mb-4">
                            Recommended universities
                        </h3>
                        <div className="flex flex-col gap-5">
                            {challenge.recommendedUniversities.map((r) => (
                                <div key={r.university?._id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-ink50">{r.university?.name}</span>
                                        <span className="font-mono text-xs text-pulse">{r.matchScore}% Match</span>
                                    </div>
                                    {r.matchedExpertise?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {r.matchedExpertise.map((e) => (
                                                <span
                                                    key={e}
                                                    className="font-mono text-[10px] bg-pulse/10 text-pulse rounded px-1.5 py-0.5"
                                                >
                                                    ✓ {e}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {challenge.assignedUniversity && (
                    <div className="bg-panel border border-panelLight rounded-lg p-6">
                        <h3 className="font-display text-sm font-semibold text-ink50 mb-2">
                            Assigned university
                        </h3>
                        <p className="text-sm text-ink50">{challenge.assignedUniversity.name}</p>
                        <p className="text-xs text-inkMuted mt-1 mb-4">
                            {challenge.assignedUniversity.district}
                        </p>

                        {!challenge.project && user?.role === 'university' && (
                            <button
                                onClick={async () => {
                                    setCreatingProject(true);
                                    try {
                                        const { data } = await createProject(challenge._id);
                                        navigate(`/university/projects/${data.project._id}`);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setCreatingProject(false);
                                    }
                                }}
                                className="w-full bg-signal text-ink text-sm font-medium rounded-md py-2.5 hover:bg-amber-400 transition-colors disabled:opacity-50"
                                disabled={creatingProject}
                            >
                                {creatingProject ? 'Creating project...' : 'Create project'}
                            </button>
                        )}
                    </div>
                )}
                {challenge.project && (
                    <div className="bg-panel border border-panelLight rounded-lg p-6">
                        <h3 className="font-display text-sm font-semibold text-ink50 mb-4">
                            Project
                        </h3>
                        <p className="text-sm text-ink50 mb-1">{challenge.project.title}</p>
                        <p className="text-xs text-inkMuted mb-4">Status: {challenge.project.status}</p>

                        {challenge.project.industryPartners?.length > 0 && (
                            <div className="pt-4 border-t border-panelLight">
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">
                                    Industry partners
                                </p>
                                {challenge.project.industryPartners.map((ip) => (
                                    <p key={ip.partner?._id} className="text-sm text-ink50">
                                        {ip.partner?.name}
                                    </p>
                                ))}
                            </div>
                        )}

                        {challenge.project.socialImpact?.peopleImpacted > 0 && (
                            <div className="pt-4 border-t border-panelLight mt-4">
                                <p className="font-mono text-xs text-inkMuted uppercase mb-2">
                                    Social impact
                                </p>
                                <p className="text-sm text-ink50">
                                    {challenge.project.socialImpact.peopleImpacted} people impacted
                                </p>
                                <p className="text-xs text-inkMuted mt-1">
                                    {challenge.project.socialImpact.description}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}