
import React, { useState } from 'react';
import { FailureCategory, FAILURE_TAGS, FAILURE_SCENARIOS, FailureLog } from '../types';
import { Plus, Loader2, Target, Globe, Lock, Coins, ChevronDown } from 'lucide-react';
import { analyzeFailure } from '../services/geminiService';

interface Props {
  onAdd: (log: FailureLog) => void;
}

export const FailureForm: React.FC<Props> = ({ onAdd }) => {
  const [step, setStep] = useState<'category' | 'scenario' | 'details'>('category');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FailureCategory>('Mock Exam');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const availableScenarios = FAILURE_SCENARIOS.filter(s => s.category === category);
  const selectedScenarioData = FAILURE_SCENARIOS.find(s => s.id === selectedScenario);

  const toggleTag = (label: string) => {
    setSelectedTags(prev => 
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario || !description) return;

    setIsLoading(true);
    const newLogBase = {
      title: selectedScenarioData?.label || title,
      date: new Date().toISOString().split('T')[0],
      category,
      score,
      tags: selectedTags,
      description,
    };

    const aiAdvice = await analyzeFailure(newLogBase);

    const newLog: FailureLog = {
      ...newLogBase,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      authorId: 'me',
      authorName: '나',
      aiAdvice,
      createdAt: Date.now(),
      likes: 0,
      dislikes: 0,
      isPublic,
      rewardClaimed: false
    };

    onAdd(newLog);
    setIsLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setStep('category');
    setTitle('');
    setSelectedScenario('');
    setDescription('');
    setScore('');
    setSelectedTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-500 px-4 py-1 text-[10px] font-bold rounded-bl-xl flex items-center gap-1">
        <Coins size={12} /> 작성 시 +500P
      </div>
      
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Target className="text-red-500" /> 망한 기록 작성하기
      </h2>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-2 ${step === 'category' ? 'text-red-500' : step === 'scenario' || step === 'details' ? 'text-green-500' : 'text-slate-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'category' ? 'bg-red-500 text-white' : step === 'scenario' || step === 'details' ? 'bg-green-500 text-white' : 'bg-slate-700'}`}>1</div>
          <span className="text-sm font-medium">카테고리</span>
        </div>
        <div className={`flex-1 h-0.5 mx-3 ${step === 'scenario' || step === 'details' ? 'bg-green-500' : 'bg-slate-700'}`}></div>
        <div className={`flex items-center gap-2 ${step === 'scenario' ? 'text-red-500' : step === 'details' ? 'text-green-500' : 'text-slate-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'scenario' ? 'bg-red-500 text-white' : step === 'details' ? 'bg-green-500 text-white' : 'bg-slate-700'}`}>2</div>
          <span className="text-sm font-medium">상황</span>
        </div>
        <div className={`flex-1 h-0.5 mx-3 ${step === 'details' ? 'bg-green-500' : 'bg-slate-700'}`}></div>
        <div className={`flex items-center gap-2 ${step === 'details' ? 'text-red-500' : 'text-slate-500'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'details' ? 'bg-red-500 text-white' : 'bg-slate-700'}`}>3</div>
          <span className="text-sm font-medium">세부사항</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Step 1: Category Selection */}
        {step === 'category' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="font-bold text-slate-200 mb-3">어떤 분야에서 실패했나요?</h3>
            <div className="grid grid-cols-1 gap-3">
              {(['Mock Exam', 'Daily Plan', 'Health/Mental', 'Study Method', 'Mock Interview'] as FailureCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setStep('scenario');
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:border-red-500 ${
                    category === cat ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-slate-200">
                    {cat === 'Mock Exam' && '📝 모의고사/정기시험'}
                    {cat === 'Daily Plan' && '📅 일일 계획/루틴'}
                    {cat === 'Health/Mental' && '🧠 건강/멘탈 관리'}
                    {cat === 'Study Method' && '📚 학습 방법'}
                    {cat === 'Mock Interview' && '🎤 모의 면접/발표'}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {cat === 'Mock Exam' && '시험에서 발생한 실수나 실패'}
                    {cat === 'Daily Plan' && '계획 실행이나 루틴 관리 실패'}
                    {cat === 'Health/Mental' && '컨디션이나 멘탈 관리 실패'}
                    {cat === 'Study Method' && '공부 방법이나 전략의 문제'}
                    {cat === 'Mock Interview' && '면접이나 발표에서의 실패'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Scenario Selection */}
        {step === 'scenario' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200">구체적으로 어떤 상황이었나요?</h3>
              <button type="button" onClick={() => setStep('category')} className="text-slate-500 hover:text-slate-300 text-sm">← 뒤로</button>
            </div>
            <div className="space-y-3">
              {availableScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenario(scenario.id);
                    setStep('details');
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-red-500 ${
                    selectedScenario === scenario.id ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-slate-200 mb-1">{scenario.label}</div>
                  <div className="text-sm text-slate-400">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200">세부 정보를 입력해주세요</h3>
              <button type="button" onClick={() => setStep('scenario')} className="text-slate-500 hover:text-slate-300 text-sm">← 뒤로</button>
            </div>

            {selectedScenarioData && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <div className="text-sm text-slate-400 mb-1">선택한 상황</div>
                <div className="font-bold text-slate-200">{selectedScenarioData.label}</div>
              </div>
            )}

            <input
              type="text"
              placeholder="결과/점수 (선택사항)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={score}
              onChange={e => setScore(e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">실패 원인 태그 (복수 선택 가능)</label>
              <div className="flex flex-wrap gap-2">
                {FAILURE_TAGS.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      selectedTags.includes(tag.label) 
                        ? 'bg-red-500 border-red-400 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="나에게 남기는 피드백 - 솔직하게 기록해보세요. (어떤 기분이었는지, 다음엔 어떻게 할지...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                {isPublic ? <Globe size={18} className="text-blue-400" /> : <Lock size={18} className="text-slate-500" />}
                <div>
                  <p className="text-sm font-bold text-slate-200">커뮤니티 공개 여부</p>
                  <p className="text-[10px] text-slate-500">공개 시 다른 유저에게 도움을 주고 포인트를 얻습니다.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-red-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedScenario || !description}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" /> AI 분석하는 중...</>
              ) : (
                <><Plus size={20} /> 실패 등록하고 500P 받기</>
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
