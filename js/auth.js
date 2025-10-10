// 인증(로그인/회원가입) 관리 모듈
export class AuthManager {
    constructor() {
        this.currentUserKey = 'diet_calendar_user';
        this.usersKey = 'diet_calendar_users';
    }

    // 모든 사용자 목록 가져오기
    getAllUsers() {
        const usersData = localStorage.getItem(this.usersKey);
        return usersData ? JSON.parse(usersData) : [];
    }

    // 사용자 목록 저장
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // 이메일로 사용자 찾기
    findUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email);
    }

    // 회원가입
    register(email, password) {
        // 1. 이메일 중복 확인
        const existingUser = this.findUserByEmail(email);
        if (existingUser) {
            return {
                success: false,
                message: '이미 가입된 이메일입니다.'
            };
        }

        // 2. 새 사용자 생성
        const newUser = {
            email: email,
            password: password, // 실제로는 암호화해야 함!
            createdAt: new Date().toISOString()
        };

        // 3. 사용자 목록에 추가
        const users = this.getAllUsers();
        users.push(newUser);
        this.saveUsers(users);

        return {
            success: true,
            message: '회원가입이 완료되었습니다!'
        };
    }

    // 로그인 처리
    login(email, password) {
        // 1. 사용자 찾기
        const user = this.findUserByEmail(email);
        
        // 2. 사용자가 없거나 비밀번호가 틀린 경우
        if (!user || user.password !== password) {
            return {
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            };
        }

        // 3. 로그인 성공 - 현재 사용자 정보 저장
        const userData = {
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
        
        return {
            success: true,
            message: '로그인 성공!'
        };
    }

    // 로그아웃 처리
    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    // 로그인 상태 확인
    isLoggedIn() {
        const userData = localStorage.getItem(this.currentUserKey);
        return userData !== null;
    }

    // 현재 사용자 정보 가져오기
    getCurrentUser() {
        const userData = localStorage.getItem(this.currentUserKey);
        return userData ? JSON.parse(userData) : null;
    }

    // 현재 사용자의 전체 정보 가져오기 (가입일 포함)
    getCurrentUserFullInfo() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        const user = this.findUserByEmail(currentUser.email);
        if (!user) return null;

        return {
            email: user.email,
            createdAt: user.createdAt,
            loginTime: currentUser.loginTime
        };
    }

    // 계정 삭제
    deleteAccount(email) {
        const users = this.getAllUsers();
        const filteredUsers = users.filter(user => user.email !== email);
        this.saveUsers(filteredUsers);
        this.logout();
    }
}
