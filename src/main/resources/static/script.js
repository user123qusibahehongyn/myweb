// 用户数据存储（模拟数据库）
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// 初始化默认管理员账号（如果不存在）
if (registeredUsers.length === 0 || !registeredUsers.find(u => u.username === 'admin')) {
    const adminUser = {
        id: 1,
        username: 'admin',
        password: 'admin123',
        phone: '13800138000',
        isAdmin: true,
        createTime: new Date().toLocaleString()
    };
    registeredUsers.push(adminUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// 短信验证码相关
let smsCode = '';
let smsCodeTimer = null;
let smsCodeExpireTime = 0;

// 模拟数据
const mockPets = [
    {
        id: 1,
        name: "小白",
        breed: "金毛",
        age: 2,
        gender: "公",
        habit: "喜欢玩球，活泼开朗",
        characterDesc: "温顺友好，对人热情，适合有孩子的家庭",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20golden%20retriever%20dog%2C%20happy%20expression%2C%20outdoor%20setting&image_size=square",
        adopted: false
    },
    {
        id: 2,
        name: "花花",
        breed: "英短",
        age: 1,
        gender: "母",
        habit: "喜欢睡觉，爱干净",
        characterDesc: "安静温顺，独立，适合单身人士",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20british%20shorthair%20cat%2C%20blue%20eyes%2C%20indoor%20setting&image_size=square",
        adopted: false
    },
    {
        id: 3,
        name: "小黑",
        breed: "拉布拉多",
        age: 3,
        gender: "公",
        habit: "喜欢游泳，精力充沛",
        characterDesc: "聪明听话，服从性高，适合训练",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20black%20labrador%20retriever%20dog%2C%20active%2C%20outdoor%20setting&image_size=square",
        adopted: false
    },
    {
        id: 4,
        name: "旺财",
        breed: "边牧",
        age: 2,
        gender: "公",
        habit: "喜欢运动，聪明活泼",
        characterDesc: "聪明伶俐，服从性高，适合有经验的主人",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=border%20collie%20dog%2C%20black%20and%20white%2C%20happy%20expression%2C%20sitting%20on%20grass&image_size=square",
        adopted: false
    },
    {
        id: 5,
        name: "乐乐",
        breed: "萨摩耶",
        age: 1,
        gender: "母",
        habit: "喜欢玩耍，活泼开朗",
        characterDesc: "温顺友善，毛发蓬松，适合有耐心的主人",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=samoyed%20dog%2C%20white%20fur%2C%20happy%20expression%2C%20sitting%20in%20grass%20with%20blue%20flowers&image_size=square",
        adopted: false
    }
];

// 反馈数据存储（模拟数据库）
let mockFeedback = JSON.parse(localStorage.getItem('mockFeedback')) || [];

// 本地存储管理
const storage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('读取本地存储失败:', error);
            return null;
        }
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    }
};

// 初始化添加新宠物表单
function initAddPetForm() {
    const form = document.getElementById('add-pet-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const petName = document.getElementById('pet-name').value;
            const petType = document.getElementById('pet-type').value;
            const petBreed = document.getElementById('pet-breed').value;
            const petAge = document.getElementById('pet-age').value;
            const petGender = document.getElementById('pet-gender').value;
            const petColor = document.getElementById('pet-color').value;
            const petDescription = document.getElementById('pet-description').value;
            const petImageFile = document.getElementById('pet-image').files[0];
            
            // 检查图片文件大小（限制为2MB）
            if (petImageFile && petImageFile.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过2MB，请选择更小的图片');
                return;
            }
            
            // 处理图片文件
            if (petImageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const petImage = event.target.result;
                    
                    console.log('图片数据长度:', petImage.length);
                    
                    try {
                        // 从localStorage获取现有宠物列表
                        const storedPets = localStorage.getItem('mockPets');
                        let pets = storedPets ? JSON.parse(storedPets) : [...mockPets];
                        
                        // 生成新的唯一ID
                        const maxId = pets.reduce((max, pet) => Math.max(max, pet.id), 0);
                        const newId = maxId + 1;
                        
                        // 创建新宠物对象
                        const newPet = {
                            id: newId,
                            name: petName,
                            breed: petBreed,
                            age: petAge,
                            gender: petGender,
                            habit: petDescription,
                            characterDesc: petDescription,
                            image: petImage,
                            adopted: false
                        };
                        
                        // 添加到宠物列表
                        pets.push(newPet);
                        
                        // 更新mockPets数组
                        mockPets.length = 0;
                        mockPets.push(...pets);
                        
                        // 保存到localStorage
                        localStorage.setItem('mockPets', JSON.stringify(pets));
                        
                        console.log('宠物已添加:', newPet);
                        
                        // 显示成功消息
                        alert('宠物添加成功！');
                        
                        // 重置表单
                        form.reset();
                        
                        // 跳转到宠物列表页面
                        showPage('pets');
                    } catch (error) {
                        console.error('添加宠物失败:', error);
                        alert('添加宠物失败，请重试');
                    }
                };
                reader.onerror = function(error) {
                    console.error('读取图片失败:', error);
                    alert('读取图片失败，请重试');
                };
                reader.readAsDataURL(petImageFile);
            } else {
                alert('请选择宠物图片');
            }
        });
    }
}

// 模拟API调用
// 模拟API调用 → 改成真实后端接口调用
const api = {
    register: (data) => {
        // 注册接口也可以按这个格式改，先保留
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "注册成功" });
            }, 500);
        });
    },
    // 核心修改：把模拟登录 → 真实调用后端 /api/user/login
    login: (data) => {
        return new Promise((resolve, reject) => {
            // 调用你的后端登录接口
            fetch('http://127.0.0.1:8080/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: new URLSearchParams({
                    username: data.username,
                    password: data.password
                })
            })
            .then(res => res.json())
            .then(result => {
                if (result.code === 200) {
                    // 登录成功：返回和原模拟数据一致的格式，前端不用改任何逻辑
                    resolve({
                        message: "登录成功",
                        access_token: "mock-token-" + Date.now(),
                        user: result.data // 把后端返回的用户信息带上
                    });
                } else {
                    // 登录失败：返回错误信息
                    reject({ message: result.msg || "账号密码错误" });
                }
            })
            .catch(err => {
                // 网络错误
                reject({ message: "网络错误，请检查后端服务" });
                console.error(err);
            });
        });
    },
    // 宠物列表接口也按这个格式改（示例）
    getPets: () => {
        return new Promise((resolve, reject) => {
            fetch('http://127.0.0.1:8080/api/pet/list', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            })
            .then(res => res.json())
            .then(result => {
                if (result.code === 200) {
                    resolve(result.data); // 用后端真实宠物数据
                } else {
                    reject({ message: result.msg || "获取宠物列表失败" });
                }
            })
            .catch(err => {
                reject({ message: "网络错误" });
                console.error(err);
            });
        });
    }
}
    getPetDetail: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 从localStorage中加载宠物数据
                const storedPets = localStorage.getItem('mockPets');
                if (storedPets) {
                    try {
                        const pets = JSON.parse(storedPets);
                        const pet = pets.find(p => p.id == id);
                        resolve(pet);
                    } catch (error) {
                        console.error('Error parsing pets from localStorage:', error);
                        const pet = mockPets.find(p => p.id == id);
                        resolve(pet);
                    }
                } else {
                    const pet = mockPets.find(p => p.id == id);
                    resolve(pet);
                }
            }, 300);
        });
    },
    adopt: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 创建新的申请记录
                const newAdoption = {
                    id: mockAdoptionHistory.length + 1,
                    petId: data.petId,
                    pet_name: data.pet_name || '未知宠物',
                    reason: data.reason,
                    contact: data.contact,
                    hasPetExperience: data.hasPetExperience,
                    username: data.username,
                    status: 'pending',
                    time: new Date().toLocaleString()
                };
                
                // 添加到申请记录数组
                mockAdoptionHistory.push(newAdoption);
                
                // 保存到localStorage
                localStorage.setItem('mockAdoptionHistory', JSON.stringify(mockAdoptionHistory));
                
                resolve({ message: "申请成功" });
            }, 500);
        });
    },
    getAdoptionHistory: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = storage.getItem('user');
                if (!user) {
                    resolve([]);
                    return;
                }
                // 从localStorage中加载申请记录数据
                const storedHistory = localStorage.getItem('mockAdoptionHistory');
                const adoptionHistory = storedHistory ? JSON.parse(storedHistory) : mockAdoptionHistory;
                const userHistory = adoptionHistory.filter(item => item.username === user.username);
                resolve(userHistory);
            }, 300);
        });
    },
    updateUser: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = storage.getItem('user');
                if (!user) {
                    resolve({ message: "请先登录" });
                    return;
                }
                const updatedUser = { ...user, ...data };
                storage.setItem('user', updatedUser);
                resolve({ message: "更新成功" });
            }, 500);
        });
    }
};

// 轮播功能
let currentSlide = 0;
let slideInterval;

// 初始化轮播
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const slideCount = slides.length;
    
    // 更新幻灯片显示
    function updateSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 添加当前活动状态
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    // 下一张
    window.nextSlide = function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const slideCount = slides.length;
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlide();
    };
    
    // 上一张
    window.prevSlide = function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const slideCount = slides.length;
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlide();
    };
    
    // 跳转到指定幻灯片
    window.goToSlide = function(index) {
        currentSlide = index;
        updateSlide();
    };
    
    // 自动轮播
    slideInterval = setInterval(window.nextSlide, 5000);
}

// 页面加载完成后初始化轮播
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

// 切换宠物知识选项卡
function showKnowledgeTab(tabId) {
    // 隐藏所有选项卡内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // 移除所有选项卡按钮的激活状态
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 显示选中的选项卡内容
    const selectedTab = document.getElementById(tabId + '-tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // 为选中的选项卡按钮添加激活状态
    const activeButton = document.querySelector(`.tab-btn[onclick="showKnowledgeTab('${tabId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 显示指定页面
async function showPage(pageId, filterType = null) {
    const loginRequiredPages = ['pets', 'pet-detail', 'adoption-history', 'user-center', 'adoption-stories', 'messages'];
    if (loginRequiredPages.includes(pageId)) {
        const token = storage.getItem('token');
        if (!token) {
            alert('请先完成登录');
            showLoginModal();
            pageId = 'home';
        }
    }
    
    // 管理员权限页面控制
    if (pageId === 'add-pet') {
        const user = storage.getItem('user');
        if (!user || !user.isAdmin) {
            alert('只有管理员有添加新宠物的权限');
            pageId = 'home';
        }
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    if (pageId === 'home' || pageId === 'pets') {
        await loadPets(filterType);
    }
    
    if (pageId === 'adoption-history') {
        loadAdoptionHistory();
    }
    
    if (pageId === 'admin-approval') {
        // 默认显示申请审批板块
        showAdminSection('approval');
    }
    
    if (pageId === 'adoption-stories') {
        loadStories();
    }
    
    if (pageId === 'messages') {
        loadContacts();
    }
    
    if (pageId === 'feedback') {
        loadFeedbackList();
        
        // 根据用户类型显示或隐藏提交反馈表单
        const feedbackFormSection = document.querySelector('.feedback-form-section');
        if (feedbackFormSection) {
            const user = storage.getItem('user');
            // 普通用户可以提交反馈，管理员不需要提交反馈
            if (user && user.isAdmin) {
                feedbackFormSection.style.display = 'none';
            } else {
                feedbackFormSection.style.display = 'block';
            }
        }
    }
    
    if (pageId === 'user-center') {
        const user = storage.getItem('user');
        const permissionsNavItem = document.getElementById('permissions-nav-item');
        const approvalNavItem = document.getElementById('approval-nav-item');
        if (permissionsNavItem) {
            if (user && user.isAdmin) {
                permissionsNavItem.style.display = 'block';
            } else {
                permissionsNavItem.style.display = 'none';
            }
        }
        if (approvalNavItem) {
            if (user && user.isAdmin) {
                approvalNavItem.style.display = 'block';
            } else {
                approvalNavItem.style.display = 'none';
            }
        }
    }
}

// 显示指定页面并应用筛选
async function showPageWithFilter(pageId, filterType) {
    // 直接调用 showPage 并传递筛选参数
    await showPage(pageId, filterType);
    
    // 页面显示后设置筛选器的值
    if (pageId === 'pets' && filterType) {
        const typeFilter = document.getElementById('pet-type-filter');
        if (typeFilter) {
            typeFilter.value = filterType;
        }
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化评论数据到localStorage（如果还没有的话）
    if (!localStorage.getItem('mockComments')) {
        localStorage.setItem('mockComments', JSON.stringify(mockComments));
    }
    if (!localStorage.getItem('mockTopics')) {
        localStorage.setItem('mockTopics', JSON.stringify(mockTopics));
    }
    if (!localStorage.getItem('mockDynamics')) {
        localStorage.setItem('mockDynamics', JSON.stringify(mockDynamics));
    }
    if (!localStorage.getItem('mockStories')) {
        localStorage.setItem('mockStories', JSON.stringify(mockStories));
    }
    if (!localStorage.getItem('mockPets')) {
        localStorage.setItem('mockPets', JSON.stringify(mockPets));
    }
    
    updateNavbar();
    bindNavbarEvents();
    bindModalEvents();
    displayCaptcha();
    initAddPetForm();
    showPage('home');
});

// 绑定导航栏按钮事件
function bindNavbarEvents() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterModal();
        });
    }
}

// 生成验证码
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

// 显示验证码
function displayCaptcha() {
    const captchaImages = document.querySelectorAll('img[alt="验证码"]');
    captchaImages.forEach(img => {
        const captcha = generateCaptcha();
        img.dataset.captcha = captcha;
        
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < captcha.length; i++) {
            const x = 20 + i * 25;
            const y = 20 + (Math.random() - 0.5) * 10;
            ctx.fillText(captcha[i], x, y);
        }
        
        ctx.strokeStyle = '#cccccc';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
        
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = '#aaaaaa';
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        img.src = canvas.toDataURL('image/png');
    });
}

// 验证验证码
function validateCaptcha(inputId, imgSelector) {
    const input = document.getElementById(inputId);
    const img = document.querySelector(imgSelector);
    if (input && img && img.dataset.captcha) {
        const userInput = input.value.toUpperCase().trim();
        const actualCaptcha = img.dataset.captcha.toUpperCase();
        return userInput === actualCaptcha;
    }
    return false;
}

// 发送短信验证码
function sendSMSCode() {
    const phoneInput = document.getElementById('reg-phone');
    const phone = phoneInput.value.trim();
    
    // 验证手机号格式
    if (!phone) {
        alert('请输入手机号');
        return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入正确的11位手机号');
        return;
    }
    
    // 检查手机号是否已注册
    const existingUser = registeredUsers.find(u => u.phone === phone);
    if (existingUser) {
        alert('该手机号已被注册');
        return;
    }
    
    // 生成6位验证码
    smsCode = Math.random().toString().slice(2, 8);
    smsCodeExpireTime = Date.now() + 5 * 60 * 1000; // 5分钟有效期
    
    // 模拟发送短信（实际项目中需要调用后端API）
    console.log(`发送验证码到手机 ${phone}: ${smsCode}`);
    alert(`验证码已发送到 ${phone}\n（模拟验证码：${smsCode}）`);
    
    // 开始倒计时
    const btn = document.getElementById('send-sms-btn');
    let countdown = 60;
    btn.disabled = true;
    btn.textContent = `${countdown}秒后重发`;
    
    if (smsCodeTimer) {
        clearInterval(smsCodeTimer);
    }
    
    smsCodeTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(smsCodeTimer);
            btn.disabled = false;
            btn.textContent = '发送验证码';
        } else {
            btn.textContent = `${countdown}秒后重发`;
        }
    }, 1000);
}

// 验证短信验证码
function validateSMSCode(inputCode) {
    if (!smsCode) {
        return { valid: false, message: '请先获取验证码' };
    }
    
    if (Date.now() > smsCodeExpireTime) {
        return { valid: false, message: '验证码已过期，请重新获取' };
    }
    
    if (inputCode !== smsCode) {
        return { valid: false, message: '验证码错误' };
    }
    
    return { valid: true, message: '验证成功' };
}

// 刷新注册验证码
function refreshRegCaptcha() {
    const img = document.getElementById('reg-captcha-img');
    if (img) {
        const captcha = generateCaptcha();
        img.dataset.captcha = captcha;
        
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < captcha.length; i++) {
            const x = 20 + i * 25;
            const y = 20 + (Math.random() - 0.5) * 10;
            ctx.fillText(captcha[i], x, y);
        }
        
        ctx.strokeStyle = '#cccccc';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
        
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = '#aaaaaa';
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        img.src = canvas.toDataURL('image/png');
    }
}

// 绑定模态框事件
function bindModalEvents() {
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    const captchaImages = document.querySelectorAll('img[alt="验证码"]');
    captchaImages.forEach(img => {
        img.addEventListener('click', function() {
            displayCaptcha();
        });
    });
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 验证图形验证码
            if (!validateCaptcha('captcha', '#login-modal img[alt="验证码"]')) {
                alert('验证码输入错误');
                return;
            }
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // 验证用户名
            if (!username) {
                alert('请输入用户名');
                return;
            }
            
            // 验证密码
            if (!password) {
                alert('请输入密码');
                return;
            }
            
            // 检查用户是否已注册
            const registeredUser = registeredUsers.find(u => u.username === username);
            if (!registeredUser) {
                alert('该用户名未注册，请先注册');
                return;
            }
            
            // 验证密码是否正确
            if (registeredUser.password !== password) {
                alert('密码错误');
                return;
            }
            
            // 登录成功
            const existingUser = storage.getItem('user');
            const userData = { 
                id: registeredUser.id,
                username: username,
                phone: registeredUser.phone,
                isAdmin: registeredUser.isAdmin || false,
                favorites: existingUser?.favorites || [],
                likes: existingUser?.likes || [],
                topics: existingUser?.topics || [],
                comments: existingUser?.comments || []
            };
            storage.setItem('token', 'token_' + Date.now());
            storage.setItem('user', userData);
            
            // 保存登录历史
            saveLoginHistory(userData);
            
            alert('登录成功');
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            updateNavbar();
            
            // 清空登录表单
            loginForm.reset();
            
            // 根据用户类型显示不同的页面
            if (userData.isAdmin) {
                showPage('admin-approval');
            } else {
                showPage('home');
            }
        });
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const phone = document.getElementById('reg-phone').value.trim();
            const smsCodeInput = document.getElementById('reg-sms-code').value.trim();
            
            // 验证用户名
            if (!username) {
                alert('请输入用户名');
                return;
            }
            
            // 检查用户名是否已存在
            if (registeredUsers.find(u => u.username === username)) {
                alert('该用户名已被注册');
                return;
            }
            
            // 验证密码长度
            if (password.length < 6) {
                alert('密码长度不能少于6位');
                return;
            }
            
            // 验证手机号格式
            if (!/^1[3-9]\d{9}$/.test(phone)) {
                alert('请输入正确的11位手机号');
                return;
            }
            
            // 验证短信验证码
            const smsResult = validateSMSCode(smsCodeInput);
            if (!smsResult.valid) {
                alert(smsResult.message);
                return;
            }
            
            // 验证图形验证码
            if (!validateCaptcha('reg-captcha', '#reg-captcha-img')) {
                alert('图形验证码输入错误');
                return;
            }
            
            // 检查当前是用户注册还是管理员注册
            const registerModal = document.getElementById('register-modal');
            const h2 = registerModal.querySelector('h2');
            const isAdmin = h2.textContent === '管理员注册';
            
            // 保存用户数据
            const newUser = {
                id: Date.now(),
                username: username,
                password: password,
                phone: phone,
                createTime: new Date().toLocaleString(),
                isAdmin: isAdmin
            };
            
            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            alert('注册成功！请使用账号密码登录');
            
            // 关闭注册模态框，打开登录模态框
            if (registerModal) {
                registerModal.style.display = 'none';
            }
            showLoginModal();
            
            // 清空注册表单
            registerForm.reset();
        });
    }
    
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const user = storage.getItem('user');
            if (!user) {
                alert('请先登录');
                return;
            }
            
            const username = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const email = document.getElementById('user-email').value;
            const address = document.getElementById('user-address').value;
            const newPassword = document.getElementById('user-password').value;
            
            const updatedUser = {
                ...user,
                username: username,
                phone: phone,
                email: email,
                address: address
            };
            
            if (newPassword) {
                updatedUser.password = newPassword;
            }
            
            storage.setItem('user', updatedUser);
            updateNavbar(); // 更新导航栏中的用户名显示
            alert('个人信息修改成功');
        });
    }
    
    const adoptionForm = document.getElementById('adoption-form');
    if (adoptionForm) {
        // 监听同意条款勾选状态，控制提交按钮状态
        const agreeCheckbox = document.getElementById('agree-terms');
        const submitButton = adoptionForm.querySelector('.submit-btn');
        
        if (agreeCheckbox && submitButton) {
            // 初始状态：未勾选时禁用提交按钮
            submitButton.disabled = !agreeCheckbox.checked;
            
            // 监听勾选状态变化
            agreeCheckbox.addEventListener('change', function() {
                submitButton.disabled = !this.checked;
            });
        }
        
        adoptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const user = storage.getItem('user');
            if (!user) {
                alert('请先登录');
                showLoginModal();
                return;
            }
            
            const petId = document.getElementById('petId').value;
            const reason = document.getElementById('reason').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const hasPetExperience = document.querySelector('input[name="has-pet-experience"]:checked');
            const agreeTerms = document.getElementById('agree-terms').checked;
            
            // 验证所有必填字段
            if (!reason) {
                alert('请填写领养原因');
                document.getElementById('reason').focus();
                return;
            }
            
            if (!contact) {
                alert('请填写联系方式');
                document.getElementById('contact').focus();
                return;
            }
            
            // 验证联系方式是否为11位数字
            if (!/^\d{11}$/.test(contact)) {
                alert('请填写正确的11位手机号码');
                document.getElementById('contact').focus();
                return;
            }
            
            if (!hasPetExperience) {
                alert('请选择是否养过小动物');
                return;
            }
            
            if (!agreeTerms) {
                alert('请阅读并同意领养须知和平台规则');
                return;
            }
            
            try {
                const petIdElement = document.getElementById('petId');
                const petName = petIdElement.dataset.petName || '未知宠物';
                
                const response = await api.adopt({
                    petId,
                    pet_name: petName,
                    reason,
                    contact,
                    hasPetExperience: hasPetExperience.value,
                    username: user.username
                });
                
                alert(response.message);
                if (response.message === '申请成功') {
                    adoptionForm.reset();
                    // 重置提交按钮状态
                    if (submitButton) {
                        submitButton.disabled = true;
                    }
                }
            } catch (error) {
                console.error('提交申请失败:', error);
                alert('提交申请失败，请稍后重试');
            }
        });
    }
    
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = storage.getItem('user');
            if (!user) {
                alert('请先登录');
                showLoginModal();
                return;
            }
            
            const feedbackType = document.getElementById('feedback-type').value;
            const feedbackTitle = document.getElementById('feedback-title').value;
            const feedbackContent = document.getElementById('feedback-content').value;
            const feedbackContact = document.getElementById('feedback-contact').value;
            
            // 创建新的反馈
            const newFeedback = {
                id: mockFeedback.length + 1,
                username: user.username,
                type: feedbackType,
                title: feedbackTitle,
                content: feedbackContent,
                contact: feedbackContact,
                time: new Date().toLocaleString(),
                status: 'pending'
            };
            
            // 添加到反馈列表
            mockFeedback.push(newFeedback);
            
            // 保存到localStorage
            localStorage.setItem('mockFeedback', JSON.stringify(mockFeedback));
            
            alert('反馈提交成功！');
            feedbackForm.reset();
            
            // 重新加载反馈列表
            loadFeedbackList();
        });
    }
}

// 加载反馈列表
function loadFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    if (!feedbackList) return;
    
    const user = storage.getItem('user');
    if (!user) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">请先登录</p>';
        return;
    }
    
    // 更新反馈列表标题
    const feedbackListSection = document.querySelector('.feedback-list-section h3');
    if (feedbackListSection) {
        feedbackListSection.textContent = user.isAdmin ? '反馈管理' : '我的反馈';
    }
    
    let displayFeedback;
    
    // 如果是管理员，显示所有反馈；否则只显示当前用户的反馈
    if (user.isAdmin) {
        displayFeedback = mockFeedback;
    } else {
        displayFeedback = mockFeedback.filter(feedback => feedback.username === user.username);
    }
    
    if (displayFeedback.length === 0) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无反馈记录</p>';
        return;
    }
    
    feedbackList.innerHTML = '';
    
    displayFeedback.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        
        // 管理员处理按钮
        let adminActions = '';
        if (user.isAdmin) {
            adminActions = `
                <div class="feedback-admin-actions">
                    <select id="status-${feedback.id}" onchange="updateFeedbackStatus(${feedback.id}, this.value)">
                        <option value="pending" ${feedback.status === 'pending' ? 'selected' : ''}>待处理</option>
                        <option value="processing" ${feedback.status === 'processing' ? 'selected' : ''}>处理中</option>
                        <option value="resolved" ${feedback.status === 'resolved' ? 'selected' : ''}>已处理</option>
                    </select>
                    <button class="btn btn-sm" onclick="replyToFeedback(${feedback.id})">回复</button>
                    <button class="btn btn-sm" onclick="openChatWithUser('${feedback.username}')">聊天</button>
                </div>
            `;
        }
        
        // 显示回复内容（如果有）
        let replyContent = '';
        if (feedback.reply) {
            replyContent = `
                <div class="feedback-reply">
                    <strong>管理员回复：</strong>
                    <p>${feedback.reply}</p>
                    <span class="reply-time">${feedback.replyTime || ''}</span>
                </div>
            `;
        }
        
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <h4>${feedback.title}</h4>
                <span class="feedback-type">${feedback.type}</span>
            </div>
            <p class="feedback-content">${feedback.content}</p>
            <div class="feedback-meta">
                <span class="feedback-user">用户：${feedback.username}</span>
                <span class="feedback-time">${feedback.time}</span>
                <span class="feedback-status ${feedback.status}">${feedback.status === 'pending' ? '待处理' : feedback.status === 'processing' ? '处理中' : '已处理'}</span>
            </div>
            ${replyContent}
            ${adminActions}
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// 更新反馈状态
function updateFeedbackStatus(feedbackId, status) {
    const feedback = mockFeedback.find(f => f.id === feedbackId);
    if (feedback) {
        feedback.status = status;
        localStorage.setItem('mockFeedback', JSON.stringify(mockFeedback));
        loadFeedbackList();
    }
}

// 回复反馈
function replyToFeedback(feedbackId) {
    const reply = prompt('请输入回复内容：');
    if (reply && reply.trim()) {
        const feedback = mockFeedback.find(f => f.id === feedbackId);
        if (feedback) {
            feedback.reply = reply.trim();
            feedback.replyTime = new Date().toLocaleString();
            feedback.status = 'resolved';
            localStorage.setItem('mockFeedback', JSON.stringify(mockFeedback));
            loadFeedbackList();
            alert('回复成功！');
        }
    }
}

// 打开与用户的聊天
function openChatWithUser(username) {
    showPage('messages');
    setTimeout(() => {
        selectContact(username, username);
    }, 100);
}

// 显示登录模态框
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (registerModal) {
        registerModal.style.display = 'none';
    }
    
    if (loginModal) {
        loginModal.style.display = 'block';
        displayCaptcha();
    }
}

// 切换登录标签页
function switchLoginTab(type) {
    const loginModal = document.getElementById('login-modal');
    if (!loginModal) return;
    
    const h2 = loginModal.querySelector('h2');
    const tabBtns = loginModal.querySelectorAll('.tab-btn');
    const registerLink = loginModal.querySelector('.register-link');
    const adminRegisterLink = loginModal.querySelector('.admin-register-link');
    
    if (type === 'admin') {
        h2.textContent = '管理员登录';
        registerLink.style.display = 'none';
        adminRegisterLink.style.display = 'block';
    } else {
        h2.textContent = '用户登录';
        registerLink.style.display = 'block';
        adminRegisterLink.style.display = 'none';
    }
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// 切换注册标签页
function switchRegisterTab(type) {
    const registerModal = document.getElementById('register-modal');
    if (!registerModal) return;
    
    const h2 = registerModal.querySelector('h2');
    const tabBtns = registerModal.querySelectorAll('.tab-btn');
    
    if (type === 'admin') {
        h2.textContent = '管理员注册';
    } else {
        h2.textContent = '用户注册';
    }
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// 显示注册模态框
function showRegisterModal(type = 'user') {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (loginModal) {
        loginModal.style.display = 'none';
    }
    
    if (registerModal) {
        registerModal.style.display = 'block';
        // 切换到指定的注册类型
        if (type === 'admin') {
            const h2 = registerModal.querySelector('h2');
            h2.textContent = '管理员注册';
            const tabBtns = registerModal.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtns[1].classList.add('active');
        } else {
            const h2 = registerModal.querySelector('h2');
            h2.textContent = '用户注册';
            const tabBtns = registerModal.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtns[0].classList.add('active');
        }
        refreshRegCaptcha();
    }
}

// 更新导航栏
function updateNavbar() {
    const token = storage.getItem('token');
    const user = storage.getItem('user');
    const userDiv = document.querySelector('.user');
    
    // 控制申请审批导航项的显示
    const approvalNavItem = document.getElementById('approval-nav-item');
    if (approvalNavItem) {
        if (user && user.isAdmin) {
            approvalNavItem.style.display = 'block';
        } else {
            approvalNavItem.style.display = 'none';
        }
    }
    
    if (token && user) {
        userDiv.innerHTML = `
            <div class="user-info" onclick="showPage('user-center')">
                <div class="user-avatar">${user.username ? user.username.charAt(0) : '用'}</div>
                <span class="user-name">${user.username || '用户'}</span>
            </div>
        `;
    } else {
        userDiv.innerHTML = `
            <a href="#" class="login-btn">登录</a>
            <a href="#" class="register-btn">注册</a>
        `;
        bindNavbarEvents();
    }
}

// 退出登录
function logout() {
    storage.removeItem('token');
    storage.removeItem('user');
    updateNavbar();
    showPage('home');
    alert('已退出登录');
}

// 保存登录历史
function saveLoginHistory(userData) {
    let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    // 检查是否已存在该账号
    const existingIndex = loginHistory.findIndex(item => item.username === userData.username);
    
    const historyItem = {
        username: userData.username,
        isAdmin: userData.isAdmin,
        loginTime: new Date().toLocaleString()
    };
    
    if (existingIndex !== -1) {
        // 更新现有记录
        loginHistory[existingIndex] = historyItem;
    } else {
        // 添加新记录
        loginHistory.push(historyItem);
    }
    
    // 限制历史记录数量（最多保存10个）
    if (loginHistory.length > 10) {
        loginHistory = loginHistory.slice(-10);
    }
    
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
}

// 加载登录历史
function loadLoginHistory() {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    const historyList = document.getElementById('account-history-list');
    
    if (historyList) {
        historyList.innerHTML = '';
        
        if (loginHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #999;">暂无历史登录用户名记录</p>';
            return;
        }
        
        loginHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'account-history-item';
            historyItem.innerHTML = `
                <div class="account-history-info">
                    <div class="account-history-username">${item.username}</div>
                    <div class="account-history-type ${item.isAdmin ? 'admin' : 'user'}">
                        ${item.isAdmin ? '管理员' : '用户'}
                    </div>
                    <div class="account-history-time">${item.loginTime}</div>
                </div>
            `;
            historyItem.onclick = () => switchToAccount(item.username);
            historyList.appendChild(historyItem);
        });
    }
}

// 切换到指定账号
function switchToAccount(username) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.username === username);
    
    if (!user) {
        alert('该用户名不存在');
        return;
    }
    
    // 自动登录
    const existingUserData = storage.getItem('user');
    const userData = { 
        id: user.id,
        username: user.username,
        phone: user.phone,
        isAdmin: user.isAdmin || false,
        favorites: existingUserData?.favorites || [],
        likes: existingUserData?.likes || [],
        topics: existingUserData?.topics || [],
        comments: existingUserData?.comments || []
    };
    
    storage.setItem('token', 'token_' + Date.now());
    storage.setItem('user', userData);
    
    // 更新登录历史
    saveLoginHistory(userData);
    
    // 关闭模态框
    closeAccountHistoryModal();
    
    // 更新导航栏
    updateNavbar();
    
    // 根据用户类型显示不同的页面
    if (userData.isAdmin) {
        showPage('admin-approval');
    } else {
        showPage('home');
    }
    
    alert(`已切换到账号：${username}`);
}

// 显示历史登录账号模态框
function showAccountHistoryModal() {
    const modal = document.getElementById('account-history-modal');
    if (modal) {
        modal.style.display = 'block';
        loadLoginHistory();
    }
}

// 关闭历史登录账号模态框
function closeAccountHistoryModal() {
    const modal = document.getElementById('account-history-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchAccount() {
    storage.removeItem('token');
    storage.removeItem('user');
    updateNavbar();
    showAccountHistoryModal();
}

// 加载宠物列表
async function loadPets(filterType = null) {
    try {
        const pets = await api.getPets();
        const petsGrid = document.getElementById('pets-grid');
        const user = storage.getItem('user');
        
        // 显示或隐藏添加新宠物按钮
        const addPetButton = document.querySelector('button[onclick="showPage(\'add-pet\')"]');
        if (addPetButton) {
            addPetButton.style.display = (user && user.isAdmin) ? 'block' : 'none';
        }
        
        if (petsGrid) {
            petsGrid.innerHTML = '';
            
            // 定义狗的品种列表
            const dogBreeds = ['金毛', '拉布拉多', '边牧', '萨摩耶', '柯基', '泰迪', '哈士奇', '德国牧羊犬', '博美', '比熊'];
            // 定义猫的品种列表
            const catBreeds = ['英短', '美短', '布偶', '暹罗', '波斯', '加菲', '缅因', '斯芬克斯', '苏格兰折耳', '金渐层'];
            
            pets.forEach(pet => {
                // 检查图片数据是否存在
                if (!pet.image) {
                    console.warn('宠物', pet.name, '没有图片数据');
                    return;
                }
                
                // 普通用户只能看到未被领养的宠物
                if (user && !user.isAdmin && pet.adopted) {
                    return;
                }
                
                // 如果有筛选类型，检查是否符合条件
                if (filterType) {
                    const isDog = dogBreeds.some(breed => pet.breed.includes(breed));
                    const isCat = catBreeds.some(breed => pet.breed.includes(breed));
                    
                    if (filterType === '猫' && !isCat) return;
                    if (filterType === '狗' && !isDog) return;
                    if (filterType === '其他' && (isDog || isCat)) return;
                }
                
                // 管理员可以看到领养状态和切换按钮
                const adminControls = user && user.isAdmin 
                    ? `<p class="adoption-status ${pet.adopted ? 'adopted' : 'available'}">${pet.adopted ? '已被领养' : '可领养'}</p>
                       <button class="btn btn-toggle-adoption" onclick="togglePetAdoption(${pet.id})">${pet.adopted ? '标记为可领养' : '标记为已领养'}</button>` 
                    : '';
                
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                petCard.innerHTML = `
                    <img src="${pet.image}" alt="${pet.name}" class="pet-card-image" onerror="this.src='https://via.placeholder.com/300x300?text=图片加载失败'">
                    <div class="pet-card-content">
                        <h3>${pet.name}</h3>
                        ${adminControls}
                        <p><strong>品种：</strong>${pet.breed}</p>
                        <p><strong>年龄：</strong>${pet.age}岁</p>
                        <p><strong>性别：</strong>${pet.gender}</p>
                        <p><strong>习惯：</strong>${pet.habit}</p>
                        <div class="pet-card-actions">
                            <button class="btn" onclick="showPetDetail(${pet.id})">查看详情</button>
                            <button class="btn btn-favorite" onclick="addToFavorites(${pet.id})">收藏</button>
                        </div>
                    </div>
                `;
                petsGrid.appendChild(petCard);
            });
        }
    } catch (error) {
        console.error('加载宠物列表失败:', error);
    }
}

// 显示宠物详情
async function showPetDetail(petId) {
    try {
        const pet = await api.getPetDetail(petId);
        if (pet) {
            const petDetailContent = document.getElementById('pet-detail-content');
            if (petDetailContent) {
                petDetailContent.innerHTML = `
                    <img src="${pet.image}" alt="${pet.name}" class="pet-detail-image">
                    <div class="pet-detail-content">
                        <h2>${pet.name}</h2>
                        <p><strong>品种：</strong>${pet.breed}</p>
                        <p><strong>年龄：</strong>${pet.age}岁</p>
                        <p><strong>性别：</strong>${pet.gender}</p>
                        <p><strong>习惯：</strong>${pet.habit}</p>
                        <p><strong>性格描述：</strong>${pet.characterDesc}</p>
                    </div>
                `;
            }
            
            document.getElementById('petId').value = pet.id;
            // 保存宠物名称，用于申请记录
            document.getElementById('petId').dataset.petName = pet.name;
            showPage('pet-detail');
        }
    } catch (error) {
        console.error('加载宠物详情失败:', error);
    }
}

// 搜索宠物
function searchPets() {
    const keyword = document.getElementById('pet-search').value.toLowerCase();
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(keyword) ? 'flex' : 'none';
    });
}

// 筛选宠物
function filterPets() {
    const typeFilter = document.getElementById('pet-type-filter').value;
    const ageFilter = document.getElementById('pet-age-filter').value;
    const genderFilter = document.getElementById('pet-gender-filter').value;
    
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        const typeText = card.textContent;
        const ageText = card.textContent;
        const genderText = card.textContent;
        
        let typeMatch = true;
        let ageMatch = true;
        let genderMatch = true;
        
        if (typeFilter) {
            // 定义狗的品种列表
            const dogBreeds = ['金毛', '拉布拉多', '边牧', '萨摩耶', '柯基', '泰迪', '哈士奇', '德国牧羊犬', '博美', '比熊'];
            // 定义猫的品种列表
            const catBreeds = ['英短', '美短', '布偶', '暹罗', '波斯', '加菲', '缅因', '斯芬克斯', '苏格兰折耳', '金渐层'];
            
            // 检查宠物是否是狗
            const isDog = dogBreeds.some(breed => typeText.includes(breed));
            // 检查宠物是否是猫
            const isCat = catBreeds.some(breed => typeText.includes(breed));
            
            if (typeFilter === '狗' && !isDog) {
                typeMatch = false;
            } else if (typeFilter === '猫' && !isCat) {
                typeMatch = false;
            } else if (typeFilter === '其他' && (isDog || isCat)) {
                typeMatch = false;
            }
        }
        
        if (ageFilter) {
            if (ageFilter === '0-1' && !ageText.includes('1岁')) {
                ageMatch = false;
            } else if (ageFilter === '1-3' && (!ageText.includes('1岁') && !ageText.includes('2岁') && !ageText.includes('3岁'))) {
                ageMatch = false;
            } else if (ageFilter === '3+' && !ageText.includes('3岁以上')) {
                ageMatch = false;
            }
        }
        
        if (genderFilter) {
            if (genderFilter === '公' && !genderText.includes('公')) {
                genderMatch = false;
            } else if (genderFilter === '母' && !genderText.includes('母')) {
                genderMatch = false;
            }
        }
        
        card.style.display = (typeMatch && ageMatch && genderMatch) ? 'flex' : 'none';
    });
}

// 添加到收藏
function addToFavorites(petId) {
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    // 确保用户有收藏列表
    if (!user.favorites) {
        user.favorites = [];
    }
    
    // 检查宠物是否已经在收藏列表中
    if (!user.favorites.includes(petId)) {
        user.favorites.push(petId);
        storage.setItem('user', user);
        alert('已添加到收藏！');
    } else {
        alert('该宠物已在收藏列表中');
    }
}

// 显示用户中心子页面
function showUserSection(sectionId) {
    // 检查是否是权限设置，如果是，需要管理员权限
    if (sectionId === 'permissions') {
        const user = storage.getItem('user');
        if (!user || !user.isAdmin) {
            alert('只有管理员才能修改权限设置');
            return;
        }
    }
    
    const sections = document.querySelectorAll('.user-section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 更新导航项的激活状态
    const navLinks = document.querySelectorAll('.user-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 为当前点击的导航项添加激活状态
    const activeLink = document.querySelector(`.user-nav a[onclick="showUserSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    if (sectionId === 'adoption-history') {
        loadUserAdoptionHistory();
    }
    
    if (sectionId === 'application-records') {
        loadApplicationRecords();
    }
    
    if (sectionId === 'favorites') {
        loadFavorites();
    }
    
    if (sectionId === 'profile') {
        loadUserProfile();
    }
    
    if (sectionId === 'topics') {
        loadUserTopics();
    }
    
    if (sectionId === 'likes') {
        loadUserLikes();
    }
    
    if (sectionId === 'comments') {
        loadUserComments();
    }
}

// 显示管理员中心的不同板块
function showAdminSection(sectionId) {
    const sections = document.querySelectorAll('#admin-approval .user-section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // 更新导航项的激活状态
    const navLinks = document.querySelectorAll('#admin-approval .user-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 为当前点击的导航项添加激活状态
    const activeLink = document.querySelector(`#admin-approval .user-nav a[onclick="showAdminSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // 加载对应板块的数据
    if (sectionId === 'approval') {
        loadAdminApproval();
    }
    
    if (sectionId === 'feedback') {
        loadAdminFeedbackList();
    }
    
    if (sectionId === 'pets') {
        loadAdminPetsList();
    }
    
    if (sectionId === 'users') {
        loadAdminUsersList();
    }
}

// 加载管理员反馈列表
function loadAdminFeedbackList() {
    const feedbackList = document.getElementById('admin-feedback-list');
    if (!feedbackList) return;
    
    const user = storage.getItem('user');
    if (!user || !user.isAdmin) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">无权限访问</p>';
        return;
    }
    
    // 从localStorage重新加载反馈数据
    mockFeedback = JSON.parse(localStorage.getItem('mockFeedback')) || mockFeedback;
    
    if (mockFeedback.length === 0) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无反馈记录</p>';
        return;
    }
    
    feedbackList.innerHTML = '';
    
    mockFeedback.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        
        // 显示回复内容（如果有）
        let replyContent = '';
        if (feedback.reply) {
            replyContent = `
                <div class="feedback-reply">
                    <strong>管理员回复：</strong>
                    <p>${feedback.reply}</p>
                    <span class="reply-time">${feedback.replyTime || ''}</span>
                </div>
            `;
        }
        
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <h4>${feedback.title}</h4>
                <span class="feedback-type">${feedback.type}</span>
            </div>
            <p class="feedback-content">${feedback.content}</p>
            <div class="feedback-meta">
                <span class="feedback-user">用户：${feedback.username}</span>
                <span class="feedback-time">${feedback.time}</span>
                <span class="feedback-status ${feedback.status}">${feedback.status === 'pending' ? '待处理' : feedback.status === 'processing' ? '处理中' : '已处理'}</span>
            </div>
            ${replyContent}
            <div class="feedback-admin-actions">
                <select id="admin-status-${feedback.id}" onchange="updateFeedbackStatus(${feedback.id}, this.value)">
                    <option value="pending" ${feedback.status === 'pending' ? 'selected' : ''}>待处理</option>
                    <option value="processing" ${feedback.status === 'processing' ? 'selected' : ''}>处理中</option>
                    <option value="resolved" ${feedback.status === 'resolved' ? 'selected' : ''}>已处理</option>
                </select>
                <button class="btn btn-sm" onclick="replyToFeedback(${feedback.id})">回复</button>
                <button class="btn btn-sm" onclick="openChatWithUser('${feedback.username}')">聊天</button>
            </div>
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// 加载管理员宠物列表
function loadAdminPetsList() {
    const petsList = document.getElementById('admin-pets-list');
    if (!petsList) return;
    
    const user = storage.getItem('user');
    if (!user || !user.isAdmin) {
        petsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">无权限访问</p>';
        return;
    }
    
    // 从localStorage重新加载宠物数据
    const pets = JSON.parse(localStorage.getItem('mockPets')) || [];
    
    if (pets.length === 0) {
        petsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无宠物记录</p>';
        return;
    }
    
    petsList.innerHTML = '';
    
    pets.forEach(pet => {
        const petItem = document.createElement('div');
        petItem.className = 'history-item';
        petItem.innerHTML = `
            <div class="approval-header">
                <img src="${pet.image}" alt="${pet.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                <div class="approval-info">
                    <h4>${pet.name}</h4>
                    <p><strong>品种：</strong>${pet.breed}</p>
                    <p><strong>年龄：</strong>${pet.age}岁</p>
                    <p><strong>性别：</strong>${pet.gender}</p>
                    <p><strong>状态：</strong><span class="status ${pet.adopted ? 'rejected' : 'approved'}">${pet.adopted ? '已被领养' : '可领养'}</span></p>
                </div>
            </div>
            <div class="approval-footer">
                <button class="btn btn-sm" onclick="togglePetAdoption(${pet.id})">${pet.adopted ? '标记为可领养' : '标记为已领养'}</button>
            </div>
        `;
        petsList.appendChild(petItem);
    });
}

// 加载管理员用户列表
function loadAdminUsersList() {
    const usersList = document.getElementById('admin-users-list');
    if (!usersList) return;
    
    const user = storage.getItem('user');
    if (!user || !user.isAdmin) {
        usersList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">无权限访问</p>';
        return;
    }
    
    // 从localStorage重新加载用户数据
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    if (registeredUsers.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无用户记录</p>';
        return;
    }
    
    usersList.innerHTML = '';
    
    registeredUsers.forEach(u => {
        const userItem = document.createElement('div');
        userItem.className = 'history-item';
        userItem.innerHTML = `
            <div class="approval-header">
                <div class="user-avatar" onclick="openUserPermissionModal('${u.username}')" title="点击设置用户权限">${u.username.charAt(0).toUpperCase()}</div>
                <div class="approval-info">
                    <h4>${u.username}</h4>
                    <p><strong>手机号：</strong>${u.phone || '未设置'}</p>
                    <p><strong>类型：</strong><span class="status ${u.isAdmin ? 'approved' : ''}">${u.isAdmin ? '管理员' : '普通用户'}</span></p>
                </div>
            </div>
            <div class="approval-footer">
                <button class="btn btn-sm" onclick="openUserPermissionModal('${u.username}')">设置权限</button>
                <button class="btn btn-sm" onclick="openChatWithUser('${u.username}')">聊天</button>
            </div>
        `;
        usersList.appendChild(userItem);
    });
}

// 加载用户个人信息
function loadUserProfile() {
    const user = storage.getItem('user');
    if (user) {
        document.getElementById('user-name').value = user.username || '';
        document.getElementById('user-phone').value = user.phone || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-address').value = user.address || '';
    }
}

// 加载用户领养历史（只显示已通过的申请）
async function loadUserAdoptionHistory() {
    try {
        const history = await api.getAdoptionHistory();
        const historyList = document.getElementById('user-history-list');
        
        if (historyList) {
            historyList.innerHTML = '';
            
            // 只显示已通过的申请
            const approvedHistory = history.filter(item => item.status === 'approved');
            
            if (approvedHistory.length === 0) {
                historyList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无领养记录</p>';
                return;
            }
            
            approvedHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h4>${item.pet_name}</h4>
                    <p><strong>领养原因：</strong>${item.reason}</p>
                    <p><strong>联系方式：</strong>${item.contact}</p>
                    <p><strong>是否养过小动物：</strong>${item.hasPetExperience === 'yes' ? '是' : '否'}</p>
                    <span class="status ${item.status}">${item.status === 'pending' ? '待审批' : item.status === 'approved' ? '申请成功' : '申请失败'}</span>
                `;
                historyList.appendChild(historyItem);
            });
        }
    } catch (error) {
        console.error('加载领养历史失败:', error);
    }
}

// 加载申请记录（显示所有申请状态）
async function loadApplicationRecords() {
    try {
        const records = await api.getAdoptionHistory();
        const recordsList = document.getElementById('application-records-list');
        
        if (recordsList) {
            recordsList.innerHTML = '';
            
            if (records.length === 0) {
                recordsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无申请记录</p>';
                return;
            }
            
            records.forEach(item => {
                const recordItem = document.createElement('div');
                recordItem.className = 'history-item';
                recordItem.innerHTML = `
                    <h4>${item.pet_name}</h4>
                    <p><strong>领养原因：</strong>${item.reason}</p>
                    <p><strong>联系方式：</strong>${item.contact}</p>
                    <p><strong>是否养过小动物：</strong>${item.hasPetExperience === 'yes' ? '是' : '否'}</p>
                    <p><strong>申请时间：</strong>${item.time}</p>
                    <span class="status ${item.status}">${item.status === 'pending' ? '待审批' : item.status === 'approved' ? '申请成功' : '申请失败'}</span>
                `;
                recordsList.appendChild(recordItem);
            });
        }
    } catch (error) {
        console.error('加载申请记录失败:', error);
    }
}

// 加载收藏列表
function loadFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;
    
    const user = storage.getItem('user');
    if (!user || !user.favorites || user.favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无收藏</p>';
        return;
    }
    
    // 从宠物列表中获取收藏的宠物
    const favoritePets = mockPets.filter(pet => user.favorites.includes(pet.id));
    
    favoritesList.innerHTML = '';
    
    favoritePets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="${pet.image || 'https://picsum.photos/200/200'}" alt="${pet.name}">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p>${pet.age}岁 · ${pet.gender} · ${pet.breed}</p>
                <p class="pet-description">${pet.description}</p>
                <div class="pet-actions">
                    <button class="btn" onclick="showPetDetail(${pet.id})"><i class="fas fa-info-circle"></i> 查看详情</button>
                    <button class="btn btn-danger" onclick="removeFromFavorites(${pet.id})"><i class="fas fa-trash"></i> 取消收藏</button>
                </div>
            </div>
        `;
        favoritesList.appendChild(petCard);
    });
}

// 从收藏中移除
function removeFromFavorites(petId) {
    const user = storage.getItem('user');
    if (!user || !user.favorites) return;
    
    user.favorites = user.favorites.filter(id => id !== petId);
    storage.setItem('user', user);
    
    // 重新加载收藏列表
    loadFavorites();
    alert('已从收藏中移除');
}

// 加载用户话题
function loadUserTopics() {
    const topicsList = document.getElementById('user-topics-list');
    if (!topicsList) return;
    
    const user = storage.getItem('user');
    console.log('用户数据:', user); // 调试信息
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    // 获取用户发布的故事
    const userStories = stories.filter(story => story.author === user.username);
    
    console.log('用户的故事:', userStories); // 调试信息
    
    if (userStories.length === 0) {
        topicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">您还没有发布任何故事</p>';
        return;
    }
    
    let html = '';
    userStories.forEach(story => {
        html += `
            <div class="story-item">
                <div class="story-info">
                    <h4>${story.title}</h4>
                    <p>${story.content.substring(0, 100)}...</p>
                    <p>发布时间：${story.time} | 点赞：${story.likes} | 评论：${story.comments}</p>
                </div>
                <div class="story-actions">
                    <button class="btn btn-sm" onclick="viewStory(${story.id})">查看</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStory(${story.id})">删除</button>
                </div>
            </div>
        `;
    });
    
    topicsList.innerHTML = html;
}

// 查看故事
function viewStory(storyId) {
    // 跳转到领养故事页面并定位到指定故事
    showPage('adoption-stories');
    // 这里可以添加逻辑来定位到指定故事
    setTimeout(() => {
        const storyElement = document.querySelector(`[data-story-id="${storyId}"]`);
        if (storyElement) {
            storyElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

// 删除故事
function deleteStory(storyId) {
    if (!confirm('确定要删除这个故事吗？')) {
        return;
    }
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    // 找到并删除指定故事
    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
        stories.splice(storyIndex, 1);
        
        // 保存到localStorage
        localStorage.setItem('mockStories', JSON.stringify(stories));
        
        // 重新加载用户故事列表
        loadUserTopics();
        
        alert('故事已删除');
    }
}

// 删除话题
function deleteTopic(topicId) {
    if (confirm('确定要删除这个话题吗？')) {
        const user = storage.getItem('user');
        if (!user || !user.topics) return;
        
        // 从用户的topics数组中移除话题ID
        user.topics = user.topics.filter(id => id !== topicId);
        storage.setItem('user', user);
        
        // 从mockTopics数组中移除话题
        const topicIndex = mockTopics.findIndex(topic => topic.id === topicId);
        if (topicIndex > -1) {
            mockTopics.splice(topicIndex, 1);
            // 保存到localStorage
            localStorage.setItem('mockTopics', JSON.stringify(mockTopics));
        }
        
        // 删除与该话题相关的动态
        const dynamicIdsToDelete = [];
        for (let i = mockDynamics.length - 1; i >= 0; i--) {
            if (mockDynamics[i].topicId === topicId) {
                dynamicIdsToDelete.push(mockDynamics[i].id);
                mockDynamics.splice(i, 1);
            }
        }
        // 保存动态到localStorage
        localStorage.setItem('mockDynamics', JSON.stringify(mockDynamics));
        
        // 删除与这些动态相关的评论
        for (let i = mockComments.length - 1; i >= 0; i--) {
            if (dynamicIdsToDelete.includes(mockComments[i].dynamicId)) {
                mockComments.splice(i, 1);
            }
        }
        // 保存评论到localStorage
        localStorage.setItem('mockComments', JSON.stringify(mockComments));
        
        // 重新加载话题列表
        loadUserTopics();
        alert('话题已删除');
    }
}

// 加载用户点赞
function loadUserLikes() {
    const likesList = document.getElementById('user-likes-list');
    if (!likesList) return;
    
    const user = storage.getItem('user');
    console.log('用户数据:', user); // 调试信息
    
    if (!user || !user.likes || user.likes.length === 0) {
        likesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无点赞</p>';
        return;
    }
    
    console.log('用户点赞列表:', user.likes); // 调试信息
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    // 从localStorage中加载动态数据
    const storedDynamics = localStorage.getItem('mockDynamics');
    const dynamics = storedDynamics ? JSON.parse(storedDynamics) : mockDynamics;
    
    // 从故事列表中获取点赞的故事（使用 "story_" 前缀）
    const likedStories = stories.filter(story => user.likes.includes(`story_${story.id}`));
    console.log('点赞的故事:', likedStories); // 调试信息
    
    // 从动态列表中获取点赞的动态（使用 "dynamic_" 前缀）
    const likedDynamics = dynamics.filter(dynamic => user.likes.includes(`dynamic_${dynamic.id}`));
    console.log('点赞的动态:', likedDynamics); // 调试信息
    
    if (likedStories.length === 0 && likedDynamics.length === 0) {
        likesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无点赞</p>';
        return;
    }
    
    let html = '';
    
    // 从localStorage中加载话题数据
    const storedTopics = localStorage.getItem('mockTopics');
    const topics = storedTopics ? JSON.parse(storedTopics) : mockTopics;
    
    // 添加点赞的故事
    likedStories.forEach(story => {
        html += `
            <div class="like-item">
                <div class="like-info">
                    <h4>故事：${story.title}</h4>
                    <p>${story.content.substring(0, 100)}${story.content.length > 100 ? '...' : ''}</p>
                    <p class="like-meta">作者：${story.author} | 时间：${story.time} | 点赞数：${story.likes}</p>
                </div>
                <div class="like-actions">
                    <button class="btn btn-sm" onclick="viewStory(${story.id})">查看详情</button>
                    <button class="btn btn-sm btn-danger" onclick="unlikeStory(${story.id})">取消点赞</button>
                </div>
            </div>
        `;
    });
    
    // 添加点赞的动态
    likedDynamics.forEach(dynamic => {
        // 获取动态所属的话题
        const topic = topics.find(t => t.id === dynamic.topicId);
        html += `
            <div class="like-item">
                <div class="like-info">
                    <h4>话题：${topic?.name || '未知话题'}</h4>
                    <p>${dynamic.content}</p>
                    <p class="like-meta">作者：${dynamic.author} | 时间：${dynamic.time} | 点赞数：${dynamic.likes}</p>
                </div>
                <div class="like-actions">
                    <button class="btn btn-sm" onclick="viewDynamic(${dynamic.topicId}, ${dynamic.id})">查看详情</button>
                    <button class="btn btn-sm btn-danger" onclick="unlikeDynamic(${dynamic.id})">取消点赞</button>
                </div>
            </div>
        `;
    });
    
    likesList.innerHTML = html;
}

// 查看故事详情
function viewStory(storyId) {
    showPage('adoption-stories');
    // 这里可以添加逻辑来定位到指定故事
    alert(`查看故事 ID: ${storyId}`);
}

// 取消点赞
function unlikeStory(storyId) {
    const user = storage.getItem('user');
    if (!user || !user.likes) return;
    
    // 使用 "story_" 前缀来区分故事点赞
    const storyLikeKey = `story_${storyId}`;
    
    // 从用户的点赞列表中移除故事ID
    user.likes = user.likes.filter(id => id !== storyLikeKey);
    storage.setItem('user', user);
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    // 更新故事数据
    const story = stories.find(s => s.id === storyId);
    if (story) {
        story.isLiked = false;
        story.likes = Math.max(0, story.likes - 1);
        // 保存到localStorage
        localStorage.setItem('mockStories', JSON.stringify(stories));
    }
    
    // 重新加载点赞列表
    loadUserLikes();
    // 重新加载故事列表
    loadStories();
    alert('已取消点赞');
}

// 取消动态点赞
function unlikeDynamic(dynamicId) {
    const user = storage.getItem('user');
    if (!user || !user.likes) return;
    
    // 使用 "dynamic_" 前缀来区分动态点赞
    const dynamicLikeKey = `dynamic_${dynamicId}`;
    
    user.likes = user.likes.filter(id => id !== dynamicLikeKey);
    storage.setItem('user', user);
    
    // 从localStorage中加载动态数据
    const storedDynamics = localStorage.getItem('mockDynamics');
    const dynamics = storedDynamics ? JSON.parse(storedDynamics) : mockDynamics;
    
    // 更新动态数据
    const dynamic = dynamics.find(d => d.id === dynamicId);
    if (dynamic) {
        dynamic.isLiked = false;
        dynamic.likes = Math.max(0, dynamic.likes - 1);
        // 保存到localStorage
        localStorage.setItem('mockDynamics', JSON.stringify(dynamics));
    }
    
    // 重新加载点赞列表
    loadUserLikes();
    // 重新加载动态列表
    if (currentTopicId) {
        loadTopicDynamics(currentTopicId);
    }
    alert('已取消点赞');
}

// 查看动态详情
function viewDynamic(topicId, dynamicId) {
    showPage('topic-circle');
    selectTopic(topicId);
    // 这里可以添加逻辑来定位到指定动态
    alert(`查看动态 ID: ${dynamicId} 在话题: ${topicId}`);
}

// 加载用户评论
function loadUserComments() {
    const commentsList = document.getElementById('user-comments-list');
    if (!commentsList) return;
    
    const user = storage.getItem('user');
    console.log('用户数据:', user); // 调试信息
    
    if (!user || !user.comments || user.comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无评论</p>';
        return;
    }
    
    console.log('用户评论列表:', user.comments); // 调试信息
    
    let html = '';
    user.comments.forEach(comment => {
        if (comment.type === 'story') {
            // 故事评论
            html += `
                <div class="comment-item-card">
                    <div class="comment-header">
                        <span class="comment-topic">故事：${comment.storyTitle || '未知故事'}</span>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="comment-actions">
                        <button class="btn btn-sm" onclick="viewStoryComment(${comment.storyId})">查看原帖</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">删除评论</button>
                    </div>
                </div>
            `;
        } else {
            // 动态评论
            html += `
                <div class="comment-item-card">
                    <div class="comment-header">
                        <span class="comment-topic">话题：${comment.topicName || '未知话题'}</span>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="comment-actions">
                        <button class="btn btn-sm" onclick="viewCommentTopic(${comment.topicId}, ${comment.dynamicId})">查看原帖</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">删除评论</button>
                    </div>
                </div>
            `;
        }
    });
    
    commentsList.innerHTML = html;
}

// 查看故事评论原帖
function viewStoryComment(storyId) {
    showPage('adoption-stories');
    // 这里可以添加逻辑来定位到指定故事
    alert(`查看故事 ID: ${storyId}`);
}

// 查看动态评论原帖
function viewCommentTopic(topicId, dynamicId) {
    if (topicId) {
        showPage('topic-circle');
        // 这里可以添加逻辑来定位到指定话题和动态
        alert(`查看话题 ID: ${topicId}, 动态 ID: ${dynamicId}`);
    } else {
        alert('原帖信息不完整');
    }
}

// 删除评论
function deleteComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        const user = storage.getItem('user');
        if (!user || !user.comments) return;
        
        // 找到要删除的评论
        const commentToDelete = user.comments.find(c => c.id === commentId);
        if (!commentToDelete) return;
        
        // 从用户的comments数组中移除评论
        user.comments = user.comments.filter(c => c.id !== commentId);
        storage.setItem('user', user);
        
        // 根据评论类型删除实际的评论
        if (commentToDelete.type === 'story') {
            // 故事评论
            const story = mockStories.find(s => s.id === commentToDelete.storyId);
            if (story && story.commentList) {
                const initialLength = story.commentList.length;
                story.commentList = story.commentList.filter(c => c.id !== commentId);
                // 更新评论数
                story.comments = story.commentList.length;
                // 保存到localStorage
                localStorage.setItem('mockStories', JSON.stringify(mockStories));
                
                // 重新加载故事评论
                const commentsList = document.getElementById(`comments-${commentToDelete.storyId}`);
                if (commentsList) {
                    commentsList.innerHTML = '';
                    if (story.commentList.length === 0) {
                        commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 10px;">暂无评论，快来发表第一条评论吧！</p>';
                    } else {
                        story.commentList.forEach(comment => {
                            const commentItem = document.createElement('div');
                            commentItem.className = 'comment-item';
                            const avatar = comment.avatar || (comment.author ? comment.author.charAt(0) : '匿');
                            commentItem.innerHTML = `
                                <div class="comment-avatar">${avatar}</div>
                                <div class="comment-content">
                                    <div class="comment-meta">
                                        <span class="comment-author">${comment.author}</span>
                                        <span class="comment-time">${comment.time}</span>
                                    </div>
                                    <p>${comment.content}</p>
                                </div>
                            `;
                            commentsList.appendChild(commentItem);
                        });
                    }
                }
            }
        } else {
            // 动态评论
            const dynamic = mockDynamics.find(d => d.id === commentToDelete.dynamicId);
            if (dynamic) {
                // 更新动态的评论数
                dynamic.comments = Math.max(0, dynamic.comments - 1);
                // 保存动态到localStorage
                localStorage.setItem('mockDynamics', JSON.stringify(mockDynamics));
                
                // 更新评论区的评论数显示
                const dynamicElement = document.querySelector(`.dynamic-item[data-id="${commentToDelete.dynamicId}"]`);
                if (dynamicElement) {
                    const commentBtn = dynamicElement.querySelector('.dynamic-action-btn:nth-child(2) span:last-child');
                    if (commentBtn) {
                        commentBtn.textContent = dynamic.comments;
                    }
                }
            }
            
            // 从全局评论数据中删除
            mockComments = mockComments.filter(c => c.id !== commentId);
            // 保存评论到localStorage
            localStorage.setItem('mockComments', JSON.stringify(mockComments));
            
            // 重新加载动态评论
            loadComments(commentToDelete.dynamicId);
        }
        
        // 重新加载评论列表
        loadUserComments();
        // 重新加载故事列表
        loadStories();
        // 重新加载动态列表
        if (currentTopicId) {
            loadTopicDynamics(currentTopicId);
        } else {
            // 如果没有当前话题ID，也要确保动态列表数据正确更新
            console.log('No current topic ID, but updating dynamics data');
        }
        
        alert('评论已删除');
        
        // 重新加载当前页面，确保所有数据都正确更新
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            const pageId = currentPage.id;
            console.log('Reloading current page:', pageId);
            showPage(pageId);
        }
    }
}

// 保存权限设置
function savePermissions() {
    const user = storage.getItem('user');
    if (!user || !user.isAdmin) {
        alert('只有管理员才能修改权限设置');
        return;
    }
    alert('权限设置已保存！');
}

// 加载管理员审批列表
async function loadAdminApproval() {
    try {
        const user = storage.getItem('user');
        if (!user || !user.isAdmin) {
            alert('只有管理员才能访问此页面');
            showPage('home');
            return;
        }
        
        const approvalList = document.getElementById('approval-list');
        if (!approvalList) return;
        
        // 从localStorage中加载申请记录数据
        const storedHistory = localStorage.getItem('mockAdoptionHistory');
        const adoptionHistory = storedHistory ? JSON.parse(storedHistory) : [];
        
        if (adoptionHistory.length === 0) {
            approvalList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无申请记录</p>';
            return;
        }
        
        approvalList.innerHTML = '';
        
        adoptionHistory.forEach(item => {
            const approvalItem = document.createElement('div');
            approvalItem.className = 'history-item';
            approvalItem.innerHTML = `
                <div class="approval-header">
                    <div class="user-avatar" onclick="openUserPermissionModal('${item.username}')" title="点击设置用户权限">${item.username.charAt(0)}</div>
                    <div class="approval-info">
                        <h4>${item.pet_name}</h4>
                        <p><strong>申请人：</strong>${item.username}</p>
                        <p><strong>领养原因：</strong>${item.reason}</p>
                        <p><strong>联系方式：</strong>${item.contact}</p>
                        <p><strong>是否养过小动物：</strong>${item.hasPetExperience === 'yes' ? '是' : '否'}</p>
                        <p><strong>申请时间：</strong>${item.time}</p>
                    </div>
                </div>
                <div class="approval-footer">
                    <span class="status ${item.status}">${item.status === 'pending' ? '待审批' : item.status === 'approved' ? '申请成功' : '申请失败'}</span>
                    <div class="approval-actions">
                        ${item.status === 'pending' ? `
                            <button class="btn btn-success" onclick="approveApplication(${item.id})">通过</button>
                            <button class="btn btn-danger" onclick="rejectApplication(${item.id})">拒绝</button>
                        ` : ''}
                    </div>
                </div>
            `;
            approvalList.appendChild(approvalItem);
        });
    } catch (error) {
        console.error('加载审批列表失败:', error);
    }
}

// 通过申请
function approveApplication(applicationId) {
    if (!confirm('确定要通过这个申请吗？')) {
        return;
    }
    
    // 从localStorage中加载申请记录数据
    const storedHistory = localStorage.getItem('mockAdoptionHistory');
    const adoptionHistory = storedHistory ? JSON.parse(storedHistory) : [];
    
    // 找到并更新申请状态
    const application = adoptionHistory.find(item => item.id === applicationId);
    if (application) {
        application.status = 'approved';
        
        // 保存到localStorage
        localStorage.setItem('mockAdoptionHistory', JSON.stringify(adoptionHistory));
        
        // 将对应的宠物标记为已领养
        const storedPets = localStorage.getItem('mockPets');
        let pets = storedPets ? JSON.parse(storedPets) : [...mockPets];
        
        const pet = pets.find(p => p.id == application.petId);
        if (pet) {
            pet.adopted = true;
            localStorage.setItem('mockPets', JSON.stringify(pets));
            mockPets.length = 0;
            mockPets.push(...pets);
        }
        
        // 重新加载审批列表
        loadAdminApproval();
        
        alert('申请已通过，宠物已标记为已领养');
    }
}

// 切换宠物领养状态
function togglePetAdoption(petId) {
    const storedPets = localStorage.getItem('mockPets');
    let pets = storedPets ? JSON.parse(storedPets) : [...mockPets];
    
    const pet = pets.find(p => p.id == petId);
    if (pet) {
        pet.adopted = !pet.adopted;
        localStorage.setItem('mockPets', JSON.stringify(pets));
        mockPets.length = 0;
        mockPets.push(...pets);
        
        // 重新加载宠物列表
        loadPets();
        
        alert(`宠物 ${pet.name} 已${pet.adopted ? '标记为已领养' : '标记为可领养'}`);
    }
}

// 拒绝申请
function rejectApplication(applicationId) {
    if (!confirm('确定要拒绝这个申请吗？')) {
        return;
    }
    
    // 从localStorage中加载申请记录数据
    const storedHistory = localStorage.getItem('mockAdoptionHistory');
    const adoptionHistory = storedHistory ? JSON.parse(storedHistory) : [];
    
    // 找到并更新申请状态
    const application = adoptionHistory.find(item => item.id === applicationId);
    if (application) {
        application.status = 'rejected';
        
        // 保存到localStorage
        localStorage.setItem('mockAdoptionHistory', JSON.stringify(adoptionHistory));
        
        // 重新加载审批列表
        loadAdminApproval();
        
        alert('申请已拒绝');
    }
}

// 打开用户权限设置模态框
function openUserPermissionModal(username) {
    const modal = document.getElementById('user-permission-modal');
    if (!modal) return;
    
    // 查找用户信息
    const user = registeredUsers.find(u => u.username === username);
    if (!user) {
        alert('用户不存在');
        return;
    }
    
    // 填充用户信息
    document.getElementById('permission-username').value = username;
    document.getElementById('permission-username-display').value = username;
    document.getElementById('permission-admin').checked = user.isAdmin || false;
    
    // 显示模态框
    modal.style.display = 'block';
}

// 关闭用户权限设置模态框
function closeUserPermissionModal() {
    const modal = document.getElementById('user-permission-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 保存用户权限
function saveUserPermissions() {
    const username = document.getElementById('permission-username').value;
    const isAdmin = document.getElementById('permission-admin').checked;
    
    // 查找用户并更新权限
    const userIndex = registeredUsers.findIndex(u => u.username === username);
    if (userIndex === -1) {
        alert('用户不存在');
        return;
    }
    
    // 更新用户权限
    registeredUsers[userIndex].isAdmin = isAdmin;
    
    // 保存到localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // 关闭模态框
    closeUserPermissionModal();
    
    alert('用户权限已保存');
}

// 打开用户详情模态框
function openUserDetailModal(username) {
    const modal = document.getElementById('user-detail-modal');
    if (!modal) return;
    
    // 检查当前用户是否是管理员
    const currentUser = storage.getItem('user');
    if (!currentUser || !currentUser.isAdmin) {
        alert('只有管理员才能查看用户详情');
        return;
    }
    
    // 查找用户信息
    const user = registeredUsers.find(u => u.username === username);
    if (!user) {
        alert('用户不存在');
        return;
    }
    
    // 填充用户信息
    document.getElementById('user-detail-avatar').textContent = username.charAt(0);
    document.getElementById('user-detail-username').textContent = username;
    document.getElementById('user-detail-admin').checked = user.isAdmin || false;
    
    // 加载用户评论
    loadUserComments(username);
    
    // 加载用户反馈
    loadUserFeedback(username);
    
    // 加载聊天记录
    loadUserChat(username);
    
    // 显示模态框
    modal.style.display = 'block';
}

// 关闭用户详情模态框
function closeUserDetailModal() {
    const modal = document.getElementById('user-detail-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 加载用户评论
function loadUserComments(username) {
    const commentsList = document.getElementById('user-comments-list');
    if (!commentsList) return;
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    // 从localStorage中加载动态数据
    const storedDynamics = localStorage.getItem('mockDynamics');
    const dynamics = storedDynamics ? JSON.parse(storedDynamics) : mockDynamics;
    
    // 收集该用户的所有评论
    const userComments = [];
    
    // 从故事评论中收集
    stories.forEach(story => {
        if (story.commentList) {
            story.commentList.forEach(comment => {
                if (comment.author === username) {
                    userComments.push({
                        ...comment,
                        storyTitle: story.title,
                        type: 'story'
                    });
                }
            });
        }
    });
    
    // 从动态评论中收集
    dynamics.forEach(dynamic => {
        if (dynamic.commentList) {
            dynamic.commentList.forEach(comment => {
                if (comment.author === username) {
                    userComments.push({
                        ...comment,
                        dynamicContent: dynamic.content,
                        type: 'dynamic'
                    });
                }
            });
        }
    });
    
    if (userComments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无评论</p>';
        return;
    }
    
    commentsList.innerHTML = '';
    
    userComments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'user-comment-item';
        commentItem.innerHTML = `
            <div class="user-comment-header">
                <span class="user-comment-type">${comment.type === 'story' ? '故事评论' : '动态评论'}</span>
                <span class="user-comment-time">${comment.time}</span>
            </div>
            <p class="user-comment-content">${comment.content}</p>
            ${comment.type === 'story' ? `<p class="user-comment-source">来自故事：${comment.storyTitle}</p>` : `<p class="user-comment-source">来自动态：${comment.dynamicContent.substring(0, 50)}...</p>`}
        `;
        commentsList.appendChild(commentItem);
    });
}

// 加载用户反馈
function loadUserFeedback(username) {
    const feedbackList = document.getElementById('user-feedback-list');
    if (!feedbackList) return;
    
    // 获取该用户的反馈
    const userFeedback = mockFeedback.filter(feedback => feedback.username === username);
    
    if (userFeedback.length === 0) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无反馈</p>';
        return;
    }
    
    feedbackList.innerHTML = '';
    
    userFeedback.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'user-feedback-item';
        feedbackItem.innerHTML = `
            <div class="user-feedback-header">
                <span class="user-feedback-type">${feedback.type}</span>
                <span class="user-feedback-time">${feedback.time}</span>
            </div>
            <p class="user-feedback-content">${feedback.content}</p>
            <span class="user-feedback-status ${feedback.status}">${feedback.status === 'pending' ? '待处理' : feedback.status === 'processing' ? '处理中' : '已处理'}</span>
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// 加载聊天记录
function loadUserChat(username) {
    const chatMessages = document.getElementById('user-chat-messages');
    if (!chatMessages) return;
    
    // 查找或创建聊天记录
    if (!mockMessages[username]) {
        mockMessages[username] = [];
    }
    
    const messages = mockMessages[username];
    
    if (messages.length === 0) {
        chatMessages.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无聊天记录</p>';
        return;
    }
    
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type === 'sent' ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            <div class="chat-message-content">
                <span class="chat-sender">${message.sender}</span>
                <p class="chat-text">${message.content}</p>
                <span class="chat-time">${message.time}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    });
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 发送消息
function sendUserMessage() {
    const chatInput = document.getElementById('user-chat-input');
    const content = chatInput.value.trim();
    
    if (!content) {
        alert('请输入消息内容');
        return;
    }
    
    const currentUser = storage.getItem('user');
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    
    const targetUsername = document.getElementById('user-detail-username').textContent;
    
    // 添加消息到聊天记录
    if (!mockMessages[targetUsername]) {
        mockMessages[targetUsername] = [];
    }
    
    mockMessages[targetUsername].push({
        id: mockMessages[targetUsername].length + 1,
        sender: currentUser.username,
        content: content,
        time: new Date().toLocaleTimeString(),
        type: 'sent'
    });
    
    // 清空输入框
    chatInput.value = '';
    
    // 重新加载聊天记录
    loadUserChat(targetUsername);
}

// 更新用户权限
function updateUserPermission() {
    const username = document.getElementById('user-detail-username').textContent;
    const isAdmin = document.getElementById('user-detail-admin').checked;
    
    // 查找用户并更新权限
    const userIndex = registeredUsers.findIndex(u => u.username === username);
    if (userIndex === -1) {
        alert('用户不存在');
        return;
    }
    
    // 更新用户权限
    registeredUsers[userIndex].isAdmin = isAdmin;
    
    // 保存到localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    alert('用户权限已更新');
}

// 冻结账号
function freezeAccount() {
    if (confirm('确定要冻结账号吗？冻结后将无法使用平台功能。')) {
        // 更新账号状态显示
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = '已冻结';
            statusBadge.className = 'status-badge frozen';
        }
        alert('账号已冻结');
    }
}

// 注销账号
function deactivateAccount() {
    if (confirm('确定要注销账号吗？此操作不可恢复！')) {
        storage.removeItem('token');
        storage.removeItem('user');
        alert('账号已注销');
        updateNavbar();
        showPage('home');
    }
}

// 加载领养历史
async function loadAdoptionHistory() {
    try {
        const history = await api.getAdoptionHistory();
        const historyList = document.getElementById('history-list');
        
        if (historyList) {
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无申请记录</p>';
                return;
            }
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h3>${item.pet_name}</h3>
                    <p><span class="label">领养原因：</span>${item.reason}</p>
                    <p><span class="label">联系方式：</span>${item.contact}</p>
                    <p><span class="label">申请时间：</span>${item.time}</p>
                    <span class="status ${item.status}">${item.status === 'pending' ? '待审批' : item.status === 'approved' ? '申请成功' : '申请失败'}</span>
                `;
                historyList.appendChild(historyItem);
            });
        }
    } catch (error) {
        console.error('加载领养历史失败:', error);
    }
}

// ==================== 社交功能 ====================

// 从localStorage加载故事数据
let mockStories = JSON.parse(localStorage.getItem('mockStories')) || [
    {
        id: 1,
        title: "我家毛孩子的蜕变之旅",
        content: "三个月前领养了这只小橘猫，当时它瘦瘦小小的，现在已经成为家里的小霸王了！每天回家看到它迎接我，所有的疲惫都消失了。",
        author: "爱猫人士",
        avatar: "爱",
        time: "2024-12-15",
        petType: "猫",
        duration: "3",
        tags: ["新手领养", "流浪宠领养"],
        likes: 128,
        comments: 23,
        isLiked: false,
        isFeatured: true,
        image: null,
        commentList: [
            {
                id: 1,
                author: "猫奴一枚",
                avatar: "猫",
                time: "2024-12-15",
                content: "好可爱的小橘猫！请问领养的时候它多大了？"
            },
            {
                id: 2,
                author: "爱猫人士",
                avatar: "爱",
                time: "2024-12-15",
                content: "谢谢！当时它大概两个月大，现在已经五个月了。"
            },
            {
                id: 3,
                author: "铲屎官",
                avatar: "铲",
                time: "2024-12-16",
                content: "我也想领养一只橘猫，请问领养流程复杂吗？"
            }
        ]
    },
    {
        id: 2,
        title: "领养代替购买，给它一个家",
        content: "在平台领养了一只金毛，它之前是流浪狗，现在每天陪我跑步，是最忠诚的伙伴。领养不仅救了它，也丰富了我的生活。",
        author: "跑步达人",
        avatar: "跑",
        time: "2024-12-10",
        petType: "狗",
        duration: "6",
        tags: ["流浪宠领养", "狗"],
        likes: 256,
        comments: 45,
        isLiked: true,
        isFeatured: true,
        image: null,
        commentList: [
            {
                id: 1,
                author: "狗迷",
                avatar: "狗",
                time: "2024-12-10",
                content: "金毛真的很温顺，我家也有一只！"
            },
            {
                id: 2,
                author: "跑步达人",
                avatar: "跑",
                time: "2024-12-10",
                content: "是的，金毛特别适合陪伴跑步，体力很好！"
            }
        ]
    }
];

// 从localStorage加载话题数据
let mockTopics = JSON.parse(localStorage.getItem('mockTopics')) || [
    {
        id: 1,
        name: "宠物驱虫小知识",
        description: "分享宠物驱虫的经验和注意事项",
        author: "平台官方",
        dynamics: 156,
        followers: 892
    },
    {
        id: 2,
        name: "领养代替购买",
        description: "倡导领养文化，分享领养故事",
        author: "平台官方",
        dynamics: 234,
        followers: 1205
    },
    {
        id: 3,
        name: "猫咪拆家怎么办",
        description: "讨论猫咪调皮捣蛋的解决办法",
        author: "铲屎官小王",
        dynamics: 89,
        followers: 456
    }
];

// 从localStorage加载动态数据
let mockDynamics = JSON.parse(localStorage.getItem('mockDynamics')) || [
    {
        id: 1,
        topicId: 1,
        author: "铲屎官小李",
        avatar: "李",
        content: "我家猫咪每个月都要驱虫，内驱外驱都要做，大家有什么推荐的驱虫药吗？",
        time: "2024-12-18 10:30",
        likes: 12,
        comments: 8
    },
    {
        id: 2,
        topicId: 1,
        author: "爱宠人士",
        avatar: "爱",
        content: "推荐大宠爱，内外同驱，很方便！",
        time: "2024-12-18 11:00",
        likes: 25,
        comments: 3
    }
];

// 从localStorage加载评论数据
let mockComments = JSON.parse(localStorage.getItem('mockComments')) || [
    {
        id: 1,
        dynamicId: 1,
        author: "宠物达人",
        avatar: "宠",
        content: "我推荐福来恩，外驱效果很好，而且安全性高。",
        time: "2024-12-18 10:45"
    },
    {
        id: 2,
        dynamicId: 1,
        author: "猫咪爱好者",
        avatar: "猫",
        content: "博来恩也不错，内外同驱，价格实惠。",
        time: "2024-12-18 11:00"
    },
    {
        id: 3,
        dynamicId: 1,
        author: "兽医小张",
        avatar: "张",
        content: "建议咨询一下宠物医生，根据猫咪的体重和年龄选择合适的驱虫药。",
        time: "2024-12-18 11:15"
    },
    {
        id: 4,
        dynamicId: 2,
        author: "铲屎官小王",
        avatar: "王",
        content: "大宠爱确实好用，我家猫咪一直在用！",
        time: "2024-12-18 11:30"
    },
    {
        id: 5,
        dynamicId: 2,
        author: "宠物医生",
        avatar: "医",
        content: "大宠爱安全性高，适合大多数猫咪使用。",
        time: "2024-12-18 11:45"
    }
];

let mockContacts = [
    {
        id: 1,
        name: "平台客服",
        avatar: "客",
        lastMessage: "您好，有什么可以帮助您的吗？",
        time: "10:30",
        unread: 0
    },
    {
        id: 2,
        name: "志愿者小王",
        avatar: "王",
        lastMessage: "明天可以来看狗狗",
        time: "昨天",
        unread: 2
    }
];

let mockMessages = {
    1: [
        { id: 1, sender: "平台客服", content: "您好，欢迎咨询宠物领养平台！", time: "10:00", type: "received" },
        { id: 2, sender: "我", content: "你好，我想了解领养流程", time: "10:05", type: "sent" },
        { id: 3, sender: "平台客服", content: "您好，领养流程很简单：1.浏览宠物 2.提交申请 3.等待审核 4.签署协议 5.接走宠物", time: "10:30", type: "received" }
    ],
    2: [
        { id: 1, sender: "志愿者小王", content: "您好，我是负责金毛小白领养的志愿者", time: "昨天", type: "received" },
        { id: 2, sender: "我", content: "你好，我想明天去看看小白", time: "昨天", type: "sent" },
        { id: 3, sender: "志愿者小王", content: "明天可以来看狗狗", time: "昨天", type: "received" }
    ]
};

// 用户和管理员对话消息存储
let userAdminMessages = JSON.parse(localStorage.getItem('userAdminMessages')) || {};

let mockAdoptionHistory = JSON.parse(localStorage.getItem('mockAdoptionHistory')) || [];

let currentTopicId = null;
let currentContactId = null;

function showPublishStoryModal() {
    const token = storage.getItem('token');
    if (!token) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    const modal = document.getElementById('publish-story-modal');
    if (modal) modal.style.display = 'block';
}

function showCreateTopicModal() {
    const token = storage.getItem('token');
    if (!token) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    const modal = document.getElementById('create-topic-modal');
    if (modal) modal.style.display = 'block';
}

function loadStories() {
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) return;
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    const typeFilter = document.getElementById('story-type-filter')?.value || '';
    const durationFilter = document.getElementById('story-duration-filter')?.value || '';
    
    // 获取当前用户
    const user = storage.getItem('user');
    
    let filteredStories = stories;
    
    if (typeFilter) filteredStories = filteredStories.filter(s => s.petType === typeFilter);
    if (durationFilter) filteredStories = filteredStories.filter(s => s.duration === durationFilter);
    
    storiesList.innerHTML = '';
    
    if (filteredStories.length === 0) {
        storiesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无相关故事</p>';
        return;
    }
    
    filteredStories.forEach(story => {
        // 检查用户是否已经点赞了该故事（使用 "story_" 前缀）
        story.isLiked = user && user.likes ? user.likes.includes(`story_${story.id}`) : false;
        
        // 确保评论数是根据实际的评论列表长度来计算的
        story.comments = story.commentList ? story.commentList.length : 0;
        
        const storyEl = document.createElement('div');
        storyEl.className = 'story-item';
        storyEl.innerHTML = `
            <div class="story-header">
                <div class="story-author">
                    <div class="story-avatar">${story.avatar}</div>
                    <div class="story-meta">
                        <span class="story-author-name">${story.author}</span>
                        <span class="story-time">${story.time}</span>
                    </div>
                </div>
                ${story.isFeatured ? '<span class="story-badge">精选</span>' : ''}
            </div>
            <h3 class="story-title">${story.title}</h3>
            <p class="story-content">${story.content}</p>
            ${story.image ? `<img src="${story.image}" class="story-image" alt="故事图片">` : ''}
            <div class="story-tags">
                ${story.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
            </div>
            <div class="story-actions">
                <span class="story-action-btn ${story.isLiked ? 'active' : ''}" onclick="toggleStoryLike(${story.id})">
                    <span>${story.isLiked ? '❤️' : '🤍'}</span>
                    <span>${story.likes}</span>
                </span>
                <span class="story-action-btn" onclick="toggleStoryComments(${story.id})">
                    <span>💬</span>
                    <span>${story.comments}</span>
                </span>
            </div>
            <div class="story-comments" id="comments-${story.id}" style="display: block;">
                <div class="comments-header">
                    <h4>评论 (${story.comments})</h4>
                </div>
                <div class="comments-list">
                    ${story.commentList ? story.commentList.map(comment => `
                        <div class="comment-item">
                            <div class="comment-avatar" onclick="openUserDetailModal('${comment.author}')" title="点击查看用户详情">${comment.avatar}</div>
                            <div class="comment-content">
                                <div class="comment-meta">
                                    <span class="comment-author">${comment.author}</span>
                                    <span class="comment-time">${comment.time}</span>
                                </div>
                                <p>${comment.content}</p>
                            </div>
                        </div>
                    `).join('') : '<p class="no-comments">暂无评论，快来发表你的看法吧！</p>'}
                </div>
                <div class="comment-form">
                    <textarea id="comment-input-${story.id}" placeholder="写下你的评论..."></textarea>
                    <button class="btn" onclick="submitStoryComment(${story.id})"><i class="fas fa-paper-plane"></i> 发表评论</button>
                </div>
            </div>
        `;
        storiesList.appendChild(storyEl);
    });
}

function filterStories() {
    loadStories();
}

function toggleStoryLike(storyId) {
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    // 从localStorage中加载故事数据
    const storedStories = localStorage.getItem('mockStories');
    const stories = storedStories ? JSON.parse(storedStories) : mockStories;
    
    const story = stories.find(s => s.id === storyId);
    if (story) {
        // 使用 "story_" 前缀来区分故事点赞
        const storyLikeKey = `story_${storyId}`;
        const isCurrentlyLiked = user.likes && user.likes.includes(storyLikeKey);
        
        if (isCurrentlyLiked) {
            // 取消点赞
            story.isLiked = false;
            story.likes = Math.max(0, story.likes - 1);
            user.likes = user.likes.filter(id => id !== storyLikeKey);
        } else {
            // 添加点赞
            story.isLiked = true;
            story.likes += 1;
            if (!user.likes) {
                user.likes = [];
            }
            user.likes.push(storyLikeKey);
        }
        
        storage.setItem('user', user);
        // 保存到localStorage
        localStorage.setItem('mockStories', JSON.stringify(stories));
        loadStories();
        // 重新加载用户点赞列表
        loadUserLikes();
    }
}

function toggleStoryComments(storyId) {
    const commentsSection = document.getElementById(`comments-${storyId}`);
    if (commentsSection) {
        if (commentsSection.style.display === 'none') {
            commentsSection.style.display = 'block';
        } else {
            commentsSection.style.display = 'none';
        }
    }
}

function submitStoryComment(storyId) {
    const commentInput = document.getElementById(`comment-input-${storyId}`);
    const commentContent = commentInput.value.trim();
    
    if (!commentContent) {
        alert('请输入评论内容');
        return;
    }
    
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    const author = user?.username || '匿名用户';
    const avatar = (user?.username || '匿').charAt(0);
    const time = new Date().toISOString().split('T')[0];
    
    const story = mockStories.find(s => s.id === storyId);
    if (story) {
        if (!story.commentList) {
            story.commentList = [];
        }
        
        const newComment = {
            id: story.commentList.length + 1,
            author,
            avatar,
            time,
            content: commentContent,
            storyId: storyId,
            storyTitle: story.title,
            type: 'story'
        };
        
        story.commentList.push(newComment);
        story.comments += 1;
        
        // 将评论添加到用户的comments数组中
        if (!user.comments) {
            user.comments = [];
        }
        user.comments.push(newComment);
        storage.setItem('user', user);
        
        // 保存到localStorage
        localStorage.setItem('mockStories', JSON.stringify(mockStories));
        
        commentInput.value = '';
        loadStories();
        
        // 重新展开评论区
        setTimeout(() => {
            const commentsSection = document.getElementById(`comments-${storyId}`);
            if (commentsSection) {
                commentsSection.style.display = 'block';
            }
        }, 100);
    }
}

function publishStory(e) {
    e.preventDefault();
    
    const title = document.getElementById('story-title').value;
    const content = document.getElementById('story-content').value;
    const petType = document.getElementById('story-pet-type').value;
    const duration = document.getElementById('story-duration').value;
    const tagsInput = document.getElementById('story-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const user = storage.getItem('user');
    
    const newStory = {
        id: mockStories.length + 1,
        title,
        content,
        author: user?.username || '匿名用户',
        avatar: (user?.username || '匿').charAt(0),
        time: new Date().toISOString().split('T')[0],
        petType,
        duration,
        tags,
        likes: 0,
        comments: 0,
        isLiked: false,
        isFeatured: false,
        image: null
    };
    
    mockStories.unshift(newStory);
    // 保存到localStorage
    localStorage.setItem('mockStories', JSON.stringify(mockStories));
    
    alert('故事发布成功！');
    document.getElementById('publish-story-form').reset();
    document.getElementById('publish-story-modal').style.display = 'none';
    loadStories();
}

function loadTopics() {
    const topicsList = document.getElementById('hot-topics-list');
    if (!topicsList) return;
    
    topicsList.innerHTML = '';
    
    mockTopics.forEach(topic => {
        const topicEl = document.createElement('div');
        topicEl.className = 'topic-item' + (topic.id === currentTopicId ? ' active' : '');
        topicEl.onclick = () => selectTopic(topic.id);
        topicEl.innerHTML = `
            <div class="topic-item-name">${topic.name}</div>
            <div class="topic-item-desc">${topic.description}</div>
            <div class="topic-item-stats">
                <span>💬 ${topic.dynamics}</span>
                <span>👥 ${topic.followers}</span>
            </div>
        `;
        topicsList.appendChild(topicEl);
    });
}

function selectTopic(topicId) {
    currentTopicId = topicId;
    loadTopics();
    
    const topic = mockTopics.find(t => t.id === topicId);
    if (topic) {
        document.getElementById('topic-title').textContent = topic.name;
        loadTopicDynamics(topicId);
    }
}

function loadTopicDynamics(topicId) {
    const dynamicsList = document.getElementById('topic-dynamic-list');
    if (!dynamicsList) return;
    
    // 从localStorage中加载动态数据
    const storedDynamics = localStorage.getItem('mockDynamics');
    const dynamics = storedDynamics ? JSON.parse(storedDynamics) : mockDynamics;
    
    const topicDynamics = dynamics.filter(d => d.topicId === topicId);
    
    // 获取当前用户
    const user = storage.getItem('user');
    
    dynamicsList.innerHTML = '';
    
    if (topicDynamics.length === 0) {
        dynamicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无动态，快来发布第一条吧！</p>';
        return;
    }
    
    topicDynamics.forEach(dynamic => {
        // 检查用户是否已经点赞了该动态（使用 "dynamic_" 前缀）
        dynamic.isLiked = user && user.likes ? user.likes.includes(`dynamic_${dynamic.id}`) : false;
        
        const dynamicEl = document.createElement('div');
        dynamicEl.className = 'dynamic-item';
        dynamicEl.setAttribute('data-id', dynamic.id);
        dynamicEl.innerHTML = `
            <div class="dynamic-header">
                <div class="dynamic-author">
                    <div class="dynamic-avatar">${dynamic.avatar}</div>
                    <div>
                        <div class="dynamic-author-name">${dynamic.author}</div>
                        <div class="dynamic-time">${dynamic.time}</div>
                    </div>
                </div>
            </div>
            <div class="dynamic-content">${dynamic.content}</div>
            <div class="dynamic-actions">
                <span class="dynamic-action-btn ${dynamic.isLiked ? 'active' : ''}" onclick="likeDynamic(${dynamic.id})"><span>${dynamic.isLiked ? '❤️' : '🤍'}</span>
                    <span>${dynamic.likes}</span>
                </span>
                <span class="dynamic-action-btn" onclick="commentDynamic(${dynamic.id})">
                    <span>💬</span>
                    <span>${dynamic.comments}</span>
                </span>
            </div>
        `;
        dynamicsList.appendChild(dynamicEl);
    });
}

function publishDynamic() {
    const content = document.getElementById('dynamic-content').value;
    if (!content.trim()) {
        alert('请输入内容');
        return;
    }
    
    if (!currentTopicId) {
        alert('请先选择一个话题');
        return;
    }
    
    const user = storage.getItem('user');
    
    const newDynamic = {
        id: mockDynamics.length + 1,
        topicId: currentTopicId,
        author: user?.username || '匿名用户',
        avatar: (user?.username || '匿').charAt(0),
        content,
        time: new Date().toLocaleString(),
        likes: 0,
        comments: 0
    };
    
    mockDynamics.unshift(newDynamic);
    // 保存到localStorage
    localStorage.setItem('mockDynamics', JSON.stringify(mockDynamics));
    
    const topic = mockTopics.find(t => t.id === currentTopicId);
    if (topic) {
        topic.dynamics++;
        // 保存话题到localStorage
        localStorage.setItem('mockTopics', JSON.stringify(mockTopics));
    }
    
    document.getElementById('dynamic-content').value = '';
    loadTopicDynamics(currentTopicId);
    loadTopics();
}

function likeDynamic(dynamicId) {
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    // 从localStorage中加载动态数据
    const storedDynamics = localStorage.getItem('mockDynamics');
    const dynamics = storedDynamics ? JSON.parse(storedDynamics) : mockDynamics;
    
    const dynamic = dynamics.find(d => d.id === dynamicId);
    if (dynamic) {
        // 使用 "dynamic_" 前缀来区分动态点赞
        const dynamicLikeKey = `dynamic_${dynamicId}`;
        const isCurrentlyLiked = user.likes && user.likes.includes(dynamicLikeKey);
        
        if (isCurrentlyLiked) {
            // 取消点赞
            dynamic.isLiked = false;
            dynamic.likes = Math.max(0, dynamic.likes - 1);
            user.likes = user.likes.filter(id => id !== dynamicLikeKey);
        } else {
            // 添加点赞
            dynamic.isLiked = true;
            dynamic.likes += 1;
            if (!user.likes) {
                user.likes = [];
            }
            user.likes.push(dynamicLikeKey);
        }
        
        storage.setItem('user', user);
        // 保存到localStorage
        localStorage.setItem('mockDynamics', JSON.stringify(dynamics));
        loadTopicDynamics(currentTopicId);
        // 重新加载用户点赞列表
        loadUserLikes();
    }
}

// 评论动态
function commentDynamic(dynamicId) {
    console.log('commentDynamic called with dynamicId:', dynamicId);
    
    // 尝试不同的选择器
    let dynamicElement = document.querySelector(`.dynamic-item[data-id="${dynamicId}"]`);
    console.log('Dynamic element found by data-id:', dynamicElement);
    
    // 如果没找到，尝试其他方式
    if (!dynamicElement) {
        const dynamicElements = document.querySelectorAll('.dynamic-item');
        console.log('All dynamic elements:', dynamicElements);
        dynamicElements.forEach(el => {
            console.log('Dynamic item data-id:', el.getAttribute('data-id'));
        });
    }
    
    if (!dynamicElement) {
        console.error('Dynamic element not found for id:', dynamicId);
        alert('找不到动态元素，请刷新页面重试');
        return;
    }
    
    // 检查是否已经有评论区
    let commentSection = dynamicElement.querySelector('.comment-section');
    console.log('Comment section found:', commentSection);
    
    if (!commentSection) {
        // 创建评论区
        console.log('Creating new comment section for dynamicId:', dynamicId);
        commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.innerHTML = `
            <h4>评论</h4>
            <div class="comments-list" id="comments-${dynamicId}">
                <!-- 评论将动态生成 -->
            </div>
            <div class="comment-form">
                <textarea placeholder="写下你的评论..." class="comment-input"></textarea>
                <button class="btn btn-sm" onclick="submitDynamicComment(${dynamicId})">发表评论</button>
            </div>
        `;
        dynamicElement.appendChild(commentSection);
        console.log('Comment section created:', commentSection);
    }
    
    // 切换评论区的显示/隐藏
    console.log('Current commentSection display:', commentSection.style.display);
    if (commentSection.style.display === 'none' || commentSection.style.display === '') {
        commentSection.style.display = 'block';
        console.log('Showing comment section, loading comments');
        // 加载评论
        loadComments(dynamicId);
    } else {
        commentSection.style.display = 'none';
        console.log('Hiding comment section');
    }
}

// 加载评论
function loadComments(dynamicId) {
    console.log('loadComments called with dynamicId:', dynamicId);
    const commentsList = document.getElementById(`comments-${dynamicId}`);
    console.log('Comments list found:', commentsList);
    if (!commentsList) {
        console.error('Comments list not found for dynamicId:', dynamicId);
        return;
    }
    
    // 定义初始评论数据，包含多个动态的评论
    const initialComments = [
        {
            id: 1,
            dynamicId: 1,
            author: "宠物达人",
            avatar: "宠",
            content: "我推荐福来恩，外驱效果很好，而且安全性高。",
            time: "2024-12-18 10:45"
        },
        {
            id: 2,
            dynamicId: 1,
            author: "猫咪爱好者",
            avatar: "猫",
            content: "博来恩也不错，内外同驱，价格实惠。",
            time: "2024-12-18 11:00"
        },
        {
            id: 3,
            dynamicId: 1,
            author: "兽医小张",
            avatar: "张",
            content: "建议咨询一下宠物医生，根据猫咪的体重和年龄选择合适的驱虫药。",
            time: "2024-12-18 11:15"
        },
        {
            id: 4,
            dynamicId: 2,
            author: "铲屎官小王",
            avatar: "王",
            content: "领养代替购买，给流浪动物一个家！",
            time: "2024-12-19 09:30"
        },
        {
            id: 5,
            dynamicId: 2,
            author: "爱心人士",
            avatar: "爱",
            content: "我已经领养了一只流浪猫，现在它很幸福！",
            time: "2024-12-19 10:00"
        },
        {
            id: 6,
            dynamicId: 3,
            author: "猫咪专家",
            avatar: "专",
            content: "猫咪拆家是正常行为，可以给它准备一些玩具来分散注意力。",
            time: "2024-12-20 14:20"
        },
        {
            id: 7,
            dynamicId: 3,
            author: "资深铲屎官",
            avatar: "资",
            content: "我家猫咪以前也拆家，后来我给它买了猫抓板，情况好多了。",
            time: "2024-12-20 15:00"
        }
    ];
    
    // 合并初始评论和当前的mockComments
    let allComments = [...initialComments];
    
    // 过滤出用户自己的评论（不是初始评论）
    const userComments = mockComments.filter(comment => {
        // 检查是否是初始评论
        const isInitialComment = initialComments.some(initial => initial.id === comment.id);
        return !isInitialComment;
    });
    
    console.log('User comments found:', userComments.length);
    console.log('User comments details:', userComments);
    
    // 添加用户评论
    if (userComments.length > 0) {
        allComments = [...allComments, ...userComments];
        console.log('Total comments after adding user comments:', allComments.length);
        console.log('Total comments details:', allComments);
    }
    
    // 确保mockComments包含所有评论
    mockComments = [...allComments];
    console.log('Current mockComments:', mockComments);
    
    // 从合并后的评论数据中获取该动态的评论
    const comments = allComments.filter(c => c.dynamicId === dynamicId);
    console.log('Comments for dynamicId:', dynamicId, 'count:', comments.length);
    console.log('Comments details:', comments);
    
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        console.log('No comments found for dynamicId:', dynamicId);
        commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 10px;">暂无评论，快来发表第一条评论吧！</p>';
        return;
    }
    
    // 按时间排序，最新的评论在前面
    comments.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        const avatar = comment.avatar || (comment.author ? comment.author.charAt(0) : '匿');
        commentItem.innerHTML = `
            <div class="comment-avatar">${avatar}</div>
            <div class="comment-content">
                <div class="comment-meta">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <p>${comment.content}</p>
            </div>
        `;
        commentsList.appendChild(commentItem);
    });
    console.log('Comments loaded successfully for dynamicId:', dynamicId);
}

// 提交动态评论
function submitDynamicComment(dynamicId) {
    const dynamicElement = document.querySelector(`.dynamic-item[data-id="${dynamicId}"]`);
    if (!dynamicElement) return;
    
    const commentInput = dynamicElement.querySelector('.comment-input');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        alert('请输入评论内容');
        return;
    }
    
    // 获取当前用户信息
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    // 获取动态信息
    const dynamic = mockDynamics.find(d => d.id === dynamicId);
    const topic = dynamic ? mockTopics.find(t => t.id === dynamic.topicId) : null;
    
    // 创建评论对象
    const newComment = {
        id: Date.now(),
        dynamicId: dynamicId,
        topicId: dynamic?.topicId,
        topicName: topic?.name || '未知话题',
        content: commentText,
        time: new Date().toLocaleString(),
        author: user.username,
        avatar: (user.username || '匿').charAt(0),
        type: 'dynamic' // 添加评论类型
    };
    
    // 将评论添加到全局评论数据中
    mockComments.push(newComment);
    
    // 定义初始评论数据，用于过滤
    const initialComments = [
        {
            id: 1,
            dynamicId: 1,
            author: "宠物达人",
            avatar: "宠",
            content: "我推荐福来恩，外驱效果很好，而且安全性高。",
            time: "2024-12-18 10:45"
        },
        {
            id: 2,
            dynamicId: 1,
            author: "猫咪爱好者",
            avatar: "猫",
            content: "博来恩也不错，内外同驱，价格实惠。",
            time: "2024-12-18 11:00"
        },
        {
            id: 3,
            dynamicId: 1,
            author: "兽医小张",
            avatar: "张",
            content: "建议咨询一下宠物医生，根据猫咪的体重和年龄选择合适的驱虫药。",
            time: "2024-12-18 11:15"
        },
        {
            id: 4,
            dynamicId: 2,
            author: "铲屎官小王",
            avatar: "王",
            content: "领养代替购买，给流浪动物一个家！",
            time: "2024-12-19 09:30"
        },
        {
            id: 5,
            dynamicId: 2,
            author: "爱心人士",
            avatar: "爱",
            content: "我已经领养了一只流浪猫，现在它很幸福！",
            time: "2024-12-19 10:00"
        },
        {
            id: 6,
            dynamicId: 3,
            author: "猫咪专家",
            avatar: "专",
            content: "猫咪拆家是正常行为，可以给它准备一些玩具来分散注意力。",
            time: "2024-12-20 14:20"
        },
        {
            id: 7,
            dynamicId: 3,
            author: "资深铲屎官",
            avatar: "资",
            content: "我家猫咪以前也拆家，后来我给它买了猫抓板，情况好多了。",
            time: "2024-12-20 15:00"
        }
    ];
    
    // 只保存用户自己的评论到localStorage，避免覆盖初始评论
    const userComments = mockComments.filter(comment => {
        // 检查是否是初始评论
        const isInitialComment = initialComments.some(initial => initial.id === comment.id);
        return !isInitialComment;
    });
    // 保存用户评论到localStorage
    localStorage.setItem('mockComments', JSON.stringify(userComments));
    
    // 更新动态的评论数
    if (dynamic) {
        dynamic.comments++;
        // 保存动态到localStorage
        localStorage.setItem('mockDynamics', JSON.stringify(mockDynamics));
    }
    
    // 将评论添加到用户的comments数组中
    if (!user.comments) {
        user.comments = [];
    }
    user.comments.push(newComment);
    storage.setItem('user', user);
    
    // 重新加载评论列表以显示所有评论
    loadComments(dynamicId);
    
    // 清空输入框
    commentInput.value = '';
    
    // 更新评论数
    const commentBtn = dynamicElement.querySelector('.dynamic-action-btn:nth-child(2) span:last-child');
    if (commentBtn) {
        const currentCount = parseInt(commentBtn.textContent) || 0;
        commentBtn.textContent = currentCount + 1;
    }
    
    alert('评论发表成功！');
}

function searchTopics() {
    const keyword = document.getElementById('topic-search').value.toLowerCase();
    if (!keyword) {
        loadTopics();
        return;
    }
    
    const topicsList = document.getElementById('hot-topics-list');
    if (!topicsList) return;
    
    const filteredTopics = mockTopics.filter(t => 
        t.name.toLowerCase().includes(keyword) || 
        t.description.toLowerCase().includes(keyword)
    );
    
    topicsList.innerHTML = '';
    
    if (filteredTopics.length === 0) {
        topicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">未找到相关话题</p>';
        return;
    }
    
    filteredTopics.forEach(topic => {
        const topicEl = document.createElement('div');
        topicEl.className = 'topic-item';
        topicEl.onclick = () => selectTopic(topic.id);
        topicEl.innerHTML = `
            <div class="topic-item-name">${topic.name}</div>
            <div class="topic-item-desc">${topic.description}</div>
            <div class="topic-item-stats">
                <span>💬 ${topic.dynamics}</span>
                <span>👥 ${topic.followers}</span>
            </div>
        `;
        topicsList.appendChild(topicEl);
    });
}

function createTopic(e) {
    e.preventDefault();
    
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        showLoginModal();
        return;
    }
    
    const name = document.getElementById('topic-name').value;
    const description = document.getElementById('topic-description').value;
    
    const newTopic = {
        id: mockTopics.length + 1,
        name,
        description,
        author: storage.getItem('user')?.username || '匿名用户',
        dynamics: 0,
        followers: 0
    };
    
    mockTopics.push(newTopic);
    // 保存到localStorage
    localStorage.setItem('mockTopics', JSON.stringify(mockTopics));
    
    // 将话题ID添加到用户的topics数组中
    if (!user.topics) {
        user.topics = [];
    }
    user.topics.push(newTopic.id);
    storage.setItem('user', user);
    
    alert('话题创建成功！');
    document.getElementById('create-topic-form').reset();
    document.getElementById('create-topic-modal').style.display = 'none';
    loadTopics();
}

function loadContacts() {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;
    
    const user = storage.getItem('user');
    if (!user) return;
    
    // 从localStorage重新加载消息数据
    userAdminMessages = JSON.parse(localStorage.getItem('userAdminMessages')) || {};
    
    contactsList.innerHTML = '<h3>联系人</h3>';
    
    // 获取注册用户列表
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    if (user.isAdmin) {
        // 管理员看到所有普通用户
        const normalUsers = registeredUsers.filter(u => !u.isAdmin && u.username !== user.username);
        
        if (normalUsers.length === 0) {
            contactsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无用户咨询</p>';
            return;
        }
        
        normalUsers.forEach(contactUser => {
            const contactEl = document.createElement('div');
            contactEl.className = 'contact-item' + (contactUser.username === currentContactId ? ' active' : '');
            contactEl.onclick = () => selectContact(contactUser.username, contactUser.username);
            
            // 获取最后一条消息 - 使用"用户名_管理员名"作为key
            const messageKey = `${contactUser.username}_${user.username}`;
            const messages = userAdminMessages[messageKey] || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '暂无消息';
            const lastTime = messages.length > 0 ? messages[messages.length - 1].time : '';
            
            contactEl.innerHTML = `
                <div class="contact-avatar">${contactUser.username.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${contactUser.username}</div>
                    <div class="contact-last-message">${lastMessage}</div>
                </div>
                <div class="contact-time">${lastTime}</div>
            `;
            contactsList.appendChild(contactEl);
        });
    } else {
        // 普通用户看到管理员
        const admins = registeredUsers.filter(u => u.isAdmin);
        
        if (admins.length === 0) {
            contactsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无管理员在线</p>';
            return;
        }
        
        admins.forEach(admin => {
            const contactEl = document.createElement('div');
            contactEl.className = 'contact-item' + (admin.username === currentContactId ? ' active' : '');
            contactEl.onclick = () => selectContact(admin.username, admin.username);
            
            // 获取最后一条消息 - 使用"用户名_管理员名"作为key
            const messageKey = `${user.username}_${admin.username}`;
            const messages = userAdminMessages[messageKey] || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '暂无消息';
            const lastTime = messages.length > 0 ? messages[messages.length - 1].time : '';
            
            contactEl.innerHTML = `
                <div class="contact-avatar">${admin.username.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${admin.username} (管理员)</div>
                    <div class="contact-last-message">${lastMessage}</div>
                </div>
                <div class="contact-time">${lastTime}</div>
            `;
            contactsList.appendChild(contactEl);
        });
    }
}

function selectContact(contactId, contactName) {
    currentContactId = contactId;
    loadContacts();
    
    document.getElementById('chat-header').textContent = contactName;
    loadMessages(contactId);
}

function loadMessages(contactId) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const user = storage.getItem('user');
    if (!user) return;
    
    // 从localStorage重新加载消息数据
    userAdminMessages = JSON.parse(localStorage.getItem('userAdminMessages')) || {};
    
    // 获取对话消息 - 使用"用户名_管理员名"作为key
    let messageKey;
    if (user.isAdmin) {
        // 管理员查看与用户的对话
        messageKey = `${contactId}_${user.username}`;
    } else {
        // 用户查看与管理员的对话
        messageKey = `${user.username}_${contactId}`;
    }
    
    const messages = userAdminMessages[messageKey] || [];
    
    chatMessages.innerHTML = '';
    
    if (messages.length === 0) {
        chatMessages.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无消息，开始对话吧！</p>';
        return;
    }
    
    messages.forEach(msg => {
        // 判断消息类型：当前用户发送的消息为sent，其他人为received
        const messageType = msg.sender === user.username ? 'sent' : 'received';
        
        const msgEl = document.createElement('div');
        msgEl.className = 'message ' + messageType;
        msgEl.innerHTML = `
            <div class="message-sender">${msg.sender}</div>
            <div>${msg.content}</div>
            <div class="message-time">${msg.time}</div>
        `;
        chatMessages.appendChild(msgEl);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content) return;
    
    if (!currentContactId) {
        alert('请先选择一个联系人');
        return;
    }
    
    const user = storage.getItem('user');
    if (!user) {
        alert('请先登录');
        return;
    }
    
    // 从localStorage重新加载消息数据
    userAdminMessages = JSON.parse(localStorage.getItem('userAdminMessages')) || {};
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 确定消息存储的key - 使用"用户名_管理员名"格式
    let messageKey;
    if (user.isAdmin) {
        // 管理员发送消息给用户
        messageKey = `${currentContactId}_${user.username}`;
    } else {
        // 用户发送消息给管理员
        messageKey = `${user.username}_${currentContactId}`;
    }
    
    // 初始化消息数组
    if (!userAdminMessages[messageKey]) {
        userAdminMessages[messageKey] = [];
    }
    
    // 添加新消息
    const newMessage = {
        id: userAdminMessages[messageKey].length + 1,
        sender: user.username,
        content,
        time: currentTime,
        isAdmin: user.isAdmin
    };
    
    userAdminMessages[messageKey].push(newMessage);
    
    // 保存到localStorage
    localStorage.setItem('userAdminMessages', JSON.stringify(userAdminMessages));
    
    input.value = '';
    loadMessages(currentContactId);
    loadContacts();
}

// 绑定社交功能表单事件
document.addEventListener('DOMContentLoaded', function() {
    const publishStoryForm = document.getElementById('publish-story-form');
    if (publishStoryForm) {
        publishStoryForm.addEventListener('submit', publishStory);
    }
    
    const createTopicForm = document.getElementById('create-topic-form');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', createTopic);
    }
    
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
