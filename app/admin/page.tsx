
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
  IoLayersOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoSparklesOutline,
  IoCreateOutline,
  IoCheckmarkOutline,
  IoLockClosedOutline,
  IoCloseOutline,
  IoHelpCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import {
  PortfolioData,
  ProjectItem,
  SkillItem,
  EducationItem,
  ServiceItem,
  ExperienceItem,
  CertificateItem,
  SectionSettings,
  CustomSection,
  CustomComponentItem,
  DEFAULT_SECTIONS_CONFIG,
} from "@/lib/portfolio-types";
import ThemeToggle from "@/components/ThemeToggle";
import DynamicIcon from "@/components/DynamicIcon";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "components" | "projects" | "resume" | "about" | "skills" | "services" | "experiences" | "certificates"
  >("components");

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectItem>({
    title: "",
    emoji: "🚀",
    tag: "Full Stack",
    tagColor: "#3B82F6",
    main: "",
    fullDescription: "",
    image: "/assets/ecomimg.png",
    demo: "",
    demoLabel: "GitHub",
    github: "",
    secondaryLink: "",
    secondaryLinkLabel: "Live Demo",
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

  // Custom Section Modal State
  const [showCustomSecModal, setShowCustomSecModal] = useState(false);
  const [editingCustomSecIndex, setEditingCustomSecIndex] = useState<number | null>(null);
  const [customSecForm, setCustomSecForm] = useState<CustomSection>({
    id: "",
    title: "",
    subtitle: "",
    navLabel: "",
    enabled: true,
    order: 8,
    layout: "cards-grid",
    items: [],
  });

  // Custom Item Modal State
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [currentSecIndexForItems, setCurrentSecIndexForItems] = useState<number | null>(null);
  const [editingCustomItemIndex, setEditingCustomItemIndex] = useState<number | null>(null);
  const [customItemForm, setCustomItemForm] = useState<CustomComponentItem>({
    id: "",
    title: "",
    description: "",
    image: "",
    tag: "",
    tagColor: "#3B82F6",
    link: "",
    linkLabel: "View Demo",
    secondaryLink: "",
    secondaryLinkLabel: "GitHub",
  });
  const [uploadingCustomItemImage, setUploadingCustomItemImage] = useState(false);

  // Edit Mode States for Hero & Resume and About Me tabs
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  // Custom UI Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirmation = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      ...options,
    });
  };

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
    const targetInput = e.target;
    requestConfirmation({
      title: "Upload Resume PDF",
      message: `Are you sure you want to upload "${file.name}" as your new Resume PDF?`,
      confirmText: "Upload & Save",
      onConfirm: async () => {
        setUploadingResume(true);
        try {
          const url = await handleFileUpload(file, "resume");
          const updated: PortfolioData = {
            ...data,
            hero: { ...data.hero, resumeUrl: url },
          };
          setData(updated);
          await handleSaveData(updated);
          alert("Resume uploaded and saved successfully!");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Resume upload failed";
          alert(msg);
        } finally {
          setUploadingResume(false);
        }
      },
    });
    targetInput.value = "";
  };

  // Hero Image upload handler
  const onHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    const targetInput = e.target;
    requestConfirmation({
      title: "Upload Hero Picture",
      message: `Are you sure you want to upload "${file.name}" as your new Hero profile picture?`,
      confirmText: "Upload & Save",
      onConfirm: async () => {
        setUploadingHeroImage(true);
        try {
          const url = await handleFileUpload(file, "hero");
          const updated: PortfolioData = {
            ...data,
            hero: { ...data.hero, profileImage: url },
          };
          setData(updated);
          await handleSaveData(updated);
          alert("Hero profile image updated and saved successfully!");
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Hero image upload failed";
          alert(msg);
        } finally {
          setUploadingHeroImage(false);
        }
      },
    });
    targetInput.value = "";
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
    requestConfirmation({
      title: editingProjectIndex !== null ? "Update Project" : "Add Project",
      message: `Are you sure you want to save "${projectForm.title || "this project"}"?`,
      confirmText: "Save Project",
      onConfirm: () => {
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
      },
    });
  };

  // Save Skill from modal
  const handleSaveSkillModal = () => {
    if (!data) return;
    requestConfirmation({
      title: editingSkillIndex !== null ? "Update Skill" : "Add Skill",
      message: `Are you sure you want to save "${skillForm.name || "this skill"}"?`,
      confirmText: "Save Skill",
      onConfirm: () => {
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
      },
    });
  };

  // Save Education from modal
  const handleSaveEduModal = () => {
    if (!data) return;
    requestConfirmation({
      title: editingEduIndex !== null ? "Update Education" : "Add Education",
      message: `Are you sure you want to save education at "${eduForm.institution || "this institution"}"?`,
      confirmText: "Save Education",
      onConfirm: () => {
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
      },
    });
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
    requestConfirmation({
      title: editingServiceIndex !== null ? "Update Service" : "Add Service",
      message: `Are you sure you want to save "${serviceForm.title || "this service"}"?`,
      confirmText: "Save Service",
      onConfirm: () => {
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
      },
    });
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
    requestConfirmation({
      title: editingExpIndex !== null ? "Update Experience" : "Add Experience",
      message: `Are you sure you want to save experience at "${expForm.company || "this company"}"?`,
      confirmText: "Save Experience",
      onConfirm: () => {
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
      },
    });
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
    requestConfirmation({
      title: editingCertIndex !== null ? "Update Certificate" : "Add Certificate",
      message: `Are you sure you want to save "${certForm.title || "this certificate"}"?`,
      confirmText: "Save Certificate",
      onConfirm: () => {
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
      },
    });
  };

  // Delete Project
  const handleDeleteProject = (idx: number) => {
    if (!data) return;
    const target = data.projects[idx];
    requestConfirmation({
      title: "Delete Project",
      message: `Are you sure you want to delete "${target ? target.title : "this project"}"?`,
      confirmText: "Delete Project",
      isDanger: true,
      onConfirm: () => {
        const updatedProjects = data.projects.filter((_, i) => i !== idx);
        const updated = { ...data, projects: updatedProjects };
        setData(updated);
        handleSaveData(updated);
      },
    });
  };

  // ── SECTION VISIBILITY & ORDERING HANDLERS ──
  const handleToggleSection = (id: string) => {
    if (!data) return;
    const currentSections = data.sectionsConfig ? [...data.sectionsConfig] : [...DEFAULT_SECTIONS_CONFIG];
    const target = currentSections.find((s) => s.id === id);
    if (target) {
      target.enabled = !target.enabled;
    } else {
      // If it's a custom section, toggle in customSections too
      const customSec = (data.customSections || []).find((c) => c.id === id);
      if (customSec) {
        customSec.enabled = !customSec.enabled;
        currentSections.push({
          id: customSec.id,
          name: customSec.title,
          navLabel: customSec.navLabel,
          enabled: customSec.enabled,
          order: customSec.order,
          isCustom: true,
        });
      }
    }
    const updated = { ...data, sectionsConfig: currentSections };
    setData(updated);
    handleSaveData(updated);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const currentSections = data.sectionsConfig ? [...data.sectionsConfig] : [...DEFAULT_SECTIONS_CONFIG];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSections.length) return;

    const temp = currentSections[index];
    currentSections[index] = currentSections[targetIdx];
    currentSections[targetIdx] = temp;

    // re-assign sequential orders
    currentSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });

    const updated = { ...data, sectionsConfig: currentSections };
    setData(updated);
    handleSaveData(updated);
  };

  // ── CUSTOM SECTIONS HANDLERS ──
  const handleSaveCustomSecModal = () => {
    if (!data || !customSecForm.title) return;
    requestConfirmation({
      title: editingCustomSecIndex !== null ? "Update Custom Section" : "Create Custom Section",
      message: `Are you sure you want to save the "${customSecForm.title}" section?`,
      confirmText: "Save Section",
      onConfirm: () => {
        const customList = data.customSections ? [...data.customSections] : [];
        const sectionsConfig = data.sectionsConfig ? [...data.sectionsConfig] : [...DEFAULT_SECTIONS_CONFIG];

        const slug =
          customSecForm.id.trim() ||
          customSecForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const formToSave = {
          ...customSecForm,
          id: slug,
          navLabel: customSecForm.navLabel || customSecForm.title,
        };

        if (editingCustomSecIndex !== null) {
          customList[editingCustomSecIndex] = formToSave;
          // Also update name in sectionsConfig
          const cfgIndex = sectionsConfig.findIndex((s) => s.id === formToSave.id);
          if (cfgIndex !== -1) {
            sectionsConfig[cfgIndex].name = formToSave.title;
            sectionsConfig[cfgIndex].navLabel = formToSave.navLabel;
          }
        } else {
          customList.push(formToSave);
          sectionsConfig.push({
            id: slug,
            name: formToSave.title,
            navLabel: formToSave.navLabel,
            enabled: true,
            order: sectionsConfig.length + 1,
            isCustom: true,
          });
        }

        const updated = { ...data, customSections: customList, sectionsConfig };
        setData(updated);
        handleSaveData(updated);
        setShowCustomSecModal(false);
        setEditingCustomSecIndex(null);
      },
    });
  };

  const handleDeleteCustomSec = (idx: number) => {
    if (!data) return;
    const target = (data.customSections || [])[idx];
    if (!target) return;
    requestConfirmation({
      title: "Delete Custom Section",
      message: `Are you sure you want to delete custom section "${target.title}" and all its contents?`,
      confirmText: "Delete Section",
      isDanger: true,
      onConfirm: () => {
        const customList = (data.customSections || []).filter((_, i) => i !== idx);
        const sectionsConfig = (data.sectionsConfig || []).filter((s) => s.id !== target.id);

        const updated = { ...data, customSections: customList, sectionsConfig };
        setData(updated);
        handleSaveData(updated);
      },
    });
  };

  // ── CUSTOM SECTION ITEMS HANDLERS ──
  const handleCustomItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCustomItemImage(true);
    try {
      const url = await handleFileUpload(file, "custom");
      setCustomItemForm((prev) => ({ ...prev, image: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Item image upload failed";
      alert(msg);
    } finally {
      setUploadingCustomItemImage(false);
    }
  };

  const handleSaveCustomItemModal = () => {
    if (!data || currentSecIndexForItems === null || !customItemForm.title) return;
    requestConfirmation({
      title: editingCustomItemIndex !== null ? "Update Item" : "Add Item",
      message: `Are you sure you want to save "${customItemForm.title}"?`,
      confirmText: "Save Item",
      onConfirm: () => {
        const customList = [...(data.customSections || [])];
        const targetSection = { ...customList[currentSecIndexForItems] };
        const items = [...(targetSection.items || [])];

        const itemToSave = {
          ...customItemForm,
          id: customItemForm.id || `item-${Date.now()}`,
        };

        if (editingCustomItemIndex !== null) {
          items[editingCustomItemIndex] = itemToSave;
        } else {
          items.push(itemToSave);
        }

        targetSection.items = items;
        customList[currentSecIndexForItems] = targetSection;

        const updated = { ...data, customSections: customList };
        setData(updated);
        handleSaveData(updated);
        setShowCustomItemModal(false);
        setEditingCustomItemIndex(null);
      },
    });
  };

  const handleDeleteCustomItem = (secIdx: number, itemIdx: number) => {
    if (!data) return;
    const targetSection = (data.customSections || [])[secIdx];
    const targetItem = targetSection?.items?.[itemIdx];
    requestConfirmation({
      title: "Delete Item",
      message: `Are you sure you want to delete "${targetItem ? targetItem.title : "this item"}"?`,
      confirmText: "Delete Item",
      isDanger: true,
      onConfirm: () => {
        const customList = [...(data.customSections || [])];
        const section = { ...customList[secIdx] };
        section.items = (section.items || []).filter((_, i) => i !== itemIdx);
        customList[secIdx] = section;

        const updated = { ...data, customSections: customList };
        setData(updated);
        handleSaveData(updated);
      },
    });
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
    <div className="min-h-screen admin-shell bg-[#0a0e17] text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-64 admin-sidebar bg-[#0e1422] border-r border-slate-800/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between gap-3 mb-6 px-2 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                JA
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Jaasir Ahamed</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-slate-400 font-medium">Portfolio Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="mb-2 px-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Navigation
          </div>
          <nav className="space-y-1">
            {[
              { id: "components", label: "Components & Sections", icon: <IoLayersOutline size={17} /> },
              { id: "projects", label: "Projects", icon: <IoFolderOutline size={17} /> },
              { id: "resume", label: "Hero & Resume", icon: <IoDocumentTextOutline size={17} /> },
              { id: "about", label: "About Me", icon: <IoPersonOutline size={17} /> },
              { id: "skills", label: "Skills & Education", icon: <IoSchoolOutline size={17} /> },
              { id: "services", label: "Services", icon: <IoConstructOutline size={17} /> },
              { id: "experiences", label: "Experience", icon: <IoBriefcaseOutline size={17} /> },
              { id: "certificates", label: "Certificates", icon: <IoRibbonOutline size={17} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 !text-white shadow-sm font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <span className={isActive ? "!text-white" : "text-slate-400"}>
                    {tab.icon}
                  </span>
                  <span className={isActive ? "!text-white" : ""}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
          >
            <IoOpenOutline size={15} className="text-slate-400" />
            <span>Open Website</span>
          </a>
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition cursor-pointer"
          >
            <IoDownloadOutline size={15} className="text-slate-400" />
            <span>Export Backup</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <IoLogOutOutline size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Admin</span>
              <span>/</span>
              <span className="text-indigo-500 font-semibold capitalize">{activeTab}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              {activeTab === "components"
                ? "Sections & Components"
                : activeTab === "resume"
                ? "Hero & Resume"
                : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {saveStatus && (
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                  saveStatus.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}
              >
                {saveStatus.msg}
              </span>
            )}

            <button
              onClick={() => {
                requestConfirmation({
                  title: "Save All Changes",
                  message: "Are you sure you want to save and update all portfolio changes?",
                  confirmText: "Save Changes",
                  onConfirm: () => handleSaveData(),
                });
              }}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 !text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <IoSaveOutline size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </header>

        {/* ── COMPONENTS & SECTIONS TAB ── */}
        {activeTab === "components" && (
          <div className="space-y-8">
            {/* Standard Components Visibility & Ordering */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <IoLayersOutline className="text-indigo-400" size={18} />
                    Section Visibility &amp; Ordering
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle sections on/off or reorder how they appear to visitors.
                  </p>
                </div>
                <button
                  onClick={() => {
                    requestConfirmation({
                      title: "Reset Section Orders",
                      message: "Are you sure you want to reset all section orders and visibility to default?",
                      confirmText: "Reset Defaults",
                      isDanger: true,
                      onConfirm: () => {
                        const defaultOrder = [...DEFAULT_SECTIONS_CONFIG];
                        const updated = { ...data, sectionsConfig: defaultOrder };
                        setData(updated);
                        handleSaveData(updated);
                      },
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 cursor-pointer transition"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-2">
                {(data.sectionsConfig || DEFAULT_SECTIONS_CONFIG).map((section, idx) => (
                  <div
                    key={section.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      section.enabled
                        ? "bg-[#111827] border-slate-800/90 hover:border-slate-700"
                        : "bg-[#0b0f19] border-dashed border-slate-800/60 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xs font-semibold text-slate-300">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">
                            {section.name}
                          </h4>
                          {section.id === "leetcode" && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Coding Profile
                            </span>
                          )}
                          {section.isCustom && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Custom Section
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          #{section.navLabel || section.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveSection(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Move Up"
                      >
                        <IoArrowUpOutline size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, "down")}
                        disabled={idx === (data.sectionsConfig || DEFAULT_SECTIONS_CONFIG).length - 1}
                        className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Move Down"
                      >
                        <IoArrowDownOutline size={14} />
                      </button>

                      <button
                        onClick={() => handleToggleSection(section.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                          section.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {section.enabled ? (
                          <>
                            <IoEyeOutline size={14} />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <IoEyeOffOutline size={14} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Sections Builder */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <IoSparklesOutline className="text-indigo-400" size={18} />
                    Custom Sections &amp; Components
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define custom sections (e.g. Freelance Projects, Client Reviews, Awards) with your choice of 4 layout templates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCustomSecIndex(null);
                    setCustomSecForm({
                      id: "",
                      title: "",
                      subtitle: "",
                      navLabel: "",
                      enabled: true,
                      order: (data.sectionsConfig?.length || 7) + 1,
                      layout: "cards-grid",
                      items: [],
                    });
                    setShowCustomSecModal(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
                >
                  <IoAddOutline size={16} />
                  New Custom Section
                </button>
              </div>

              {(!data.customSections || data.customSections.length === 0) ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                  <IoSparklesOutline size={28} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">No custom sections created yet</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click &quot;New Custom Section&quot; to add sections like &quot;Freelance Projects&quot; or &quot;Client Reviews&quot;.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.customSections.map((sec, secIdx) => (
                    <div
                      key={sec.id || secIdx}
                      className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                sec.enabled
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {sec.enabled ? "Active" : "Hidden"}
                            </span>
                            <span className="text-[11px] text-indigo-400 font-mono">
                              #{sec.id}
                            </span>
                            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 font-mono capitalize">
                              {sec.layout || "cards-grid"}
                            </span>
                          </div>
                          {sec.subtitle && (
                            <p className="text-xs text-slate-400 mt-1">{sec.subtitle}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentSecIndexForItems(secIdx);
                              setEditingCustomItemIndex(null);
                              setCustomItemForm({
                                id: "",
                                title: "",
                                description: "",
                                image: "",
                                tag: "",
                                tagColor: "#3B82F6",
                                link: "",
                                linkLabel: "View Demo",
                                secondaryLink: "",
                                secondaryLinkLabel: "GitHub",
                              });
                              setShowCustomItemModal(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
                          >
                            <IoAddOutline size={15} />
                            Add Item
                          </button>

                          <button
                            onClick={() => {
                              setEditingCustomSecIndex(secIdx);
                              setCustomSecForm(sec);
                              setShowCustomSecModal(true);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700/70 cursor-pointer transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteCustomSec(secIdx)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition cursor-pointer border border-red-500/20"
                            title="Delete Section"
                          >
                            <IoTrashOutline size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Items list inside this custom section */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Section Items ({sec.items?.length || 0})
                        </div>

                        {(!sec.items || sec.items.length === 0) ? (
                          <div className="p-4 rounded-lg border border-dashed border-slate-800 text-center text-xs text-slate-500">
                            No items added yet. Click &quot;Add Item&quot; to add cards to this section.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sec.items.map((item, itemIdx) => (
                              <div
                                key={item.id || itemIdx}
                                className="bg-[#0e1422] border border-slate-800/90 rounded-lg p-3.5 flex flex-col justify-between"
                              >
                                <div>
                                  {item.image && (
                                    <div className="relative h-28 w-full bg-[#0a0e17] rounded-md overflow-hidden mb-2.5 border border-slate-800/60">
                                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="text-xs font-bold text-white truncate">
                                      {item.title}
                                    </h5>
                                    {item.tag && (
                                      <span
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded border flex-shrink-0"
                                        style={{
                                          color: item.tagColor || "#3B82F6",
                                          borderColor: `${item.tagColor || "#3B82F6"}40`,
                                        }}
                                      >
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="flex justify-end items-center gap-1.5 pt-3 border-t border-slate-800/80 mt-3">
                                  <button
                                    onClick={() => {
                                      setCurrentSecIndexForItems(secIdx);
                                      setEditingCustomItemIndex(itemIdx);
                                      setCustomItemForm(item);
                                      setShowCustomItemModal(true);
                                    }}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-md cursor-pointer transition border border-slate-700/60"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomItem(secIdx, itemIdx)}
                                    className="p-1 text-red-400 hover:bg-red-500/10 rounded-md cursor-pointer transition"
                                  >
                                    <IoTrashOutline size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e1422] p-4 sm:p-5 border border-slate-800/80 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <IoFolderOutline className="text-indigo-400" size={17} />
                  Projects Showcase ({data.projects.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Portfolio projects with live demo links, repository tags, and previews.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProjectIndex(null);
                  setProjectForm({
                    title: "",
                    emoji: "🚀",
                    tag: "Full Stack",
                    tagColor: "#3B82F6",
                    main: "",
                    fullDescription: "",
                    image: "/assets/ecomimg.png",
                    demo: "",
                    demoLabel: "GitHub",
                    github: "",
                    secondaryLink: "",
                    secondaryLinkLabel: "Live Demo",
                  });
                  setShowProjectModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                <IoAddOutline size={16} />
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e1422] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-slate-700/80 transition"
                >
                  <div className="relative h-44 w-full bg-[#0a0e17] border-b border-slate-800/70">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span
                      className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded border backdrop-blur-sm shadow-sm"
                      style={{ color: proj.tagColor, borderColor: `${proj.tagColor}55`, background: `${proj.tagColor}15` }}
                    >
                      {proj.tag}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1.5">{proj.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {proj.main}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-indigo-400 truncate max-w-[140px] font-mono">
                        {proj.demo ? proj.demoLabel : "No link"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProjectIndex(idx);
                            setProjectForm(proj);
                            setShowProjectModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-md transition cursor-pointer border border-slate-700/60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition cursor-pointer border border-red-500/20"
                          title="Delete Project"
                        >
                          <IoTrashOutline size={15} />
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
          <div className="max-w-3xl space-y-6">
            {/* Edit Mode Toggle Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0e1422] p-4 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                {isEditingHero ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ) : (
                  <IoLockClosedOutline className="text-slate-400" size={17} />
                )}
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {isEditingHero ? "Editing Enabled" : "Fields Locked (View Mode)"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEditingHero
                      ? "You can now edit all hero and resume details below."
                      : "Click 'Edit Hero & Resume' to modify texts, upload new files, or replace photo."}
                  </p>
                </div>
              </div>

              {isEditingHero ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingHero(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 cursor-pointer transition"
                  >
                    <IoLockClosedOutline size={14} />
                    Done Editing
                  </button>
                  <button
                    onClick={() => {
                      requestConfirmation({
                        title: "Save Hero & Resume",
                        message: "Are you sure you want to save these Hero & Resume changes?",
                        confirmText: "Save Changes",
                        onConfirm: () => {
                          handleSaveData();
                          setIsEditingHero(false);
                        },
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 !text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                  >
                    <IoSaveOutline size={14} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingHero(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 !text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                >
                  <IoCreateOutline size={15} />
                  Edit Hero &amp; Resume
                </button>
              )}
            </div>

            {/* Resume Upload Card */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <IoDocumentTextOutline className="text-indigo-400" size={17} />
                Resume Document (PDF)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Upload your updated CV. When visitors click &quot;Download CV&quot;, this file will be delivered.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 border border-slate-800 rounded-lg bg-[#0a0e17]">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Path</span>
                  <p className="text-xs text-indigo-400 font-mono truncate mt-0.5">{data.hero.resumeUrl}</p>
                </div>

                <label
                  className={`flex items-center gap-2 px-3.5 py-2 text-white text-xs font-semibold rounded-lg shadow-sm transition ${
                    isEditingHero
                      ? "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
                      : "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50"
                  }`}
                  onClick={(e) => {
                    if (!isEditingHero) {
                      e.preventDefault();
                      alert("Please click 'Edit Hero & Resume' first to unlock uploading.");
                    }
                  }}
                >
                  <IoCloudUploadOutline size={16} />
                  {uploadingResume ? "Uploading PDF..." : "Upload New PDF"}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={onResumeFileChange}
                    className="hidden"
                    disabled={!isEditingHero || uploadingResume}
                  />
                </label>
              </div>
            </div>

            {/* Hero Profile Image Card */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <IoPersonOutline className="text-indigo-400" size={17} />
                Hero Portrait
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Main photo displayed on the right of the Hero banner.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 p-3.5 border border-slate-800 rounded-lg bg-[#0a0e17]">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#0e1422] border border-slate-800 flex-shrink-0">
                  <Image
                    src={data.hero.profileImage || "/assets/my_image.png"}
                    alt="Hero Preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 w-full space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Image URL or Path</label>
                    <input
                      type="text"
                      disabled={!isEditingHero}
                      value={data.hero.profileImage}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, profileImage: e.target.value } })
                      }
                      placeholder="/assets/my_image.png"
                      className="w-full px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs mt-1 font-mono focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <label
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      isEditingHero
                        ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700/60 cursor-pointer"
                        : "bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed opacity-50"
                    }`}
                    onClick={(e) => {
                      if (!isEditingHero) {
                        e.preventDefault();
                        alert("Please click 'Edit Hero & Resume' first to unlock uploading.");
                      }
                    }}
                  >
                    <IoCloudUploadOutline size={15} />
                    {uploadingHeroImage ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onHeroImageChange}
                      className="hidden"
                      disabled={!isEditingHero || uploadingHeroImage}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Hero Information */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <IoDocumentTextOutline className="text-indigo-400" size={17} />
                Hero Section Copy
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Greeting Line
                </label>
                <input
                  type="text"
                  disabled={!isEditingHero}
                  value={data.hero.greeting}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, greeting: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditingHero}
                  value={data.hero.name}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, name: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rotating Typed Roles (comma-separated)
                </label>
                <input
                  type="text"
                  disabled={!isEditingHero}
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
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Short Introduction
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditingHero}
                  value={data.hero.bio}
                  onChange={(e) =>
                    setData({ ...data, hero: { ...data.hero, bio: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── ABOUT ME TAB ── */}
        {activeTab === "about" && (
          <div className="max-w-3xl space-y-6">
            {/* Edit Mode Toggle Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0e1422] p-4 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                {isEditingAbout ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ) : (
                  <IoLockClosedOutline className="text-slate-400" size={17} />
                )}
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {isEditingAbout ? "Editing Enabled" : "Fields Locked (View Mode)"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isEditingAbout
                      ? "You can now edit biography, key metrics, and contact info."
                      : "Click 'Edit About Me' to modify bio, stats, and contact details."}
                  </p>
                </div>
              </div>

              {isEditingAbout ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingAbout(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 cursor-pointer transition"
                  >
                    <IoLockClosedOutline size={14} />
                    Done Editing
                  </button>
                  <button
                    onClick={() => {
                      requestConfirmation({
                        title: "Save About Me",
                        message: "Are you sure you want to save these About Me changes?",
                        confirmText: "Save Changes",
                        onConfirm: () => {
                          handleSaveData();
                          setIsEditingAbout(false);
                        },
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 !text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                  >
                    <IoSaveOutline size={14} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingAbout(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 !text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                >
                  <IoCreateOutline size={15} />
                  Edit About Me
                </button>
              )}
            </div>

            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <IoPersonOutline className="text-indigo-400" size={17} />
                  About Overview
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Narrative bio paragraphs and highlight statistics.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Badge / Subtitle
                </label>
                <input
                  type="text"
                  disabled={!isEditingAbout}
                  value={data.about.roleBadge}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, roleBadge: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bio Paragraph 1
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditingAbout}
                  value={data.about.bio1}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, bio1: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bio Paragraph 2
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditingAbout}
                  value={data.about.bio2}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, bio2: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs leading-relaxed focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Stats */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Key Metrics &amp; Experience Stats
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.about.stats.map((stat, i) => (
                    <div key={i} className="p-3 bg-[#111827] border border-slate-800 rounded-lg">
                      <input
                        type="text"
                        disabled={!isEditingAbout}
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...data.about.stats];
                          updated[i].value = e.target.value;
                          setData({ ...data, about: { ...data.about, stats: updated } });
                        }}
                        placeholder="Value (e.g. 2+)"
                        className="w-full mb-1 text-sm font-bold text-white bg-transparent border-b border-slate-700 pb-0.5 focus:outline-none focus:border-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <input
                        type="text"
                        disabled={!isEditingAbout}
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...data.about.stats];
                          updated[i].label = e.target.value;
                          setData({ ...data, about: { ...data.about, stats: updated } });
                        }}
                        placeholder="Label (e.g. Years)"
                        className="w-full text-xs text-slate-400 bg-transparent focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact &amp; Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Email Address</label>
                    <input
                      type="text"
                      disabled={!isEditingAbout}
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
                      className="w-full px-3 py-1.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs mt-1 focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Phone Number</label>
                    <input
                      type="text"
                      disabled={!isEditingAbout}
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
                      className="w-full px-3 py-1.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs mt-1 focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">GitHub URL</label>
                    <input
                      type="text"
                      disabled={!isEditingAbout}
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
                      className="w-full px-3 py-1.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs mt-1 font-mono focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">LinkedIn URL</label>
                    <input
                      type="text"
                      disabled={!isEditingAbout}
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
                      className="w-full px-3 py-1.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs mt-1 font-mono focus:border-indigo-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS & EDUCATION TAB ── */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <IoSchoolOutline className="text-indigo-400" size={17} />
                    Technical Skills ({data.skills.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Brand icons and accent color highlights for technical proficiencies.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkillIndex(null);
                    setSkillForm({ name: "", color: "#3B82F6", iconType: "FaReact" });
                    setShowSkillModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                >
                  <IoAddOutline size={16} /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {data.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#111827] border border-slate-800 rounded-lg flex flex-col justify-between group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl" style={{ color: skill.color }}>
                        <DynamicIcon name={skill.iconType || skill.name} />
                      </div>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingSkillIndex(i);
                            setSkillForm(skill);
                            setShowSkillModal(true);
                          }}
                          className="text-xs text-slate-400 hover:text-white p-1 cursor-pointer"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            requestConfirmation({
                              title: "Delete Skill",
                              message: `Are you sure you want to delete skill "${skill.name}"?`,
                              confirmText: "Delete Skill",
                              isDanger: true,
                              onConfirm: () => {
                                const newSkills = data.skills.filter((_, idx) => idx !== i);
                                const updated = { ...data, skills: newSkills };
                                setData(updated);
                                handleSaveData(updated);
                              },
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate">{skill.name}</p>
                      <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{skill.iconType || "default"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <IoSchoolOutline className="text-indigo-400" size={17} />
                    Education Timeline ({data.education.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Academic qualifications, institutions, and timelines.</p>
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
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
                >
                  <IoAddOutline size={16} /> Add Education
                </button>
              </div>

              <div className="space-y-2.5">
                {data.education.map((edu, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-[#111827] border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-2xl flex-shrink-0" style={{ color: edu.iconColor }}>
                        <DynamicIcon name={edu.iconType || "FaGraduationCap"} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{edu.institution}</h4>
                          {edu.current && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-indigo-400 mt-0.5 font-mono">{edu.period} &bull; <span className="text-slate-400 font-sans">{edu.details}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingEduIndex(i);
                          setEduForm(edu);
                          setShowEduModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-md transition cursor-pointer border border-slate-700/60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          requestConfirmation({
                            title: "Delete Education",
                            message: `Are you sure you want to delete education at "${edu.institution}"?`,
                            confirmText: "Delete Education",
                            isDanger: true,
                            onConfirm: () => {
                              const newEdu = data.education.filter((_, idx) => idx !== i);
                              const updated = { ...data, education: newEdu };
                              setData(updated);
                              handleSaveData(updated);
                            },
                          });
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition cursor-pointer border border-red-500/20"
                        title="Delete"
                      >
                        <IoTrashOutline size={15} />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0e1422] p-4 sm:p-5 border border-slate-800/80 rounded-xl">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <IoConstructOutline className="text-indigo-400" size={17} />
                  Services Offered ({data.services.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Core service offerings, descriptions, and cover graphics.</p>
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
              >
                <IoAddOutline size={16} /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.services.map((svc, i) => (
                <div
                  key={i}
                  className="bg-[#0e1422] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:border-slate-700/80 transition"
                >
                  <div className="relative h-40 bg-[#0a0e17] border-b border-slate-800/70">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 30%, rgba(10,14,23,0.9) 100%)`,
                      }}
                    />
                    <span
                      className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-sm"
                      style={{ color: svc.accent, borderColor: `${svc.accent}55`, background: `${svc.accent}15` }}
                    >
                      {svc.tag}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-3.5 rounded-full flex-shrink-0" style={{ background: svc.accent }} />
                        <h3 className="text-sm font-bold text-white">{svc.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{svc.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-mono text-slate-400" style={{ color: svc.accent }}>
                        {svc.accent}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingServiceIndex(i);
                            setServiceForm(svc);
                            setShowServiceModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-md transition cursor-pointer border border-slate-700/60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            requestConfirmation({
                              title: "Delete Service",
                              message: `Are you sure you want to delete service "${svc.title}"?`,
                              confirmText: "Delete Service",
                              isDanger: true,
                              onConfirm: () => {
                                const newServices = data.services.filter((_, idx) => idx !== i);
                                const updated = { ...data, services: newServices };
                                setData(updated);
                                handleSaveData(updated);
                              },
                            });
                          }}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition cursor-pointer border border-red-500/20"
                          title="Delete"
                        >
                          <IoTrashOutline size={15} />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0e1422] p-4 sm:p-5 border border-slate-800/80 rounded-xl">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <IoBriefcaseOutline className="text-indigo-400" size={17} />
                  Work Experience ({data.experiences.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Career milestones, achievements, tech chips, and certificates.</p>
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
              >
                <IoAddOutline size={16} /> Add Experience
              </button>
            </div>

            <div className="space-y-3.5">
              {data.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 group hover:border-slate-700/80 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{
                          background: `${exp.accent}15`,
                          border: `1px solid ${exp.accent}40`,
                          color: exp.accent,
                        }}
                      >
                        {exp.initials || exp.company.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                        <p className="text-xs font-medium mt-0.5" style={{ color: exp.accent }}>
                          {exp.company} &bull; <span className="text-slate-400 font-mono">{exp.period}</span>
                        </p>
                        {exp.cert && exp.cert.image && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                            <IoDocumentTextOutline size={12} /> Certificate attached
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
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
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-md transition cursor-pointer border border-slate-700/60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          requestConfirmation({
                            title: "Delete Experience",
                            message: `Are you sure you want to delete experience at "${exp.company}"?`,
                            confirmText: "Delete Experience",
                            isDanger: true,
                            onConfirm: () => {
                              const newExp = data.experiences.filter((_, idx) => idx !== i);
                              const updated = { ...data, experiences: newExp };
                              setData(updated);
                              handleSaveData(updated);
                            },
                          });
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition cursor-pointer border border-red-500/20"
                        title="Delete"
                      >
                        <IoTrashOutline size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Key Contributions</p>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>

                  {exp.techIcons && exp.techIcons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                      {exp.techIcons.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-800 bg-[#0a0e17]"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0e1422] p-4 sm:p-5 border border-slate-800/80 rounded-xl">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <IoRibbonOutline className="text-indigo-400" size={17} />
                  Certifications ({data.certificates.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload certificate credentials and issuer verification.</p>
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition"
              >
                <IoAddOutline size={16} /> Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.certificates.map((cert, i) => (
                <div
                  key={i}
                  className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between group hover:border-slate-700/80 transition"
                >
                  <div className="relative aspect-[4/3] bg-[#0a0e17] rounded-lg overflow-hidden mb-2.5 border border-slate-800/60">
                    <Image src={cert.src} alt={cert.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{cert.title}</h4>
                    <p className="text-[11px] text-indigo-400 truncate mt-0.5 font-medium">{cert.issuer}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setEditingCertIndex(i);
                          setCertForm(cert);
                          setShowCertModal(true);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 rounded-md transition cursor-pointer border border-slate-700/60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          requestConfirmation({
                            title: "Delete Certificate",
                            message: `Are you sure you want to delete certificate "${cert.title}"?`,
                            confirmText: "Delete Certificate",
                            isDanger: true,
                            onConfirm: () => {
                              const newCerts = data.certificates.filter((_, idx) => idx !== i);
                              const updated = { ...data, certificates: newCerts };
                              setData(updated);
                              handleSaveData(updated);
                            },
                          });
                        }}
                        className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition cursor-pointer border border-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base sm:text-lg font-bold text-white pb-3 border-b border-slate-800">
              {editingProjectIndex !== null ? "Edit Project" : "Add New Project"}
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. AI Content Generator"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Tag (Technology)
                </label>
                <input
                  type="text"
                  value={projectForm.tag}
                  onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                  placeholder="e.g. Next.js · AI"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Tag Color Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={projectForm.tagColor.startsWith("#") && projectForm.tagColor.length === 7 ? projectForm.tagColor : "#3B82F6"}
                    onChange={(e) => setProjectForm({ ...projectForm, tagColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={projectForm.tagColor}
                    onChange={(e) => setProjectForm({ ...projectForm, tagColor: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Short Description (Shown on Card)
              </label>
              <textarea
                rows={2}
                value={projectForm.main}
                onChange={(e) => setProjectForm({ ...projectForm, main: e.target.value })}
                placeholder="Brief summary displayed on the card..."
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Description (Shown in Details Modal)
              </label>
              <textarea
                rows={4}
                value={projectForm.fullDescription || ""}
                onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                placeholder="In-depth project breakdown, features, architecture, challenges, and tech stack details..."
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed font-sans"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Leave blank to automatically use the short description, or provide full multi-paragraph details for the popup modal.
              </p>
            </div>

            {/* Project Image Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Project Image
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="flex-1 px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700/70 cursor-pointer transition">
                  <IoCloudUploadOutline size={15} />
                  {uploadingImage ? "Uploading..." : "Upload"}
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

            {/* Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Link / Demo URL
                </label>
                <input
                  type="text"
                  value={projectForm.demo || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value || null })}
                  placeholder="https://github.com/... or https://..."
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Link Label
                </label>
                <input
                  type="text"
                  value={projectForm.demoLabel || ""}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, demoLabel: e.target.value || "GitHub" })
                  }
                  placeholder="GitHub, Live Demo, or Preview"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Dedicated GitHub URL (Optional)
                </label>
                <input
                  type="text"
                  value={projectForm.github || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value || null })}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Secondary Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={projectForm.secondaryLink || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, secondaryLink: e.target.value || null })}
                  placeholder="https://linkedin.com/... or live demo"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProjectModal}
                disabled={!projectForm.title}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILL ADD/EDIT MODAL ── */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingSkillIndex !== null ? "Edit Skill" : "Add New Skill"}
              </h2>
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-slate-800 flex items-center justify-center text-xl" style={{ color: skillForm.color }}>
                <DynamicIcon name={skillForm.iconType || skillForm.name} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g. Next.js, Docker, TypeScript, React"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Icon Name or Component
              </label>
              <input
                type="text"
                value={skillForm.iconType}
                onChange={(e) => setSkillForm({ ...skillForm, iconType: e.target.value })}
                placeholder="e.g. <FaHtml5 />, SiNextdotjs, FaDocker, SiTailwindcss, FaJava"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Accepts <code className="text-indigo-400">&lt;FaHtml5 /&gt;</code>, <code className="text-indigo-400">SiDocker</code>, or shorthand tags.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Brand Color Hex
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={skillForm.color.startsWith("#") && skillForm.color.length === 7 ? skillForm.color : "#3B82F6"}
                  onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={skillForm.color}
                  onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowSkillModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkillModal}
                disabled={!skillForm.name}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDUCATION ADD/EDIT MODAL ── */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingEduIndex !== null ? "Edit Education" : "Add Education"}
              </h2>
              <div className="text-2xl" style={{ color: eduForm.iconColor }}>
                <DynamicIcon name={eduForm.iconType || "FaGraduationCap"} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                placeholder="e.g. Mount Zion College of Engineering"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Time Period
                </label>
                <input
                  type="text"
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  placeholder="2022 – 2026"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Status
                </label>
                <label className="flex items-center gap-2 h-10 px-3 bg-[#111827] border border-slate-700/80 rounded-lg text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eduForm.current}
                    onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Current Degree</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Degree / Course Details
              </label>
              <input
                type="text"
                value={eduForm.details}
                onChange={(e) => setEduForm({ ...eduForm, details: e.target.value })}
                placeholder="BE Computer Science And Engineering"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={eduForm.iconType}
                  onChange={(e) => setEduForm({ ...eduForm, iconType: e.target.value })}
                  placeholder="FaGraduationCap"
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={eduForm.iconColor.startsWith("#") && eduForm.iconColor.length === 7 ? eduForm.iconColor : "#FBBF24"}
                    onChange={(e) => setEduForm({ ...eduForm, iconColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={eduForm.iconColor}
                    onChange={(e) => setEduForm({ ...eduForm, iconColor: e.target.value })}
                    className="flex-1 px-2.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowEduModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEduModal}
                disabled={!eduForm.institution}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Education
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICE ADD/EDIT MODAL ── */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingServiceIndex !== null ? "Edit Service" : "Add New Service"}
              </h2>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{ color: serviceForm.accent, borderColor: `${serviceForm.accent}50`, background: `${serviceForm.accent}15` }}
              >
                {serviceForm.tag || "Preview"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Service Title
              </label>
              <input
                type="text"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                placeholder="e.g. Full Stack Developer, AI & Robotics"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Tag / Tech Stack
                </label>
                <input
                  type="text"
                  value={serviceForm.tag}
                  onChange={(e) => setServiceForm({ ...serviceForm, tag: e.target.value })}
                  placeholder="e.g. MERN · Next.js"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={serviceForm.accent.startsWith("#") && serviceForm.accent.length === 7 ? serviceForm.accent : "#3B82F6"}
                    onChange={(e) => setServiceForm({ ...serviceForm, accent: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={serviceForm.accent}
                    onChange={(e) => setServiceForm({ ...serviceForm, accent: e.target.value })}
                    className="flex-1 px-2.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Describe what you provide in this service..."
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Service Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Service Image
              </label>
              <div className="flex items-center gap-2.5">
                <div className="relative w-16 h-12 bg-[#111827] rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                  <Image src={serviceForm.image} alt="service" fill sizes="64px" className="object-cover" />
                </div>
                <input
                  type="text"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  placeholder="/assets/MERN.png"
                  className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700/70 cursor-pointer transition">
                  <IoCloudUploadOutline size={15} />
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

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveServiceModal}
                disabled={!serviceForm.title}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPERIENCE ADD/EDIT MODAL ── */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingExpIndex !== null ? "Edit Experience" : "Add Experience"}
              </h2>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{
                  background: `${expForm.accent}15`,
                  border: `1px solid ${expForm.accent}40`,
                  color: expForm.accent,
                }}
              >
                {expForm.initials || expForm.company.slice(0, 3).toUpperCase() || "EXP"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. RCK Techiees"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Job Role / Position
                </label>
                <input
                  type="text"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  placeholder="e.g. Dec 2025 – Present"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={expForm.accent.startsWith("#") && expForm.accent.length === 7 ? expForm.accent : "#3B82F6"}
                    onChange={(e) => setExpForm({ ...expForm, accent: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={expForm.accent}
                    onChange={(e) => setExpForm({ ...expForm, accent: e.target.value })}
                    className="flex-1 px-2.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bullets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Key Contributions (One per line)
              </label>
              <textarea
                rows={3}
                value={expBulletsText}
                onChange={(e) => setExpBulletsText(e.target.value)}
                placeholder="Migrated ticketing systems via REST APIs&#10;Contributed to full-stack development using React and Node.js"
                className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Technologies used */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Technologies (One per line: <code className="text-indigo-400">icon:color:Label</code>)
              </label>
              <textarea
                rows={2}
                value={expTechText}
                onChange={(e) => setExpTechText(e.target.value)}
                placeholder="react:#61DAFB:React&#10;node:#339933:Node.js"
                className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Certificate attached */}
            <div className="bg-[#111827] p-3.5 border border-slate-800 rounded-lg space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Optional Certificate Attachment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={expForm.cert?.title || ""}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      cert: { ...expForm.cert, title: e.target.value },
                    })
                  }
                  placeholder="Certificate Title"
                  className="w-full px-3 py-2 bg-[#0e1422] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
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
                    placeholder="/certificates/internship.png"
                    className="flex-1 px-3 py-2 bg-[#0e1422] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <label className="flex items-center gap-1 px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700/70 cursor-pointer transition">
                    <IoCloudUploadOutline size={15} />
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
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
                  <div className="relative w-14 h-10 bg-[#0e1422] rounded overflow-hidden border border-slate-800 flex-shrink-0">
                    <Image
                      src={expForm.cert.image}
                      alt="Certificate Preview"
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {expForm.cert.title || "Attached Certificate"}
                    </p>
                    <p className="text-[10px] text-emerald-400 truncate font-mono">
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
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 rounded cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowExpModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpModal}
                disabled={!expForm.company || !expForm.role}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE ADD/EDIT MODAL ── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingCertIndex !== null ? "Edit Certificate" : "Add Certificate"}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                placeholder="e.g. Flutter Development, AWS Certified"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Issuer / Platform
              </label>
              <input
                type="text"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                placeholder="e.g. Google, Meta, Coursera"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Certificate Image
              </label>
              <div className="flex items-center gap-2.5">
                <div className="relative w-16 h-12 bg-[#111827] rounded overflow-hidden border border-slate-800 flex-shrink-0">
                  <Image src={certForm.src} alt="cert" fill sizes="64px" className="object-contain" />
                </div>
                <input
                  type="text"
                  value={certForm.src}
                  onChange={(e) => setCertForm({ ...certForm, src: e.target.value })}
                  placeholder="/certificates/Flutter.png"
                  className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
                <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700/70 cursor-pointer transition">
                  <IoCloudUploadOutline size={15} />
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

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertModal}
                disabled={!certForm.title || !certForm.src}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM SECTION CREATE/EDIT MODAL ── */}
      {showCustomSecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e17]">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <IoSparklesOutline className="text-indigo-400" size={18} />
                {editingCustomSecIndex !== null ? "Edit Custom Section" : "New Custom Section"}
              </h2>
              <button
                onClick={() => setShowCustomSecModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-7 space-y-5 overflow-y-auto flex-1">
              {/* Quick-Start Templates */}
              {editingCustomSecIndex === null && (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Start from a preset template (optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      {
                        label: "💼 Freelance Projects",
                        title: "Freelance Projects",
                        subtitle: "Selected client works delivered across web, mobile, and full-stack solutions",
                        id: "freelance-projects",
                        navLabel: "Freelance",
                        layout: "cards-grid" as const,
                        sampleItems: [
                          {
                            id: "freelance-1",
                            title: "E-Commerce Store & POS",
                            description: "Custom headless online shop with live order tracking, inventory sync, and Stripe checkout.",
                            tag: "Client Work · Full Stack",
                            tagColor: "#10B981",
                            image: "/assets/ecomimg.png",
                            link: "https://example.com",
                            linkLabel: "Live Website",
                            secondaryLink: "",
                            secondaryLinkLabel: "Case Study",
                          },
                        ],
                      },
                      {
                        label: "⭐ Client Reviews",
                        title: "Client Testimonials",
                        subtitle: "What founders and clients have to say about working with me",
                        id: "testimonials",
                        navLabel: "Reviews",
                        layout: "compact-list" as const,
                        sampleItems: [
                          {
                            id: "test-1",
                            title: "Alex Morgan · Founder, TechVibe",
                            description: "“Jaasir delivered our web app ahead of schedule with remarkable UI/UX quality and clean code. Highly recommended!”",
                            tag: "5.0 ★ Review",
                            tagColor: "#F59E0B",
                            image: "",
                            link: "",
                            linkLabel: "View Review",
                            secondaryLink: "",
                            secondaryLinkLabel: "",
                          },
                        ],
                      },
                      {
                        label: "🏆 Awards & Honors",
                        title: "Honors & Milestones",
                        subtitle: "Hackathons, academic excellence, and technical recognitions",
                        id: "achievements",
                        navLabel: "Awards",
                        layout: "timeline" as const,
                        sampleItems: [
                          {
                            id: "award-1",
                            title: "Hackathon Winner - 1st Place",
                            description: "Built an IoT and AI-driven emergency response prototype in 24 hours competing against 40+ teams.",
                            tag: "1st Place · Winner",
                            tagColor: "#EC4899",
                            image: "",
                            link: "",
                            linkLabel: "Event Details",
                            secondaryLink: "",
                            secondaryLinkLabel: "",
                          },
                        ],
                      },
                      {
                        label: "🌟 Flagship Showcase",
                        title: "Featured Flagship Platform",
                        subtitle: "Comprehensive end-to-end digital product showcase with detailed deep dives",
                        id: "featured-case",
                        navLabel: "Showcase",
                        layout: "featured-split" as const,
                        sampleItems: [
                          {
                            id: "feat-1",
                            title: "Automated Enterprise Dashboard",
                            description: "High-scale multi-tenant portal with live analytics, role-based access, and real-time alerts.",
                            tag: "Production Flagship",
                            tagColor: "#8B5CF6",
                            image: "/assets/ecomimg.png",
                            link: "https://example.com",
                            linkLabel: "Explore Product",
                            secondaryLink: "https://github.com",
                            secondaryLinkLabel: "Architecture",
                          },
                        ],
                      },
                      {
                        label: "🌐 Open Source",
                        title: "Open Source Contributions",
                        subtitle: "Public libraries, tools, and developer utilities shared with the community",
                        id: "open-source",
                        navLabel: "Open Source",
                        layout: "cards-grid" as const,
                        sampleItems: [
                          {
                            id: "os-1",
                            title: "React Modern Components",
                            description: "A lightweight collection of responsive UI primitives with tailwind animations.",
                            tag: "Open Source · MIT",
                            tagColor: "#3B82F6",
                            image: "",
                            link: "https://github.com",
                            linkLabel: "GitHub Repo",
                            secondaryLink: "https://npmjs.com",
                            secondaryLinkLabel: "npm package",
                          },
                        ],
                      },
                      {
                        label: "📄 Blank Section",
                        title: "Custom Section",
                        subtitle: "Explore highlights and specialized work",
                        id: "custom-section",
                        navLabel: "Custom",
                        layout: "cards-grid" as const,
                        sampleItems: [],
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setCustomSecForm({
                            ...customSecForm,
                            title: tpl.title,
                            subtitle: tpl.subtitle,
                            id: tpl.id,
                            navLabel: tpl.navLabel,
                            layout: tpl.layout,
                            items: tpl.sampleItems.length > 0 ? tpl.sampleItems : customSecForm.items,
                          });
                        }}
                        className="text-left p-2.5 rounded-lg bg-[#0a0e17] border border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/20 text-xs text-slate-300 hover:text-white font-medium transition cursor-pointer"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={customSecForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setCustomSecForm({
                      ...customSecForm,
                      title,
                      id: customSecForm.id || autoSlug,
                      navLabel: customSecForm.navLabel || title,
                    });
                  }}
                  placeholder="e.g. Freelance Projects"
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Section Slug (Anchor)
                  </label>
                  <input
                    type="text"
                    value={customSecForm.id}
                    onChange={(e) => setCustomSecForm({ ...customSecForm, id: e.target.value })}
                    placeholder="freelance-projects"
                    className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Navbar Menu Label
                  </label>
                  <input
                    type="text"
                    value={customSecForm.navLabel}
                    onChange={(e) => setCustomSecForm({ ...customSecForm, navLabel: e.target.value })}
                    placeholder="Freelance"
                    className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={customSecForm.subtitle || ""}
                  onChange={(e) => setCustomSecForm({ ...customSecForm, subtitle: e.target.value })}
                  placeholder="e.g. Selected works completed for clients"
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* 4 WEB LAYOUT TEMPLATES */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2.5">
                  Web Layout Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "cards-grid" as const,
                      name: "1. Three-Column Cards Grid",
                      desc: "Responsive cards with preview thumbnail, category tag, and action links.",
                      preview: (
                        <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#0a0e17] rounded-lg border border-slate-800">
                          <div className="h-9 rounded bg-indigo-600/20 border border-indigo-500/30 flex flex-col justify-end p-1">
                            <div className="h-1 w-3/4 bg-indigo-400 rounded"></div>
                          </div>
                          <div className="h-9 rounded bg-indigo-600/20 border border-indigo-500/30 flex flex-col justify-end p-1">
                            <div className="h-1 w-3/4 bg-indigo-400 rounded"></div>
                          </div>
                          <div className="h-9 rounded bg-indigo-600/20 border border-indigo-500/30 flex flex-col justify-end p-1">
                            <div className="h-1 w-3/4 bg-indigo-400 rounded"></div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "featured-split" as const,
                      name: "2. Featured Split (Zigzag)",
                      desc: "Alternating showcase with side-by-side screenshot and detailed narrative.",
                      preview: (
                        <div className="space-y-1 p-2 bg-[#0a0e17] rounded-lg border border-slate-800">
                          <div className="flex gap-1 items-center">
                            <div className="h-4 w-1/2 rounded bg-indigo-600/20 border border-indigo-500/30"></div>
                            <div className="h-2 w-1/2 rounded bg-slate-800"></div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <div className="h-2 w-1/2 rounded bg-slate-800"></div>
                            <div className="h-4 w-1/2 rounded bg-indigo-600/20 border border-indigo-500/30"></div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "timeline" as const,
                      name: "3. Vertical Timeline / Roadmap",
                      desc: "Sequential milestones along a connected line, great for chronological events.",
                      preview: (
                        <div className="p-2 bg-[#0a0e17] rounded-lg border border-slate-800 flex items-center gap-2 pl-3">
                          <div className="w-1.5 h-9 bg-emerald-500/40 rounded-full relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -left-0.5 top-0.5 absolute"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -left-0.5 bottom-0.5 absolute"></div>
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
                            <div className="h-3 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "compact-list" as const,
                      name: "4. Compact Horizontal List",
                      desc: "Structured list items with title badge, excerpt, and external links.",
                      preview: (
                        <div className="space-y-1 p-2 bg-[#0a0e17] rounded-lg border border-slate-800">
                          <div className="h-4 rounded bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-between px-2">
                            <div className="h-1.5 w-1/3 bg-cyan-400 rounded"></div>
                            <div className="h-1.5 w-8 bg-cyan-500 rounded"></div>
                          </div>
                          <div className="h-4 rounded bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-between px-2">
                            <div className="h-1.5 w-1/3 bg-cyan-400 rounded"></div>
                            <div className="h-1.5 w-8 bg-cyan-500 rounded"></div>
                          </div>
                        </div>
                      ),
                    },
                  ].map((tpl) => {
                    const isSelected = (customSecForm.layout || "cards-grid") === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setCustomSecForm({ ...customSecForm, layout: tpl.id })}
                        className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#111827] border-indigo-500 ring-1 ring-indigo-500/40"
                            : "bg-[#0a0e17] border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="space-y-2">
                          {tpl.preview}
                          <div className="flex items-center justify-between pt-1">
                            <h4 className="text-xs font-bold text-white">{tpl.name}</h4>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                                isSelected ? "border-indigo-500 bg-indigo-600" : "border-slate-700"
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{tpl.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg">
                <label className="flex items-center gap-2.5 text-xs text-white font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customSecForm.enabled}
                    onChange={(e) => setCustomSecForm({ ...customSecForm, enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <span>Display on Website (Visible to visitors)</span>
                </label>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-0 z-10 px-6 py-3.5 bg-[#0a0e17] border-t border-slate-800 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Saves to portfolio-data.json
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowCustomSecModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60 flex-1 sm:flex-initial"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomSecModal}
                  disabled={!customSecForm.title}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition disabled:opacity-50 flex-1 sm:flex-initial"
                >
                  Save Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM SECTION ITEM CREATE/EDIT MODAL ── */}
      {showCustomItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e17]">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {editingCustomItemIndex !== null ? "Edit Item / Card" : "Add Item / Card"}
              </h2>
              <button
                onClick={() => setShowCustomItemModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-7 space-y-4 overflow-y-auto flex-1">
              {/* Quick Item Fill Templates */}
              {editingCustomItemIndex === null && (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-3.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Autofill sample data (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: "💼 Client Work",
                        data: {
                          title: "Client Web Application",
                          description: "Developed end-to-end full-stack platform featuring customer portal, automated payments, and admin controls.",
                          tag: "Client Work · Production",
                          tagColor: "#10B981",
                          image: "/assets/ecomimg.png",
                          link: "https://example.com",
                          linkLabel: "Visit Live Site",
                          secondaryLink: "",
                          secondaryLinkLabel: "Case Study",
                        },
                      },
                      {
                        label: "⭐ Client Review",
                        data: {
                          title: "David Ross · CEO at CloudScale",
                          description: "“Outstanding engineering quality! Jaasir solved our performance bottlenecks and delivered ahead of our release window.”",
                          tag: "Verified Client · 5.0 ★",
                          tagColor: "#F59E0B",
                          image: "",
                          link: "https://linkedin.com",
                          linkLabel: "Client Profile",
                          secondaryLink: "",
                          secondaryLinkLabel: "",
                        },
                      },
                      {
                        label: "🏆 Hackathon Award",
                        data: {
                          title: "Best Innovation Award",
                          description: "Awarded 1st place in National Tech Fest for developing an AI-driven accessibility tool.",
                          tag: "Winner · 1st Place",
                          tagColor: "#EC4899",
                          image: "",
                          link: "",
                          linkLabel: "Certificate / Proof",
                          secondaryLink: "",
                          secondaryLinkLabel: "",
                        },
                      },
                      {
                        label: "⚡ Tool / Package",
                        data: {
                          title: "npm-package-name",
                          description: "Open-source developer utility with 5k+ monthly downloads for seamless state synchronization.",
                          tag: "Open Source · TypeScript",
                          tagColor: "#3B82F6",
                          image: "",
                          link: "https://github.com",
                          linkLabel: "GitHub Repository",
                          secondaryLink: "https://npmjs.com",
                          secondaryLinkLabel: "npm Package",
                        },
                      },
                    ].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setCustomItemForm({
                            ...customItemForm,
                            ...tpl.data,
                          });
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#0a0e17] border border-slate-800 hover:border-indigo-500 hover:text-indigo-400 text-xs text-slate-300 font-medium transition cursor-pointer"
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={customItemForm.title}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, title: e.target.value })}
                  placeholder="e.g. Real Estate Dashboard"
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Tag / Category
                  </label>
                  <input
                    type="text"
                    value={customItemForm.tag || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, tag: e.target.value })}
                    placeholder="e.g. Freelance · Next.js"
                    className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Tag Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        customItemForm.tagColor && customItemForm.tagColor.startsWith("#") && customItemForm.tagColor.length === 7
                          ? customItemForm.tagColor
                          : "#3B82F6"
                      }
                      onChange={(e) => setCustomItemForm({ ...customItemForm, tagColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customItemForm.tagColor || "#3B82F6"}
                      onChange={(e) => setCustomItemForm({ ...customItemForm, tagColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={customItemForm.description}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, description: e.target.value })}
                  placeholder="Summary of work or achievements..."
                  className="w-full px-3.5 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Screenshot / Image (Optional)
                </label>
                <div className="flex items-center gap-2.5">
                  {customItemForm.image && (
                    <div className="relative w-14 h-10 bg-[#0a0e17] rounded overflow-hidden border border-slate-800 flex-shrink-0">
                      <Image src={customItemForm.image} alt="preview" fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={customItemForm.image || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, image: e.target.value })}
                    placeholder="/assets/image.png"
                    className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700/70 cursor-pointer transition">
                    <IoCloudUploadOutline size={15} />
                    {uploadingCustomItemImage ? "..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomItemImageUpload}
                      className="hidden"
                      disabled={uploadingCustomItemImage}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Primary Link URL
                  </label>
                  <input
                    type="text"
                    value={customItemForm.link || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Primary Link Label
                  </label>
                  <input
                    type="text"
                    value={customItemForm.linkLabel || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, linkLabel: e.target.value })}
                    placeholder="View Demo"
                    className="w-full px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Secondary Link URL
                  </label>
                  <input
                    type="text"
                    value={customItemForm.secondaryLink || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, secondaryLink: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Secondary Link Label
                  </label>
                  <input
                    type="text"
                    value={customItemForm.secondaryLinkLabel || ""}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, secondaryLinkLabel: e.target.value })}
                    placeholder="Source Code"
                    className="w-full px-3 py-2 bg-[#111827] border border-slate-700/80 rounded-lg text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 z-10 px-6 py-3.5 bg-[#0a0e17] border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCustomItemModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomItemModal}
                disabled={!customItemForm.title}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition disabled:opacity-50"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM CONFIRMATION MODAL POPUP ── */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e1422] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 transform transition-all scale-100">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  confirmDialog.isDanger
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                }`}
              >
                {confirmDialog.isDanger ? (
                  <IoAlertCircleOutline size={22} />
                ) : (
                  <IoHelpCircleOutline size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
              <button
                onClick={() => setConfirmDialog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <IoCloseOutline size={18} />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition border border-slate-700/60"
              >
                {confirmDialog.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  action();
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition ${
                  confirmDialog.isDanger
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                <IoCheckmarkOutline size={16} />
                <span>{confirmDialog.confirmText || "Yes, Confirm"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

