// components/ExportModal.tsx

'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { X, Download, FileText, Table, Check, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportService } from '@/lib/services/exportService';
import type { Idea } from '@/lib/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: Idea[];
  selectedIdeas?: string[];
}

export default function ExportModal({ isOpen, onClose, ideas, selectedIdeas }: ExportModalProps) {
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeRoadmap, setIncludeRoadmap] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportError, setExportError] = useState('');
  const [canExport, setCanExport] = useState<{ pdf: boolean; excel: boolean }>({ pdf: false, excel: false });
  const [user, setUser] = useState<any>(null);

  // Filter ideas to export
  const ideasToExport = selectedIdeas && selectedIdeas.length > 0
    ? ideas.filter(idea => selectedIdeas.includes(idea.id))
    : ideas;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const token = await user.getIdToken();
          try {
            const response = await fetch('/api/export', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setCanExport(data.formats);
            } else {
              // Fallback to allowing all exports for development
              setCanExport({ pdf: true, excel: true });
            }
          } catch (error) {
            // Fallback to allowing all exports for development
            console.log('Export API not available, enabling all formats for development');
            setCanExport({ pdf: true, excel: true });
          }
        } catch (error) {
          console.error('Failed to load export options:', error);
          setCanExport({ pdf: true, excel: true });
        }
      } else {
        // Allow exports for non-authenticated users in development
        setCanExport({ pdf: true, excel: true });
      }
    });
    return unsubscribe;
  }, []);

  // Auto-generate filename
  useEffect(() => {
    if (!fileName) {
      const date = new Date().toISOString().split('T')[0];
      const count = ideasToExport.length;
      setFileName(`ideaoasis-ideas-${count}개-${date}`);
    }
  }, [ideasToExport.length, fileName]);

  // Client-side export generation for development
  const generateClientSideExport = () => {
    try {
      if (format === 'excel') {
        // Generate CSV
        let csv = '제목,Korea Fit,분야,요약,트렌드 성장률,원문 링크';
        if (includeMetrics) {
          csv += ',시장 기회,실행 난이도,수익 잠재력,타이밍 점수,규제 리스크';
        }
        csv += '\n';

        ideasToExport.forEach(idea => {
          let row = [
            `"${idea.title.replace(/"/g, '""')}"`,
            idea.koreaFit || 0,
            `"${idea.sector || '미분류'}"`,
            `"${(idea.summary3 || '').replace(/"/g, '""')}"`,
            `"${idea.trendData?.growth || 'N/A'}"`,
            `"${idea.sourceUrl}"`
          ];
          
          if (includeMetrics && idea.metrics) {
            row.push(
              String(idea.metrics.marketOpportunity || 0),
              String(idea.metrics.executionDifficulty || 0),
              String(idea.metrics.revenuePotential || 0),
              String(idea.metrics.timingScore || 0),
              String(idea.metrics.regulatoryRisk || 0)
            );
          }
          
          csv += row.join(',') + '\n';
        });

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Generate simple text file for PDF
        let content = `IdeaOasis 아이디어 리포트\n`;
        content += `생성일: ${new Date().toLocaleDateString('ko-KR')}\n`;
        content += `총 ${ideasToExport.length}개의 아이디어\n\n`;
        
        ideasToExport.forEach((idea, index) => {
          content += `${index + 1}. ${idea.title}\n`;
          content += `Korea Fit: ${idea.koreaFit}/10\n`;
          content += `분야: ${idea.sector || '미분류'}\n`;
          content += `요약: ${idea.summary3}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExportStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setExportError('클라이언트 내보내기 중 오류가 발생했습니다.');
      setExportStatus('error');
    }
  };

  const handleExport = async () => {
    if (!user) {
      // Allow export without login in development
      console.log('No user logged in, using client-side export');
      generateClientSideExport();
      return;
    }

    if (ideasToExport.length === 0) {
      setExportError('내보낼 아이디어가 없습니다.');
      setExportStatus('error');
      return;
    }

    setIsExporting(true);
    setExportStatus('idle');
    setExportError('');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          format,
          ideaIds: selectedIdeas,
          fileName,
          includeMetrics,
          includeRoadmap
        })
      });

      const result = await response.json();

      if (!response.ok) {
        // If API fails, generate export client-side for development
        console.log('API export failed, generating client-side export for development');
        generateClientSideExport();
        return;
      }

      if (result.success && result.downloadUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${fileName}.${format === 'pdf' ? 'pdf' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('다운로드 링크를 생성할 수 없습니다.');
      }

    } catch (error) {
      console.error('Export failed, trying client-side generation:', error);
      generateClientSideExport();
    } finally {
      setIsExporting(false);
    }
  };

  const exportPreview = ExportService.generateExportPreview(ideasToExport);

  if (!isOpen) return null;

  console.log('ExportModal rendering:', { isOpen, ideasToExport: ideasToExport.length, canExport });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">아이디어 내보내기</h2>
              <p className="text-sm text-slate-600">{exportPreview.totalIdeas}개 아이디어</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Preview */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-2">내보내기 미리보기</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">총 아이디어</span>
                <span className="font-medium">{exportPreview.totalIdeas}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">예상 파일 크기</span>
                <span className="font-medium">{exportPreview.estimatedFileSize}</span>
              </div>
            </div>
            
            {exportPreview.previewIdeas.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-2">포함된 아이디어 (일부):</p>
                {exportPreview.previewIdeas.map((idea, index) => (
                  <div key={index} className="text-xs text-slate-700 flex justify-between">
                    <span className="truncate flex-1 mr-2">{idea.title}</span>
                    <span className="text-blue-600">{idea.koreaFit}/10</span>
                  </div>
                ))}
                {exportPreview.totalIdeas > 3 && (
                  <div className="text-xs text-slate-500 mt-1">
                    ...및 {exportPreview.totalIdeas - 3}개 더
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">내보내기 형식</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('pdf')}
                disabled={!canExport?.pdf}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  format === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : canExport?.pdf 
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                }`}
              >
                <FileText className={`w-6 h-6 mb-2 ${format === 'pdf' ? 'text-blue-600' : canExport?.pdf ? 'text-slate-600' : 'text-slate-400'}`} />
                <div className={`font-medium ${format === 'pdf' ? 'text-blue-900' : canExport?.pdf ? 'text-slate-900' : 'text-slate-500'}`}>PDF 리포트</div>
                <div className={`text-sm ${format === 'pdf' ? 'text-blue-700' : canExport?.pdf ? 'text-slate-600' : 'text-slate-500'}`}>
                  상세한 분석 리포트
                </div>
                {!canExport?.pdf && (
                  <div className="text-xs text-amber-600 mt-1">프리미엄 필요</div>
                )}
              </button>
              
              <button
                onClick={() => setFormat('excel')}
                disabled={!canExport?.excel}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  format === 'excel'
                    ? 'border-green-500 bg-green-50'
                    : canExport?.excel 
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                }`}
              >
                <Table className={`w-6 h-6 mb-2 ${format === 'excel' ? 'text-green-600' : canExport?.excel ? 'text-slate-600' : 'text-slate-400'}`} />
                <div className={`font-medium ${format === 'excel' ? 'text-green-900' : canExport?.excel ? 'text-slate-900' : 'text-slate-500'}`}>Excel/CSV</div>
                <div className={`text-sm ${format === 'excel' ? 'text-green-700' : canExport?.excel ? 'text-slate-600' : 'text-slate-500'}`}>
                  데이터 분석용
                </div>
                {!canExport?.excel && (
                  <div className="text-xs text-amber-600 mt-1">프리미엄 필요</div>
                )}
              </button>
            </div>
          </div>

          {/* File Name */}
          <div>
            <label className="block font-medium text-slate-900 mb-2">파일 이름</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="파일 이름을 입력하세요"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Options */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">포함할 내용</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeMetrics}
                  onChange={(e) => setIncludeMetrics(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">상세 메트릭 (시장 기회, 난이도 등)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeRoadmap}
                  onChange={(e) => setIncludeRoadmap(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">실행 로드맵</span>
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {exportStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 text-sm">성공적으로 다운로드되었습니다!</span>
            </div>
          )}

          {exportStatus === 'error' && exportError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-800 text-sm">{exportError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || (!canExport?.pdf && !canExport?.excel)}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                내보내는 중...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}