export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export type SkillStatus = 'Ready' | 'Developing' | 'Needs Work';

export function getSkillStatus(current: number, required: number): SkillStatus {
  if (current >= required) return 'Ready';
  if (current >= required - 20) return 'Developing';
  return 'Needs Work';
}

export function getStatusColor(status: SkillStatus): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (status) {
    case 'Ready':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    case 'Developing':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'Needs Work':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-300',
      };
  }
}
