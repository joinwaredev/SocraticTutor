import React, { useState } from 'react';
import { Badge, SparkyCostume } from '../types';
import { Award, Lock, Sparkles, Check, Flame, Trophy, Shirt } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  stars: number;
  badges: Badge[];
  costumes: SparkyCostume[];
  activeCostumeId: string;
  onEquipCostume: (id: string) => void;
  onBuyCostume: (costume: SparkyCostume) => void;
  streakDays: number;
  whyCount: number;
}

export const RewardRoom: React.FC<Props> = ({
  stars,
  badges,
  costumes,
  activeCostumeId,
  onEquipCostume,
  onBuyCostume,
  streakDays,
  whyCount,
}) => {
  const [unlockedCostumeIds, setUnlockedCostumeIds] = useState<string[]>([
    'costume-detective',
  ]);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handlePurchase = (costume: SparkyCostume) => {
    if (stars < costume.cost) return;
    setUnlockedCostumeIds((prev) => [...prev, costume.id]);
    onBuyCostume(costume);
    fireConfetti();
  };

  const activeCostume = costumes.find((c) => c.id === activeCostumeId) || costumes[0];

  return (
    <div className="space-y-6">
      {/* Gamified Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> Trophy Room & Sparky's Closet
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold drop-shadow-xs">
            Celebrate Your Mathematical Journey! 🎉
          </h2>
          <p className="text-sm text-amber-100 max-w-lg font-medium">
            Earn Spark Stars by tackling steps and asking <strong>"Why did we do that?"</strong>. Use your stars to unlock fun costumes for Coach Sparky!
          </p>
        </div>

        {/* Currency Card */}
        <div className="bg-white/95 backdrop-blur text-slate-800 p-4 rounded-3xl shadow-md flex items-center gap-4 shrink-0 border-2 border-amber-200">
          <div className="text-center px-2">
            <div className="text-xs font-bold uppercase text-slate-400">Your Stars</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-500 flex items-center gap-1">
              ⭐ {stars}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-xs font-bold uppercase text-slate-400">Streak</div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-orange-500 flex items-center gap-1">
              🔥 {streakDays}d
            </div>
          </div>
        </div>
      </div>

      {/* Sparky's Avatar Customizer */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
              <Shirt className="w-5 h-5 text-amber-600" />
              Coach Sparky's Outfits
            </h3>
            <p className="text-xs text-slate-500">Equip costumes to customize your patient tutor during math sessions.</p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            <span className="text-2xl animate-float">{activeCostume.icon}</span>
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Equipped</span>
              <span className="font-bold text-amber-900">{activeCostume.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {costumes.map((costume) => {
            const isUnlocked = unlockedCostumeIds.includes(costume.id);
            const isEquipped = activeCostumeId === costume.id;

            return (
              <div
                key={costume.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-amber-300'
                    : 'border-slate-200 bg-slate-50/70 opacity-80'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto shadow-xs">
                    {costume.icon}
                  </div>
                  <div className="text-center">
                    <h4 className="font-heading font-bold text-sm text-slate-800">{costume.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{costume.description}</p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  {isEquipped ? (
                    <div className="w-full py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Equipped
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        onEquipCostume(costume.id);
                        fireConfetti();
                      }}
                      className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Wear Outfit
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(costume)}
                      disabled={stars < costume.cost}
                      className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Unlock for ⭐ {costume.cost}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges of Mathematical Bravery */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-200/80 space-y-4">
        <div>
          <h3 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Badges of Mathematical Bravery
          </h3>
          <p className="text-xs text-slate-500">Badges celebrate patience, question-asking, and step-by-step thinking.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked =
              badge.id === 'badge-first-step' ||
              (badge.id === 'badge-why-1' && whyCount >= 1) ||
              (badge.id === 'badge-why-5' && whyCount >= 5) ||
              badge.id === 'badge-scaffold-master';

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-amber-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                    isUnlocked ? 'bg-amber-200/80' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-slate-800">{badge.name}</h4>
                    {isUnlocked && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                        Earned!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{badge.description}</p>
                  <p className="text-[11px] text-amber-800 font-semibold pt-0.5">
                    🎯 {badge.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
