// 모달 관리 모듈
export class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
        
        this.init();
    }

    init() {
        // 확인 버튼 클릭 시 모달 닫기
        this.modalClose.addEventListener('click', () => {
            this.close();
        });

        // 오버레이(배경) 클릭 시 모달 닫기
        this.modalOverlay.addEventListener('click', () => {
            this.close();
        });
    }

    // 모달 열기
    show(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.classList.add('show');
        
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';
    }

    // 모달 닫기
    close() {
        this.modal.classList.remove('show');
        
        // body 스크롤 복구
        document.body.style.overflow = '';
    }
}
