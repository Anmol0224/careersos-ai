import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, BarChart3, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface NextActionCardProps {
  title?: string;
  duration?: string;
  difficulty?: string;
  impact?: string;
  description?: string;
  actionRoute?: string;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  title = 'Complete the Power BI Sales Dashboard Challenge',
  duration = '45 min',
  difficulty = 'Intermediate',
  impact = 'High Impact',
  description = 'Build a multi-region retail performance dashboard to bridge your highest priority gap (+34 Power BI improvement potential).',
  actionRoute = '/challenge',
}) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-[#14213D] to-[#1c2e56] text-white border-none shadow-md overflow-hidden relative">
      {/* Subtle background decoration */}
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Header pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next Best Action</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {title}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {description}
            </p>

            {/* Badges / Meta */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                <span>{difficulty}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-md">
                <Zap className="w-3.5 h-3.5" />
                <span>{impact}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 pt-2 lg:pt-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(actionRoute)}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="w-full sm:w-auto shadow-lg shadow-blue-900/40 bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Start Challenge
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
