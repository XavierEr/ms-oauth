interface DgpSystem {
  agencyAbbreviation: string;
  systemId: string;
  systemName: string;
  systemDescription: string;
  systemStatus: SystemStatus;
  systemCriticality: SystemCriticality;
  securityClassification: SecurityClassification;
  sensitivityClassification: SensitivityClassification;
  subsystemId: string;
  subsystemName: string;
  subsystemDescription: string; // Contains html tags
  subsystemStatus: SubsystemStatus;
  internetAccessible: InternetAccessible;
  computedRiskMaterialityLevel: ComputedRiskMaterialityLevel;
  agencyProposedRiskMaterialityLevel: AgencyProposedRiskMaterialityLevel;
  endorsedRiskMaterialityLevel: EndorsedRiskMaterialityLevel;
}

interface DgpSubsystem {
  
}

type SystemStatus =
  'Active' |
  'Draft' |
  'Inactive';

type SystemCriticality =
  'CII' |
  'Others' |
  'SII';

type SecurityClassification =
  'CONFIDENTIAL (CLOUD-ELIGIBLE)' |
  'CONFIDENTIAL' |
  'OFFICIAL (CLOSED)' |
  'OFFICIAL (OPEN)' |
  'RESTRICTED' |
  'S-Class';

type SensitivityClassification =
  'No entity data' |
  'NON-SENSITIVE' |
  'SENSITIVE HIGH' |
  'SENSITIVE NORMAL';

type SubsystemStatus =
  'Decommissioned system' |
  'Maintenance of system' |
  'New system' |
  'Removed system' |
  'Replacement of existing system' |
  'Upgrade or expansion of existing system';

type InternetAccessible =
  'Not Internet Accessible' |
  'Not Public Facing' |
  'Public Facing';

type ComputedRiskMaterialityLevel =
  'Critical' |
  'High' |
  'Low' |
  'Medium';

type AgencyProposedRiskMaterialityLevel =
  'High' |
  'Low' |
  'Medium';

type EndorsedRiskMaterialityLevel =
  'High' |
  'Low' |
  'Medium';