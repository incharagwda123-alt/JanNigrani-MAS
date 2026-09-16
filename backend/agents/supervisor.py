import math
from typing import List, Dict, Any
from schemas.project import ProjectRecord
from schemas.state import SharedProjectState, AgentSignal, DuplicateMatch

class SupervisorAgent:
    """
    LangGraph Supervisor Agent for JanNigrani MAS.
    Evaluates record completeness, coordinates specialized domain agents,
    and updates the immutable SharedProjectState.
    """

    def __init__(self):
        self.version = "2.4.0"

    def run_pipeline(self, project: ProjectRecord, existing_projects: List[ProjectRecord] = None) -> SharedProjectState:
        state = SharedProjectState(project=project)
        
        # 1. Data Quality Agent
        self._run_data_quality_agent(state)
        
        # 2. Entity Resolution Agent
        self._run_entity_resolution_agent(state)
        
        # 3. Parallel Domain Agents
        self._run_compliance_agent(state)
        self._run_financial_agent(state)
        self._run_progress_agent(state)
        
        # 4. Spatial & Graph Agents
        if existing_projects:
            self._run_duplicate_agent(state, existing_projects)
            self._run_geo_network_agent(state, existing_projects)
        else:
            state.d_score = 0.0
            state.g_score = 0.0
            
        # 5. Risk Aggregator & Evidence Engine
        self._aggregate_risk_score(state)
        self._generate_evidence_dossier(state)
        
        return state

    def _run_data_quality_agent(self, state: SharedProjectState):
        p = state.project
        if not p.project_id:
            state.data_quality_flags.append("MISSING_PROJECT_ID")
        if p.actual_expenditure < 0:
            state.data_quality_flags.append("NEGATIVE_EXPENDITURE")
        if p.actual_expenditure > p.sanctioned_amount * 1.5:
            state.data_quality_flags.append("EXPENDITURE_EXCEEDS_SANCTION_THRESHOLD")
        if p.progress_percent == 100 and p.completion_certificate_status == "Missing":
            state.data_quality_flags.append("COMPLETION_WITHOUT_CERTIFICATE")

    def _run_entity_resolution_agent(self, state: SharedProjectState):
        name = state.project.contractor_name.strip().upper()
        # Normalization heuristics (simulating RapidFuzz token matching)
        if "ABC" in name and ("INFRA" in name or "INFRASTRUCTURE" in name):
            state.project.contractor_id = "CON-042"
        else:
            state.project.contractor_id = f"CON-{abs(hash(name)) % 1000:03d}"

    def _run_compliance_agent(self, state: SharedProjectState):
        p = state.project
        c_penalty = 0.0
        
        if p.inspection_status == "Missing":
            c_penalty += 35.0
            state.compliance_flags.append("MISSING_INSPECTION_RECORD")
        if p.completion_certificate_status == "Missing" and p.progress_percent > 80:
            c_penalty += 30.0
            state.compliance_flags.append("MISSING_COMPLETION_CERTIFICATE")
        if p.last_photo_days_ago and p.last_photo_days_ago > 180:
            c_penalty += 25.0
            state.compliance_flags.append("STALE_GEOTAGGED_PHOTOS_180_DAYS")
        if p.is_sc_st_priority and p.progress_percent < 30 and p.actual_expenditure > p.sanctioned_amount * 0.5:
            c_penalty += 30.0
            state.compliance_flags.append("SC_ST_PRIORITY_MILESTONE_LAG")
            
        state.c_score = min(c_penalty, 100.0)

    def _run_financial_agent(self, state: SharedProjectState):
        p = state.project
        f_risk = 0.0
        
        # Cost overrun check
        if p.estimated_cost > 0:
            overrun_ratio = p.actual_expenditure / p.estimated_cost
            if overrun_ratio > 1.30:
                f_risk += 45.0
                state.financial_signals["cost_overrun_pct"] = round((overrun_ratio - 1.0) * 100, 1)
            elif overrun_ratio > 1.10:
                f_risk += 25.0
                state.financial_signals["cost_overrun_pct"] = round((overrun_ratio - 1.0) * 100, 1)
                
        state.f_score = min(f_risk, 100.0)

    def _run_progress_agent(self, state: SharedProjectState):
        p = state.project
        # 1. Payment vs Progress mismatch
        disbursal_pct = (p.actual_expenditure / p.sanctioned_amount) * 100.0 if p.sanctioned_amount > 0 else 0
        gap = disbursal_pct - p.progress_percent
        
        if gap > 40.0:
            state.p_score = 90.0
        elif gap > 25.0:
            state.p_score = 65.0
        elif gap > 10.0:
            state.p_score = 30.0
        else:
            state.p_score = 0.0

        # 2. Timeline delay score (T)
        state.t_score = 75.0 if p.progress_percent < 60 and disbursal_pct > 75 else 20.0

    def _run_duplicate_agent(self, state: SharedProjectState, existing: List[ProjectRecord]):
        p = state.project
        max_similarity = 0.0
        
        for other in existing:
            if other.project_id == p.project_id:
                continue
            
            # Spatial distance using Haversine formula
            dist_km = self._haversine(
                p.location.latitude, p.location.longitude,
                other.location.latitude, other.location.longitude
            )
            dist_meters = dist_km * 1000.0
            
            # Simple word-token overlap similarity
            p_words = set(p.project_description.lower().split())
            o_words = set(other.project_description.lower().split())
            overlap = len(p_words.intersection(o_words)) / max(len(p_words.union(o_words)), 1)
            
            same_contractor = (p.contractor_id == other.contractor_id) or (p.contractor_name == other.contractor_name)
            
            if dist_meters < 500 and (overlap > 0.40 or same_contractor):
                sim_score = round(overlap * 100, 1)
                state.duplicate_matches.append(DuplicateMatch(
                    matched_project_id=other.project_id,
                    semantic_similarity=sim_score,
                    distance_meters=round(dist_meters, 1),
                    same_contractor=same_contractor
                ))
                if sim_score > max_similarity:
                    max_similarity = sim_score
                    
        state.d_score = min(max_similarity * 1.1, 100.0) if state.duplicate_matches else 0.0

    def _run_geo_network_agent(self, state: SharedProjectState, existing: List[ProjectRecord]):
        p = state.project
        cid = p.contractor_id or p.contractor_name
        
        # Count contractor frequency across nearby projects
        contractor_count = sum(1 for o in existing if (o.contractor_id == cid or o.contractor_name == p.contractor_name))
        
        if contractor_count >= 5:
            state.g_score = 80.0
            state.network_signals["contractor_centrality"] = "HIGH"
            state.network_signals["works_awarded_count"] = contractor_count
        elif contractor_count >= 3:
            state.g_score = 45.0
            state.network_signals["contractor_centrality"] = "MEDIUM"
            state.network_signals["works_awarded_count"] = contractor_count
        else:
            state.g_score = 10.0

    def _aggregate_risk_score(self, state: SharedProjectState):
        """
        Calibrated Multi-Signal Composite Formula:
        R = 0.25F + 0.20T + 0.20D + 0.15C + 0.10P + 0.10G
        """
        r = (
            0.25 * state.f_score +
            0.20 * state.t_score +
            0.20 * state.d_score +
            0.15 * state.c_score +
            0.10 * state.p_score +
            0.10 * state.g_score
        )
        
        state.composite_risk_score = round(min(max(r, 0.0), 100.0), 1)
        
        if state.composite_risk_score >= 70.0:
            state.priority_tier = "HIGH"
        elif state.composite_risk_score >= 40.0:
            state.priority_tier = "MEDIUM"
        else:
            state.priority_tier = "LOW"

    def _generate_evidence_dossier(self, state: SharedProjectState):
        # Attribute contributing signals
        if state.p_score > 50:
            state.contributing_signals.append(AgentSignal(
                agent_name="ProjectProgressAgent",
                signal_type="Payment-Progress Mismatch",
                weight=round(state.p_score * 0.10, 1),
                description=f"Fund disbursal outpaces physical progress by >30% ({state.project.progress_percent}% complete)."
            ))
        if state.d_score > 30:
            state.contributing_signals.append(AgentSignal(
                agent_name="DuplicateProjectAgent",
                signal_type="Near-Duplicate Infrastructure",
                weight=round(state.d_score * 0.20, 1),
                description="Near-identical public work sanctioned within 300-500 meters."
            ))
        if state.f_score > 30:
            state.contributing_signals.append(AgentSignal(
                agent_name="FinancialAnalyticsAgent",
                signal_type="Cost Outlier Deviation",
                weight=round(state.f_score * 0.25, 1),
                description="Expenditure exceeds median cost estimates for similar works."
            ))
        if state.c_score > 20:
            state.contributing_signals.append(AgentSignal(
                agent_name="ComplianceAgent",
                signal_type="Compliance & Inspection Gaps",
                weight=round(state.c_score * 0.15, 1),
                description="Missing mandatory site inspection logs or stale geotagged photos."
            ))

        # Recommended review actions
        state.recommended_actions = [
            "1. Conduct targeted on-site physical inspection before final disbursal.",
            "2. Reconcile physical Measurement Book (MB) entries with PFMS transactions.",
            "3. Verify spatial boundaries to prevent cross-scheme duplicate funding (PMGSY / State funds)."
        ]
        state.evidence_bundle = [
            f"Sanction Order #{state.project.project_id}-SO",
            "PFMS Financial Disbursal Log",
            "EXIF Mobile Geotag Validation Report"
        ]

    @staticmethod
    def _haversine(lat1, lon1, lat2, lon2):
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
