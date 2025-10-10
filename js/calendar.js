// 캘린더 렌더링 모듈
export class Calendar {
    constructor(containerElement, mealManager, onEditClick) {
        this.container = containerElement;
        this.mealManager = mealManager;
        this.onEditClick = onEditClick;
        this.currentDate = new Date();
        this.selectedDate = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate()
        };
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const html = `
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button id="prevMonth">이전</button>
                </div>
                <h2>${year}년 ${month + 1}월</h2>
                <div class="calendar-nav">
                    <button id="nextMonth">다음</button>
                </div>
            </div>
            <div class="calendar-grid">
                ${this.generateDays()}
            </div>
            <div class="meal-summary">
                ${this.generateMealSummary()}
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEvents();
    }

    generateDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const datesWithMeals = this.mealManager 
            ? this.mealManager.getDatesWithMeals(year, month)
            : [];
        
        let html = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = this.isToday(year, month, day);
            const isSelected = this.isSelected(year, month, day);
            const hasMeal = datesWithMeals.includes(day);
            
            const classes = [
                'calendar-day',
                isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                hasMeal ? 'has-meal' : ''
            ].filter(Boolean).join(' ');
            
            html += `<div class="${classes}" data-year="${year}" data-month="${month}" data-day="${day}">${day}</div>`;
        }
        
        return html;
    }

    generateMealSummary() {
        const { year, month, day } = this.selectedDate;
        const meals = this.mealManager.getMealsByDate(year, month, day);
        const totalCalories = this.mealManager.getTotalCalories(year, month, day);
        
        const dateStr = `${year}년 ${month + 1}월 ${day}일`;
        
        // 데이터가 있는지 확인
        const hasData = !this.mealManager.isDateEmpty(meals);
        
        const buttonText = hasData ? '수정' : '작성';
        
        return `
            <div class="meal-summary-header">
                <span class="meal-summary-date">${dateStr}</span>
                <button class="meal-summary-edit" id="editMealSummary">${buttonText}</button>
            </div>
            ${hasData ? this.generateDataView(meals, totalCalories) : this.generateEmptyView()}
        `;
    }

    generateDataView(meals, totalCalories) {
        return `
            <div class="meal-summary-stats">
                <div class="stat-item">
                    <span class="stat-label">총 칼로리</span>
                    <span class="stat-value">${totalCalories} kcal</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">물 섭취</span>
                    <span class="stat-value">${meals.water || 0} 잔</span>
                </div>
            </div>
            <div class="meal-summary-content">
                ${this.generateMealSection('🌅 아침', meals.breakfast)}
                ${this.generateMealSection('☀️ 점심', meals.lunch)}
                ${this.generateMealSection('🌙 저녁', meals.dinner)}
                ${this.generateMealSection('🍪 간식', meals.snack)}
            </div>
            ${meals.exercise ? `
                <div class="meal-summary-extra">
                    <h4>💪 운동</h4>
                    <p>${this.escapeHtml(meals.exercise)}</p>
                </div>
            ` : ''}
            ${meals.memo ? `
                <div class="meal-summary-extra">
                    <h4>📝 메모</h4>
                    <p>${this.escapeHtml(meals.memo)}</p>
                </div>
            ` : ''}
        `;
    }

    generateEmptyView() {
        return `
            <div class="meal-summary-empty">
                <p>아직 기록이 없습니다.</p>
                <p>위 "작성" 버튼을 눌러 식사를 기록하세요.</p>
            </div>
        `;
    }

    generateMealSection(title, items) {
        if (items.length === 0) {
            return `
                <div class="meal-summary-section">
                    <h4 class="meal-summary-section-title">${title}</h4>
                    <p class="meal-empty-text">기록 없음</p>
                </div>
            `;
        }
        
        const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
        
        const itemsHtml = items.map(item => 
            `<li class="meal-summary-item">
                <span>${this.escapeHtml(item.text)}</span>
                <span class="meal-item-cal">${item.calories}kcal</span>
            </li>`
        ).join('');
        
        return `
            <div class="meal-summary-section">
                <div class="meal-summary-section-header">
                    <h4 class="meal-summary-section-title">${title}</h4>
                    <span class="meal-summary-section-total">${totalCalories}kcal</span>
                </div>
                <ul class="meal-summary-list">
                    ${itemsHtml}
                </ul>
            </div>
        `;
    }

    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year && 
               today.getMonth() === month && 
               today.getDate() === day;
    }

    isSelected(year, month, day) {
        return this.selectedDate.year === year &&
               this.selectedDate.month === month &&
               this.selectedDate.day === day;
    }

    attachEvents() {
        // 이전/다음 버튼
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.selectedDate = {
                year: this.currentDate.getFullYear(),
                month: this.currentDate.getMonth(),
                day: 1
            };
            this.render();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.selectedDate = {
                year: this.currentDate.getFullYear(),
                month: this.currentDate.getMonth(),
                day: 1
            };
            this.render();
        });

        // 날짜 클릭
        this.container.querySelectorAll('.calendar-day').forEach(dayElement => {
            dayElement.addEventListener('click', (e) => {
                const year = parseInt(e.target.dataset.year);
                const month = parseInt(e.target.dataset.month);
                const day = parseInt(e.target.dataset.day);
                
                this.selectedDate = { year, month, day };
                this.render();
            });
        });

        // 작성/수정 버튼
        const editBtn = document.getElementById('editMealSummary');
        if (editBtn && this.onEditClick) {
            editBtn.addEventListener('click', () => {
                this.onEditClick(
                    this.selectedDate.year,
                    this.selectedDate.month,
                    this.selectedDate.day
                );
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
