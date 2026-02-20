import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, School, Target, BookOpen, Clock, MapPin, Save } from 'lucide-react';

interface Props {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
  onClose: () => void;
}

export const ProfileForm: React.FC<Props> = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    school: user.school || '',
    grade: user.grade || '',
    targetUniversity: user.targetUniversity || '',
    currentGrades: {
      korean: user.currentGrades?.korean || '',
      math: user.currentGrades?.math || '',
      english: user.currentGrades?.english || '',
      science1: user.currentGrades?.science1 || '',
      science2: user.currentGrades?.science2 || '',
      social: user.currentGrades?.social || ''
    },
    studyHoursPerDay: user.studyHoursPerDay || 8,
    weakSubjects: user.weakSubjects || [],
    studyLocation: user.studyLocation || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: UserProfile = {
      ...user,
      ...formData,
      profileCompleted: true
    };
    
    onUpdate(updatedUser);
    onClose();
  };

  const handleWeakSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject)
        ? prev.weakSubjects.filter(s => s !== subject)
        : [...prev.weakSubjects, subject]
    }));
  };

  const gradeOptions = ['1등급', '2등급', '3등급', '4등급', '5등급', '6등급', '7등급', '8등급', '9등급'];
  const subjectOptions = ['국어', '수학', '영어', '물리', '화학', '생명과학', '지구과학', '한국사', '세계사', '동아시아사', '경제', '정치와법', '사회문화', '생활과윤리', '윤리와사상'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold">프로필 설정</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <School size={16} className="inline mr-2" />
                  소속 학교/학원
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 서울고등학교, 대치학원"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  학년
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택하세요</option>
                  <option value="고1">고1</option>
                  <option value="고2">고2</option>
                  <option value="고3">고3</option>
                  <option value="N수생">N수생</option>
                </select>
              </div>
            </div>

            {/* 목표 대학 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Target size={16} className="inline mr-2" />
                목표 대학/학과
              </label>
              <input
                type="text"
                value={formData.targetUniversity}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 서울대 의대, 연세대 공대"
              />
            </div>

            {/* 현재 성적 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                <BookOpen size={16} className="inline mr-2" />
                현재 성적 (최근 모의고사 기준)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">국어</label>
                  <select
                    value={formData.currentGrades.korean}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      currentGrades: { ...prev.currentGrades, korean: e.target.value }
                    }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">수학</label>
                  <select
                    value={formData.currentGrades.math}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      currentGrades: { ...prev.currentGrades, math: e.target.value }
                    }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">영어</label>
                  <select
                    value={formData.currentGrades.english}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      currentGrades: { ...prev.currentGrades, english: e.target.value }
                    }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">과탐1/사탐1</label>
                  <select
                    value={formData.currentGrades.science1 || formData.currentGrades.social}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      currentGrades: { 
                        ...prev.currentGrades, 
                        science1: e.target.value,
                        social: e.target.value 
                      }
                    }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">과탐2/사탐2</label>
                  <select
                    value={formData.currentGrades.science2}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      currentGrades: { ...prev.currentGrades, science2: e.target.value }
                    }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 공부 시간 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Clock size={16} className="inline mr-2" />
                하루 평균 공부 시간: {formData.studyHoursPerDay}시간
              </label>
              <input
                type="range"
                min="1"
                max="16"
                value={formData.studyHoursPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, studyHoursPerDay: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1시간</span>
                <span>16시간</span>
              </div>
            </div>

            {/* 약한 과목 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                약한 과목 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {subjectOptions.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleWeakSubjectToggle(subject)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      formData.weakSubjects.includes(subject)
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* 주 공부 장소 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin size={16} className="inline mr-2" />
                주 공부 장소
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['집', '도서관', '학원', '독서실', '학교', '카페'].map(location => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, studyLocation: location }))}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      formData.studyLocation === location
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                프로필 저장
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};