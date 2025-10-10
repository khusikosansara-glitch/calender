// 통계 관리 모듈
export class StatsManager {
    constructor(mealManager) {
        this.mealManager = mealManager;
    }

    // 날짜 범위의 통계 계산
    getStatsForPeriod(startDate, endDate) {
        const stats = {
            totalCalories: 0,
            totalWater: 0,
            daysWithRecords: 0,
            avgCalories: 0,
            avgWater: 0,
            dailyData: [],
            mealCounts: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snack: 0
            }
        };

        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();
            
            const dayData = this.mealManager.getMealsByDate(year, month, day);
            const hasMeal = this.mealManager.hasMeals(year, month, day);
            
            if (hasMeal) {
                stats.daysWithRecords++;
            }
            
            // 일일 칼로리 계산
            const dayCalories = this.mealManager.getTotalCalories(year, month, day);
            stats.totalCalories += dayCalories;
            
            // 물 섭취량
            stats.totalWater += dayData.water || 0;
            
            // 차트용 일일 데이터
            stats.dailyData.push({
                date: new Date(currentDate),
                calories: dayCalories,
                water: dayData.water || 0
            });
            
            // 식사 횟수 카운트
            if (dayData.breakfast.length > 0) stats.mealCounts.breakfast++;
            if (dayData.lunch.length > 0) stats.mealCounts.lunch++;
            if (dayData.dinner.length > 0) stats.mealCounts.dinner++;
            if (dayData.snack.length > 0) stats.mealCounts.snack++;
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // 평균 계산
        if (stats.daysWithRecords > 0) {
            stats.avgCalories = Math.round(stats.totalCalories / stats.daysWithRecords);
            stats.avgWater = Math.round(stats.totalWater / stats.daysWithRecords);
        }
        
        return stats;
    }

    // 오늘 통계
    getTodayStats() {
        const today = new Date();
        return this.getStatsForPeriod(today, today);
    }

    // 이번 주 통계 (월요일부터)
    getWeekStats() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        
        // 월요일로 이동 (0: 일요일, 1: 월요일)
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        
        return this.getStatsForPeriod(monday, sunday);
    }

    // 이번 달 통계
    getMonthStats() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        return this.getStatsForPeriod(firstDay, lastDay);
    }

    // 최근 7일 통계
    getLast7DaysStats() {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        return this.getStatsForPeriod(sevenDaysAgo, today);
    }

    // 최근 30일 통계
    getLast30DaysStats() {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        
        return this.getStatsForPeriod(thirtyDaysAgo, today);
    }
}
