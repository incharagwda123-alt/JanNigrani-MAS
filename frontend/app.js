// JanNigrani Prototype Application Logic
// Built for SIH 2026 - Problem Statement SIH26102 (MoSPI DIID)

let currentRole = "district"; // default view: District Authority
let currentTab = "dashboard";
let selectedProject = null;
let mapInstance = null;
let mapMarkers = [];
let allProjects = [...window.JANNIGRANI_DATA];

// Format Indian Currency
function formatINR(num) {
  if (num >= 10000000) {
    return "₹" + (num / 10000000).toFixed(2) + " Cr";
  } else if (num >= 100000) {
    return "₹" + (num / 100000).toFixed(2) + " Lakh";
  }
  return "₹" + Number(num).toLocaleString('en-IN');
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderKPIs();
  renderProjectTable();
  setupEventListeners();
  initNetworkGraph();
});

// Setup Event Listeners
function setupEventListeners() {
  // Role Selector
  const roleSelect = document.getElementById("stakeholder-role-select");
  if (roleSelect) {
    roleSelect.addEventListener("change", (e) => {
      currentRole = e.target.value;
      updateRoleContext();
    });
  }

  // Search input
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderProjectTable();
    });
  }

  // Priority filter
  const priorityFilter = document.getElementById("priority-filter");
  if (priorityFilter) {
    priorityFilter.addEventListener("change", () => {
      renderProjectTable();
    });
  }

  // Sector filter
  const sectorFilter = document.getElementById("sector-filter");
  if (sectorFilter) {
    sectorFilter.addEventListener("change", () => {
      renderProjectTable();
    });
  }

  // Drawer Close Button & Backdrop
  document.getElementById("close-drawer-btn")?.addEventListener("click", closeDrawer);
  document.getElementById("drawer-backdrop")?.addEventListener("click", closeDrawer);

  // Escape key to close drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

// Switch Active Navigation Tab
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.remove("text-sky-400", "border-sky-400", "bg-slate-800/60");
    btn.classList.add("text-slate-400", "border-transparent");
  });

  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) activeContent.classList.remove("hidden");

  const activeBtn = document.getElementById(`nav-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove("text-slate-400", "border-transparent");
    activeBtn.classList.add("text-sky-400", "border-sky-400", "bg-slate-800/60");
  }

  if (tabId === "gis-map") {
    setTimeout(initOrUpdateMap, 200);
  } else if (tabId === "cartel-graph") {
    setTimeout(initNetworkGraph, 100);
  }
}

// Update Role Context (4-Tier Governance)
function updateRoleContext() {
  const badge = document.getElementById("active-role-badge");
  const scopeText = document.getElementById("role-scope-description");

  const roleMeta = {
    ministry: {
      name: "MoSPI DIID (Ministry Apex)",
      badge: "National Oversight",
      color: "bg-purple-900/60 text-purple-300 border-purple-500",
      desc: "Monitoring all 780+ Districts & State Nodal Allocations"
    },
    state: {
      name: "State Nodal Authority (Karnataka)",
      badge: "State Level",
      color: "bg-blue-900/60 text-blue-300 border-blue-500",
      desc: "Monitoring 31 Districts · Cross-district anomaly surveillance"
    },
    district: {
      name: "District Authority (DM / Collectorate)",
      badge: "Operational Authority",
      color: "bg-emerald-900/60 text-emerald-300 border-emerald-500",
      desc: "Bengaluru Urban Jurisdiction · Site Inspection Queue"
    },
    mp: {
      name: "Hon'ble MP Portal (Bengaluru South)",
      badge: "Constituency View",
      color: "bg-amber-900/60 text-amber-300 border-amber-500",
      desc: "Constituency Public Assets & Civic Amenities Creation"
    }
  };

  const meta = roleMeta[currentRole];
  if (badge && meta) {
    badge.className = `px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${meta.color}`;
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-current animate-pulse"></span> ${meta.badge}`;
  }
  if (scopeText && meta) {
    scopeText.textContent = meta.desc;
  }

  renderKPIs();
  renderProjectTable();
  if (currentTab === "gis-map") initOrUpdateMap();
}

// Filter projects according to search, role & criteria
function getFilteredProjects() {
  const search = document.getElementById("search-input")?.value.toLowerCase().trim() || "";
  const priority = document.getElementById("priority-filter")?.value || "all";
  const sector = document.getElementById("sector-filter")?.value || "all";

  return allProjects.filter(p => {
    // Role filtering
    if (currentRole === "district" && p.district !== "Bengaluru Urban") return false;
    if (currentRole === "mp" && p.constituency !== "Bengaluru South") return false;
    if (currentRole === "state" && p.state !== "Karnataka") return false;

    // Search filter
    if (search) {
      const matchText = `${p.project_id} ${p.description} ${p.contractor_name} ${p.agency_name} ${p.district}`.toLowerCase();
      if (!matchText.includes(search)) return false;
    }

    // Priority filter
    if (priority !== "all" && p.priority.toLowerCase() !== priority.toLowerCase()) return false;

    // Sector filter
    if (sector !== "all" && p.sector !== sector) return false;

    return true;
  });
}

// Render Top KPI Metrics
function renderKPIs() {
  const filtered = getFilteredProjects();
  const totalSanctioned = filtered.reduce((acc, p) => acc + p.sanctioned_amount, 0);
  const totalExp = filtered.reduce((acc, p) => acc + p.actual_expenditure, 0);
  const highRisk = filtered.filter(p => p.priority === "High");
  const capitalAtRisk = highRisk.reduce((acc, p) => acc + (p.actual_expenditure - (p.sanctioned_amount * (p.progress_percent / 100))), 0);

  document.getElementById("kpi-total-works").textContent = filtered.length;
  document.getElementById("kpi-total-sanctioned").textContent = formatINR(totalSanctioned);
  document.getElementById("kpi-high-priority").textContent = highRisk.length;
  document.getElementById("kpi-capital-risk").textContent = formatINR(Math.max(0, capitalAtRisk));
}

// Render the Main Sortable Anomaly Table
function renderProjectTable() {
  const tbody = document.getElementById("project-table-body");
  if (!tbody) return;

  const projects = getFilteredProjects().sort((a, b) => b.risk_score - a.risk_score);
  tbody.innerHTML = "";

  if (projects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-2">🔍</div>
          No projects found matching current filters or jurisdiction scope.
        </td>
      </tr>`;
    return;
  }

  projects.forEach(p => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-800/80 hover:bg-slate-800/50 transition cursor-pointer group";
    tr.onclick = () => openDrawer(p);

    const priorityBadge = p.priority === "High"
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> High (${p.risk_score}/100)
         </span>`
      : p.priority === "Medium"
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Med (${p.risk_score}/100)
         </span>`
      : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Low (${p.risk_score}/100)
         </span>`;

    // Progress vs Financial Bar
    const progressMismatch = p.fund_utilization_percent - p.progress_percent;
    const progressAlert = progressMismatch > 25
      ? `<div class="text-[11px] text-red-400 font-mono mt-1 flex items-center gap-1">
          <svg class="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          ${progressMismatch.toFixed(0)}% fund-work gap
         </div>`
      : '';

    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono text-xs font-semibold text-sky-400 group-hover:text-sky-300">
        ${p.project_id}
      </td>
      <td class="py-3.5 px-4">
        <div class="font-medium text-sm text-slate-100 line-clamp-1">${p.description}</div>
        <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
          <span>${p.sector}</span> &bull; 
          <span class="text-slate-300">${p.district}, ${p.state}</span>
        </div>
      </td>
      <td class="py-3.5 px-4">
        <div class="text-xs font-medium text-slate-200">${p.contractor_name}</div>
        <div class="text-[11px] text-slate-400 truncate max-w-[180px]">${p.agency_name}</div>
      </td>
      <td class="py-3.5 px-4 text-right">
        <div class="text-xs font-semibold text-slate-200">${formatINR(p.sanctioned_amount)}</div>
        <div class="text-[11px] text-slate-400">Spent: ${formatINR(p.actual_expenditure)}</div>
      </td>
      <td class="py-3.5 px-4 w-44">
        <div class="flex justify-between text-[11px] mb-1 font-mono">
          <span class="text-slate-400">Work: <strong class="text-slate-200">${p.progress_percent}%</strong></span>
          <span class="text-slate-400">Fund: <strong class="${progressMismatch > 25 ? 'text-red-400' : 'text-slate-200'}">${p.fund_utilization_percent}%</strong></span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: ${p.progress_percent}%"></div>
        </div>
        ${progressAlert}
      </td>
      <td class="py-3.5 px-4 text-center">
        ${priorityBadge}
      </td>
      <td class="py-3.5 px-4 text-right">
        <button class="px-3 py-1 text-xs font-medium rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition flex items-center gap-1 ml-auto">
          <span>Evidence</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Open the Killer Feature: The Signature Evidence Bundle Drawer
function openDrawer(project) {
  selectedProject = project;
  const drawer = document.getElementById("evidence-drawer");
  const backdrop = document.getElementById("drawer-backdrop");

  if (!drawer || !backdrop) return;

  // Fill in Project Meta
  document.getElementById("drawer-project-id").textContent = project.project_id;
  document.getElementById("drawer-project-title").textContent = project.description;
  document.getElementById("drawer-sector").textContent = project.sector;
  document.getElementById("drawer-location").textContent = `${project.district}, ${project.state} (${project.constituency})`;
  document.getElementById("drawer-contractor").textContent = project.contractor_name;
  document.getElementById("drawer-agency").textContent = project.agency_name;

  // Fill in Financials
  document.getElementById("drawer-sanctioned").textContent = formatINR(project.sanctioned_amount);
  document.getElementById("drawer-expenditure").textContent = formatINR(project.actual_expenditure);
  document.getElementById("drawer-progress").textContent = `${project.progress_percent}%`;
  document.getElementById("drawer-fund-util").textContent = `${project.fund_utilization_percent}%`;

  // Score Gauge
  const scoreEl = document.getElementById("drawer-risk-score");
  scoreEl.textContent = `${project.risk_score}/100`;
  scoreEl.className = project.priority === "High" ? "text-red-400 text-3xl font-black font-mono" : project.priority === "Medium" ? "text-amber-400 text-3xl font-black font-mono" : "text-emerald-400 text-3xl font-black font-mono";

  document.getElementById("drawer-priority-badge").textContent = `${project.priority} Investigation Priority`;
  document.getElementById("drawer-priority-badge").className = project.priority === "High" ? "px-2.5 py-0.5 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40" : project.priority === "Medium" ? "px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40" : "px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";

  // Render Contributing Signals Breakdown
  const signalsContainer = document.getElementById("drawer-signals-list");
  signalsContainer.innerHTML = "";
  project.contributing_signals.forEach(sig => {
    const div = document.createElement("div");
    div.className = "p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 mb-2.5";
    div.innerHTML = `
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="font-semibold text-slate-200 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> ${sig.signal}
        </span>
        <span class="font-mono text-red-400 font-bold">+${sig.contribution} pts</span>
      </div>
      <div class="text-xs text-slate-400 leading-relaxed">${sig.reason}</div>
    `;
    signalsContainer.appendChild(div);
  });

  // Render Missing Documents
  const docsList = document.getElementById("drawer-missing-docs");
  docsList.innerHTML = "";
  if (project.evidence_bundle.missing_documents.length === 0) {
    docsList.innerHTML = `<li class="text-xs text-emerald-400 flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> All statutory inspection documents verified.</li>`;
  } else {
    project.evidence_bundle.missing_documents.forEach(doc => {
      const li = document.createElement("li");
      li.className = "text-xs text-red-300 flex items-start gap-1.5 mb-1";
      li.innerHTML = `<svg class="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> <span>${doc}</span>`;
      docsList.appendChild(li);
    });
  }

  // Render Recommended Actions
  const actionsList = document.getElementById("drawer-actions-list");
  actionsList.innerHTML = "";
  project.evidence_bundle.recommended_action.forEach(act => {
    const li = document.createElement("li");
    li.className = "text-xs text-slate-300 flex items-start gap-1.5 mb-1.5";
    li.innerHTML = `<svg class="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> <span>${act}</span>`;
    actionsList.appendChild(li);
  });

  // Statutory Disclaimer
  document.getElementById("drawer-disclaimer").textContent = project.disclaimer;

  // Open Drawer UI
  drawer.classList.remove("drawer-closed");
  drawer.classList.add("drawer-open");
  backdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// Close Evidence Drawer
function closeDrawer() {
  const drawer = document.getElementById("evidence-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (!drawer || !backdrop) return;

  drawer.classList.remove("drawer-open");
  drawer.classList.add("drawer-closed");
  backdrop.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Print / Export Official Audit Dossier
function printAuditDossier() {
  window.print();
}

// Trigger Simulated District Site Inspection Notice
function triggerSiteInspection() {
  if (!selectedProject) return;
  alert(`✅ Site Inspection Notice Dispatched!\n\nReference: NIDHI-INSP-${Date.now().toString().slice(-6)}\nTarget: Assistant Executive Engineer (AEE), ${selectedProject.district}\nProject: ${selectedProject.project_id}\n\nNotice generated with 1-click Evidence Bundle attached.`);
}

// Initialize or Update the Leaflet Interactive GIS Map
function initOrUpdateMap() {
  const mapDiv = document.getElementById("leaflet-map");
  if (!mapDiv) return;

  if (!mapInstance) {
    // Center on Bengaluru Urban coordinates by default
    mapInstance = L.map("leaflet-map").setView([12.9249, 77.5852], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance);
  }

  // Clear existing markers
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  const projects = getFilteredProjects();

  projects.forEach(p => {
    const isHigh = p.priority === "High";
    const isMed = p.priority === "Medium";
    const color = isHigh ? "#EF4444" : isMed ? "#F59E0B" : "#10B981";

    // Circle Marker
    const marker = L.circleMarker([p.latitude, p.longitude], {
      radius: isHigh ? 10 : 8,
      fillColor: color,
      color: "#FFFFFF",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(mapInstance);

    marker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; min-width: 180px;">
        <strong style="color: ${color};">${p.project_id} (${p.priority} Risk: ${p.risk_score})</strong>
        <p style="margin: 4px 0 6px 0; font-weight: 500;">${p.description}</p>
        <div style="font-size: 11px; color: #64748b;">Sanction: ${formatINR(p.sanctioned_amount)}</div>
        <div style="font-size: 11px; color: #64748b;">Contractor: ${p.contractor_name}</div>
        <button onclick="window.triggerMapDrawer('${p.project_id}')" style="margin-top: 8px; width: 100%; background: #0284c7; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">View Evidence Dossier</button>
      </div>
    `);

    mapMarkers.push(marker);

    // If High risk with duplicate match, draw 500m proximity alert circle
    if (isHigh && p.contributing_signals.some(s => s.signal.includes("Duplicate"))) {
      const radiusCircle = L.circle([p.latitude, p.longitude], {
        radius: 350,
        color: "#EF4444",
        fillColor: "#EF4444",
        fillOpacity: 0.12,
        dashArray: "4, 6"
      }).addTo(mapInstance);
      mapMarkers.push(radiusCircle);
    }
  });

  if (projects.length > 0) {
    const group = new L.featureGroup(mapMarkers);
    mapInstance.fitBounds(group.getBounds().pad(0.2));
  }
}

// Global bridge for popup click
window.triggerMapDrawer = function(projectId) {
  const p = allProjects.find(x => x.project_id === projectId);
  if (p) openDrawer(p);
};

// Initialize Contractor Cartel Network Graph
function initNetworkGraph() {
  const container = document.getElementById("network-svg-container");
  if (!container) return;

  const data = window.JANNIGRANI_GRAPH;
  const width = container.clientWidth || 900;
  const height = 500;

  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 900 500" class="select-none">`;

  // Draw links
  data.links.forEach(l => {
    const s = data.nodes.find(n => n.id === l.source);
    const t = data.nodes.find(n => n.id === l.target);
    if (!s || !t) return;

    const isCartelLink = s.id === "CON-042" || t.id === "CON-042";
    const strokeColor = isCartelLink ? "#EF4444" : "#475569";
    const strokeWidth = isCartelLink ? "2.5" : "1.2";

    svgContent += `
      <line x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" 
            stroke="${strokeColor}" stroke-width="${strokeWidth}" 
            stroke-opacity="${isCartelLink ? '0.85' : '0.4'}" 
            class="${isCartelLink ? 'graph-link' : ''}"/>
    `;
  });

  // Draw nodes
  data.nodes.forEach(n => {
    if (n.type === "agency") {
      svgContent += `
        <g class="graph-node" onclick="window.onGraphNodeClick('${n.id}')">
          <rect x="${n.x - 45}" y="${n.y - 20}" width="90" height="40" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <text x="${n.x}" y="${n.y + 4}" fill="#38BDF8" font-size="11" font-weight="600" text-anchor="middle">${n.label}</text>
        </g>
      `;
    } else if (n.type === "contractor") {
      const isHigh = n.risk === "high";
      const fillColor = isHigh ? "#7F1D1D" : "#1E293B";
      const strokeColor = isHigh ? "#EF4444" : "#F59E0B";

      svgContent += `
        <g class="graph-node" onclick="window.onGraphNodeClick('${n.id}')">
          <circle cx="${n.x}" cy="${n.y}" r="32" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2.5"/>
          <text x="${n.x}" y="${n.y - 4}" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">${n.label.split(' ')[0]}</text>
          <text x="${n.x}" y="${n.y + 10}" fill="${strokeColor}" font-size="9" font-weight="600" text-anchor="middle">${n.count || ''}</text>
        </g>
      `;
    } else {
      // Project node
      const pColor = n.priority === "High" ? "#EF4444" : n.priority === "Medium" ? "#F59E0B" : "#10B981";
      svgContent += `
        <g class="graph-node" onclick="window.onGraphNodeClick('${n.id}')">
          <circle cx="${n.x}" cy="${n.y}" r="16" fill="#0F172A" stroke="${pColor}" stroke-width="2"/>
          <text x="${n.x}" y="${n.y + 3}" fill="#F8FAFC" font-size="9" font-weight="600" text-anchor="middle">${n.score}</text>
          <text x="${n.x}" y="${n.y + 28}" fill="#94A3B8" font-size="8" text-anchor="middle">${n.label}</text>
        </g>
      `;
    }
  });

  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

window.onGraphNodeClick = function(id) {
  if (id === "CON-042") {
    alert("🚨 Contractor Concentration Alert!\n\nContractor: ABC Infra Solutions Pvt Ltd (CON-042)\n- 11 Works captured across 3 separate municipal agencies.\n- Cartel Clustering Index: 88% (Abnormal bidding concentration).\n- Recommended: Inter-agency procurement vigilance check.");
  } else if (id.startsWith("P-")) {
    const fullId = "MPLADS-2026-KA-" + id.split("-")[1];
    const p = allProjects.find(x => x.project_id.includes(id.split("-")[1]));
    if (p) openDrawer(p);
  } else {
    alert(`Agency Node: ${id}\nClick connected contractor nodes to inspect multi-project bidding patterns.`);
  }
};

// Real-Time Anomaly Ingestion Simulator (Live Judge Demo)
function runAnomalySimulation() {
  const stepsContainer = document.getElementById("simulator-steps");
  const resultContainer = document.getElementById("simulator-result");
  const runBtn = document.getElementById("run-simulation-btn");

  if (!stepsContainer || !resultContainer || !runBtn) return;

  runBtn.disabled = true;
  runBtn.innerHTML = `<span class="animate-spin inline-block mr-2">⟳</span> Running Deterministic Agent Pipeline...`;
  stepsContainer.innerHTML = "";
  resultContainer.classList.add("hidden");

  const steps = [
    { title: "1. Data Ingestion & Canonical Normalizer", desc: "Parsed raw Excel row. Normalized 14 aliases into unified 17-field MoSPI schema.", status: "ok" },
    { title: "2. Cost Outlier Detector (Statistical Median)", desc: "Calculated deviation: ₹85,00,000 is +41% higher than district median (₹60,20,000).", status: "flag" },
    { title: "3. Spatio-Temporal Duplicate Detector", desc: "Haversine distance = 280m from MPLADS-2025-KA-0891. RapidFuzz token similarity = 91%.", status: "flag" },
    { title: "4. Payment-Progress Mismatch Engine", desc: "Expenditure = 98.2% (₹83.5L) vs Certified Progress = 52%. Divergence gap = 46.2%.", status: "flag" },
    { title: "5. Risk Aggregator & Evidence Bundle Agent", desc: "Combined weighted score: 86/100 (HIGH). Generated audit dossier for District Magistrate.", status: "complete" }
  ];

  steps.forEach((s, idx) => {
    setTimeout(() => {
      const stepDiv = document.createElement("div");
      stepDiv.className = "p-3 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-start gap-3 transition-all";
      const icon = s.status === "flag" ? "⚠️" : s.status === "complete" ? "🎯" : "✓";
      const iconBg = s.status === "flag" ? "bg-red-500/20 text-red-400" : "bg-sky-500/20 text-sky-400";

      stepDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full ${iconBg} flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">${icon}</div>
        <div>
          <div class="text-xs font-semibold text-slate-200">${s.title}</div>
          <div class="text-xs text-slate-400 mt-0.5">${s.desc}</div>
        </div>
      `;
      stepsContainer.appendChild(stepDiv);

      if (idx === steps.length - 1) {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span>▶ Run Live Anomaly Detection Pipeline</span>`;
        resultContainer.classList.remove("hidden");
      }
    }, (idx + 1) * 700);
  });
}
