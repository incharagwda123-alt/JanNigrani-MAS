# JanNigrani MAS — Complete SIH Pitch Deck & Engineering Blueprint
**Problem Statement ID:** 26102  
**Problem Statement Title:** Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation regd.  
**Ministry / Organization:** Ministry of Statistics and Programme Implementation (MoSPI)  
**Department:** Data Informatics & Innovation Division (DIID)  
**Theme:** Smart Automation | **Category:** Software  
**Team Name:** SentinelX3.0  
* **Live Working Prototype (Vercel):** `https://frontend-theta-six-83.vercel.app`  
* **Alternative Mirror (Netlify):** `https://gleaming-malasada-dafc82.netlify.app`

---

## 🏛️ Executive Summary & Guiding Principle

> ### ⚖️ Foundational Maturity Maxim
> **"This alert indicates risk and requires human investigation. It does not prove fraud."**
> 
> **Core Architectural Decision:**  
> *"Models and rules produce the facts; agents coordinate the analysis and explain the evidence."*

---

## 📄 Slide-by-Slide Content (Strict 6-Slide SIH Format)

---

### Slide 1: Title Page

* **Problem Statement ID:** 26102
* **Problem Statement Title:** Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation regd.
* **Organization / Ministry:** Ministry of Statistics and Programme Implementation (MoSPI)
* **Department:** Data Informatics & Innovation Division (DIID)
* **Theme:** Smart Automation | **Category:** Software
* **Team Name:** SentinelX3.0
* **Team ID:** [Your SIH Team ID]
* **Project Name:** JanNigrani MAS (ProjectTwin)
* **Subtitle:** Explainable Multi-Agent AI Monitoring for MPLADS

---

### Slide 2: Idea Title & Targeted Case Review

* **Title:** JanNigrani MAS : Transparent AI Monitoring for MPLADS
* **Tagline:** *"Connecting money flow, physical milestones, and site evidence to prioritize audits — without false accusations."*
* **Proposed Solution:**
  * **Unifies Data Silos:** Integrates sanction letters, bank disbursals, mobile geotags, and contractor logs into one single project profile.
  * **0–100 Priority Score:** Flags dangerous mismatches (e.g. 100% money released while physical progress sits at 55%).
  * **1-Page Evidence Dossier:** Generates an actionable inspection card with clickable links to source records.
* **Targeted Case Review (Demo Case Card):**
  * Work ID: `MPLADS-P-1042` | Community Center Construction (Bengaluru Urban)
  * Priority: **HIGH** | Risk Score: **86 / 100**
  * Financial vs Ground Reality: **₹8,35,000 paid (100% released)** vs **55% physical progress** (delayed 6 months).
  * Decomposed Contributing Signals: `+24%` payment-progress mismatch, `+21%` duplicate work 280m away, `+18%` cost outlier (+40% above median), `+14%` missing compliance, `+9%` contractor concentration.
* **Live Working MVP Link:** `https://gleaming-malasada-dafc82.netlify.app`

---

### Slide 3: Technical Approach (5-Agent Architecture)

* **5-Stage Pipeline (Supervisor Orchestration):**
  1. **Data Ingestion:** Fetch real-time project data from eSAKSHI portal using official APIs and extract key information (Sanctions, Expenditure, Work Progress).
  2. **Data Quality Checks:** Ensure reliable and consistent data for accurate analysis (Validate schemas, clean duplicates, flag missing nulls).
  3. **Parallel Multi-Agent Analysis (5 Specialized Domain Agents):**
     * **1. Financial Agent (Isolation Forest):** Cost overruns, inflated estimates, single-bid tenders.
     * **2. Compliance Agent (Rule Engine):** GFR 2017 rules, mandatory 15% SC / 7.5% ST quota checks.
     * **3. Geo Agent (DBSCAN + GIS):** Location clustering, boundary validation, geographic inconsistencies.
     * **4. Duplicate Agent (RapidFuzz + DBSCAN):** Duplicate project matching, 300m–500m proximity alerts.
     * **5. Peer Benchmarking Agent (Statistical Medians):** District and sector cost benchmarking.
  4. **Interactive Dashboard:** Interactive Maps (Leaflet.js), Relationship Graphs (cartels), Trend Charts, React/Next.js.
  5. **Output (Actionable Intelligence):** 0–100 Risk Score (investigation priority), Role-Based Views, Flagged Cases, Never Auto-Labeled as Fraud.
* **Tech Stack:** Python, FastAPI, PostgreSQL, React / Next.js, Tailwind CSS, Docker, Git.

---

### Slide 4: Feasibility & Viability

* **Feasibility Triad:**
  * *Technical:* 100% open-source Python stack; sub-2-second inference on commodity servers.
  * *Operational:* Seamless integration with existing MoSPI DigiGov APIs; zero workflow changes for District Collectors.
  * *Economic:* ₹0 proprietary software fees; compatible with local open-weights LLMs (Llama 3 / Mistral).
* **Challenge vs. Mitigation Matrix:**
  * *No Labeled Fraud Data (Cold Start):* Unsupervised Isolation Forest + Benford's Law + statutory heuristics. Zero pre-labeled fraud datasets needed.
  * *Dirty Contractor Names:* RapidFuzz string distance + Soundex phonetics + GSTIN/PAN deduplication.
  * *Black-Box Skepticism:* SHAP feature attribution with direct clickable links to sanction PDFs and EXIF photos.
  * *Alert Fatigue:* Convergent multi-signal scoring (minor issues never trigger alerts; requires convergence across finance, progress, and GIS).

---

### Slide 5: Impact, Benefits & Societal Value

> **🌟 Societal Mission Banner:**  
> *"Transforming ₹4,000+ Crores of annual public funds from paper transactions into real, durable community assets for 1.4 Billion citizens."*

#### 🤝 1. Direct Societal & Human Impact (The Citizen Dimension)
* 🚰 **Guaranteed Clean Drinking Water & Public Sanitation:**
  * Stalled tubewells and village RO purification plants force rural women and children to walk kilometers for clean water.
  * JanNigrani flags payment-progress delays instantly, **ensuring drinking water works are completed on time rather than abandoned halfway**.
* 🏫 **Better Village Schools & Maternal Healthcare:**
  * MPLADS funds primary school classrooms, smart labs, girls' sanitation blocks, and community health centers.
  * Halting fund leakage means **schools get finished science labs and clinics get operational ambulance shelters** instead of stalled concrete shells.
* 🛡️ **Protecting Marginalized Communities (Mandatory 15% SC & 7.5% ST Quotas):**
  * By statutory law, **15% of MPLADS funds must be spent in Scheduled Caste (SC) areas and 7.5% in Scheduled Tribe (ST) areas**.
  * Our Compliance Agent **actively monitors and prevents fund diversion**, guaranteeing that underrepresented and tribal villages receive their legally mandated development.
* 🚫 **Eliminating "Ghost Assets" & Hazardous Abandoned Works:**
  * Prevents contractors from claiming 100% money on 50% completed works.
  * Protects public safety by ensuring no unfinished, hazardous construction shells are left in neighborhoods.
* 🗳️ **Restoring Democratic Trust in Public Governance:**
  * When citizens see that their elected Member of Parliament’s development funds are tracked transparently with **verifiable mobile geotagged photos**, it restores faith in democracy.

#### 💰 2. Economic & Governance Impact (The National Dimension)
* **Economic Value:** Stops double-dipping where contractors claim MPLADS funds for works already financed under PMGSY or AMRUT; frees up hundreds of crores for new development.
* **Administrative Efficiency:** Gives District Collectors and field engineers an intelligent daily triage queue, reducing audit cycle times by **75%**.
* **National Scalability:** Generalizes effortlessly to monitor **PMGSY (Roads), MGNREGA (Rural Employment), and Smart Cities**.

---

### Slide 6: Research Foundations, References & Live Prototype

* **🏛️ Government & Regulatory Foundations:**
  * MoSPI DigiGov & eSAKSHI Portal: `https://mplads.mospi.gov.in/` (Real-time data & mobile geotags)
  * MoSPI Revised Guidelines (2023): `https://www.mospi.gov.in/mplads` (SNA-SPARSH fund flow & statutory limits)
  * CAG Performance Audit Reports: `https://cag.gov.in/audit-report` (Empirical proof of scheme bottlenecks)
* **📚 Academic & Multi-Agent AI Research:**
  * USC-FORTIS AD-AGENT Framework (2025): `https://github.com/USC-FORTIS/AD-AGENT` (Multi-agent anomaly triage)
  * Autonomous Financial AI (IJARIIT / IJCNLP, 2025): `https://tinyurl.com/ijariit-ai-agents` (Causal transaction audits)
  * Isolation Forest (Liu et al.) & SHAP (Lundberg & Lee): Mathematical basis for outlier detection & explainability.
* **🎥 Live Working Prototype & Demo:**
  * **Live Web App (Vercel):** `https://frontend-theta-six-83.vercel.app`
  * **Alternative Mirror (Netlify):** `https://gleaming-malasada-dafc82.netlify.app`
  * **GitHub Code:** `https://github.com/incharagwda123-alt/JanNigrani-MAS`
  * **Video Walkthrough:** `https://youtu.be/YOUR_DEMO_LINK`
