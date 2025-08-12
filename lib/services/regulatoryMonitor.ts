import { Idea } from '@/lib/types';
import crypto from 'crypto';

export interface RegulatoryUpdate {
  id: string;
  sourceUrl: string;
  title: string;
  summary: string;
  publishedDate: Date;
  effectiveDate?: Date;
  ministry: string;
  category: 'law' | 'decree' | 'regulation' | 'guideline' | 'announcement';
  industries: string[];
  complianceRequired: boolean;
  businessImpact: 'high' | 'medium' | 'low';
  keyChanges: string[];
  affectedBusinessTypes: string[];
  actionItems: string[];
  deadline?: Date;
  penalties?: string;
  opportunities?: string[];
  risks?: string[];
  relatedRegulations?: string[];
  fullText?: string;
  lastChecked: Date;
  changeDetected: boolean;
  previousVersion?: string;
}

export interface MonitoringTarget {
  name: string;
  url: string;
  ministry: string;
  checkInterval: number; // in hours
  selectors: {
    listContainer: string;
    listItem: string;
    title: string;
    date?: string;
    link?: string;
    content?: string;
  };
  rssUrl?: string;
  apiEndpoint?: string;
}

export class RegulatoryMonitoringService {
  private targets: MonitoringTarget[] = [
    {
      name: 'KFTC Competition Law',
      url: 'https://www.ftc.go.kr/www/selectReportUserList.do?key=10',
      ministry: 'Korea Fair Trade Commission',
      checkInterval: 6,
      selectors: {
        listContainer: '.board_list',
        listItem: 'tbody tr',
        title: '.tit a',
        date: '.date',
        link: '.tit a'
      }
    },
    {
      name: 'MSIT AI/Digital Policy',
      url: 'https://www.msit.go.kr/bbs/list.do?sCode=user&mId=113&mPid=112',
      ministry: 'Ministry of Science and ICT',
      checkInterval: 12,
      selectors: {
        listContainer: '.board_list',
        listItem: 'tbody tr',
        title: '.align_left a',
        date: '.date',
        link: '.align_left a'
      }
    },
    {
      name: 'FSC Financial Regulations',
      url: 'https://www.fsc.go.kr/no010101',
      ministry: 'Financial Services Commission',
      checkInterval: 6,
      selectors: {
        listContainer: '.bd_list',
        listItem: 'tbody tr',
        title: '.title a',
        date: '.date',
        link: '.title a'
      }
    },
    {
      name: 'PIPC Data Protection',
      url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardList.do?bbsId=BBSMSTR_000000000045',
      ministry: 'Personal Information Protection Commission',
      checkInterval: 12,
      selectors: {
        listContainer: '.board_list',
        listItem: 'tbody tr',
        title: '.title a',
        date: '.date',
        link: '.title a'
      }
    },
    {
      name: 'MOTIE Industry Policy',
      url: 'https://www.motie.go.kr/motie/ms/nt/announce3/bbs/bbsList.do?bbs_cd_n=6',
      ministry: 'Ministry of Trade, Industry and Energy',
      checkInterval: 24,
      selectors: {
        listContainer: '.board_list',
        listItem: 'tbody tr',
        title: '.title a',
        date: '.date',
        link: '.title a'
      }
    }
  ];

  private updates: Map<string, RegulatoryUpdate> = new Map();
  private lastCheckTimestamps: Map<string, Date> = new Map();
  private changeHistory: Map<string, RegulatoryUpdate[]> = new Map();

  async monitorAllTargets(): Promise<RegulatoryUpdate[]> {
    const allUpdates: RegulatoryUpdate[] = [];
    
    for (const target of this.targets) {
      const lastCheck = this.lastCheckTimestamps.get(target.name);
      const now = new Date();
      
      if (!lastCheck || 
          (now.getTime() - lastCheck.getTime()) > target.checkInterval * 60 * 60 * 1000) {
        
        try {
          const updates = await this.checkTarget(target);
          allUpdates.push(...updates);
          this.lastCheckTimestamps.set(target.name, now);
        } catch (error) {
          console.error(`Failed to check ${target.name}:`, error);
        }
      }
    }
    
    return allUpdates;
  }

  private async checkTarget(target: MonitoringTarget): Promise<RegulatoryUpdate[]> {
    const updates: RegulatoryUpdate[] = [];
    
    try {
      const response = await fetch(`/api/regulatory/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });
      
      if (!response.ok) throw new Error(`Failed to fetch ${target.url}`);
      
      const data = await response.json();
      const items = data.items || [];
      
      for (const item of items) {
        const update = this.parseRegulatoryItem(item, target);
        
        if (this.isNewOrChanged(update)) {
          updates.push(update);
          this.updates.set(update.id, update);
          this.addToHistory(update);
        }
      }
    } catch (error) {
      console.error(`Error checking ${target.name}:`, error);
    }
    
    return updates;
  }

  private parseRegulatoryItem(item: any, target: MonitoringTarget): RegulatoryUpdate {
    const id = this.generateId(item.url || item.title);
    
    return {
      id,
      sourceUrl: item.url || target.url,
      title: item.title,
      summary: item.summary || '',
      publishedDate: new Date(item.date || Date.now()),
      ministry: target.ministry,
      category: this.categorizeUpdate(item.title),
      industries: this.extractIndustries(item.title + ' ' + item.summary),
      complianceRequired: this.assessComplianceRequirement(item),
      businessImpact: this.assessBusinessImpact(item),
      keyChanges: this.extractKeyChanges(item),
      affectedBusinessTypes: this.identifyAffectedBusinesses(item),
      actionItems: this.generateActionItems(item),
      lastChecked: new Date(),
      changeDetected: false
    };
  }

  private generateId(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex').substring(0, 12);
  }

  private isNewOrChanged(update: RegulatoryUpdate): boolean {
    const existing = this.updates.get(update.id);
    if (!existing) return true;
    
    const hasChanged = existing.title !== update.title || 
                       existing.summary !== update.summary;
    
    if (hasChanged) {
      update.changeDetected = true;
      update.previousVersion = JSON.stringify(existing);
    }
    
    return hasChanged;
  }

  private addToHistory(update: RegulatoryUpdate): void {
    const history = this.changeHistory.get(update.id) || [];
    history.push({ ...update });
    this.changeHistory.set(update.id, history);
  }

  private categorizeUpdate(title: string): RegulatoryUpdate['category'] {
    const lower = title.toLowerCase();
    if (lower.includes('법률') || lower.includes('법')) return 'law';
    if (lower.includes('시행령') || lower.includes('령')) return 'decree';
    if (lower.includes('규정') || lower.includes('규칙')) return 'regulation';
    if (lower.includes('가이드') || lower.includes('지침')) return 'guideline';
    return 'announcement';
  }

  private extractIndustries(text: string): string[] {
    const industries: string[] = [];
    const industryKeywords = {
      'fintech': ['핀테크', '금융', '은행', '결제', 'payment'],
      'ai': ['인공지능', 'AI', '머신러닝', '딥러닝'],
      'blockchain': ['블록체인', '암호화폐', '가상자산', 'NFT'],
      'ecommerce': ['이커머스', '전자상거래', '온라인쇼핑'],
      'healthcare': ['헬스케어', '의료', '바이오', '제약'],
      'mobility': ['모빌리티', '자동차', '운송', '물류'],
      'gaming': ['게임', '게이밍', 'e스포츠'],
      'education': ['에듀테크', '교육', '이러닝'],
      'realestate': ['부동산', '프롭테크', '건설'],
      'manufacturing': ['제조', '스마트팩토리', '산업']
    };
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        industries.push(industry);
      }
    }
    
    return industries.length > 0 ? industries : ['general'];
  }

  private assessComplianceRequirement(item: any): boolean {
    const complianceKeywords = ['의무', '필수', '준수', '위반', '제재', '과태료', '처벌'];
    const text = (item.title + ' ' + item.summary).toLowerCase();
    return complianceKeywords.some(keyword => text.includes(keyword));
  }

  private assessBusinessImpact(item: any): 'high' | 'medium' | 'low' {
    const highImpactKeywords = ['전면', '금지', '폐지', '의무화', '즉시', '중단'];
    const mediumImpactKeywords = ['개정', '변경', '조정', '강화', '완화'];
    const text = (item.title + ' ' + item.summary).toLowerCase();
    
    if (highImpactKeywords.some(keyword => text.includes(keyword))) return 'high';
    if (mediumImpactKeywords.some(keyword => text.includes(keyword))) return 'medium';
    return 'low';
  }

  private extractKeyChanges(item: any): string[] {
    const changes: string[] = [];
    const changePatterns = [
      /기존\s*(.+?)에서\s*(.+?)로/g,
      /(.+?)을?\s*의무화/g,
      /(.+?)을?\s*폐지/g,
      /(.+?)을?\s*신설/g
    ];
    
    const text = item.title + ' ' + item.summary;
    for (const pattern of changePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        changes.push(match[0]);
      }
    }
    
    return changes.slice(0, 5);
  }

  private identifyAffectedBusinesses(item: any): string[] {
    const businesses: string[] = [];
    const businessTypes = {
      'startups': ['스타트업', '창업', '벤처'],
      'smes': ['중소기업', '소상공인'],
      'enterprises': ['대기업', '대규모'],
      'foreign': ['외국', '해외', '글로벌'],
      'platforms': ['플랫폼', '온라인', '앱']
    };
    
    const text = (item.title + ' ' + item.summary).toLowerCase();
    for (const [type, keywords] of Object.entries(businessTypes)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        businesses.push(type);
      }
    }
    
    return businesses.length > 0 ? businesses : ['all'];
  }

  private generateActionItems(item: any): string[] {
    const actions: string[] = [];
    const update = this.parseRegulatoryItem(item, this.targets[0]);
    
    if (update.complianceRequired) {
      actions.push('Review compliance requirements and update internal policies');
    }
    
    if (update.businessImpact === 'high') {
      actions.push('Conduct immediate impact assessment on current operations');
      actions.push('Consult with legal counsel for implementation guidance');
    }
    
    if (update.deadline) {
      actions.push(`Ensure compliance by ${update.deadline.toLocaleDateString()}`);
    }
    
    if (update.industries.includes('fintech') || update.industries.includes('ai')) {
      actions.push('Review technical infrastructure for compliance');
    }
    
    return actions;
  }

  async analyzeImpactOnIdeas(updates: RegulatoryUpdate[]): Promise<Map<string, string[]>> {
    const impactMap = new Map<string, string[]>();
    
    for (const update of updates) {
      const affectedIdeas: string[] = [];
      
      const response = await fetch('/api/ideas');
      const ideas: Idea[] = await response.json();
      
      for (const idea of ideas) {
        const ideaIndustries = idea.tags || [];
        const hasIndustryOverlap = update.industries.some(ind => 
          ideaIndustries.some(tag => tag.toLowerCase().includes(ind))
        );
        
        if (hasIndustryOverlap) {
          affectedIdeas.push(idea.id);
        }
      }
      
      if (affectedIdeas.length > 0) {
        impactMap.set(update.id, affectedIdeas);
      }
    }
    
    return impactMap;
  }

  async generateAlert(update: RegulatoryUpdate): Promise<string> {
    const alert = `
🚨 New Regulatory Update from ${update.ministry}

📋 ${update.title}

⚡ Impact Level: ${update.businessImpact.toUpperCase()}
📅 Published: ${update.publishedDate.toLocaleDateString()}
${update.effectiveDate ? `📅 Effective: ${update.effectiveDate.toLocaleDateString()}` : ''}

🏢 Affected Industries: ${update.industries.join(', ')}
💼 Affected Businesses: ${update.affectedBusinessTypes.join(', ')}

${update.keyChanges.length > 0 ? `
🔄 Key Changes:
${update.keyChanges.map(c => `• ${c}`).join('\n')}
` : ''}

${update.actionItems.length > 0 ? `
✅ Required Actions:
${update.actionItems.map(a => `• ${a}`).join('\n')}
` : ''}

🔗 Source: ${update.sourceUrl}
    `.trim();
    
    return alert;
  }

  async generateNewsletterSection(updates: RegulatoryUpdate[]): Promise<string> {
    const highImpact = updates.filter(u => u.businessImpact === 'high');
    const byIndustry = this.groupByIndustry(updates);
    
    let content = `## 📊 This Week's Regulatory Intelligence\n\n`;
    
    if (highImpact.length > 0) {
      content += `### ⚡ High Impact Changes\n\n`;
      for (const update of highImpact) {
        content += `**${update.title}**\n`;
        content += `${update.ministry} • ${update.publishedDate.toLocaleDateString()}\n`;
        content += `${update.summary}\n\n`;
      }
    }
    
    content += `### 🏢 Updates by Industry\n\n`;
    for (const [industry, industryUpdates] of byIndustry.entries()) {
      content += `**${industry.toUpperCase()}**\n`;
      for (const update of industryUpdates) {
        content += `• ${update.title} (${update.businessImpact} impact)\n`;
      }
      content += `\n`;
    }
    
    return content;
  }

  private groupByIndustry(updates: RegulatoryUpdate[]): Map<string, RegulatoryUpdate[]> {
    const grouped = new Map<string, RegulatoryUpdate[]>();
    
    for (const update of updates) {
      for (const industry of update.industries) {
        const industryUpdates = grouped.get(industry) || [];
        industryUpdates.push(update);
        grouped.set(industry, industryUpdates);
      }
    }
    
    return grouped;
  }
}

export const regulatoryMonitor = new RegulatoryMonitoringService();