// 대시보드 관리 모듈
export class Dashboard {
    constructor(container, mealManager) {
        this.container = container;
        this.mealManager = mealManager;
    }

    // 대시보드 렌더링
    render() {
        this.updateTodayCalories();
        this.updateTodayWater();
        this.updateWeekExercise();
        this.updateTotalDays();
        this.updateRecentActivity();
    }

    // 오늘의 칼로리 계산
    updateTodayCalories() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        
        const totalCalories = this.mealManager.getTotalCalories(year, month, day);
        
        const element = document.getElementById('todayCalories');
        if (element) {
            element.textContent = `${totalCalories} kcal`;
        }
    }

    // 오늘의 물 섭취량
    updateTodayWater() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        
        const mealData = this.mealManager.getMealsByDate(year, month, day);
        const waterCount = mealData?.water || 0;
        
        const element = document.getElementById('todayWater');
        if (element) {
            element.textContent = `${waterCount} 잔`;
        }
    }

    // 이번 주 운동 횟수
    updateWeekExercise() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        let exerciseCount = 0;
        
        // 이번 주 7일 동안 확인
        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(startOfWeek);
            checkDate.setDate(startOfWeek.getDate() + i);
            
            const year = checkDate.getFullYear();
            const month = checkDate.getMonth();
            const day = checkDate.getDate();
            
            const mealData = this.mealManager.getMealsByDate(year, month, day);
            if (mealData?.exercise && mealData.exercise.trim() !== '') {
                exerciseCount++;
            }
        }
        
        const element = document.getElementById('weekExercise');
        if (element) {
            element.textContent = `${exerciseCount}회`;
        }
    }

    // 총 기록 일수
    updateTotalDays() {
        const allData = this.mealManager.getAllMeals();
        const totalDays = Object.keys(allData).length;
        
        const element = document.getElementById('totalDays');
        if (element) {
            element.textContent = `${totalDays}일`;
        }
    }

    // 최근 활동 업데이트
    updateRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        const allData = this.mealManager.getAllMeals();
        const dates = Object.keys(allData).sort().reverse().slice(0, 5);
        
        if (dates.length === 0) {
            container.innerHTML = '<p class="empty-message">아직 기록된 활동이 없습니다.</p>';
            return;
        }
        
        container.innerHTML = '';
        
        dates.forEach(dateKey => {
            const [year, month, day] = dateKey.split('-').map(Number);
            const mealData = allData[dateKey];
            
            // 총 칼로리 계산
            let totalCalories = 0;
            ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
                if (mealData[mealType]) {
                    mealData[mealType].forEach(item => {
                        totalCalories += item.calories || 0;
                    });
                }
            });
            
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            // 아이콘 선택
            let icon = 'fa-utensils';
            let iconColor = 'var(--accent-color)';
            
            if (mealData.exercise && mealData.exercise.trim() !== '') {
                icon = 'fa-dumbbell';
                iconColor = '#43e97b';
            }
            
            activityItem.innerHTML = `
                <div class="activity-icon" style="background-color: ${iconColor};">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${year}년 ${month}월 ${day}일 - ${totalCalories} kcal</div>
                    <div class="activity-time">
                        ${mealData.exercise ? '운동: ' + mealData.exercise : '식사 기록'}
                        ${mealData.water ? ` | 물: ${mealData.water}잔` : ''}
                    </div>
                </div>
            `;
            
            container.appendChild(activityItem);
        });
    }
}
