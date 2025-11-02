// 이미지 처리 유틸리티 모듈
export class ImageHandler {
    constructor() {
        this.MAX_WIDTH = 800;  // 최대 가로 크기
        this.MAX_HEIGHT = 800;  // 최대 세로 크기
        this.QUALITY = 0.7;  // 압축 품질 (0-1)
        this.MAX_SIZE_MB = 0.5;  // 최대 파일 크기 (MB)
        this.MAX_IMAGES_PER_DAY = 2;  // 날짜당 최대 이미지 수
    }

    /**
     * 파일을 압축하고 Base64로 변환
     * @param {File} file - 이미지 파일
     * @returns {Promise<string>} Base64 문자열
     */
    async compressImage(file) {
        return new Promise((resolve, reject) => {
            // 파일 타입 검증
            if (!file.type.startsWith('image/')) {
                reject(new Error('이미지 파일만 업로드 가능합니다.'));
                return;
            }

            // 파일 크기 검증 (10MB 이상은 거부)
            if (file.size > 10 * 1024 * 1024) {
                reject(new Error('파일 크기가 너무 큽니다. (최대 10MB)'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // 비율 유지하면서 리사이징
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > this.MAX_WIDTH || height > this.MAX_HEIGHT) {
                        const ratio = Math.min(
                            this.MAX_WIDTH / width,
                            this.MAX_HEIGHT / height
                        );
                        width = Math.floor(width * ratio);
                        height = Math.floor(height * ratio);
                    }
                    
                    // Canvas로 리사이징 및 압축
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Base64로 변환 (압축 적용)
                    const base64 = canvas.toDataURL('image/jpeg', this.QUALITY);
                    
                    // 압축 후 크기 확인
                    const sizeKB = (base64.length * 3) / 4 / 1024;
                    console.log(`압축 완료: ${Math.round(sizeKB)}KB`);
                    
                    resolve(base64);
                };
                
                img.onerror = () => {
                    reject(new Error('이미지를 로드할 수 없습니다.'));
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                reject(new Error('파일을 읽을 수 없습니다.'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * LocalStorage 사용량 확인
     * @returns {Object} 사용량 정보
     */
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        
        const usedMB = (total / 1024 / 1024).toFixed(2);
        const limitMB = 5;  // 대략적인 한계
        const percentage = ((usedMB / limitMB) * 100).toFixed(1);
        
        return {
            usedMB,
            limitMB,
            percentage,
            available: limitMB - usedMB
        };
    }

    /**
     * 저장 가능 여부 확인
     * @param {string} base64 - 저장할 Base64 이미지
     * @returns {Object} 가능 여부 및 정보
     */
    canStore(base64) {
        const usage = this.getStorageUsage();
        const imageSizeMB = (base64.length / 1024 / 1024).toFixed(2);
        
        const canStore = parseFloat(imageSizeMB) < parseFloat(usage.available);
        
        return {
            canStore,
            imageSizeMB,
            ...usage
        };
    }

    /**
     * 이미지 미리보기 URL 생성
     * @param {string} base64 - Base64 이미지
     * @returns {string} 미리보기 URL
     */
    getPreviewUrl(base64) {
        return base64;
    }

    /**
     * Base64 크기 계산 (KB)
     * @param {string} base64 - Base64 문자열
     * @returns {number} 크기 (KB)
     */
    getBase64Size(base64) {
        return Math.round((base64.length * 3) / 4 / 1024);
    }
}
