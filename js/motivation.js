// 동기부여 문구 관리 모듈
export class MotivationManager {
    constructor() {
        this.motivations = [];
        this.currentMotivation = '';
    }

    // JSON 파일에서 문구 로드
    async loadMotivations() {
        try {
            const response = await fetch('./data/motivations.json');
            const data = await response.json();
            this.motivations = data.motivations;
            return true;
        } catch (error) {
            console.error('동기부여 문구 로드 실패:', error);
            // 기본 문구 사용
            this.motivations = [
                "오늘도 화이팅! 💪",
                "작은 변화가 큰 결과를 만듭니다",
                "건강한 선택, 멋진 나"
            ];
            return false;
        }
    }

    // 완전 랜덤 문구 선택
    getRandomMotivation() {
        if (this.motivations.length === 0) {
            return "로딩 중...";
        }
        const index = Math.floor(Math.random() * this.motivations.length);
        this.currentMotivation = this.motivations[index];
        return this.currentMotivation;
    }
}
