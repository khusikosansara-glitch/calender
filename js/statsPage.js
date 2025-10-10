// 통계 페이지 UI 관리 모듈
import { HealthAnalyzer } from './healthAnalyzer.js';

export class StatsPage {
    constructor(containerElement, statsManager) {
        this.container = containerElement;
        this.statsManager = statsManager;
        this.healthAnalyzer = new HealthAnalyzer();
        this.currentPeriod = 'week'; // 'day', 'week', 'month'
        this.chart = null;
    }

    render() {
        const html = `
            <div class="stats-page">
                <div class="stats-tabs">
                    <button class="stats-tab ${this.currentPeriod === 'day' ? 'active' : ''}" data-period="day">
                        일간
                    </button>
                    <button class="stats-tab ${this.currentPeriod === 'week' ? 'active' : ''}" data-period="week">
                        주간
                    </button>
                    <button class="stats-tab ${this.currentPeriod === 'month' ? 'active' : ''}" data-period="month">
                        월간
                    </button>
                </div>

                <div id="statsContent"></div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEvents();
        this.loadStats();
    }

    attachEvents() {
        // 탭 클릭 이벤트
        this.container.querySelectorAll('.stats-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentPeriod = e.target.dataset.period;
                this.render();
            });
        });
    }

    loadStats() {
        let stats;
        let periodLabel;

        switch (this.currentPeriod) {
            case 'day':
                stats = this.statsManager.getTodayStats();
                periodLabel = '오늘';
                break;
            case 'week':
                stats = this.statsManager.getWeekStats();
                periodLabel = '이번 주';
                break;
            case 'month':
                stats = this.statsManager.getMonthStats();
                periodLabel = '이번 달';
                break;
        }

        this.renderStats(stats, periodLabel);
    }

    renderStats(stats, periodLabel) {
        const contentElement = document.getElementById('statsContent');

        if (stats.daysWithRecords === 0) {
            contentElement.innerHTML = `
                <div class="stats-empty">
                    <div class="stats-empty-icon">📊</div>
                    <p>${periodLabel} 기록이 없습니다.</p>
                    <p>식사를 기록하고 통계를 확인하세요!</p>
                </div>
            `;
            return;
        }

        contentElement.innerHTML = `
            <!-- 통계 카드 -->
            <div class="stats-cards">
                <div class="stats-card">
                    <div class="stats-card-icon">🔥</div>
                    <div class="stats-card-label">총 칼로리</div>
                    <div class="stats-card-value">
                        ${stats.totalCalories.toLocaleString()}
                        <span class="stats-card-unit">kcal</span>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">📊</div>
                    <div class="stats-card-label">평균 칼로리</div>
                    <div class="stats-card-value">
                        ${stats.avgCalories.toLocaleString()}
                        <span class="stats-card-unit">kcal</span>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">💧</div>
                    <div class="stats-card-label">총 물 섭취</div>
                    <div class="stats-card-value">
                        ${stats.totalWater}
                        <span class="stats-card-unit">잔</span>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-card-icon">📅</div>
                    <div class="stats-card-label">기록한 날</div>
                    <div class="stats-card-value">
                        ${stats.daysWithRecords}
                        <span class="stats-card-unit">일</span>
                    </div>
                </div>
            </div>

            <!-- 칼로리 추이 차트 -->
            <div class="stats-section">
                <h3 class="stats-section-title">칼로리 추이</h3>
                <div class="chart-container">
                    <canvas id="caloriesChart"></canvas>
                </div>
            </div>

            <!-- 물 섭취 차트 -->
            <div class="stats-section">
                <h3 class="stats-section-title">물 섭취량</h3>
                <div class="chart-container">
                    <canvas id="waterChart"></canvas>
                </div>
            </div>

            <!-- 식사 기록 요약 -->
            <div class="stats-section">
                <h3 class="stats-section-title">식사 기록 현황</h3>
                <ul class="stats-summary-list">
                    <li class="stats-summary-item">
                        <span class="stats-summary-label">🌅 아침 기록</span>
                        <span class="stats-summary-value">${stats.mealCounts.breakfast}일</span>
                    </li>
                    <li class="stats-summary-item">
                        <span class="stats-summary-label">☀️ 점심 기록</span>
                        <span class="stats-summary-value">${stats.mealCounts.lunch}일</span>
                    </li>
                    <li class="stats-summary-item">
                        <span class="stats-summary-label">🌙 저녁 기록</span>
                        <span class="stats-summary-value">${stats.mealCounts.dinner}일</span>
                    </li>
                    <li class="stats-summary-item">
                        <span class="stats-summary-label">🍪 간식 기록</span>
                        <span class="stats-summary-value">${stats.mealCounts.snack}일</span>
                    </li>
                </ul>
            </div>
            
            <!-- AI 분석 및 조언 -->
            <div class="ai-insights">
                <div class="ai-insights-header">
                    <span class="ai-insights-icon">🤖</span>
                    <h3 class="ai-insights-title">AI 건강 분석</h3>
                </div>
                <div class="ai-insights-content" id="aiInsightsContent"></div>
            </div>
        `;

        // 차트 렌더링
        this.renderCharts(stats);
        
        // AI 분석 렌더링
        this.renderAIInsights(stats, periodLabel);
    }

    renderCharts(stats) {
        // 기존 차트 제거
        if (this.chart) {
            this.chart.destroy();
        }

        // 날짜 레이블 생성
        const labels = stats.dailyData.map(d => {
            const date = d.date;
            if (this.currentPeriod === 'day') {
                return '오늘';
            } else if (this.currentPeriod === 'week') {
                return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
            } else {
                return `${date.getMonth() + 1}/${date.getDate()}`;
            }
        });

        // 칼로리 데이터
        const caloriesData = stats.dailyData.map(d => d.calories);
        
        // 물 섭취 데이터
        const waterData = stats.dailyData.map(d => d.water);

        // 차트 옵션 (경량화)
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 300 // 애니메이션 단축
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim()
                    }
                }
            }
        };

        // 칼로리 차트
        const caloriesCtx = document.getElementById('caloriesChart');
        if (caloriesCtx) {
            new Chart(caloriesCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '칼로리',
                        data: caloriesData,
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: commonOptions
            });
        }

        // 물 섭취 차트
        const waterCtx = document.getElementById('waterChart');
        if (waterCtx) {
            new Chart(waterCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '물 (잔)',
                        data: waterData,
                        backgroundColor: 'rgba(74, 144, 226, 0.6)',
                        borderColor: '#4a90e2',
                        borderWidth: 1
                    }]
                },
                options: commonOptions
            });
        }
    }

    renderAIInsights(stats, periodLabel) {
        const analysis = this.healthAnalyzer.analyze(stats, this.currentPeriod);
        const contentElement = document.getElementById('aiInsightsContent');
        
        if (!contentElement) return;
        
        // 건강 스코어
        let healthScoreHTML = '';
        if (analysis.scoreLevel !== 'no-data') {
            const statusText = this.healthAnalyzer.getScoreStatusText(analysis.scoreLevel);
            healthScoreHTML = `
                <div class="health-score">
                    <div class="health-score-label">건강 스코어</div>
                    <div class="health-score-value ${analysis.scoreLevel}">${analysis.healthScore}</div>
                    <div class="health-score-status ${analysis.scoreLevel}">${statusText}</div>
                </div>
            `;
        }
        
        // 인사이트 카드
        const insightsHTML = analysis.insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-card-header">
                    <span class="insight-card-icon">${insight.icon}</span>
                    <h4 class="insight-card-title">${insight.title}</h4>
                </div>
                <p class="insight-card-content">${insight.content}</p>
            </div>
        `).join('');
        
        // 추천 사항
        let recommendationsHTML = '';
        if (analysis.recommendations.length > 0) {
            recommendationsHTML = `
                <div class="insight-card">
                    <div class="insight-card-header">
                        <span class="insight-card-icon">💡</span>
                        <h4 class="insight-card-title">추천 사항</h4>
                    </div>
                    <ul class="recommendations-list">
                        ${analysis.recommendations.map(rec => `
                            <li class="recommendation-item">
                                <span class="recommendation-icon">${rec.icon}</span>
                                <span class="recommendation-text">${rec.text}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        contentElement.innerHTML = healthScoreHTML + insightsHTML + recommendationsHTML;
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
