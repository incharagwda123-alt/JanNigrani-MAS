from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from schemas.project import ProjectRecord

class AgentSignal(BaseModel):
    agent_name: str
    signal_type: str
    weight: float
    description: str
    evidence_ref: Optional[str] = None

class DuplicateMatch(BaseModel):
    matched_project_id: str
    semantic_similarity: float
    distance_meters: float
    same_contractor: bool

class SharedProjectState(BaseModel):
    """
    Immutable Shared Project State object carried across every agent
    in the LangGraph supervisor pipeline.
    """
    project: ProjectRecord
    
    # Flags updated sequentially by agents
    data_quality_flags: List[str] = Field(default_factory=list)
    compliance_flags: List[str] = Field(default_factory=list)
    financial_signals: Dict[str, Any] = Field(default_factory=dict)
    duplicate_matches: List[DuplicateMatch] = Field(default_factory=list)
    network_signals: Dict[str, Any] = Field(default_factory=dict)
    
    # Composite risk components
    f_score: float = 0.0  # Financial risk (0-100)
    t_score: float = 0.0  # Timeline delay risk (0-100)
    d_score: float = 0.0  # Duplicate similarity risk (0-100)
    c_score: float = 0.0  # Compliance gap risk (0-100)
    p_score: float = 0.0  # Payment-progress mismatch risk (0-100)
    g_score: float = 0.0  # Geographic/Network cartel risk (0-100)
    
    # Final composite score: R = 0.25F + 0.20T + 0.20D + 0.15C + 0.10P + 0.10G
    composite_risk_score: Optional[float] = None
    priority_tier: Optional[str] = None  # HIGH, MEDIUM, LOW
    
    # Traceable evidence dossier
    contributing_signals: List[AgentSignal] = Field(default_factory=list)
    evidence_bundle: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    
    # Review workflow
    review_status: str = Field(default="pending", description="pending | verified | dismissed | escalated")
    reviewer_notes: Optional[str] = None
