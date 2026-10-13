'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiService } from '@/lib/apiService';
import type { DecisionResponse, HealthResponse, RULResponse, RiskResponse, SimulationResponse, TelemetryData, AssetInfo } from '@/types/api';

export default function DecisionCenterPage() {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [interventions, setInterventions] = useState<Array<any>>([]);
  const [recommended, setRecommended] = useState<string>('REDUCE_LOAD');
  const [assetHealth, setAssetHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const result = await apiService.getAssets();
        setAssets(result.assets);
        if (result.assets.length > 0 && !selectedAsset) {
          setSelectedAsset(result.assets[0].asset_id);
        }
      } catch (err) {
        console.error('Failed to fetch assets:', err);
        setError('Failed to load asset list.');
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (!selectedAsset) return;
    
    const fetchDecisionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get asset info to use its default telemetry
        const assetInfo = await apiService.getAssetInfo(selectedAsset);
        
        // Use asset's default telemetry
        const telemetry = assetInfo.default_telemetry;

        // Fetch all necessary data for the decision analysis
        const [healthResult, rulResult, riskResult, decisionResult] = await Promise.all([
          apiService.getAssetHealth(selectedAsset, telemetry),
          apiService.getAssetRUL(selectedAsset, telemetry),
          apiService.getAssetRisk(selectedAsset, telemetry),
          // For decision, we need to construct a proper telemetry object
          (async () => {
            const healthResult = await apiService.getAssetHealth(selectedAsset, telemetry);
            const rulResult = await apiService.getAssetRUL(selectedAsset, telemetry);
            const riskResult = await apiService.getAssetRisk(selectedAsset, telemetry);

            // Create a simulation request based on current conditions
            const simRequest = {
              load_percent: telemetry.load_percent,
              ambient_temp_c: telemetry.ambient_temp_c,
              cooling_mode: "normal",
              harmonic_distortion_thd: 0.05,
              hours_at_conditions: 1.0,
              vibration_rms_mm_s: telemetry.vibration_mm_s,
              dielectric_stress_factor: 1.0,
              symmetry_imbalance_percent: 0.0,
              partial_discharge_detected: false
            };

            const simulationResult = await apiService.simulateAsset(selectedAsset, simRequest);

            return apiService.getAssetDecision(selectedAsset, telemetry);
          })()
        ]);

        // Process the decision results into the format expected by the UI
        const processedInterventions = [
          {
            key: 'CONTINUE_OPERATION',
            label: 'Continue Operation',
            decisionScore: Math.round(decisionResult.intervention_scores?.CONTINUE_OPERATION?.score || 42),
            riskScore: Math.round(decisionResult.intervention_scores?.CONTINUE_OPERATION?.risk || 65),
            cost: 0,
            downtime: 0,
            lifeImpact: 0,
            reasoning: decisionResult.explanation?.find(exp => exp.toLowerCase().includes('continue')) ||
                      'Maintains service but leaves thermal risk elevated.',
          },
          {
            key: 'REDUCE_LOAD',
            label: 'Reduce Load',
            decisionScore: Math.round(decisionResult.intervention_scores?.REDUCE_LOAD?.score || 31),
            riskScore: Math.round(decisionResult.intervention_scores?.REDUCE_LOAD?.risk || 38),
            cost: Math.round(decisionResult.intervention_scores?.REDUCE_LOAD?.cost || 7500),
            downtime: 0,
            lifeImpact: 0,
            reasoning: decisionResult.explanation?.find(exp => exp.toLowerCase().includes('reduce')) ||
                      'Cuts thermal stress quickly with minimal operating disruption.',
          },
          {
            key: 'SCHEDULE_MAINTENANCE',
            label: 'Schedule Maintenance',
            decisionScore: Math.round(decisionResult.intervention_scores?.SCHEDULE_MAINTENANCE?.score || 45),
            riskScore: Math.round(decisionResult.intervention_scores?.SCHEDULE_MAINTENANCE?.risk || 55),
            cost: Math.round(decisionResult.intervention_scores?.SCHEDULE_MAINTENANCE?.cost || 15000),
            downtime: Math.round(decisionResult.intervention_scores?.SCHEDULE_MAINTENANCE?.downtime || 4),
            lifeImpact: Math.round(decisionResult.intervention_scores?.SCHEDULE_MAINTENANCE?.life_impact || 25),
            reasoning: decisionResult.explanation?.find(exp => exp.toLowerCase().includes('maintenance')) ||
                      'Addresses degradation causes but requires a planned outage.',
          },
          {
            key: 'REPLACE_ASSET',
            label: 'Replace Asset',
            decisionScore: Math.round(decisionResult.intervention_scores?.REPLACE_ASSET?.score || 58),
            riskScore: Math.round(decisionResult.intervention_scores?.REPLACE_ASSET?.risk || 70),
            cost: Math.round(decisionResult.intervention_scores?.REPLACE_ASSET?.cost || 200000),
            downtime: Math.round(decisionResult.intervention_scores?.REPLACE_ASSET?.downtime || 8),
            lifeImpact: Math.round(decisionResult.intervention_scores?.REPLACE_ASSET?.life_impact || 365),
            reasoning: decisionResult.explanation?.find(exp => exp.toLowerCase().includes('replace')) ||
                      'Resets asset health but carries high cost and downtime.',
          },
        ];

        // Find the recommended intervention (highest score)
        const recommendedIntervention = processedInterventions.reduce((prev, current) =>
          (prev.decisionScore > current.decisionScore) ? prev : current
        );

        setInterventions(processedInterventions);
        setRecommended(recommendedIntervention.key);
        setAssetHealth({
          healthScore: Math.round(healthResult.health_score),
          failureProbability: Math.round(healthResult.failure_probability),
          rulDays: Math.round(rulResult.rul_days),
          riskLevel: riskResult.overall_risk_level
        });
      } catch (err) {
        console.error('Failed to fetch decision data:', err);
        setError('Failed to load decision data. Using fallback data.');

        // Fallback to static data if API call fails
        setInterventions([
          {
            key: 'CONTINUE_OPERATION',
            label: 'Continue Operation',
            decisionScore: 42,
            riskScore: 65,
            cost: 0,
            downtime: 0,
            lifeImpact: 0,
            reasoning: 'Maintains service but leaves thermal risk elevated.',
          },
          {
            key: 'REDUCE_LOAD',
            label: 'Reduce Load',
            decisionScore: 31,
            riskScore: 38,
            cost: 7500,
            downtime: 0,
            lifeImpact: 8,
            reasoning: 'Cuts thermal stress quickly with minimal operating disruption.',
          },
          {
            key: 'SCHEDULE_MAINTENANCE',
            label: 'Schedule Maintenance',
            decisionScore: 45,
            riskScore: 55,
            cost: 15000,
            downtime: 4,
            lifeImpact: 25,
            reasoning: 'Addresses degradation causes but requires a planned outage.',
          },
          {
            key: 'REPLACE_ASSET',
            label: 'Replace Asset',
            decisionScore: 58,
            riskScore: 70,
            cost: 200000,
            downtime: 8,
            lifeImpact: 365,
            reasoning: 'Resets asset health but carries high cost and downtime.',
          },
        ]);
        setRecommended('REDUCE_LOAD');
        setAssetHealth({
          healthScore: 67,
          failureProbability: 31,
          rulDays: 41,
          riskLevel: 'HIGH'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecisionData();
  }, [selectedAsset]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Decision Center</h1>
            <p className="text-sm text-gray-500">Multi-criteria intervention analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              {assets.length > 0 && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Asset</label>
                  <select
                    value={selectedAsset}
                    onChange={event => setSelectedAsset(event.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    {assets.map(asset => (
                      <option key={asset.asset_id} value={asset.asset_id}>
                        {asset.asset_id} - {asset.name} ({asset.site})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Link className="text-sm font-medium text-blue-700" href="/">Back to Dashboard</Link>
              <Link className="text-sm font-medium text-blue-700" href="/analytics">Analytics</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && !assetHealth && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Decision Data...</h2>
              <p className="text-lg text-gray-500">Analyzing intervention options for asset {selectedAsset}</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {error && (
              <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-200">
                <h3 className="text-sm font-medium text-red-800">Data Loading Error</h3>
                <p className="mt-1 text-xs text-red-600">{error}</p>
              </div>
            )}

            <section className="mb-6 grid gap-4 sm:grid-cols-4">
              <Metric label="Health Score" value={`${assetHealth?.healthScore || '—'}/100`} />
              <Metric 
                label="Risk Level" 
                value={assetHealth?.riskLevel || '—'} 
                tone={assetHealth?.riskLevel === 'HIGH' || assetHealth?.riskLevel === 'CRITICAL' ? 'red' 
                  : assetHealth?.riskLevel === 'MEDIUM' ? 'yellow' : 'green'} 
              />
              <Metric label="RUL" value={`${assetHealth?.rulDays || '—'} days`} />
              <Metric label="Selected Asset" value={selectedAsset} />
            </section>

            <section className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Intervention Options</h2>
              <div className="mt-5 space-y-4">
                {interventions.map(item => {
                  const isRecommended = item.key === recommended;
                  return (
                    <article
                      key={item.key}
                      className={`rounded-lg border-l-4 p-5 ${isRecommended ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.label}
                            {isRecommended && <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">RECOMMENDED</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{item.reasoning}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Score {item.decisionScore}</p>
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                        <Pair label="Risk" value={item.riskScore.toFixed(1)} />
                        <Pair label="Cost" value={`$${item.cost.toLocaleString()}`} />
                        <Pair label="Downtime" value={`${item.downtime} hours`} />
                        <Pair label="Life Impact" value={`+${item.lifeImpact} days`} />
                      </dl>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'red' | 'green' | 'yellow' }) {
  let colorClass = 'text-gray-900';
  if (tone === 'red') colorClass = 'text-red-700';
  else if (tone === 'green') colorClass = 'text-green-700';
  else if (tone === 'yellow') colorClass = 'text-yellow-800';

  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}