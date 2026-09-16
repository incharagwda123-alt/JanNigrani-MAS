from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import date

class LocationSchema(BaseModel):
    state: str = Field(..., description="Indian State/UT")
    district: str = Field(..., description="District Name")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="GPS Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="GPS Longitude")

class ProjectRecord(BaseModel):
    project_id: str = Field(..., description="Unique MPLADS Project Code (e.g. MPLADS-P-1042)")
    project_description: str = Field(..., description="Scope of public work recommended by Hon'ble MP")
    mp_constituency: str = Field(..., description="Lok Sabha / Rajya Sabha Constituency")
    location: LocationSchema
    
    # Financial fields
    sanctioned_amount: float = Field(..., gt=0, description="Sanctioned budget in INR")
    estimated_cost: float = Field(..., gt=0, description="Detailed project estimate in INR")
    actual_expenditure: float = Field(..., ge=0, description="Cumulative disbursed expenditure in INR")
    
    # Milestone dates
    sanction_date: str = Field(..., description="Date of administrative sanction (YYYY-MM-DD)")
    expected_completion_date: str = Field(..., description="Target milestone completion date (YYYY-MM-DD)")
    actual_completion_date: Optional[str] = Field(None, description="Actual completion date if finished")
    progress_percent: float = Field(..., ge=0, le=100, description="Physical progress reported on ground")
    
    # Entities
    contractor_name: str = Field(..., description="Contractor / Vendor name")
    contractor_id: Optional[str] = Field(None, description="Resolved canonical contractor ID")
    implementing_agency: str = Field(..., description="Executing agency (e.g. ZP, PWD, Municipal Corp)")
    
    # Compliance proofs
    inspection_status: str = Field(..., description="Status of mandatory site inspections (Verified / Pending / Missing)")
    completion_certificate_status: str = Field(..., description="Status of completion certificate (Submitted / Missing)")
    last_photo_days_ago: Optional[int] = Field(None, description="Days since last mobile geotagged photo was uploaded")
    category: Optional[str] = Field("Community Assets", description="MPLADS work category (Drinking Water, Education, Roads, Health)")
    is_sc_st_priority: Optional[bool] = Field(False, description="Flag indicating if project falls under 15% SC or 7.5% ST quota")

class ProjectBatch(BaseModel):
    batch_id: str
    records: List[ProjectRecord]
