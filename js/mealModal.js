// 식사 기록 모달 관리 모듈
export class MealModal {
    constructor(mealManager, onClose) {
        this.mealManager = mealManager;
        this.onClose = onClose;
        this.modal = document.getElementById('mealModal');
        this.overlay = this.modal.querySelector('.meal-modal-overlay');
        this.closeBtn = document.getElementById('mealModalClose');
        this.saveBtn = document.getElementById('mealModalSave');
        this.dateDisplay = document.getElementById('mealModalDate');
        
        // 물 섭취 카운터 요소들
        this.waterCountDisplay = document.getElementById('waterCount');
        this.waterIncreaseBtn = document.getElementById('waterIncreaseBtn');
        this.waterDecreaseBtn = document.getElementById('waterDecreaseBtn');
        
        this.currentYear = null;
        this.currentMonth = null;
        this.currentDay = null;
        
        this.currentData = null;
        this.waterCount = 0;
        
        this.init();
    }

    init() {
        // 닫기 버튼
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        
        // 저장 버튼
        this.saveBtn.addEventListener('click', () => this.save());
        
        // 물 카운터 버튼
        this.waterIncreaseBtn.addEventListener('click', () => {
            this.waterCount++;
            this.updateWaterDisplay();
        });
        
        this.waterDecreaseBtn.addEventListener('click', () => {
            if (this.waterCount > 0) {
                this.waterCount--;
                this.updateWaterDisplay();
            }
        });
        
        // 식사 추가 버튼들
        this.setupMealTypeButtons();
    }

    setupMealTypeButtons() {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        mealTypes.forEach(type => {
            const addBtn = document.getElementById(`add${type.charAt(0).toUpperCase() + type.slice(1)}`);
            const textInput = document.getElementById(`${type}TextInput`);
            const caloriesInput = document.getElementById(`${type}CaloriesInput`);
            
            if (addBtn && textInput) {
                addBtn.addEventListener('click', () => {
                    const text = textInput.value.trim();
                    const calories = parseInt(caloriesInput.value) || 0;
                    
                    if (text) {
                        this.addMealToList(type, text, calories);
                        textInput.value = '';
                        caloriesInput.value = '';
                        textInput.focus();
                    }
                });
                
                // Enter 키로도 추가 가능
                textInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        addBtn.click();
                    }
                });
            }
        });
    }

    updateWaterDisplay() {
        this.waterCountDisplay.textContent = this.waterCount;
        
        // 0이면 감소 버튼 비활성화
        if (this.waterCount === 0) {
            this.waterDecreaseBtn.disabled = true;
        } else {
            this.waterDecreaseBtn.disabled = false;
        }
    }

    open(year, month, day) {
        this.currentYear = year;
        this.currentMonth = month;
        this.currentDay = day;
        
        // 날짜 표시
        this.dateDisplay.textContent = `${year}년 ${month + 1}월 ${day}일`;
        
        // 기존 데이터 로드
        this.loadData();
        
        // 모달 표시
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    loadData() {
        this.currentData = this.mealManager.getMealsByDate(
            this.currentYear,
            this.currentMonth,
            this.currentDay
        );
        
        // 각 식사 타입별로 렌더링
        this.renderMealList('breakfast', this.currentData.breakfast);
        this.renderMealList('lunch', this.currentData.lunch);
        this.renderMealList('dinner', this.currentData.dinner);
        this.renderMealList('snack', this.currentData.snack);
        
        // 물 섭취량 로드
        this.waterCount = this.currentData.water || 0;
        this.updateWaterDisplay();
        
        // 추가 정보 로드
        document.getElementById('exerciseInput').value = this.currentData.exercise || '';
        document.getElementById('memoInput').value = this.currentData.memo || '';
        
        // 총 칼로리 업데이트
        this.updateTotalCalories();
    }

    renderMealList(mealType, meals) {
        const listElement = document.getElementById(`${mealType}List`);
        
        if (meals.length === 0) {
            listElement.innerHTML = '<div class="meal-empty">기록이 없습니다</div>';
            return;
        }
        
        listElement.innerHTML = meals.map((meal, index) => `
            <div class="meal-item">
                <div class="meal-item-info">
                    <span class="meal-item-text">${this.escapeHtml(meal.text)}</span>
                    <span class="meal-item-calories">${meal.calories}kcal</span>
                </div>
                <button class="meal-item-delete" data-type="${mealType}" data-index="${index}">
                    삭제
                </button>
            </div>
        `).join('');
        
        // 삭제 버튼 이벤트 추가
        listElement.querySelectorAll('.meal-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const index = parseInt(e.target.dataset.index);
                this.deleteMealFromList(type, index);
            });
        });
    }

    addMealToList(mealType, text, calories) {
        this.currentData[mealType].push({
            text: text,
            calories: calories,
            timestamp: new Date().toISOString()
        });
        
        this.renderMealList(mealType, this.currentData[mealType]);
        this.updateTotalCalories();
    }

    deleteMealFromList(mealType, index) {
        this.currentData[mealType].splice(index, 1);
        this.renderMealList(mealType, this.currentData[mealType]);
        this.updateTotalCalories();
    }

    updateTotalCalories() {
        let total = 0;
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
            this.currentData[mealType].forEach(item => {
                total += item.calories || 0;
            });
        });
        
        document.getElementById('totalCalories').textContent = total;
    }

    save() {
        // 추가 정보 수집
        this.currentData.water = this.waterCount;
        this.currentData.exercise = document.getElementById('exerciseInput').value.trim();
        this.currentData.memo = document.getElementById('memoInput').value.trim();
        
        // 저장
        this.mealManager.saveDateData(
            this.currentYear,
            this.currentMonth,
            this.currentDay,
            this.currentData
        );
        
        // 모달 닫기 및 콜백 호출
        this.close();
        
        if (this.onClose) {
            this.onClose();
        }
    }

    // XSS 방지를 위한 HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
