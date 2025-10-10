// AI 스타일 건강 분석 모듈
export class HealthAnalyzer {
    constructor() {
        // 권장 일일 칼로리 (일반적인 기준)
        this.RECOMMENDED_CALORIES = {
            min: 1800,
            ideal: 2000,
            max: 2400
        };
        
        // 권장 물 섭취량 (잔)
        this.RECOMMENDED_WATER = {
            min: 6,
            ideal: 8,
            max: 10
        };
    }

    // 전체 건강 분석
    analyze(stats, period) {
        const analysis = {
            healthScore: 0,
            scoreLevel: '',
            insights: [],
            recommendations: []
        };

        // 데이터가 없으면 분석 불가
        if (stats.daysWithRecords === 0) {
            return {
                healthScore: 0,
                scoreLevel: 'no-data',
                insights: [{
                    type: 'info',
                    icon: '📝',
                    title: '데이터가 부족해요',
                    content: '식사를 기록하면 맞춤형 건강 분석을 제공해드립니다.'
                }],
                recommendations: []
            };
        }

        // 각 항목별 점수 계산
        const caloriesScore = this.analyzeCalories(stats);
        const waterScore = this.analyzeWater(stats);
        const consistencyScore = this.analyzeConsistency(stats, period);
        const balanceScore = this.analyzeMealBalance(stats);

        // 전체 점수 (100점 만점)
        analysis.healthScore = Math.round(
            caloriesScore.score * 0.3 +
            waterScore.score * 0.25 +
            consistencyScore.score * 0.25 +
            balanceScore.score * 0.2
        );

        // 점수 레벨 결정
        if (analysis.healthScore >= 85) {
            analysis.scoreLevel = 'excellent';
        } else if (analysis.healthScore >= 70) {
            analysis.scoreLevel = 'good';
        } else if (analysis.healthScore >= 50) {
            analysis.scoreLevel = 'fair';
        } else {
            analysis.scoreLevel = 'poor';
        }

        // 인사이트 수집
        analysis.insights.push(caloriesScore.insight);
        analysis.insights.push(waterScore.insight);
        analysis.insights.push(consistencyScore.insight);
        analysis.insights.push(balanceScore.insight);

        // 추천 사항 생성
        analysis.recommendations = this.generateRecommendations(
            stats,
            caloriesScore,
            waterScore,
            consistencyScore,
            balanceScore
        );

        return analysis;
    }

    // 칼로리 분석
    analyzeCalories(stats) {
        const avgCalories = stats.avgCalories;
        
        let score = 0;
        let type = 'info';
        let icon = '🔥';
        let title = '칼로리 섭취';
        let content = '';

        if (avgCalories === 0) {
            score = 0;
            type = 'critical';
            content = '칼로리 기록이 없습니다. 식사에 칼로리를 입력해주세요.';
        } else if (avgCalories < this.RECOMMENDED_CALORIES.min) {
            score = 50;
            type = 'warning';
            content = `평균 ${avgCalories}kcal로 권장량(${this.RECOMMENDED_CALORIES.min}~${this.RECOMMENDED_CALORIES.max}kcal)보다 낮습니다. 영양 부족이 우려됩니다.`;
        } else if (avgCalories > this.RECOMMENDED_CALORIES.max) {
            score = 60;
            type = 'warning';
            content = `평균 ${avgCalories}kcal로 권장량을 초과했습니다. 칼로리 조절이 필요합니다.`;
        } else {
            // 이상적인 범위 내
            const idealDiff = Math.abs(avgCalories - this.RECOMMENDED_CALORIES.ideal);
            score = Math.max(70, 100 - idealDiff / 10);
            type = 'positive';
            content = `평균 ${avgCalories}kcal로 적절한 칼로리를 섭취하고 있습니다. 👍`;
        }

        return {
            score,
            insight: { type, icon, title, content }
        };
    }

    // 물 섭취 분석
    analyzeWater(stats) {
        const avgWater = stats.avgWater;
        
        let score = 0;
        let type = 'info';
        let icon = '💧';
        let title = '수분 섭취';
        let content = '';

        if (avgWater === 0) {
            score = 0;
            type = 'critical';
            content = '물 섭취량이 기록되지 않았습니다. 하루 8잔 이상의 물을 마셔주세요.';
        } else if (avgWater < this.RECOMMENDED_WATER.min) {
            score = 50;
            type = 'warning';
            content = `평균 ${avgWater}잔으로 부족합니다. 최소 ${this.RECOMMENDED_WATER.min}잔 이상 마셔주세요.`;
        } else if (avgWater >= this.RECOMMENDED_WATER.ideal) {
            score = 100;
            type = 'positive';
            content = `평균 ${avgWater}잔으로 충분한 수분을 섭취하고 있습니다! 훌륭해요! 🎉`;
        } else {
            score = 70 + (avgWater - this.RECOMMENDED_WATER.min) * 10;
            type = 'positive';
            content = `평균 ${avgWater}잔으로 괜찮지만, ${this.RECOMMENDED_WATER.ideal}잔을 목표로 해보세요.`;
        }

        return {
            score,
            insight: { type, icon, title, content }
        };
    }

    // 기록 일관성 분석
    analyzeConsistency(stats, period) {
        let totalDays;
        
        if (period === 'day') {
            totalDays = 1;
        } else if (period === 'week') {
            totalDays = 7;
        } else {
            // 월간: 현재 날짜까지
            const today = new Date();
            totalDays = today.getDate();
        }

        const recordRate = (stats.daysWithRecords / totalDays) * 100;
        
        let score = recordRate;
        let type = 'info';
        let icon = '📅';
        let title = '기록 일관성';
        let content = '';

        if (recordRate === 100) {
            type = 'positive';
            content = `${totalDays}일 중 ${stats.daysWithRecords}일 기록! 완벽한 일관성입니다! 🏆`;
        } else if (recordRate >= 80) {
            type = 'positive';
            content = `${totalDays}일 중 ${stats.daysWithRecords}일 기록! 잘하고 있어요! 계속 이어가세요! 💪`;
        } else if (recordRate >= 50) {
            type = 'warning';
            content = `${totalDays}일 중 ${stats.daysWithRecords}일 기록. 좀 더 꾸준히 기록해보세요.`;
        } else {
            type = 'critical';
            content = `${totalDays}일 중 ${stats.daysWithRecords}일만 기록했습니다. 매일 기록하는 습관을 만들어보세요.`;
        }

        return {
            score,
            insight: { type, icon, title, content }
        };
    }

    // 식사 균형 분석
    analyzeMealBalance(stats) {
        const { breakfast, lunch, dinner } = stats.mealCounts;
        const totalDays = stats.daysWithRecords;
        
        const breakfastRate = (breakfast / totalDays) * 100;
        const lunchRate = (lunch / totalDays) * 100;
        const dinnerRate = (dinner / totalDays) * 100;
        
        let score = 0;
        let type = 'info';
        let icon = '🍽️';
        let title = '식사 균형';
        let content = '';

        // 세 끼 모두 70% 이상 먹었는지 확인
        const allMealsGood = breakfastRate >= 70 && lunchRate >= 70 && dinnerRate >= 70;
        
        if (allMealsGood) {
            score = 100;
            type = 'positive';
            content = '아침, 점심, 저녁을 규칙적으로 드시고 있어요! 이상적입니다! ✨';
        } else {
            // 각 식사 비율의 평균
            score = (breakfastRate + lunchRate + dinnerRate) / 3;
            
            const skippedMeals = [];
            if (breakfastRate < 50) skippedMeals.push('아침');
            if (lunchRate < 50) skippedMeals.push('점심');
            if (dinnerRate < 50) skippedMeals.push('저녁');
            
            if (skippedMeals.length > 0) {
                type = 'warning';
                content = `${skippedMeals.join(', ')}을(를) 자주 거르고 있어요. 규칙적인 식사가 건강의 기본입니다.`;
            } else {
                type = 'positive';
                content = '대체로 균형잡힌 식사를 하고 있습니다. 조금만 더 규칙적으로!';
            }
        }

        return {
            score,
            insight: { type, icon, title, content }
        };
    }

    // 맞춤형 추천 사항 생성
    generateRecommendations(stats, caloriesScore, waterScore, consistencyScore, balanceScore) {
        const recommendations = [];

        // 칼로리 관련 추천
        if (caloriesScore.score < 70) {
            if (stats.avgCalories < this.RECOMMENDED_CALORIES.min) {
                recommendations.push({
                    icon: '🍎',
                    text: '영양가 높은 간식(견과류, 과일 등)을 추가해서 칼로리를 보충하세요.'
                });
            } else if (stats.avgCalories > this.RECOMMENDED_CALORIES.max) {
                recommendations.push({
                    icon: '🥗',
                    text: '채소 위주의 식단으로 포만감을 유지하면서 칼로리를 줄여보세요.'
                });
            }
        }

        // 물 섭취 관련 추천
        if (waterScore.score < 70) {
            recommendations.push({
                icon: '⏰',
                text: '매 시간마다 알람을 설정해서 물 마시는 습관을 만들어보세요.'
            });
            recommendations.push({
                icon: '🚰',
                text: '아침에 일어나자마자 물 한 잔, 식사 전후로 물 한 잔씩 마셔보세요.'
            });
        }

        // 일관성 관련 추천
        if (consistencyScore.score < 70) {
            recommendations.push({
                icon: '📱',
                text: '매일 같은 시간에 기록하는 루틴을 만들어보세요. 알람을 활용하면 좋아요!'
            });
        }

        // 식사 균형 관련 추천
        if (balanceScore.score < 70) {
            if (stats.mealCounts.breakfast < stats.daysWithRecords * 0.5) {
                recommendations.push({
                    icon: '🌅',
                    text: '아침 식사를 거르지 마세요. 간단한 과일이나 요거트라도 좋습니다.'
                });
            }
            recommendations.push({
                icon: '⏱️',
                text: '규칙적인 식사 시간을 정해두면 건강 관리가 훨씬 쉬워집니다.'
            });
        }

        // 긍정적인 격려 (점수가 높을 때)
        if (stats.daysWithRecords >= 7) {
            recommendations.push({
                icon: '🎯',
                text: '꾸준한 기록, 정말 대단해요! 이 습관을 계속 유지하면 목표 달성이 가까워집니다.'
            });
        }

        return recommendations;
    }

    // 점수에 따른 상태 텍스트
    getScoreStatusText(scoreLevel) {
        const statusTexts = {
            'excellent': '매우 좋음',
            'good': '좋음',
            'fair': '보통',
            'poor': '개선 필요',
            'no-data': '데이터 없음'
        };
        
        return statusTexts[scoreLevel] || '평가 중';
    }
}
