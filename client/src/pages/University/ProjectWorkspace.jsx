import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    GitBranch,
    Users,
    UserCheck,
    Milestone as MilestoneIcon,
    FileText,
    Factory,
    MessageSquare,
} from 'lucide-react';
import {
    getProjectById,
    updateProject,
    addProjectUpdate,
    uploadProjectDocuments,
    updateMilestone,
    updateIndustryPartnerStatus,
} from '../../services/projectService';

const TABS = [
    { key: 'overview', label: 'Overview', icon: GitBranch },
    { key: 'team', label: 'Team & Mentor', icon: Users },
    { key: 'milestones', label: 'Milestones', icon: MilestoneIcon },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'industry', label: 'Industry', icon: Factory },
    { key: 'updates', label: 'Updates & Impact', icon: MessageSquare },
];

export default function ProjectWorkspace() {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [project, setProject] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    const [studentDraft, setStudentDraft] = useState({ name: '', email: '', department: '' });
    const [mentorDraft, setMentorDraft] = useState({ name: '', email: '', department: '' });
    const [updateText, setUpdateText] = useState('');

    const isOwner = user?.role === 'university';

    const load = async () => {
        try {
            const { data } = await getProjectById(id);
            setProject(data.project);
            setMilestones(data.milestones);
            setMentorDraft(data.project.facultyMentor || { name: '', email: '', department: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddStudent = async () => {
        if (!studentDraft.name) return;
        const students = [...(project.students || []), studentDraft];
        await updateProject(id, { students });
        setStudentDraft({ name: '', email: '', department: '' });
        load();
    };

    const handleRemoveStudent = async (index) => {
        const students = project.students.filter((_, i) => i !== index);
        await updateProject(id, { students });
        load();
    };

    const handleSaveMentor = async () => {
        await updateProject(id, { facultyMentor: mentorDraft });
        load();
    };

    const handleMilestoneChange = async (milestoneId, field, value) => {
        await updateMilestone(id, milestoneId, { [field]: value });
        load();
    };

    const handleUploadDocs = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const formData = new FormData();
        files.forEach((f) => formData.append('documents', f));
        await uploadProjectDocuments(id, formData);
        load();
    };

    const handlePostUpdate = async () => {
        if (!updateText.trim()) return;
        await addProjectUpdate(id, updateText);
        setUpdateText('');
        load();
    };

    const handleSaveImpact = async () => {
        await updateProject(id, {
            socialImpact: project.socialImpact,
        });
        load();
    };

    if (loading || !project) {
        return <div className="min-h-screen bg-ink flex items-center justify-center text-inkMuted">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-ink">
            <header className="border-b border-panelLight">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <GitBranch size={20} className="text-signal" />
                        <span className="font-display font-semibold text-lg text-ink50">SocioSolve</span>
                    </Link>
                    <Link to="/university/dashboard" className="text-sm text-inkMuted hover:text-ink50">
                        Back to dashboard
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
                <p className="font-mono text-xs text-inkMuted uppercase mb-2">Project workspace</p>
                <h1 className="font-display text-2xl font-semibold text-ink50 mb-8">{project.title}</h1>

                <div className="flex gap-2 mb-8 border-b border-panelLight overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                    ? 'border-signal text-ink50'
                                    : 'border-transparent text-inkMuted hover:text-ink50'
                                }`}
                        >
                            <tab.icon size={15} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <p className="font-mono text-xs text-inkMuted uppercase mb-2">Challenge</p>
                            <Link
                                to={`/challenges/${project.challenge?._id}`}
                                className="text-sm text-signal hover:underline"
                            >
                                {project.challenge?.title}
                            </Link>
                            <p className="text-xs text-inkMuted mt-2">{project.challenge?.district}</p>
                        </div>
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <p className="font-mono text-xs text-inkMuted uppercase mb-2">Status</p>
                            <p className="text-sm text-ink50 capitalize">{project.status.replace('_', ' ')}</p>
                        </div>
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <p className="font-mono text-xs text-inkMuted uppercase mb-2">University</p>
                            <p className="text-sm text-ink50">{project.university?.name}</p>
                        </div>
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <p className="font-mono text-xs text-inkMuted uppercase mb-2">Team size</p>
                            <p className="text-sm text-ink50">{project.students?.length || 0} students</p>
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <h3 className="font-display text-sm font-semibold text-ink50 mb-4">Students</h3>
                            <div className="flex flex-col gap-2 mb-4">
                                {(project.students || []).map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-panelLight rounded-md px-3 py-2"
                                    >
                                        <span className="text-sm text-ink50">
                                            {s.name} <span className="text-xs text-inkMuted">— {s.department}</span>
                                        </span>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleRemoveStudent(i)}
                                                className="text-xs text-red-400 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {(!project.students || project.students.length === 0) && (
                                    <p className="text-sm text-inkMuted">No students added yet.</p>
                                )}
                            </div>
                            {isOwner && (
                                <div className="flex flex-col gap-2 pt-4 border-t border-panelLight">
                                    <input
                                        placeholder="Name"
                                        value={studentDraft.name}
                                        onChange={(e) => setStudentDraft({ ...studentDraft, name: e.target.value })}
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <input
                                        placeholder="Email"
                                        value={studentDraft.email}
                                        onChange={(e) => setStudentDraft({ ...studentDraft, email: e.target.value })}
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <input
                                        placeholder="Department"
                                        value={studentDraft.department}
                                        onChange={(e) =>
                                            setStudentDraft({ ...studentDraft, department: e.target.value })
                                        }
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <button
                                        onClick={handleAddStudent}
                                        className="bg-signal text-ink text-sm font-medium rounded-md py-2 hover:bg-amber-400"
                                    >
                                        Add student
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <h3 className="font-display text-sm font-semibold text-ink50 mb-4 flex items-center gap-2">
                                <UserCheck size={16} className="text-pulse" /> Faculty mentor
                            </h3>
                            {isOwner ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        placeholder="Name"
                                        value={mentorDraft.name || ''}
                                        onChange={(e) => setMentorDraft({ ...mentorDraft, name: e.target.value })}
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <input
                                        placeholder="Email"
                                        value={mentorDraft.email || ''}
                                        onChange={(e) => setMentorDraft({ ...mentorDraft, email: e.target.value })}
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <input
                                        placeholder="Department"
                                        value={mentorDraft.department || ''}
                                        onChange={(e) =>
                                            setMentorDraft({ ...mentorDraft, department: e.target.value })
                                        }
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <button
                                        onClick={handleSaveMentor}
                                        className="bg-panelLight text-ink50 text-sm font-medium rounded-md py-2 hover:text-pulse"
                                    >
                                        Save mentor
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-ink50">{project.facultyMentor?.name || 'Not assigned yet'}</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'milestones' && (
                    <div className="flex flex-col gap-4">
                        {milestones.map((m) => (
                            <div key={m._id} className="bg-panel border border-panelLight rounded-lg p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-display text-sm font-semibold text-ink50">{m.stage}</span>
                                    {isOwner ? (
                                        <select
                                            value={m.status}
                                            onChange={(e) => handleMilestoneChange(m._id, 'status', e.target.value)}
                                            className="bg-panelLight border border-panelLight rounded-md px-2 py-1 text-xs text-ink50"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    ) : (
                                        <span className="text-xs text-inkMuted capitalize">
                                            {m.status.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>
                                <div className="h-2 bg-panelLight rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-signal transition-all"
                                        style={{ width: `${m.progress}%` }}
                                    />
                                </div>
                                {isOwner && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={m.progress}
                                        onChange={(e) => handleMilestoneChange(m._id, 'progress', Number(e.target.value))}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-panel border border-panelLight rounded-lg p-6">
                        {isOwner && (
                            <div className="mb-6">
                                <label className="block text-sm text-inkMuted mb-2">Upload proposal / documents</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleUploadDocs}
                                    className="w-full text-sm text-inkMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-panelLight file:text-ink50 file:text-sm"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            {(project.documents || []).map((doc, i) => (
                                <a
                                    key={i}
                                    href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${doc.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-pulse hover:underline"
                                >
                                    <FileText size={14} /> {doc.name}
                                </a>
                            ))}
                            {(!project.documents || project.documents.length === 0) && (
                                <p className="text-sm text-inkMuted">No documents uploaded yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'industry' && (
                    <div className="bg-panel border border-panelLight rounded-lg p-6">
                        {(project.industryPartners || []).length === 0 ? (
                            <p className="text-sm text-inkMuted">
                                No industry partners yet. Industry accounts can express interest from their own
                                dashboard.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {project.industryPartners.map((ip) => (
                                    <div
                                        key={ip._id}
                                        className="flex items-center justify-between border-b border-panelLight pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <div>
                                            <span className="text-sm text-ink50">{ip.partner?.name}</span>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {(ip.supportType || []).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="font-mono text-[10px] bg-panelLight rounded px-1.5 py-0.5 text-inkMuted"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {isOwner && ip.status === 'interested' ? (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={async () => {
                                                        await updateIndustryPartnerStatus(project._id, ip._id, 'active');
                                                        load();
                                                    }}
                                                    className="text-xs bg-signal text-ink rounded-md px-3 py-1.5 font-medium hover:bg-amber-400"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await updateIndustryPartnerStatus(project._id, ip._id, 'completed');
                                                        load();
                                                    }}
                                                    className="text-xs text-inkMuted hover:text-red-400"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-mono text-[10px] uppercase text-pulse shrink-0">
                                                {ip.status}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'updates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <h3 className="font-display text-sm font-semibold text-ink50 mb-4">Updates</h3>
                            <div className="flex gap-2 mb-4">
                                <input
                                    placeholder="Post an update..."
                                    value={updateText}
                                    onChange={(e) => setUpdateText(e.target.value)}
                                    className="flex-1 bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                />
                                <button
                                    onClick={handlePostUpdate}
                                    className="bg-signal text-ink text-sm font-medium rounded-md px-4 hover:bg-amber-400"
                                >
                                    Post
                                </button>
                            </div>
                            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                                {(project.updates || []).map((u, i) => (
                                    <div key={i} className="border-b border-panelLight pb-3">
                                        <p className="text-sm text-ink50">{u.text}</p>
                                        <p className="text-xs text-inkMuted mt-1">
                                            {u.postedBy?.name} · {new Date(u.postedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-panel border border-panelLight rounded-lg p-6">
                            <h3 className="font-display text-sm font-semibold text-ink50 mb-4">Social impact</h3>
                            {isOwner ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="number"
                                        placeholder="People impacted"
                                        value={project.socialImpact?.peopleImpacted || ''}
                                        onChange={(e) =>
                                            setProject({
                                                ...project,
                                                socialImpact: {
                                                    ...project.socialImpact,
                                                    peopleImpacted: Number(e.target.value),
                                                },
                                            })
                                        }
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <textarea
                                        placeholder="Describe the impact..."
                                        value={project.socialImpact?.description || ''}
                                        onChange={(e) =>
                                            setProject({
                                                ...project,
                                                socialImpact: { ...project.socialImpact, description: e.target.value },
                                            })
                                        }
                                        rows={3}
                                        className="bg-panelLight border border-panelLight rounded-md px-3 py-2 text-sm text-ink50 focus:outline-none focus:border-signal"
                                    />
                                    <button
                                        onClick={handleSaveImpact}
                                        className="bg-panelLight text-ink50 text-sm font-medium rounded-md py-2 hover:text-pulse"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-ink50">
                                        {project.socialImpact?.peopleImpacted || 0} people impacted
                                    </p>
                                    <p className="text-xs text-inkMuted mt-1">{project.socialImpact?.description}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}