/**
 * TypeScript interfaces for Aegis backend API responses
 * These mirror the Pydantic models in the backend/main.py file
 */

export interface AssetInfo {
  asset_id: string;
  name: string;
  site: string;
  transformer_type: string;
  rating_mva: number;
  voltage_rating_kv: number;
}

export interface AssetDetail extends AssetInfo {
  default_telemetry: TelemetryData;
}

export interface HealthResponse {
  asset_id: string;
  health_score: number;
  failure_probability: number;
  estimated_rul_days: number;
  risk_level: string;
  degradation_type: string;
  is_anomaly: boolean;
  confidence: number;
}

export interface RULResponse {
  asset_id: string;
  rul_hours: number;
  rul_days: number;
  rul_years: number;
  confidence: number;
  basis: string;
  design_life_hours: number;
  percent_life_used: number;
}

export interface RiskResponse {
  asset_id: string;
  overall_risk_score: number;
  overall_risk_level: string;
  risk_level_numeric: number;
  risk_scores: Record<string, number>;
  risk_contributions_percent: Record<string, number>;
  primary_risk_drivers: string[];
  risk_recommendations: string[];
  confidence: number;
  assessment_timestamp: string;
  risk_trend: string;
  recommended_action_urgency: string;
  assessment_details?: Record<string, any>;
}

export interface DecisionResponse {
  asset_id: string;
  recommended_intervention: string;
  recommended_intervention_key: string;
  intervention_scores: Record<string, any>;
  optimal_intervention_score: number;
  explanation: string[];
  assessment_details: Record<string, any>;
}

export interface SimulationResponse {
  // Input parameters
  load_percent: number;
  ambient_temp_c: number;
  cooling_mode: string;
  harmonic_distortion_thd: number;
  simulation_hours: number;
  vibration_rms_mm_s: number;
  dielectric_stress_factor: number;
  symmetry_imbalance_percent: number;
  partial_discharge_detected: boolean;

  // Electrical parameters
  rated_current_a: number;
  actual_current_a: number;
  rated_voltage_kv: number;
  actual_voltage_kv: number;
  apparent_power_mva: number;
  real_power_mw: number;
  reactive_power_mvar: number;
  power_factor: number;
  resistance_ohm: number;
  reactance_ohm: number;
  impedance_ohm: number;
  voltage_regulation_percent: number;

  // Losses breakdown
  no_load_losses_kw: number;
  load_losses_kw: number;
  total_losses_kw: number;
  losses_breakdown: Record<string, any>;
  harmonic_loss_factors: Record<string, number>;

  // Temperatures
  oil_temp_c: number;
  winding_temp_c: number;
  hotspot_temp_c: number;
  temperature_rise_oil_c: number;
  temperature_rise_winding_c: number;
  temperature_rise_hotspot_c: number;
  hotspot_gradient_c: number;
  oil_winding_gradient_c: number;

  // Thermal time constants
  thermal_time_constants_hours: Record<string, number>;

  // Efficiency and losses
  efficiency_percent: number;
  losses_percent: number;

  // Aging and health
  health_impact_per_hour: number;
  estimated_remaining_hours: number;
  aging_rate_per_hour: number;
  design_life_hours: number;
  combined_aging_factor: number;
  aging_breakdown: Record<string, number>;

  // Risk assessment
  risk_level: string;
  risk_level_numeric: number;
  risk_confidence: number;
  risk_scores: Record<string, number>;
  max_individual_risk: number;
  significant_risk_factors: Record<string, number>;

  // Dielectric and insulation
  bil_level_kv: number;
  dielectric_stress_actual: number;
  partial_discharge_risk: string;

  // System parameters
  frequency_hz: number;
  rated_mva: number;
  voltage_rating_kv: number;
  temp_rise_limit_c: number;
  impedance_percent: number;
  x_over_r_ratio: number;

  // Timestamp
  timestamp: string;
  simulation_id: string;
}

export interface SummaryResponse {
  asset_id: string;
  health: HealthResponse;
  rul: RULResponse;
  risk: RiskResponse;
  decision: DecisionResponse;
  simulation: SimulationResponse;
  timestamp: string;
}

export interface TelemetryData {
  asset_id: string;
  load_percent: number;
  voltage_kv: number;
  current_a: number;
  ambient_temp_c: number;
  oil_temp_c: number;
  winding_temp_c: number;
  vibration_mm_s: number;
  operating_hours: number;
}

export interface SimulationRequest {
  load_percent: number;
  ambient_temp_c: number;
  cooling_mode: string;
  harmonic_distortion_thd: number;
  hours_at_conditions: number;
  vibration_rms_mm_s: number;
  dielectric_stress_factor: number;
  symmetry_imbalance_percent: number;
  partial_discharge_detected: boolean;
}