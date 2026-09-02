/**
 * SIF Intelligence API Client
 * Connects frontend React components to FastAPI backend REST endpoints
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = {
  // 1. Health & Dashboard
  getHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  },

  getDashboard: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, using cached state:', e);
      return null;
    }
  },

  // 2. Reports & Bulk Intelligence
  getReports: async (hazard = 'ALL', sifPotential = 'ALL') => {
    try {
      const params = new URLSearchParams();
      if (hazard !== 'ALL') params.append('hazard', hazard);
      if (sifPotential !== 'ALL') params.append('sif_potential', sifPotential);
      const res = await fetch(`${API_BASE_URL}/reports?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Using local reports dataset:', e);
      return null;
    }
  },

  getReportById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  createReport: async (reportData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Failed to create report:', e);
      return null;
    }
  },

  analyzeReport: async (reportData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Failed to run analysis:', e);
      return null;
    }
  },

  uploadBulkFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/reports/upload-bulk`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Failed to upload bulk file:', e);
      return null;
    }
  },

  bulkAnalyze: async (reports) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/bulk-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reports),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('Bulk analyze error:', e);
      return null;
    }
  },

  // 3. Patterns & Risk Evolution
  getPatterns: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/patterns`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  getRiskEvolution: async (id = 'PAT-001') => {
    try {
      const res = await fetch(`${API_BASE_URL}/risk-evolution/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // 4. Cases
  getCases: async (status = 'ALL', hazard = 'ALL') => {
    try {
      const params = new URLSearchParams();
      if (status !== 'ALL') params.append('status', status);
      if (hazard !== 'ALL') params.append('hazard', hazard);
      const res = await fetch(`${API_BASE_URL}/cases?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  getCaseById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cases/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  createCase: async (caseData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  updateCase: async (id, patchData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },
};
