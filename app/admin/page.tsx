"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IoFolderOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoBriefcaseOutline,
  IoRibbonOutline,
  IoLogOutOutline,
  IoSaveOutline,
  IoCloudUploadOutline,
  IoTrashOutline,
  IoAddOutline,
  IoOpenOutline,
  IoDownloadOutline,
  IoConstructOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import { PortfolioData, ProjectItem, SkillItem, EducationItem, ServiceItem, ExperienceItem, CertificateItem } from "@/lib/portfolio-storage";
import ThemeToggle from "@/components/ThemeToggle";
import DynamicIcon from "@/components/DynamicIcon";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "projects" | "resume" | "about" | "skills" | "services" | "experiences" | "certificates"
  >("projects");

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectItem>({
    title: "",
    emoji: "🚀",
    tag: "Full Stack",
    tagColor: "#3B82F6",
    main: "",
    image: "/assets/ecomimg.png",
    demo: "",
    demoLabel: "GitHub",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Resume Upload State
  const [uploadingResume, setUploadingResume] = useState(false);
  // Hero Image Upload State
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  // Skill Modal State
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<SkillItem>({
    name: "",
    color: "#3B82F6",
    iconType: "react",
  });

  // Education Modal State
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<EducationItem>({
    institution: "",
    period: "2022 – 2026",
    details: "BE Computer Science and Engineering",
    iconType: "FaGraduationCap",
    iconColor: "#FBBF24",
    current: true,
  });

  // Service Modal State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    emoji: "💻",
    title: "",
    tag: "",
    description: "",
    image: "/assets/MERN.png",
    accent: "#3B82F6",
  });
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);

  // Experience Modal State
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expForm, setExpForm] = useState<ExperienceItem>({
    company: "",
    role: "",
    period: "",
    accent: "#3B82F6",
    initials: "",
    cert: {
      image: "",
      title: "",
    },
    techIcons: [],
    bullets: [],
  });
  const [expBulletsText, setExpBulletsText] = useState("");
  const [expTechText, setExpTechText] = useState("");
  const [uploadingExpCert, setUploadingExpCert] = useState(false);

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [certForm, setCertForm] = useState<CertificateItem>({
    title: "",
    issuer: "",
    src: "/certificates/Flutter.png",
  });
  const [uploadingCertImage, setUploadingCertImage] = useState(false);

  // Load portfolio data on mount
  useEffect(() => {
    async function load() {
      try {
        const checkRes = await fetch("/api/auth/check");
        const checkData = await checkRes.json();
        if (!checkData.authenticated) {
          router.push("/admin/login");
          return;
        }

        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  // Save changes to JSON file
  const handleSaveData = async (customData?: PortfolioData) => {
    const payload = customData || data;
    if (!payload) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus({ type: "success", msg: "Saved successfully!" });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ type: "error", msg: json.message || "Failed to save." });
      }
    } catch {
      setSaveStatus({ type: "error", msg: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  // Sign out
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Upload helper
  const handleFileUpload = async (file: File, category: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Upload failed");
    return json.url;
  };

  // Resume file upload handler
  const onResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploadingResume(true);
    try {
      const url = await handleFileUpload(file, "resume");
      const updated: PortfolioData = {
        ...data,
        hero: { ...data.hero, resumeUrl: url },
      };
      setData(updated);
      await handleSaveData(updated);
      alert("Resume uploaded and set successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Resume upload failed";
      alert(msg);
    } finally {
      setUploadingResume(false);
    }
  };

  // Hero Image upload handler
  const onHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploadingHeroImage(true);
    try {
      const url = await handleFileUpload(file, "hero");
      const updated: PortfolioData = {
        ...data,
        hero: { ...data.hero, profileImage: url },
      };
      setData(updated);
      await handleSaveData(updated);
      alert("Hero profile image updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hero image upload failed";
      alert(msg);
    } finally {
      setUploadingHeroImage(false);
    }
  };

  // Project Image upload handler
  const onProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await handleFileUpload(file, "project");
      setProjectForm((prev) => ({ ...prev, image: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      alert(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Project from modal
  const handleSaveProjectModal = () => {
    if (!data) return;
    let updatedProjects = [...data.projects];
    if (editingProjectIndex !== null) {
      updatedProjects[editingProjectIndex] = projectForm;
    } else {
      updatedProjects = [
        { ...projectForm, id: `proj-${Date.now()}` },
        ...updatedProjects,
      ];
    }

    const updated = { ...data, projects: updatedProjects };
    setData(updated);
    handleSaveData(updated);
    setShowProjectModal(false);
    setEditingProjectIndex(null);
  };

  // Save Skill from modal
  const handleSaveSkillModal = () => {
    if (!data) return;
    const updatedSkills = [...data.skills];
    if (editingSkillIndex !== null) {
      updatedSkills[editingSkillIndex] = skillForm;
    } else {
      updatedSkills.push(skillForm);
    }
    const updated = { ...data, skills: updatedSkills };
    setData(updated);
    handleSaveData(updated);
    setShowSkillModal(false);
    setEditingSkillIndex(null);
  };

  // Save Education from modal
  const handleSaveEduModal = () => {
    if (!data) return;
    const updatedEdu = [...data.education];
    if (editingEduIndex !== null) {
      updatedEdu[editingEduIndex] = eduForm;
    } else {
      updatedEdu.push(eduForm);
    }
    const updated = { ...data, education: updatedEdu };
    setData(updated);
    handleSaveData(updated);
    setShowEduModal(false);
    setEditingEduIndex(null);
  };

  // Service image upload
  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingServiceImage(true);
    try {
      const url = await handleFileUpload(file, "service");
      setServiceForm((prev) => ({ ...prev, image: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Service image upload failed";
      alert(msg);
    } finally {
      setUploadingServiceImage(false);
    }
  };

  // Save Service from modal
  const handleSaveServiceModal = () => {
    if (!data) return;
    let updatedServices = [...data.services];
    if (editingServiceIndex !== null) {
      updatedServices[editingServiceIndex] = serviceForm;
    } else {
      updatedServices.push(serviceForm);
    }
    const updated = { ...data, services: updatedServices };
    setData(updated);
    handleSaveData(updated);
    setShowServiceModal(false);
    setEditingServiceIndex(null);
  };

  // Experience cert image upload
  const handleExpCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExpCert(true);
    try {
      const url = await handleFileUpload(file, "cert");
      setExpForm((prev) => ({
        ...prev,
        cert: {
          ...prev.cert,
          image: url,
          title: prev.cert.title || `${prev.company} Certificate`,
        },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Certificate upload failed";
      alert(msg);
    } finally {
      setUploadingExpCert(false);
    }
  };

  // Save Experience from modal
  const handleSaveExpModal = () => {
    if (!data) return;
    // parse bullets from multiline text
    const bullets = expBulletsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // parse tech icons from comma or newline text
    // format: React, Node.js, Freshworks or iconType:color:label
    const techItems = expTechText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const techIcons = techItems.map((item) => {
      const parts = item.split(":");
      if (parts.length >= 3) {
        return {
          iconType: parts[0].trim(),
          color: parts[1].trim(),
          label: parts.slice(2).join(":").trim(),
        };
      }
      const label = parts[0].trim();
      return {
        iconType: label.toLowerCase().replace(/[^a-z0-9]/g, ""),
        color: expForm.accent || "#3B82F6",
        label,
      };
    });

    const finalExp: ExperienceItem = {
      ...expForm,
      bullets: bullets.length > 0 ? bullets : expForm.bullets,
      techIcons: techIcons.length > 0 ? techIcons : expForm.techIcons,
      initials: expForm.initials || expForm.company.slice(0, 3).toUpperCase(),
    };

    let updatedExp = [...data.experiences];
    if (editingExpIndex !== null) {
      updatedExp[editingExpIndex] = finalExp;
    } else {
      updatedExp.push(finalExp);
    }
    const updated = { ...data, experiences: updatedExp };
    setData(updated);
    handleSaveData(updated);
    setShowExpModal(false);
    setEditingExpIndex(null);
  };

  // Certificate image upload
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCertImage(true);
    try {
      const url = await handleFileUpload(file, "cert");
      setCertForm((prev) => ({ ...prev, src: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Certificate upload failed";
      alert(msg);
    } finally {
      setUploadingCertImage(false);
    }
  };

  // Save Certificate from modal
  const handleSaveCertModal = () => {
    if (!data) return;
    let updatedCerts = [...data.certificates];
    if (editingCertIndex !== null) {
      updatedCerts[editingCertIndex] = certForm;
    } else {
      updatedCerts.push(certForm);
    }
    const updated = { ...data, certificates: updatedCerts };
    setData(updated);
    handleSaveData(updated);
    setShowCertModal(false);
    setEditingCertIndex(null);
  };

  // Delete Project
  const handleDeleteProject = (idx: number) => {
    if (!data || !confirm("Are you sure you want to delete this project?")) return;
    const updatedProjects = data.projects.filter((_, i) => i !== idx);
    const updated = { ...data, projects: updatedProjects };
    setData(updated);
    handleSaveData(updated);
  };

  // Backup download JSON
  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-400 font-semibold text-lg">
        Loading Admin Portal...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 font-semibold text-lg">
        Failed to load portfolio data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1222] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900/90 border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              JA
            </div>
            <div>
              <h2 className="text-white font-bold leading-tight">Admin Console</h2>
              <span className="text-xs text-blue-400 font-medium">Portfolio Manager</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "projects", label: "Projects", icon: <IoFolderOutline size={18} /> },
              { id: "resume", label: "Resume & Hero", icon: <IoDocumentTextOutline size={18} /> },
              { id: "about", label: "About Me", icon: <IoPersonOutline size={18} /> },
              { id: "skills", label: "Skills & Edu", icon: <IoSchoolOutline size={18} /> },
              { id: "services", label: "Services", icon: <IoConstructOutline size={18} /> },
              { id: "experiences", label: "Experiences", icon: <IoBriefcaseOutline size={18} /> },
              { id: "certificates", label: "Certificates", icon: <IoRibbonOutline size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-800 space-y-2">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/60 transition cursor-pointer"
          >
            <IoDownloadOutline size={16} />
            Export Backup (.json)
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/60 transition"
          >
            <IoOpenOutline size={16} />
            View Live Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <IoLogOutOutline size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize">
              Manage {activeTab}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Edit your portfolio details stored directly in <code className="text-blue-400">portfolio-data.json</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <ThemeToggle />

            {saveStatus && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                  saveStatus.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {saveStatus.msg}
              </span>
            )}

            <button
              onClick={() => handleSaveData()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <IoSaveOutline size={18} />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* ── PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Total Projects: <span className="text-white font-bold">{data.projects.length}</span>
              </p>
              <button
                onClick={() => {
                  setEditingProjectIndex(null);
                  setProjectForm({
                    title: "",
                    emoji: "🚀",
                    tag: "Full Stack",
                    tagColor: "#3B82F6",
                    main: "",
                    image: "/assets/ecomimg.png",
                    demo: "",
                    demoLabel: "GitHub",
                  });
                  setShowProjectModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition cursor-pointer"
              >
                <IoAddOutline size={18} />
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-44 w-full bg-gray-950">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                    <span
                      className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm"
                      style={{ color: proj.tagColor, borderColor: `${proj.tagColor}55`, background: `${proj.tagColor}20` }}
                    >
                      {proj.tag}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {proj.main}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <span className="text-xs text-blue-400 truncate max-w-[150px]">
                        {proj.demo ? proj.demoLabel : "No link"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProjectIndex(idx);
                            setProjectForm(proj);
                            setShowProjectModal(true);
                          }}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                          title="Delete Project"
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESUME & HERO TAB ── */}
        {activeTab === "resume" && (
          <div className="max-w-3xl space-y-8">
            {/* Resume Upload Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <IoDocumentTextOutline className="text-blue-400" />
                Upload New Resume (PDF)
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Upload your latest resume. When downloaded on your portfolio, this new PDF will be served automatically.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-gray-700 rounded-xl bg-gray-950/40">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-300">Current Resume Path:</p>
                  <p className="text-xs text-blue-400 truncate mt-0.5">{data.hero.resumeUrl}</p>
                </div>

                <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
                  <IoCloudUploadOutline size={18} />
                  {uploadingResume ? "Uploading PDF..." : "Upload New PDF"}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={onResumeFileChange}
                    className="hidden"
                    disabled={uploadingResume}
                  />
                </label>
              </div>
            </div>

            {/* Hero Profile Image Card */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <IoPersonOutline className="text-blue-400" />
                Hero Profile Image
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Upload your main hero photo or specify an image URL. This image appears on the right side of the hero section.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-dashed border-gray-700 rounded-xl bg-gray-950/40">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 flex-shrink-0 shadow-lg">
                  <Image
                    src={data.hero.profileImage || "/assets/my_image.png"}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase">Image URL or Path</label>
                    <input
                      type="text"
                      value={data.hero.profileImage}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, profileImage: e.target.value } })
                      }
                      placeholder="/assets/my_image.png"
                      className="w-full px-3.5 py-2 bg-gray-950/70 border border-gray-700 rounded-xl text-white text-xs mt-1"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
                    <IoCloudUploadOutline size={16} />
                    {uploadingHeroImage ? "Uploading Photo..." : "Upload New Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onHeroImageChange}
                      className="hidden"
                      disabled={uploadingHeroImage}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Hero Information */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Hero Section Text</h2>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Greeting Line (e.g. Welcome to my portfolio)
                </label>
                <input
                  type="text"
                  value={data.hero.greeting}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, greeting: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={data.hero.name}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, name: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Rotating Typed Roles (Comma-separated)
                </label>
                <input
                  type="text"
                  value={data.hero.roles.join(", ")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      hero: {
                        ...data.hero,
                        roles: e.target.value.split(",").map((s) => s.trim()),
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Hero Bio Text
                </label>
                <textarea
                  rows={3}
                  value={data.hero.bio}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, bio: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── ABOUT ME TAB ── */}
        {activeTab === "about" && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">About Me Overview</h2>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Role Subtitle / Badge
                </label>
                <input
                  type="text"
                  value={data.about.roleBadge}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, roleBadge: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Bio Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={data.about.bio1}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, bio1: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                  Bio Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={data.about.bio2}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, bio2: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              {/* Stats */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                  Statistics Badges
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.about.stats.map((stat, i) => (
                    <div key={i} className="p-3 bg-gray-950/60 border border-gray-800 rounded-xl">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...data.about.stats];
                          updated[i].value = e.target.value;
                          setData({ ...data, about: { ...data.about, stats: updated } });
                        }}
                        placeholder="Value (e.g. 2+)"
                        className="w-full mb-1 text-sm font-bold text-white bg-transparent border-b border-gray-700 focus:outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...data.about.stats];
                          updated[i].label = e.target.value;
                          setData({ ...data, about: { ...data.about, stats: updated } });
                        }}
                        placeholder="Label (e.g. Years)"
                        className="w-full text-xs text-gray-400 bg-transparent focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <h3 className="text-sm font-bold text-white">Contact &amp; Social Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Email Address</label>
                    <input
                      type="text"
                      value={data.about.contact.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            contact: { ...data.about.contact, email: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Phone Number</label>
                    <input
                      type="text"
                      value={data.about.contact.phone}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            contact: { ...data.about.contact, phone: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">GitHub Profile</label>
                    <input
                      type="text"
                      value={data.about.contact.github}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            contact: { ...data.about.contact, github: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={data.about.contact.linkedin}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: {
                            ...data.about,
                            contact: { ...data.about.contact, linkedin: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-950/60 border border-gray-700 rounded-xl text-white text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS & EDUCATION TAB ── */}
        {activeTab === "skills" && (
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Technical Skills ({data.skills.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage skill icons and brand colors with interactive preview.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkillIndex(null);
                    setSkillForm({ name: "", color: "#3B82F6", iconType: "FaReact" });
                    setShowSkillModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition"
                >
                  <IoAddOutline size={18} /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {data.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-gray-950/60 border border-gray-800 rounded-2xl flex flex-col justify-between group hover:border-gray-700 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl" style={{ color: skill.color }}>
                        <DynamicIcon name={skill.iconType || skill.name} />
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingSkillIndex(i);
                            setSkillForm(skill);
                            setShowSkillModal(true);
                          }}
                          className="text-xs text-gray-400 hover:text-blue-400 p-1 cursor-pointer"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete skill "${skill.name}"?`)) {
                              const newSkills = data.skills.filter((_, idx) => idx !== i);
                              const updated = { ...data, skills: newSkills };
                              setData(updated);
                              handleSaveData(updated);
                            }
                          }}
                          className="text-xs text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate">{skill.name}</p>
                      <p className="text-[10px] text-gray-500 truncate font-mono mt-0.5">{skill.iconType || "default"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Education Timeline ({data.education.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage your degrees, schools, years, and icons.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEduIndex(null);
                    setEduForm({
                      institution: "",
                      period: "2022 – 2026",
                      details: "BE Computer Science And Engineering",
                      iconType: "FaGraduationCap",
                      iconColor: "#FBBF24",
                      current: true,
                    });
                    setShowEduModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition"
                >
                  <IoAddOutline size={18} /> Add Education
                </button>
              </div>

              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-950/60 border border-gray-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-gray-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-3xl flex-shrink-0" style={{ color: edu.iconColor }}>
                        <DynamicIcon name={edu.iconType || "FaGraduationCap"} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                          {edu.current && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-400 mt-0.5">{edu.period} &bull; <span className="text-gray-400">{edu.details}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingEduIndex(i);
                          setEduForm(edu);
                          setShowEduModal(true);
                        }}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete education "${edu.institution}"?`)) {
                            const newEdu = data.education.filter((_, idx) => idx !== i);
                            const updated = { ...data, education: newEdu };
                            setData(updated);
                            handleSaveData(updated);
                          }
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900/40 p-4 border border-gray-800 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">Services Offered ({data.services.length})</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage services, descriptions, cover images, and tags.</p>
              </div>
              <button
                onClick={() => {
                  setEditingServiceIndex(null);
                  setServiceForm({
                    emoji: "💻",
                    title: "",
                    tag: "MERN · Next.js",
                    description: "",
                    image: "/assets/MERN.png",
                    accent: "#3B82F6",
                  });
                  setShowServiceModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition"
              >
                <IoAddOutline size={18} /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.services.map((svc, i) => (
                <div
                  key={i}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-gray-700 transition"
                >
                  <div className="relative h-40 bg-gray-950">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 20%, rgba(10,10,20,0.85) 100%)`,
                      }}
                    />
                    <span
                      className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm"
                      style={{ color: svc.accent, borderColor: `${svc.accent}55`, background: `${svc.accent}20` }}
                    >
                      {svc.tag}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-4 rounded-full flex-shrink-0" style={{ background: svc.accent }} />
                        <h3 className="text-base font-bold text-white">{svc.title}</h3>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{svc.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <span className="text-[11px] font-mono text-gray-500" style={{ color: svc.accent }}>
                        {svc.accent}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingServiceIndex(i);
                            setServiceForm(svc);
                            setShowServiceModal(true);
                          }}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete service "${svc.title}"?`)) {
                              const newServices = data.services.filter((_, idx) => idx !== i);
                              const updated = { ...data, services: newServices };
                              setData(updated);
                              handleSaveData(updated);
                            }
                          }}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                          title="Delete"
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCES TAB ── */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900/40 p-4 border border-gray-800 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">Work Experience ({data.experiences.length})</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage job positions, key achievements, certificate popups, and tech chips.</p>
              </div>
              <button
                onClick={() => {
                  setEditingExpIndex(null);
                  setExpForm({
                    company: "",
                    role: "",
                    period: "Dec 2025 – Present",
                    accent: "#3B82F6",
                    initials: "",
                    cert: {
                      image: "",
                      title: "",
                    },
                    techIcons: [],
                    bullets: [],
                  });
                  setExpBulletsText("");
                  setExpTechText("");
                  setShowExpModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition"
              >
                <IoAddOutline size={18} /> Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {data.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4 group hover:border-gray-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                        style={{
                          background: `${exp.accent}20`,
                          border: `1.5px solid ${exp.accent}50`,
                          color: exp.accent,
                        }}
                      >
                        {exp.initials || exp.company.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{exp.role}</h3>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: exp.accent }}>
                          {exp.company} &bull; <span className="text-gray-400">{exp.period}</span>
                        </p>
                        {exp.cert && exp.cert.image && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                            <IoDocumentTextOutline size={12} /> Certificate attached
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingExpIndex(i);
                          setExpForm(exp);
                          setExpBulletsText(exp.bullets.join("\n"));
                          setExpTechText(
                            exp.techIcons
                              ? exp.techIcons
                                  .map((t) => `${t.iconType}:${t.color}:${t.label}`)
                                  .join("\n")
                              : ""
                          );
                          setShowExpModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete experience at "${exp.company}"?`)) {
                            const newExp = data.experiences.filter((_, idx) => idx !== i);
                            const updated = { ...data, experiences: newExp };
                            setData(updated);
                            handleSaveData(updated);
                          }
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800/80">
                    <p className="text-xs font-semibold text-gray-300 mb-1.5">Key Points:</p>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>

                  {exp.techIcons && exp.techIcons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/80">
                      {exp.techIcons.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-800 bg-gray-950/60"
                          style={{ color: tech.color }}
                        >
                          <DynamicIcon name={tech.iconType || tech.label} />
                          {tech.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CERTIFICATES TAB ── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-900/40 p-4 border border-gray-800 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">Certifications ({data.certificates.length})</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage certificates, upload images, and update issuers.</p>
              </div>
              <button
                onClick={() => {
                  setEditingCertIndex(null);
                  setCertForm({
                    title: "",
                    issuer: "Coursera",
                    src: "/certificates/Flutter.png",
                  });
                  setShowCertModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition"
              >
                <IoAddOutline size={18} /> Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.certificates.map((cert, i) => (
                <div
                  key={i}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3 flex flex-col justify-between group hover:border-gray-700 transition"
                >
                  <div className="relative aspect-[4/3] bg-gray-950 rounded-xl overflow-hidden mb-2.5">
                    <Image src={cert.src} alt={cert.title} fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{cert.title}</h4>
                    <p className="text-[11px] text-blue-400 truncate mt-0.5">{cert.issuer}</p>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-800/80">
                      <button
                        onClick={() => {
                          setEditingCertIndex(i);
                          setCertForm(cert);
                          setShowCertModal(true);
                        }}
                        className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-[11px] font-semibold text-white rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete certificate "${cert.title}"?`)) {
                            const newCerts = data.certificates.filter((_, idx) => idx !== i);
                            const updated = { ...data, certificates: newCerts };
                            setData(updated);
                            handleSaveData(updated);
                          }
                        }}
                        className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── PROJECT ADD/EDIT MODAL ── */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white">
              {editingProjectIndex !== null ? "Edit Project" : "Add New Project"}
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. AI Content Generator"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Tag (Technology)
                </label>
                <input
                  type="text"
                  value={projectForm.tag}
                  onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                  placeholder="e.g. Next.js · AI"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Tag Color Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={projectForm.tagColor.startsWith("#") && projectForm.tagColor.length === 7 ? projectForm.tagColor : "#3B82F6"}
                    onChange={(e) => setProjectForm({ ...projectForm, tagColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={projectForm.tagColor}
                    onChange={(e) => setProjectForm({ ...projectForm, tagColor: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1 px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Description / Main Story
              </label>
              <textarea
                rows={3}
                value={projectForm.main}
                onChange={(e) => setProjectForm({ ...projectForm, main: e.target.value })}
                placeholder="Describe features, purpose, technologies..."
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            {/* Project Image Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Project Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs"
                />
                <label className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition">
                  <IoCloudUploadOutline size={16} />
                  {uploadingImage ? "Uploading..." : "Upload File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onProjectImageChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Demo / Code URL
                </label>
                <input
                  type="text"
                  value={projectForm.demo || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value || null })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Link Label
                </label>
                <input
                  type="text"
                  value={projectForm.demoLabel || ""}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, demoLabel: e.target.value || "GitHub" })
                  }
                  placeholder="GitHub or Live Demo"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProjectModal}
                disabled={!projectForm.title}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILL ADD/EDIT MODAL ── */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingSkillIndex !== null ? "Edit Skill" : "Add New Skill"}
              </h2>
              <div className="w-10 h-10 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-2xl" style={{ color: skillForm.color }}>
                <DynamicIcon name={skillForm.iconType || skillForm.name} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g. Next.js, Docker, TypeScript, React"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Icon Name or Component
              </label>
              <input
                type="text"
                value={skillForm.iconType}
                onChange={(e) => setSkillForm({ ...skillForm, iconType: e.target.value })}
                placeholder="e.g. <FaHtml5 />, SiNextdotjs, FaDocker, SiTailwindcss, FaJava"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Tip: You can type either component syntax like <code className="text-blue-400">&lt;FaHtml5 /&gt;</code>, react-icon names like <code className="text-blue-400">SiDocker</code>, or shorthand presets.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Brand / Glow Color Hex
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={skillForm.color.startsWith("#") && skillForm.color.length === 7 ? skillForm.color : "#3B82F6"}
                  onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={skillForm.color}
                  onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1 px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowSkillModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkillModal}
                disabled={!skillForm.name}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDUCATION ADD/EDIT MODAL ── */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingEduIndex !== null ? "Edit Education" : "Add New Education"}
              </h2>
              <div className="text-3xl" style={{ color: eduForm.iconColor }}>
                <DynamicIcon name={eduForm.iconType || "FaGraduationCap"} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Institution / School Name
              </label>
              <input
                type="text"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                placeholder="e.g. Mount Zion College of Engineering"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Time Period (Years)
                </label>
                <input
                  type="text"
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  placeholder="2022 – 2026"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Status
                </label>
                <label className="flex items-center gap-2 h-10 px-3 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eduForm.current}
                    onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Currently Studying here</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Degree / Course Details
              </label>
              <input
                type="text"
                value={eduForm.details}
                onChange={(e) => setEduForm({ ...eduForm, details: e.target.value })}
                placeholder="BE Computer Science And Engineering"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Icon (react-icon name)
                </label>
                <input
                  type="text"
                  value={eduForm.iconType}
                  onChange={(e) => setEduForm({ ...eduForm, iconType: e.target.value })}
                  placeholder="FaGraduationCap or FaSchool"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Icon &amp; Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={eduForm.iconColor.startsWith("#") && eduForm.iconColor.length === 7 ? eduForm.iconColor : "#FBBF24"}
                    onChange={(e) => setEduForm({ ...eduForm, iconColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={eduForm.iconColor}
                    onChange={(e) => setEduForm({ ...eduForm, iconColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowEduModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEduModal}
                disabled={!eduForm.institution}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Education
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICE ADD/EDIT MODAL ── */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingServiceIndex !== null ? "Edit Service" : "Add New Service"}
              </h2>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                style={{ color: serviceForm.accent, borderColor: `${serviceForm.accent}60`, background: `${serviceForm.accent}20` }}
              >
                {serviceForm.tag || "Preview"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Service Title
              </label>
              <input
                type="text"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                placeholder="e.g. Full Stack Developer, AI & Robotics"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Tag / Tech Stack
                </label>
                <input
                  type="text"
                  value={serviceForm.tag}
                  onChange={(e) => setServiceForm({ ...serviceForm, tag: e.target.value })}
                  placeholder="e.g. MERN · Next.js · Flutter"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={serviceForm.accent.startsWith("#") && serviceForm.accent.length === 7 ? serviceForm.accent : "#3B82F6"}
                    onChange={(e) => setServiceForm({ ...serviceForm, accent: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={serviceForm.accent}
                    onChange={(e) => setServiceForm({ ...serviceForm, accent: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Describe what you provide in this service..."
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm resize-none"
              />
            </div>

            {/* Service Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Service Image
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-14 bg-gray-950 rounded-xl overflow-hidden border border-gray-800 flex-shrink-0">
                  <Image src={serviceForm.image} alt="service" fill className="object-cover" />
                </div>
                <input
                  type="text"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  placeholder="/assets/MERN.png or /uploads/..."
                  className="flex-1 px-3.5 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer">
                  <IoCloudUploadOutline size={16} />
                  {uploadingServiceImage ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleServiceImageUpload}
                    className="hidden"
                    disabled={uploadingServiceImage}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveServiceModal}
                disabled={!serviceForm.title}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPERIENCE ADD/EDIT MODAL ── */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingExpIndex !== null ? "Edit Experience" : "Add New Experience"}
              </h2>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{
                  background: `${expForm.accent}20`,
                  border: `1.5px solid ${expForm.accent}50`,
                  color: expForm.accent,
                }}
              >
                {expForm.initials || expForm.company.slice(0, 3).toUpperCase() || "EXP"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. RCK Techiees, Google, Startup"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Job Role / Position
                </label>
                <input
                  type="text"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  placeholder="e.g. Dec 2025 – Present"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={expForm.accent.startsWith("#") && expForm.accent.length === 7 ? expForm.accent : "#3B82F6"}
                    onChange={(e) => setExpForm({ ...expForm, accent: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={expForm.accent}
                    onChange={(e) => setExpForm({ ...expForm, accent: e.target.value })}
                    className="flex-1 px-2.5 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bullets */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Key Contributions / Bullets (One per line)
              </label>
              <textarea
                rows={4}
                value={expBulletsText}
                onChange={(e) => setExpBulletsText(e.target.value)}
                placeholder="Migrated 5+ ticketing systems via REST APIs&#10;Contributed to full-stack development using React and Node.js&#10;Automated migration workflows with high accuracy"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono leading-relaxed"
              />
            </div>

            {/* Technologies used */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Technologies (One per line: <code className="text-blue-400">iconName:color:Label</code> or just <code className="text-blue-400">Label</code>)
              </label>
              <textarea
                rows={3}
                value={expTechText}
                onChange={(e) => setExpTechText(e.target.value)}
                placeholder="react:#61DAFB:React&#10;node:#339933:Node.js&#10;next:#FFFFFF:Next.js"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs font-mono leading-relaxed"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Example: <code className="text-blue-400">react:#61DAFB:React</code> or just <code className="text-blue-400">TypeScript</code>.
              </p>
            </div>

            {/* Certificate attached */}
            <div className="bg-gray-950/60 p-4 border border-gray-800 rounded-2xl space-y-3">
              <label className="block text-xs font-semibold uppercase text-gray-300">
                Optional Certificate / Proof
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={expForm.cert?.title || ""}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      cert: { ...expForm.cert, title: e.target.value },
                    })
                  }
                  placeholder="Certificate Title (e.g. Internship Certificate)"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={expForm.cert?.image || ""}
                    onChange={(e) =>
                      setExpForm({
                        ...expForm,
                        cert: {
                          image: e.target.value,
                          title: expForm.cert?.title || `${expForm.company || "Experience"} Certificate`,
                        },
                      })
                    }
                    placeholder="/certificates/internship.png or /uploads/..."
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-xs"
                  />
                  <label className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl cursor-pointer">
                    <IoCloudUploadOutline size={16} />
                    {uploadingExpCert ? "..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleExpCertUpload}
                      className="hidden"
                      disabled={uploadingExpCert}
                    />
                  </label>
                </div>
              </div>

              {/* Certificate Preview if image exists */}
              {expForm.cert?.image && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
                  <div className="relative w-16 h-12 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                    <Image
                      src={expForm.cert.image}
                      alt="Certificate Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {expForm.cert.title || "Attached Certificate"}
                    </p>
                    <p className="text-[10px] text-emerald-400 truncate">
                      {expForm.cert.image}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpForm({
                        ...expForm,
                        cert: { image: "", title: "" },
                      })
                    }
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 rounded-lg cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowExpModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpModal}
                disabled={!expForm.company || !expForm.role}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE ADD/EDIT MODAL ── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {editingCertIndex !== null ? "Edit Certificate" : "Add New Certificate"}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                placeholder="e.g. Flutter Development, AWS Certified Cloud Practitioner"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Issuer / Platform
              </label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                placeholder="e.g. Google, Meta, Coursera, DeepLearning.AI, MongoDB"
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                Certificate Image
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-14 bg-gray-950 rounded-xl overflow-hidden border border-gray-800 flex-shrink-0">
                  <Image src={certForm.src} alt="cert" fill className="object-contain" />
                </div>
                <input
                  type="text"
                  value={certForm.src}
                  onChange={(e) => setCertForm({ ...certForm, src: e.target.value })}
                  placeholder="/certificates/Flutter.png or /uploads/..."
                  className="flex-1 px-3.5 py-2 bg-gray-950 border border-gray-700 rounded-xl text-white text-xs"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer">
                  <IoCloudUploadOutline size={16} />
                  {uploadingCertImage ? "..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCertImageUpload}
                    className="hidden"
                    disabled={uploadingCertImage}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertModal}
                disabled={!certForm.title || !certForm.src}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

