// 식사 기록 모달 관리 모듈
import { ImageHandler } from './imageHandler.js';

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
        
        // 이미지 관련 요소들
        this.imageHandler = new ImageHandler();
        this.imageInput = document.getElementById('imageInput');
        this.imageUploadBtn = document.getElementById('imageUploadBtn');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.storageInfo = document.getElementById('storageInfo');
        this.currentImages = [];
        
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
        
        // 이미지 업로드 버튼
        this.setupImageUpload();
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
        
        // 이미지 로드
        this.currentImages = this.currentData.images || [];
        this.renderImagePreviews();
        this.updateStorageInfo();
        
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
        this.currentData.images = this.currentImages;  // 이미지 저장
        
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

    // 이미지 업로드 설정
    setupImageUpload() {
        // 업로드 버튼 클릭
        this.imageUploadBtn.addEventListener('click', () => {
            if (this.currentImages.length >= this.imageHandler.MAX_IMAGES_PER_DAY) {
                alert(`최대 ${this.imageHandler.MAX_IMAGES_PER_DAY}장까지만 추가할 수 있습니다.`);
                return;
            }
            this.imageInput.click();
        });

        // 파일 선택 시
        this.imageInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            // 최대 개수 확인
            const remaining = this.imageHandler.MAX_IMAGES_PER_DAY - this.currentImages.length;
            const filesToProcess = files.slice(0, remaining);

            if (files.length > remaining) {
                alert(`최대 ${this.imageHandler.MAX_IMAGES_PER_DAY}장까지만 추가할 수 있습니다. ${remaining}장만 추가됩니다.`);
            }

            // 각 파일 처리
            for (const file of filesToProcess) {
                try {
                    const base64 = await this.imageHandler.compressImage(file);
                    
                    // 저장 가능 여부 확인
                    const storageCheck = this.imageHandler.canStore(base64);
                    
                    if (!storageCheck.canStore) {
                        alert(`저장 공간이 부족합니다.\n사용 중: ${storageCheck.usedMB}MB / ${storageCheck.limitMB}MB\n이미지 크기: ${storageCheck.imageSizeMB}MB`);
                        break;
                    }
                    
                    this.currentImages.push({
                        base64: base64,
                        size: this.imageHandler.getBase64Size(base64),
                        timestamp: new Date().toISOString()
                    });
                    
                } catch (error) {
                    alert(`이미지 처리 오류: ${error.message}`);
                }
            }

            // 미리보기 업데이트
            this.renderImagePreviews();
            this.updateStorageInfo();
            
            // input 초기화
            e.target.value = '';
        });
    }

    // 이미지 미리보기 렌더링
    renderImagePreviews() {
        if (this.currentImages.length === 0) {
            this.imagePreviewContainer.innerHTML = '';
            return;
        }

        this.imagePreviewContainer.innerHTML = this.currentImages.map((img, index) => `
            <div class="image-preview-item">
                <img src="${img.base64}" alt="사진 ${index + 1}">
                <button class="image-preview-delete" data-index="${index}" title="삭제">
                    <i class="fas fa-times"></i>
                </button>
                <div class="image-preview-size">${img.size}KB</div>
            </div>
        `).join('');

        // 삭제 버튼 이벤트
        this.imagePreviewContainer.querySelectorAll('.image-preview-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.deleteImage(index);
            });
        });
    }

    // 이미지 삭제
    deleteImage(index) {
        this.currentImages.splice(index, 1);
        this.renderImagePreviews();
        this.updateStorageInfo();
    }

    // 저장 공간 정보 업데이트
    updateStorageInfo() {
        const usage = this.imageHandler.getStorageUsage();
        
        this.storageInfo.classList.remove('warning', 'error');
        
        if (usage.percentage > 80) {
            this.storageInfo.classList.add('error');
            this.storageInfo.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <strong>경고:</strong> 저장 공간이 ${usage.percentage}% 사용 중입니다. (${usage.usedMB}MB / ${usage.limitMB}MB)<br>
                일부 데이터를 삭제해주세요.
            `;
        } else if (usage.percentage > 60) {
            this.storageInfo.classList.add('warning');
            this.storageInfo.innerHTML = `
                <i class="fas fa-info-circle"></i>
                저장 공간: ${usage.usedMB}MB / ${usage.limitMB}MB (${usage.percentage}% 사용 중)
            `;
        } else {
            this.storageInfo.innerHTML = `
                <i class="fas fa-check-circle"></i>
                저장 공간: ${usage.usedMB}MB / ${usage.limitMB}MB (${usage.percentage}% 사용 중)
            `;
        }
        
        this.storageInfo.classList.add('show');
    }
}
