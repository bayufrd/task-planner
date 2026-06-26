/**
 * Adaptive Behavior Engine - Pure Logic-Based Analysis
 * No external AI required
 */

export interface TaskStats {
  total?: number;
  todo?: number;
  inProgress?: number;
  done?: number;
  skipped?: number;
  // VueJS API format
  pending?: number;
}

export interface DailyStatsItem {
  date: string;
  created: number;
  completed: number;
}

export interface WeeklyStatsItem {
  week: string;
  created: number;
  completed: number;
}

export interface AdviceItem {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

export interface AdaptiveBehaviorResponse {
  score: number;
  level: number;
  color: string;
  archetype: 'snail' | 'dragon' | 'balanced';
  archetypeName: string;
  archetypeDescription: string;
  imagePath: string;
  imageUrl: string;
  insights: string[];
  advice: AdviceItem[];
  stats: {
    completionRate: number;
    skipRate: number;
    consistencyScore: number;
    avgDailyCompletion: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    skippedTasks: number;
  };
  progressToNext: number;
}

// Level mapping based on score
const LEVEL_MAP = [
  { maxScore: 10, level: 1, name: 'Batu Rebahan', description: 'Hampir tidak bergerak, task cuma dilihat doang', color: 'gray' },
  { maxScore: 20, level: 2, name: 'Siput Loading', description: 'Ada niat, tapi progress lambat banget', color: 'amber' },
  { maxScore: 30, level: 3, name: 'Kucing Mager', description: 'Mau produktif, tapi kasur lebih kuat', color: 'orange' },
  { maxScore: 40, level: 4, name: 'Panda Santuy', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', color: 'gray' },
  { maxScore: 50, level: 5, name: 'Badak Si Pemalas', description: 'Kuat sebenarnya, tapi susah mulai', color: 'slate' },
  { maxScore: 60, level: 6, name: 'Bebek Mulai Jalan', description: 'Sudah mulai konsisten, walau masih goyang', color: 'yellow' },
  { maxScore: 70, level: 7, name: 'Kelinci Si Rajin', description: 'Task mulai banyak selesai, ritme bagus', color: 'pink' },
  { maxScore: 80, level: 8, name: 'Semut Produktif', description: 'Rapi, konsisten, dan jarang skip', color: 'amber' },
  { maxScore: 90, level: 9, name: 'Elang Fokus', description: 'Fokus tinggi, prioritas jelas', color: 'purple' },
  { maxScore: 100, level: 10, name: 'Naga Deadline', description: 'Mode legenda, task tunduk semua', color: 'red' },
];

/**
 * Calculate daily consistency score (0-100)
 * Based on variance in daily completions
 */
function calculateConsistencyScore(dailyStats: DailyStatsItem[]): number {
  if (!dailyStats || dailyStats.length < 2) return 50;

  const completions = dailyStats.map(d => d.completed);
  const avg = completions.reduce((sum, c) => sum + c, 0) / completions.length;
  
  if (avg === 0) return 30; // No completions at all
  
  // Calculate coefficient of variation (lower is better)
  const variance = completions.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / completions.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / avg;
  
  // Convert to score (cv of 0 = 100, cv of 2+ = 0)
  const score = Math.max(0, Math.min(100, 100 - (cv * 50)));
  
  return Math.round(score);
}

/**
 * Detect behavioral archetype based on patterns
 */
function detectArchetype(
  completionRate: number,
  skipRate: number,
  consistencyScore: number
): 'snail' | 'dragon' | 'balanced' {
  // Snail: High skip rate or low completion
  if (skipRate > 25 || completionRate < 30) {
    return 'snail';
  }
  
  // Dragon: High completion, low skip, good consistency
  if (completionRate > 60 && skipRate < 15 && consistencyScore > 60) {
    return 'dragon';
  }
  
  // Balanced: Everything else
  return 'balanced';
}

/**
 * Generate insights based on behavior patterns
 */
function generateInsights(
  _stats: TaskStats,
  _dailyStats: DailyStatsItem[],
  completionRate: number,
  skipRate: number,
  consistencyScore: number,
  avgDailyCompletion: number,
  archetype: 'snail' | 'dragon' | 'balanced'
): string[] {
  const insights: string[] = [];
  
  // Completion insight
  if (completionRate >= 70) {
    insights.push('Tingkat penyelesaian Anda sangat tinggi, pertahankan momentum!');
  } else if (completionRate >= 50) {
    insights.push('Separuh dari tugas Anda sudah terselesaikan, terus tingkatkan!');
  } else if (completionRate >= 30) {
    insights.push('Banyak tugas yang belum terselesaikan, coba fokus lebih.');
  } else {
    insights.push('Tingkat penyelesaian masih rendah, mulai dengan tugas kecil dulu.');
  }
  
  // Skip rate insight
  if (skipRate > 30) {
    insights.push('Tingkat skip cukup tinggi, pertimbangkan untuk memecah tugas besar.');
  } else if (skipRate < 10) {
    insights.push('Anda jarang melewatkan tugas, luar biasa!');
  }
  
  // Consistency insight
  if (consistencyScore >= 70) {
    insights.push('Konsistensi Anda sangat baik dalam menyelesaikan tugas harian.');
  } else if (consistencyScore < 40) {
    insights.push('Variasi penyelesaian harian cukup tinggi, coba atur jadwal lebih rutin.');
  }
  
  // Average daily completion
  if (avgDailyCompletion >= 5) {
    insights.push(`Rata-rata ${avgDailyCompletion.toFixed(1)} tugas selesai per hari, produktivitas tinggi!`);
  } else if (avgDailyCompletion >= 2) {
    insights.push(`Rata-rata ${avgDailyCompletion.toFixed(1)} tugas selesai per hari, mulai terbentuk kebiasaan baik.`);
  }
  
  // Archetype-specific insight
  if (archetype === 'snail') {
    insights.push('Coba mulai dengan target 1-2 tugas kecil per hari untuk membangun kebiasaan.');
  } else if (archetype === 'dragon') {
    insights.push('模式的 legenda! Anda adalah tipe yang efisien dalam menyelesaikan tugas.');
  } else {
    insights.push('Profil Anda seimbang, terus tingkatkan konsistensi untuk naik level.');
  }
  
  return insights.slice(0, 5);
}

/**
 * Generate advice based on behavior patterns
 */
function generateAdvice(
  completionRate: number,
  skipRate: number,
  consistencyScore: number,
  archetype: 'snail' | 'dragon' | 'balanced'
): AdviceItem[] {
  const advice: AdviceItem[] = [];
  
  if (archetype === 'snail' || skipRate > 25) {
    advice.push({
      title: 'Mulai dari yang Kecil',
      description: 'Pecah tugas besar menjadi chunk 15-30 menit agar lebih mudah dimulai.',
      type: 'warning',
    });
  }
  
  if (consistencyScore < 60) {
    advice.push({
      title: 'Bangun Konsistensi',
      description: 'Coba selesaikan minimal 1 tugas setiap hari pada jam yang sama.',
      type: 'info',
    });
  }
  
  if (completionRate < 50) {
    advice.push({
      title: 'Prioritaskan Tugas',
      description: 'Fokus pada tugas HIGH priority terlebih dahulu sebelum yang lain.',
      type: 'warning',
    });
  }
  
  if (archetype === 'dragon') {
    advice.push({
      title: 'Pertahankan Standar',
      description: 'Anda di jalur yang benar! Jaga konsistensi dan hindari overcommit.',
      type: 'success',
    });
  } else {
    advice.push({
      title: 'Tingkatkan Sedikit Demi Sedikit',
      description: 'Tambahkan 1 tugas lagi per hari secara bertahap.',
      type: 'info',
    });
  }
  
  return advice.slice(0, 3);
}

/**
 * Main function to calculate adaptive behavior analysis
 */
export function calculateAdaptiveBehavior(
  stats: TaskStats,
  dailyStats: DailyStatsItem[],
  _weeklyStats: WeeklyStatsItem[],
  baseUrl: string = ''
): AdaptiveBehaviorResponse {
  // Map incoming stats to expected format
  // Incoming: { pending, done, skipped } from VueJS API
  // Expected: { todo, inProgress, done, skipped, total }
  const mappedStats = {
    todo: stats.todo ?? stats.pending ?? 0,
    inProgress: stats.inProgress ?? 0,
    done: stats.done ?? 0,
    skipped: stats.skipped ?? 0,
  };
  const total = stats.total ?? (mappedStats.todo + mappedStats.inProgress + mappedStats.done + mappedStats.skipped);
  const completionRate = total > 0 ? Math.round((mappedStats.done / total) * 100) : 0;
  const skipRate = total > 0 ? Math.round((mappedStats.skipped / total) * 100) : 0;
  
  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(dailyStats);
  
  // Calculate average daily completion
  const recentDays = dailyStats.slice(-7);
  const avgDailyCompletion = recentDays.length > 0
    ? recentDays.reduce((sum, day) => sum + day.completed, 0) / recentDays.length
    : 0;
  
  // Detect archetype
  const archetype = detectArchetype(completionRate, skipRate, consistencyScore);
  
  // Calculate score (weighted formula)
  const score = Math.round(
    (completionRate * 0.45) +
    ((100 - skipRate) * 0.25) +
    (consistencyScore * 0.20) +
    (Math.min(avgDailyCompletion * 5, 10) * 0.10)
  );
  
  // Clamp score to 0-100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  // Find level info - reversed to get highest matching level
  const reversedLevels = [...LEVEL_MAP].reverse();
  const levelInfo = reversedLevels.find(l => clampedScore >= l.maxScore - 9) || LEVEL_MAP[0];
  const nextLevelScore = levelInfo.maxScore + 10;
  const progressToNext = nextLevelScore <= 100 ? nextLevelScore - clampedScore : 0;
  
  // Generate insights and advice
  const insights = generateInsights(
    stats, dailyStats, completionRate, skipRate,
    consistencyScore, avgDailyCompletion, archetype
  );
  const advice = generateAdvice(completionRate, skipRate, consistencyScore, archetype);
  
  // Build image path
  const imagePath = `/leveling/${levelInfo.level}.webp`;
  const imageUrl = baseUrl ? `${baseUrl}${imagePath}` : imagePath;
  
  return {
    score: clampedScore,
    level: levelInfo.level,
    color: levelInfo.color,
    archetype,
    archetypeName: levelInfo.name,
    archetypeDescription: levelInfo.description,
    imagePath,
    imageUrl,
    insights,
    advice,
    stats: {
      completionRate,
      skipRate,
      consistencyScore,
      avgDailyCompletion: Math.round(avgDailyCompletion * 10) / 10,
      totalTasks: total,
      completedTasks: mappedStats.done,
      pendingTasks: mappedStats.todo + mappedStats.inProgress,
      skippedTasks: mappedStats.skipped,
    },
    progressToNext,
  };
}
