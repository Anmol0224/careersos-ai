import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, ArrowUpRight, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProgressMetrics } from '../../data/mockData';

export const ProgressHistoryCard: React.FC = () => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">Recent Progress & Improvements</CardTitle>
            <p className="text-xs text-[#475569]">Evidence-backed gains from completed challenges & projects</p>
          </div>
        </div>
        <Link
          to="/result"
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
        >
          <span>View Detailed Results</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Featured Readiness Improvement Banner */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Career Readiness Lift
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0F172A]">74</span>
                <span className="text-base font-bold text-[#94A3B8]">→</span>
                <span className="text-2xl font-black text-emerald-700">81</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full ml-1">
                  +7 points
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-emerald-800/80 sm:max-w-xs">
            Driven by your practical submission on business intelligence modeling and SQL joins.
          </p>
        </div>

        {/* Sub metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockProgressMetrics.slice(1).map((metric) => (
            <div
              key={metric.label}
              className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#475569] mb-1 font-medium">
                <span className="truncate">{metric.label}</span>
                <span className="flex items-center font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{metric.delta}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-sm font-semibold text-[#94A3B8]">{metric.previous}</span>
                <span className="text-xs text-[#94A3B8]">→</span>
                <span className="text-base font-bold text-[#0F172A]">{metric.current}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
