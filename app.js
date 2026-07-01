let currentUser = null;
let users = [];
let courses = [];
let attendanceRecords = [];

const coursesData = [
    { id: '1', name: '高等数学', teacherId: 'teacher1', className: '2026级计算机1班', dayOfWeek: 1, startTime: '08:00', endTime: '09:40', location: '教学楼A-101' },
    { id: '2', name: '大学英语', teacherId: 'teacher2', className: '2026级计算机1班', dayOfWeek: 2, startTime: '10:00', endTime: '11:40', location: '教学楼B-203' },
    { id: '3', name: '计算机基础', teacherId: 'teacher3', className: '2026级计算机1班', dayOfWeek: 3, startTime: '14:00', endTime: '15:40', location: '实验楼C-301' },
    { id: '4', name: '线性代数', teacherId: 'teacher1', className: '2026级计算机1班', dayOfWeek: 4, startTime: '08:00', endTime: '09:40', location: '教学楼A-101' },
    { id: '5', name: '数据结构', teacherId: 'teacher3', className: '2026级计算机1班', dayOfWeek: 5, startTime: '14:00', endTime: '15:40', location: '实验楼C-302' },
    { id: '6', name: '思想政治', teacherId: 'teacher4', className: '2026级计算机1班', dayOfWeek: 1, startTime: '14:00', endTime: '15:40', location: '教学楼D-401' },
];

const attendanceData = [
    { id: '1', courseId: '1', studentId: 'student1', status: 'present', signinTime: '2026-06-30 08:15', location: '教学楼A-101' },
    { id: '2', courseId: '2', studentId: 'student1', status: 'late', signinTime: '2026-06-29 10:20', location: '教学楼B-203' },
    { id: '3', courseId: '3', studentId: 'student1', status: 'present', signinTime: '2026-06-28 14:05', location: '实验楼C-301' },
    { id: '4', courseId: '4', studentId: 'student1', status: 'absent', signinTime: null, location: null },
    { id: '5', courseId: '5', studentId: 'student1', status: 'present', signinTime: '2026-06-27 14:10', location: '实验楼C-302' },
    { id: '6', courseId: '1', studentId: 'student1', status: 'leave', signinTime: null, location: null },
    { id: '7', courseId: '2', studentId: 'student1', status: 'present', signinTime: '2026-06-26 10:05', location: '教学楼B-203' },
    { id: '8', courseId: '3', studentId: 'student1', status: 'present', signinTime: '2026-06-25 14:00', location: '实验楼C-301' },
];

function initData() {
    users = [
        { id: 'student1', name: '张三', role: 'student', studentId: '2026001', classId: 'class1', phone: '13800138001', password: '123456' },
        { id: 'teacher1', name: '李老师', role: 'teacher', teacherId: 'T001', phone: '13800138002', password: '123456' },
        { id: 'admin1', name: '管理员', role: 'admin', phone: '13800138003', password: '123456' },
    ];
    courses = [...coursesData];
    attendanceRecords = [...attendanceData];
}

function switchTab(tab) {
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tab-login').classList.toggle('text-emerald-600', tab === 'login');
    document.getElementById('tab-login').classList.toggle('border-emerald-500', tab === 'login');
    document.getElementById('tab-login').classList.toggle('text-gray-500', tab !== 'login');
    document.getElementById('tab-login').classList.toggle('border-transparent', tab !== 'login');
    document.getElementById('tab-register').classList.toggle('text-emerald-600', tab === 'register');
    document.getElementById('tab-register').classList.toggle('border-emerald-500', tab === 'register');
    document.getElementById('tab-register').classList.toggle('text-gray-500', tab !== 'register');
    document.getElementById('tab-register').classList.toggle('border-transparent', tab !== 'register');
}

function handleLogin(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    
    const user = users.find(u => u.phone === phone && u.password === password && u.role === role);
    if (user) {
        currentUser = user;
        showPage('home');
        updateProfile();
        renderHome();
        renderCourses();
        renderAttendance();
    } else {
        alert('登录失败：手机号、密码或角色错误');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const idNum = document.getElementById('register-id').value;
    
    if (users.find(u => u.phone === phone)) {
        alert('该手机号已注册');
        return;
    }
    
    const newUser = {
        id: role + Date.now(),
        name,
        role,
        phone,
        password,
        [role === 'student' ? 'studentId' : 'teacherId']: idNum,
        classId: role === 'student' ? 'class1' : undefined,
    };
    
    users.push(newUser);
    alert('注册成功，请登录');
    switchTab('login');
}

function handleLogout() {
    currentUser = null;
    showPage('login');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-emerald-600');
        btn.classList.add('text-gray-400');
    });
    
    const activeBtn = document.querySelector(`.tab-btn[onclick="navigateTo('${pageId}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-400');
        activeBtn.classList.add('text-emerald-600');
    }
}

function navigateTo(pageId) {
    if (!currentUser) {
        showPage('login');
        return;
    }
    showPage(pageId);
    
    if (pageId === 'home') renderHome();
    if (pageId === 'attendance') renderAttendance();
    if (pageId === 'courses') renderCourses();
}

function updateProfile() {
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-role').textContent = currentUser.role === 'student' ? '学生' : currentUser.role === 'teacher' ? '教师' : '管理员';
    document.getElementById('profile-id').textContent = currentUser.role === 'student' ? '学号：' + currentUser.studentId : currentUser.role === 'teacher' ? '工号：' + currentUser.teacherId : '管理员';
}

function renderHome() {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${['日', '一', '二', '三', '四', '五', '六'][now.getDay()]}`;
    document.getElementById('current-date').textContent = dateStr;
    
    const todayCourses = courses.filter(c => c.dayOfWeek === dayOfWeek);
    const coursesHtml = todayCourses.map(course => `
        <div class="card flex items-center justify-between animate-slide-up">
            <div>
                <h3 class="font-bold text-gray-800">${course.name}</h3>
                <p class="text-sm text-gray-500 mt-1">${course.startTime} - ${course.endTime}</p>
                <p class="text-sm text-gray-400"><i class="fa-solid fa-location-dot"></i> ${course.location}</p>
            </div>
            ${currentUser.role === 'student' ? `
                <button onclick="navigateTo('signin')" class="btn-primary text-sm">签到</button>
            ` : `
                <button onclick="startSignin('${course.id}')" class="btn-primary text-sm">发起签到</button>
            `}
        </div>
    `).join('');
    document.getElementById('today-courses').innerHTML = coursesHtml || '<p class="text-center text-gray-500 py-4">今日无课程</p>';
    
    const recentAttendance = attendanceRecords.filter(r => r.studentId === currentUser.id).slice(0, 3);
    const attendanceHtml = recentAttendance.map(record => {
        const course = courses.find(c => c.id === record.courseId);
        const statusMap = { present: '出勤', absent: '缺勤', late: '迟到', leave: '请假' };
        const statusClass = { present: 'status-present', absent: 'status-absent', late: 'status-late', leave: 'status-leave' };
        return `
            <div class="card flex items-center justify-between">
                <div>
                    <p class="font-medium text-gray-800">${course?.name || '未知课程'}</p>
                    <p class="text-xs text-gray-500">${record.signinTime || '-'}</p>
                </div>
                <span class="font-medium ${statusClass[record.status]}">${statusMap[record.status]}</span>
            </div>
        `;
    }).join('');
    document.getElementById('recent-attendance').innerHTML = attendanceHtml || '<p class="text-center text-gray-500 py-4">暂无考勤记录</p>';
}

function renderAttendance() {
    const userRecords = currentUser.role === 'student' 
        ? attendanceRecords.filter(r => r.studentId === currentUser.id)
        : attendanceRecords;
    
    const statusMap = { present: '出勤', absent: '缺勤', late: '迟到', leave: '请假' };
    const statusClass = { present: 'status-present', absent: 'status-absent', late: 'status-late', leave: 'status-leave' };
    
    const html = userRecords.map(record => {
        const course = courses.find(c => c.id === record.courseId);
        return `
            <div class="card">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-gray-800">${course?.name || '未知课程'}</h3>
                    <span class="font-medium ${statusClass[record.status]}">${statusMap[record.status]}</span>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span><i class="fa-solid fa-calendar"></i> ${record.signinTime || '-'}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${record.location || '-'}</span>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('attendance-list').innerHTML = html || '<p class="text-center text-gray-500 py-8">暂无考勤记录</p>';
}

function renderCourses() {
    const userCourses = currentUser.role === 'teacher'
        ? courses.filter(c => c.teacherId === currentUser.id)
        : courses;
    
    const dayMap = ['日', '一', '二', '三', '四', '五', '六'];
    
    const html = userCourses.map(course => `
        <div class="card">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-gray-800">${course.name}</h3>
                ${currentUser.role === 'teacher' ? `
                    <div class="flex gap-2">
                        <button class="text-blue-500 text-sm"><i class="fa-solid fa-edit"></i></button>
                        <button class="text-red-500 text-sm"><i class="fa-solid fa-trash"></i></button>
                    </div>
                ` : ''}
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-500">
                <span><i class="fa-solid fa-calendar"></i> 星期${dayMap[course.dayOfWeek - 1]}</span>
                <span><i class="fa-solid fa-clock"></i> ${course.startTime} - ${course.endTime}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${course.location}</span>
                <span><i class="fa-solid fa-users"></i> ${course.className}</span>
            </div>
            ${currentUser.role === 'teacher' ? `
                <button onclick="startSignin('${course.id}')" class="btn-primary w-full mt-3">发起签到</button>
            ` : ''}
        </div>
    `).join('');
    document.getElementById('courses-list').innerHTML = html || '<p class="text-center text-gray-500 py-8">暂无课程</p>';
}

function showAddCourse() {
    document.getElementById('modal-add-course').classList.remove('hidden');
    document.getElementById('modal-add-course').classList.add('flex');
}

function closeModal() {
    document.getElementById('modal-add-course').classList.add('hidden');
    document.getElementById('modal-add-course').classList.remove('flex');
}

function handleAddCourse(e) {
    e.preventDefault();
    const name = document.getElementById('course-name').value;
    const dayOfWeek = parseInt(document.getElementById('course-day').value);
    const className = document.getElementById('course-class').value;
    const startTime = document.getElementById('course-start').value;
    const endTime = document.getElementById('course-end').value;
    const location = document.getElementById('course-location').value;
    
    courses.push({
        id: 'course' + Date.now(),
        name,
        teacherId: currentUser.id,
        className,
        dayOfWeek,
        startTime,
        endTime,
        location,
    });
    
    closeModal();
    renderCourses();
    alert('课程添加成功');
}

function handleSignin() {
    const btn = document.getElementById('signin-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 签到中...';
    
    setTimeout(() => {
        attendanceRecords.push({
            id: 'record' + Date.now(),
            courseId: '1',
            studentId: currentUser.id,
            status: 'present',
            signinTime: new Date().toLocaleString('zh-CN'),
            location: '教学楼A-101',
        });
        
        btn.disabled = false;
        btn.textContent = '立即签到';
        
        document.getElementById('modal-success').classList.remove('hidden');
        document.getElementById('modal-success').classList.add('flex');
    }, 1500);
}

function closeSuccessModal() {
    document.getElementById('modal-success').classList.add('hidden');
    document.getElementById('modal-success').classList.remove('flex');
    navigateTo('home');
}

function startSignin(courseId) {
    alert('签到已发起！请在教室展示二维码供学生扫描。');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('location-info').innerHTML = `
                    <i class="fa-solid fa-map-marker-alt text-emerald-500"></i> 
                    已定位：${latitude.toFixed(4)}, ${longitude.toFixed(4)}
                `;
            },
            (error) => {
                document.getElementById('location-info').innerHTML = `
                    <i class="fa-solid fa-exclamation-circle text-amber-500"></i> 
                    定位失败，请检查权限设置
                `;
            }
        );
    } else {
        document.getElementById('location-info').innerHTML = '您的浏览器不支持定位功能';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initData();
    getLocation();
});