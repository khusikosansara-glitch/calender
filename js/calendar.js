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
        this.weekdays = ['일', '월', '화', '수', '목', '금', '토'];
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
                    <button id="todayButton">오늘</button>
                    <button id="nextMonth">다음</button>
                </div>
            </div>
            ${this.generateWeekdaysHeader()}
            ${this.generateCalendarGrid()}
            <div class="meal-summary">
                ${this.generateMealSummary()}
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEvents();
    }

    // 요일 헤더 생성
    generateWeekdaysHeader() {
        let html = '<div class="calendar-weekdays">';
        
        // 주차 라벨
        html += '<div class="calendar-weekday week-label">주차</div>';
        
        // 요일
        this.weekdays.forEach((day, index) => {
            const classes = [];
            if (index === 0) classes.push('sunday');
            if (index === 6) classes.push('saturday');
            
            html += `<div class="calendar-weekday ${classes.join(' ')}">${day}</div>`;
        });
        
        html += '</div>';
        return html;
    }

    // 연도 기준 주차 계산 (일요일 시작)
    getWeekNumber(date) {
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        
        // 1월 1일이 무슨 요일인지 (0: 일요일)
        const startDay = startOfYear.getDay();
        
        // 1월 1일부터 현재 날짜까지의 일수
        const diff = date - startOfYear;
        const daysSinceStart = Math.floor(diff / (24 * 60 * 60 * 1000));
        
        // 1월 1일이 속한 주의 일요일까지 남은 일수
        const daysToFirstSunday = startDay === 0 ? 0 : (7 - startDay);
        
        // 주차 계산
        if (daysSinceStart < daysToFirstSunday) {
            return 1;
        } else {
            const daysAfterFirstWeek = daysSinceStart - daysToFirstSunday;
            return Math.floor(daysAfterFirstWeek / 7) + 2;
        }
    }

    // 캘린더 그리드 생성
    generateCalendarGrid() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        const firstDayOfWeek = firstDay.getDay();
        
        const datesWithMeals = this.mealManager 
            ? this.mealManager.getDatesWithMeals(year, month)
            : [];
        
        let html = '<div class="calendar-grid">';
        let currentDay = 1;
        
        while (currentDay <= daysInMonth) {
            html += '<div class="calendar-week-row">';
            
            // 이번 주의 일요일 날짜
            let weekStartDay = currentDay;
            if (currentDay === 1) {
                weekStartDay = 1;
            } else {
                const currentDayOfWeek = (firstDayOfWeek + currentDay - 1) % 7;
                weekStartDay = currentDay - currentDayOfWeek;
            }
            
            const weekDate = new Date(year, month, weekStartDay);
            const weekNumber = this.getWeekNumber(weekDate);
            
            html += `<div class="calendar-week-number">${weekNumber}주</div>`;
            
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const isBeforeStart = (currentDay === 1 && dayOfWeek < firstDayOfWeek);
                const isAfterEnd = (currentDay > daysInMonth);
                
                if (isBeforeStart || isAfterEnd) {
                    html += '<div class="calendar-day" style="visibility: hidden;"></div>';
                } else {
                    const isToday = this.isToday(year, month, currentDay);
                    const isSelected = this.isSelected(year, month, currentDay);
                    const hasMeal = datesWithMeals.includes(currentDay);
                    
                    const classes = [
                        'calendar-day',
                        dayOfWeek === 0 ? 'sunday' : '',
                        dayOfWeek === 6 ? 'saturday' : '',
                        isToday ? 'today' : '',
                        isSelected ? 'selected' : '',
                        hasMeal ? 'has-meal' : ''
                    ].filter(Boolean).join(' ');
                    
                    html += `<div class="${classes}" data-year="${year}" data-month="${month}" data-day="${currentDay}">${currentDay}</div>`;
                    currentDay++;
                }
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }

    generateMealSummary() {
        const { year, month, day } = this.selectedDate;
        const meals = this.mealManager.getMealsByDate(year, month, day);
        const totalCalories = this.mealManager.getTotalCalories(year, month, day);
        
        const dateStr = `${year}년 ${month + 1}월 ${day}일`;
        
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
            ${meals.images && meals.images.length > 0 ? `
                <div class="meal-summary-extra">
                    <div class="meal-summary-image-header">
                        <h4>📷 사진</h4>
                        ${meals.images.length > 1 ? `
                            <div class="image-tabs">
                                ${meals.images.map((img, index) => `
                                    <button class="image-tab ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                                        사진 ${index + 1}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="meal-summary-images-container">
                        ${meals.images.map((img, index) => `
                            <div class="meal-summary-image-single ${index === 0 ? 'active' : ''}" data-image-id="${index}">
                                <img src="${img.base64}" alt="사진 ${index + 1}" />
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
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
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.selectedDate = {
                year: this.currentDate.getFullYear(),
                month: this.currentDate.getMonth(),
                day: 1
            };
            this.render();
        });

        document.getElementById('todayButton').addEventListener('click', () => {
            const today = new Date();
            this.currentDate = new Date(today);
            this.selectedDate = {
                year: today.getFullYear(),
                month: today.getMonth(),
                day: today.getDate()
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

        this.container.querySelectorAll('.calendar-day').forEach(dayElement => {
            dayElement.addEventListener('click', (e) => {
                const year = parseInt(e.target.dataset.year);
                const month = parseInt(e.target.dataset.month);
                const day = parseInt(e.target.dataset.day);
                
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    this.selectedDate = { year, month, day };
                    this.render();
                }
            });
        });

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

        // 이미지 탭 이벤트
        this.container.querySelectorAll('.image-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.imageIndex);
                
                // 모든 탭 비활성화
                this.container.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
                // 클릭한 탭 활성화
                e.target.classList.add('active');
                
                // 모든 이미지 숨기기
                this.container.querySelectorAll('.meal-summary-image-single').forEach(img => img.classList.remove('active'));
                // 해당 이미지 보이기
                const targetImage = this.container.querySelector(`.meal-summary-image-single[data-image-id="${index}"]`);
                if (targetImage) {
                    targetImage.classList.add('active');
                }
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
