// 식사 데이터 관리 모듈
export class MealManager {
    constructor() {
        this.storageKey = 'diet_calendar_meals';
    }

    // 날짜 키 생성 (YYYY-MM-DD 형식)
    getDateKey(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }

    // 모든 식사 데이터 가져오기
    getAllMeals() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    // 특정 날짜의 식사 데이터 가져오기
    getMealsByDate(year, month, day) {
        const dateKey = this.getDateKey(year, month, day);
        const allMeals = this.getAllMeals();
        
        return allMeals[dateKey] || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        water: 0,
        exercise: '',
        memo: '',
            images: []  // 이미지 배열 추가
            };
    }

    // 식사 추가
    addMeal(year, month, day, mealType, mealData) {
        const dateKey = this.getDateKey(year, month, day);
        const allMeals = this.getAllMeals();
        
        if (!allMeals[dateKey]) {
            allMeals[dateKey] = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
                water: 0,
                exercise: '',
                memo: '',
                images: []  // 이미지 배열 추가
            };
        }
        
        allMeals[dateKey][mealType].push({
            text: mealData.text,
            calories: mealData.calories || 0,
            timestamp: new Date().toISOString()
        });
        
        this.saveMeals(allMeals);
    }

    // 식사 삭제
    deleteMeal(year, month, day, mealType, index) {
        const dateKey = this.getDateKey(year, month, day);
        const allMeals = this.getAllMeals();
        
        if (allMeals[dateKey] && allMeals[dateKey][mealType]) {
            allMeals[dateKey][mealType].splice(index, 1);
            
            // 모든 식사가 비어있고 추가 정보도 없으면 날짜 데이터 삭제
            const isEmpty = this.isDateEmpty(allMeals[dateKey]);
            if (isEmpty) {
                delete allMeals[dateKey];
            }
            
            this.saveMeals(allMeals);
        }
    }

    // 날짜별 전체 데이터 저장
    saveDateData(year, month, day, data) {
        const dateKey = this.getDateKey(year, month, day);
        const allMeals = this.getAllMeals();
        
        allMeals[dateKey] = data;
        
        // 데이터가 완전히 비어있으면 삭제
        if (this.isDateEmpty(data)) {
            delete allMeals[dateKey];
        }
        
        this.saveMeals(allMeals);
    }

    // 날짜 데이터가 비어있는지 확인
    isDateEmpty(dateData) {
        return dateData.breakfast.length === 0 &&
               dateData.lunch.length === 0 &&
               dateData.dinner.length === 0 &&
               dateData.snack.length === 0 &&
               dateData.water === 0 &&
               !dateData.exercise &&
               !dateData.memo &&
               (!dateData.images || dateData.images.length === 0);  // 이미지 확인 추가
    }

    // 식사 데이터 저장
    saveMeals(meals) {
        localStorage.setItem(this.storageKey, JSON.stringify(meals));
    }

    // 특정 날짜에 기록이 있는지 확인
    hasMeals(year, month, day) {
        const dateKey = this.getDateKey(year, month, day);
        const allMeals = this.getAllMeals();
        
        if (!allMeals[dateKey]) return false;
        
        return !this.isDateEmpty(allMeals[dateKey]);
    }

    // 특정 월에 기록이 있는 날짜들 가져오기
    getDatesWithMeals(year, month) {
        const allMeals = this.getAllMeals();
        const datesWithMeals = [];
        
        Object.keys(allMeals).forEach(dateKey => {
            const [y, m, d] = dateKey.split('-').map(Number);
            if (y === year && m === month + 1) {
                if (!this.isDateEmpty(allMeals[dateKey])) {
                    datesWithMeals.push(d);
                }
            }
        });
        
        return datesWithMeals;
    }

    // 날짜별 총 칼로리 계산
    getTotalCalories(year, month, day) {
        const meals = this.getMealsByDate(year, month, day);
        let total = 0;
        
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
            meals[mealType].forEach(item => {
                total += item.calories || 0;
            });
        });
        
        return total;
    }
}
