import React, { useMemo } from 'react';
import { FailureLog, UserProfile, AdminStats, FailureCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, Target, TrendingDown, Download, School, Trophy, MapPin } from 'lucide-react';

interface Props {
  logs: FailureLog[];
  users: UserProfile[];
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

export const AdminPanel: React.FC<Props> = ({ logs, users }) => {
  const stats = useMemo(() => {
    // 학교별 분석
    const schoolData = users.reduce((acc: any, user) => {
      if (!user.school) return acc;
      if (!acc[user.school]) {
        acc[user.school] = { users: [], logs: [] };
      }
      acc[user.school].users.push(user);
      const userLogs = logs.filter(log => log.authorId === user.id);
      acc[user.school].logs.push(...userLogs);
      return acc;
    }, {});

    const schoolAnalysis = Object.entries(schoolData).map(([school, data]: [string, any]) => {
      const schoolUsers = data.users;
      const schoolLogs = data.logs;
      
      const failureTypes: any = {};
      schoolLogs.forEach((log: FailureLog) => {
        failureTypes[log.category] = (failureTypes[log.category] || 0) + 1;
      });

      const commonFailureTypes = Object.entries(failureTypes)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([type]) => type);

      return {
        school,
        userCount: schoolUsers.length,
        averageFailures: schoolUsers.length > 0 ? Math.round((schoolLogs.length / schoolUsers.length) * 10) / 10 : 0,
        commonFailureTypes,
        averageGrades: {}
      };
    }).sort((a, b) => b.userCount - a.userCount);

    // 성적대별 분석
    const getGradeRange = (user: UserProfile): string => {
      if (!user.currentGrades) return '정보없음';
      const grades = Object.values(user.currentGrades).filter(Boolean);
      if (grades.length === 0) return '정보없음';
      
      const avgGrade = grades.reduce((sum, grade) => {
        const num = parseInt(grade!.replace('등급', ''));
        return sum + (isNaN(num) ? 5 : num);
      }, 0) / grades.length;

      if (avgGrade <= 2) return '1-2등급';
      if (avgGrade <= 4) return '3-4등급';
      return '5등급 이하';
    };

    const gradeData = users.reduce((acc: any, user) => {
      const range = getGradeRange(user);
      if (!acc[range]) acc[range] = { users: [], logs: [] };
      acc[range].users.push(user);
      const userLogs = logs.filter(log => log.authorId === user.id);
      acc[range].logs.push(...userLogs);
      return acc;
    }, {});

    const gradeAnalysis = Object.entries(gradeData).map(([gradeRange, data]: [string, any]) => {
      const gradeUsers = data.users;
      const gradeLogs = data.logs;
      
      const categoryCount: any = {};
      gradeLogs.forEach((log: FailureLog) => {
        categoryCount[log.category] = (categoryCount[log.category] || 0) + 1;
      });

      const totalLogs = gradeLogs.length;
      const commonFailures = Object.entries(categoryCount).map(([category, count]) => ({
        category: category as FailureCategory,
        count: count as number,
        percentage: totalLogs > 0 ? Math.round(((count as number) / totalLogs) * 100) : 0
      })).sort((a, b) => b.count - a.count);

      const tagCount: any = {};
      gradeLogs.forEach((log: FailureLog) => {
        log.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      const commonTags = Object.entries(tagCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count: count as number }));

      return {
        gradeRange,
        userCount: gradeUsers.length,
        commonFailures,
        commonTags
      };
    });

    // 목표 대학별 분석
    const universityData = users.reduce((acc: any, user) => {
      if (!user.targetUniversity) return acc;
      const uni = user.targetUniversity.split(' ')[0];
      if (!acc[uni]) acc[uni] = { users: [], logs: [] };
      acc[uni].users.push(user);
      const userLogs = logs.filter(log => log.authorId === user.id);
      acc[uni].logs.push(...userLogs);
      return acc;
    }, {});

    const universityAnalysis = Object.entries(universityData)
      .filter(([, data]: [string, any]) => data.users.length >= 2)
      .map(([university, data]: [string, any]) => {
        const uniUsers = data.users;
        const uniLogs = data.logs;
        
        const failurePatterns: any = {};
        uniLogs.forEach((log: FailureLog) => {
          failurePatterns[log.category] = (failurePatterns[log.category] || 0) + 1;
        });

        const avgStudyHours = uniUsers.reduce((sum: number, user: UserProfile) => 
          sum + (user.studyHoursPerDay || 0), 0) / uniUsers.length;

        return {
          university,
          userCount: uniUsers.length,
          failurePatterns: Object.entries(failurePatterns).map(([category, count]) => ({
            category: category as FailureCategory,
            count: count as number
          })),
          averageStudyHours: Math.round(avgStudyHours * 10) / 10
        };
      }).sort((a, b) => b.userCount - a.userCount);

    // 공부 환경별 분석
    const locationData = users.reduce((acc: any, user) => {
      if (!user.studyLocation) return acc;
      if (!acc[user.studyLocation]) acc[user.studyLocation] = { users: [], logs: [] };
      acc[user.studyLocation].users.push(user);
      const userLogs = logs.filter(log => log.authorId === user.id);
      acc[user.studyLocation].logs.push(...userLogs);
      return acc;
    }, {});

    const studyLocationAnalysis = Object.entries(locationData).map(([location, data]: [string, any]) => {
      const locationUsers = data.users;
      const locationLogs = data.logs;
      
      const avgFailuresPerUser = locationUsers.length > 0 ? locationLogs.length / locationUsers.length : 0;
      const successRate = Math.max(0, Math.round((1 - (avgFailuresPerUser / 10)) * 100));

      const issueCount: any = {};
      locationLogs.forEach((log: FailureLog) => {
        log.tags.forEach(tag => {
          issueCount[tag] = (issueCount[tag] || 0) + 1;
        });
      });

      const commonIssues = Object.entries(issueCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([issue]) => issue);

      return {
        location,
        userCount: locationUsers.length,
        successRate,
        commonIssues
      };
    }).sort((a, b) => b.userCount - a.userCount);

    return {
      totalUsers: users.length,
      totalLogs: logs.length,
      schoolAnalysis,
      gradeAnalysis,
      universityAnalysis,
      studyLocationAnalysis
    };
  }, [logs, users]);

  const exportData = () => {
    const exportObj = {
      timestamp: new Date().toISOString(),
      summary: stats,
      detailedAnalysis: {
        userProfiles: users.map(user => ({
          school: user.school,
          grade: user.grade,
          targetUniversity: user.targetUniversity,
          currentGrades: user.currentGrades,
          studyHoursPerDay: user.studyHoursPerDay,
          weakSubjects: user.weakSubjects,
          studyLocation: user.studyLocation,
          failureCount: logs.filter(l => l.authorId === user.id).length
        })),
        correlationAnalysis: {
          studyHoursVsFailures: users.map(user => ({
            studyHours: user.studyHoursPerDay || 0,
            failures: logs.filter(l => l.authorId === user.id).length
          })),
          gradeVsFailureTypes: stats.gradeAnalysis
        }
      }
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fail-forward-deep-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">📊 수험생 실패 패턴 분석</h2>
          <p className="text-slate-400">집단별 실패 원인과 성과 상관관계 분석</p>
        </div>
        <button
          onClick={exportData}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Download size={18} /> 심화 분석 데이터 내보내기
        </button>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={24} />
            <h3 className="font-bold text-slate-300">분석 대상</h3>
          </div>
          <p className="text-3xl font-black text-blue-500">{stats.totalUsers}명</p>
          <p className="text-xs text-slate-500 mt-1">수험생</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-red-500" size={24} />
            <h3 className="font-bold text-slate-300">실패 사례</h3>
          </div>
          <p className="text-3xl font-black text-red-500">{stats.totalLogs}건</p>
          <p className="text-xs text-slate-500 mt-1">총 기록</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <School className="text-amber-500" size={24} />
            <h3 className="font-bold text-slate-300">참여 학교</h3>
          </div>
          <p className="text-3xl font-black text-amber-500">{stats.schoolAnalysis.length}개</p>
          <p className="text-xs text-slate-500 mt-1">교육기관</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-green-500" size={24} />
            <h3 className="font-bold text-slate-300">목표 대학</h3>
          </div>
          <p className="text-3xl font-black text-green-500">{stats.universityAnalysis.length}개</p>
          <p className="text-xs text-slate-500 mt-1">대학교</p>
        </div>
      </div>

      {/* 성적대별 실패 패턴 분석 */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          성적대별 실패 패턴 분석
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stats.gradeAnalysis.map((grade: any, index: number) => (
            <div key={grade.gradeRange} className="bg-slate-800 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">{grade.gradeRange}</h4>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {grade.userCount}명
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">주요 실패 유형</p>
                <div className="space-y-2">
                  {grade.commonFailures.slice(0, 3).map((failure: any, idx: number) => (
                    <div key={failure.category} className="flex justify-between items-center">
                      <span className="text-sm">{failure.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${failure.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{failure.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">주요 실패 원인</p>
                <div className="flex flex-wrap gap-1">
                  {grade.commonTags.slice(0, 3).map((tag: any) => (
                    <span key={tag.tag} className="text-xs bg-slate-700 px-2 py-1 rounded">
                      {tag.tag} ({tag.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 학교별 성과 분석 */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <GraduationCap className="text-blue-500" size={24} />
          학교별 실패 패턴 및 성과 분석
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2">학교명</th>
                <th className="text-center py-3 px-2">학생 수</th>
                <th className="text-center py-3 px-2">평균 실패 횟수</th>
                <th className="text-left py-3 px-2">주요 실패 유형</th>
              </tr>
            </thead>
            <tbody>
              {stats.schoolAnalysis.slice(0, 10).map((school: any, index: number) => (
                <tr key={school.school} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-2 font-medium">{school.school}</td>
                  <td className="py-3 px-2 text-center">{school.userCount}명</td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      school.averageFailures < 2 ? 'bg-green-500/20 text-green-400' :
                      school.averageFailures < 4 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {school.averageFailures}회
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {school.commonFailureTypes.slice(0, 2).map((type: string) => (
                        <span key={type} className="text-xs bg-slate-700 px-2 py-1 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 목표 대학별 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold mb-4">목표 대학별 실패 패턴</h3>
          <div className="space-y-4">
            {stats.universityAnalysis.slice(0, 6).map((uni: any, index: number) => (
              <div key={uni.university} className="bg-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{uni.university}</h4>
                  <div className="text-right text-sm">
                    <p className="text-slate-400">{uni.userCount}명</p>
                    <p className="text-amber-400">{uni.averageStudyHours}시간/일</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uni.failurePatterns.slice(0, 3).map((pattern: any) => (
                    <span key={pattern.category} className="text-xs bg-slate-700 px-2 py-1 rounded">
                      {pattern.category} ({pattern.count})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="text-purple-500" size={20} />
            공부 환경별 성과 분석
          </h3>
          <div className="space-y-4">
            {stats.studyLocationAnalysis.map((location: any, index: number) => (
              <div key={location.location} className="bg-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold">{location.location}</h4>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">{location.userCount}명</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            location.successRate >= 80 ? 'bg-green-500' :
                            location.successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${location.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{location.successRate}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">주요 문제점:</p>
                  <div className="flex flex-wrap gap-1">
                    {location.commonIssues.map((issue: string) => (
                      <span key={issue} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 p-4 bg-slate-900/50 rounded-xl">
        💡 이 분석 데이터는 교육 기관별 맞춤 솔루션 개발, 성적대별 학습 전략 수립, 
        목표 대학별 입시 컨설팅 등에 활용할 수 있는 귀중한 인사이트를 제공합니다.
      </div>
    </div>
  );
};