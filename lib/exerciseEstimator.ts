export function estimateExerciseByMET(
  met: number,
  weightKg: number,
  durationMinutes: number
): number {
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours);
}

export function estimateRunningCalories(
  weightKg: number,
  distanceKm: number
): number {
  return Math.round(weightKg * distanceKm);
}
