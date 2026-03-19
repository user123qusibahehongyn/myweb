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
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20golden%20retriever%20dog%2C%20happy%20expression%2C%20outdoor%20setting&image_size=square"
    },
    {
        id: 2,
        name: "花花",
        breed: "英短",
        age: 1,
        gender: "母",
        habit: "喜欢睡觉，爱干净",
        characterDesc: "安静温顺，独立，适合单身人士",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20british%20shorthair%20cat%2C%20blue%20eyes%2C%20indoor%20setting&image_size=square"
    },
    {
        id: 3,
        name: "小黑",
        breed: "拉布拉多",
        age: 3,
        gender: "公",
        habit: "喜欢游泳，精力充沛",
        characterDesc: "聪明听话，服从性高，适合训练",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20black%20labrador%20retriever%20dog%2C%20active%2C%20outdoor%20setting&image_size=square"
    },
    {
        id: 4,
        name: "旺财",
        breed: "边牧",
        age: 2,
        gender: "公",
        habit: "喜欢运动，聪明活泼",
        characterDesc: "聪明伶俐，服从性高，适合有经验的主人",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=border%20collie%20dog%2C%20black%20and%20white%2C%20happy%20expression%2C%20sitting%20on%20grass&image_size=square"
    },
    {
        id: 5,
        name: "乐乐",
        breed: "萨摩耶",
        age: 1,
        gender: "母",
        habit: "喜欢玩耍，活泼开朗",
        characterDesc: "温顺友善，毛发蓬松，适合有耐心的主人",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=samoyed%20dog%2C%20white%20fur%2C%20happy%20expression%2C%20sitting%20in%20grass%20with%20blue%20flowers&image_size=square"
    }
];

const mockAdoptionHistory = [
    {
        id: 1,
        pet_name: "小白",
        reason: "我很喜欢狗狗，有足够的时间和空间照顾它",
        contact: "13800138000",
        hasPetExperience: "yes",
        status: "pending"
    },
    {
        id: 2,
        pet_name: "花花",
        reason: "我想养一只猫作伴",
        contact: "13900139000",
        hasPetExperience: "no",
        status: "approved"
    }
];

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

// 模拟API调用
const api = {
    register: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "注册成功" });
            }, 500);
        });
    },
    login: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (data.username && data.password) {
                    resolve({ 
                        message: "登录成功", 
                        access_token: "mock-token-" + Date.now() 
                    });
                } else {
                    resolve({ message: "账号密码错误" });
                }
            }, 500);
        });
    },
    getPets: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockPets);
            }, 300);
        });
    },
    getPetDetail: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const pet = mockPets.find(p => p.id == id);
                resolve(pet);
            }, 300);
        });
    },
    adopt: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
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
                const userHistory = mockAdoptionHistory.filter(item => item.username === user.username);
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
    const loginRequiredPages = ['pets', 'pet-detail', 'adoption-history', 'user-center', 'adoption-stories', 'topic-circle', 'messages'];
    if (loginRequiredPages.includes(pageId)) {
        const token = storage.getItem('token');
        if (!token) {
            alert('请先完成登录');
            showLoginModal();
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
    
    if (pageId === 'adoption-stories') {
        loadStories();
    }
    
    if (pageId === 'topic-circle') {
        loadTopics();
        if (mockTopics.length > 0 && !currentTopicId) {
            selectTopic(mockTopics[0].id);
        }
    }
    
    if (pageId === 'messages') {
        loadContacts();
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
    updateNavbar();
    bindNavbarEvents();
    bindModalEvents();
    displayCaptcha();
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
            
            if (!validateCaptcha('captcha', '#login-modal img[alt="验证码"]')) {
                alert('验证码输入错误');
                return;
            }
            
            let username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || username.trim() === '') {
                username = '游客' + Math.floor(Math.random() * 10000);
            }
            
            try {
                const response = await api.login({ username, password });
                if (response.message === '登录成功') {
                    // 检查是否已有用户数据，如果有则保留
                    const existingUser = storage.getItem('user');
                    const userData = { 
                        username: username,
                        favorites: existingUser?.favorites || [],
                        likes: existingUser?.likes || [],
                        topics: existingUser?.topics || [],
                        comments: existingUser?.comments || []
                    };
                    storage.setItem('token', response.access_token);
                    storage.setItem('user', userData);
                    
                    alert('登录成功');
                    const loginModal = document.getElementById('login-modal');
                    if (loginModal) {
                        loginModal.style.display = 'none';
                    }
                    updateNavbar();
                } else {
                    alert(response.message);
                }
            } catch (error) {
                console.error('登录失败:', error);
                alert('登录失败，请稍后重试');
            }
        });
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateCaptcha('reg-captcha', '#register-modal img[alt="验证码"]')) {
                alert('验证码输入错误');
                return;
            }
            
            let username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const phone = document.getElementById('reg-phone').value;
            
            if (!username || username.trim() === '') {
                username = '游客' + Math.floor(Math.random() * 10000);
            }
            
            try {
                const response = await api.register({ username, password, phone });
                alert(response.message);
                if (response.message === '注册成功') {
                    const registerModal = document.getElementById('register-modal');
                    if (registerModal) {
                        registerModal.style.display = 'none';
                    }
                    const loginResponse = await api.login({ username, password });
                    if (loginResponse.message === '登录成功') {
                        storage.setItem('token', loginResponse.access_token);
                        storage.setItem('user', { username: username });
                        updateNavbar();
                    }
                }
            } catch (error) {
                console.error('注册失败:', error);
                alert('注册失败，请稍后重试');
            }
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
            
            if (!hasPetExperience) {
                alert('请选择是否养过小动物');
                return;
            }
            
            if (!agreeTerms) {
                alert('请阅读并同意领养须知和平台规则');
                return;
            }
            
            try {
                const response = await api.adopt({
                    petId,
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
            
            alert('反馈提交成功！');
            feedbackForm.reset();
            // 返回个人中心
            showPage('user-center');
        });
    }
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

// 显示注册模态框
function showRegisterModal() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (loginModal) {
        loginModal.style.display = 'none';
    }
    
    if (registerModal) {
        registerModal.style.display = 'block';
        displayCaptcha();
    }
}

// 更新导航栏
function updateNavbar() {
    const token = storage.getItem('token');
    const user = storage.getItem('user');
    const userDiv = document.querySelector('.user');
    
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

// 加载宠物列表
async function loadPets(filterType = null) {
    try {
        const pets = await api.getPets();
        const petsGrid = document.getElementById('pets-grid');
        
        if (petsGrid) {
            petsGrid.innerHTML = '';
            
            // 定义狗的品种列表
            const dogBreeds = ['金毛', '拉布拉多', '边牧', '萨摩耶', '柯基', '泰迪', '哈士奇', '德国牧羊犬', '博美', '比熊'];
            // 定义猫的品种列表
            const catBreeds = ['英短', '美短', '布偶', '暹罗', '波斯', '加菲', '缅因', '斯芬克斯', '苏格兰折耳', '金渐层'];
            
            pets.forEach(pet => {
                // 如果有筛选类型，检查是否符合条件
                if (filterType) {
                    const isDog = dogBreeds.some(breed => pet.breed.includes(breed));
                    const isCat = catBreeds.some(breed => pet.breed.includes(breed));
                    
                    if (filterType === '猫' && !isCat) return;
                    if (filterType === '狗' && !isDog) return;
                    if (filterType === '其他' && (isDog || isCat)) return;
                }
                
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                petCard.innerHTML = `
                    <img src="${pet.image}" alt="${pet.name}" class="pet-card-image">
                    <div class="pet-card-content">
                        <h3>${pet.name}</h3>
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
    
    if (!user || !user.topics || user.topics.length === 0) {
        topicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">您还没有发起任何话题</p>';
        return;
    }
    
    console.log('用户话题列表:', user.topics); // 调试信息
    
    // 从话题列表中获取用户的话题
    const userTopics = mockTopics.filter(topic => user.topics.includes(topic.id));
    
    console.log('用户的话题:', userTopics); // 调试信息
    
    if (userTopics.length === 0) {
        topicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">您还没有发起任何话题</p>';
        return;
    }
    
    let html = '';
    userTopics.forEach(topic => {
        html += `
            <div class="topic-item">
                <div class="topic-info">
                    <h4>${topic.name}</h4>
                    <p>描述：${topic.description} | 动态：${topic.dynamics} | 关注：${topic.followers}</p>
                </div>
                <div class="topic-actions">
                    <button class="btn btn-sm" onclick="viewTopic(${topic.id})">查看</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTopic(${topic.id})">删除</button>
                </div>
            </div>
        `;
    });
    
    topicsList.innerHTML = html;
}

// 查看话题
function viewTopic(topicId) {
    // 跳转到话题圈页面并显示指定话题
    showPage('topic-circle');
    // 这里可以添加逻辑来定位到指定话题
    alert(`查看话题 ID: ${topicId}`);
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
        }
        
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
    
    // 从故事列表中获取点赞的故事
    const likedStories = mockStories.filter(story => user.likes.includes(story.id));
    
    console.log('点赞的故事:', likedStories); // 调试信息
    
    if (likedStories.length === 0) {
        likesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无点赞</p>';
        return;
    }
    
    let html = '';
    likedStories.forEach(story => {
        html += `
            <div class="like-item">
                <div class="like-info">
                    <h4>${story.title}</h4>
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
    
    user.likes = user.likes.filter(id => id !== storyId);
    storage.setItem('user', user);
    
    // 更新故事数据
    const story = mockStories.find(s => s.id === storyId);
    if (story && story.isLiked) {
        story.isLiked = false;
        story.likes -= 1;
    }
    
    // 重新加载点赞列表
    loadUserLikes();
    alert('已取消点赞');
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
    });
    
    commentsList.innerHTML = html;
}

// 查看评论原帖
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
        
        // 从用户的comments数组中移除评论
        user.comments = user.comments.filter(c => c.id !== commentId);
        storage.setItem('user', user);
        
        // 重新加载评论列表
        loadUserComments();
        alert('评论已删除');
    }
}

// 保存权限设置
function savePermissions() {
    alert('权限设置已保存！');
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
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h3>${item.pet_name}</h3>
                    <p><span class="label">领养原因：</span>${item.reason}</p>
                    <p><span class="label">联系方式：</span>${item.contact}</p>
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

let mockStories = [
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

let mockTopics = [
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

let mockDynamics = [
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

let mockComments = [
    {
        id: 1,
        dynamicId: 1,
        author: "宠物达人",
        content: "我推荐福来恩，外驱效果很好，而且安全性高。",
        time: "2024-12-18 10:45"
    },
    {
        id: 2,
        dynamicId: 1,
        author: "猫咪爱好者",
        content: "博来恩也不错，内外同驱，价格实惠。",
        time: "2024-12-18 11:00"
    },
    {
        id: 3,
        dynamicId: 1,
        author: "兽医小张",
        content: "建议咨询一下宠物医生，根据猫咪的体重和年龄选择合适的驱虫药。",
        time: "2024-12-18 11:15"
    },
    {
        id: 4,
        dynamicId: 2,
        author: "铲屎官小王",
        content: "大宠爱确实好用，我家猫咪一直在用！",
        time: "2024-12-18 11:30"
    },
    {
        id: 5,
        dynamicId: 2,
        author: "宠物医生",
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
    
    const typeFilter = document.getElementById('story-type-filter')?.value || '';
    const durationFilter = document.getElementById('story-duration-filter')?.value || '';
    
    let filteredStories = mockStories;
    
    if (typeFilter) filteredStories = filteredStories.filter(s => s.petType === typeFilter);
    if (durationFilter) filteredStories = filteredStories.filter(s => s.duration === durationFilter);
    
    storiesList.innerHTML = '';
    
    if (filteredStories.length === 0) {
        storiesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无相关故事</p>';
        return;
    }
    
    filteredStories.forEach(story => {
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
            <div class="story-comments" id="comments-${story.id}" style="display: none;">
                <div class="comments-header">
                    <h4>评论 (${story.comments})</h4>
                </div>
                <div class="comments-list">
                    ${story.commentList ? story.commentList.map(comment => `
                        <div class="comment-item">
                            <div class="comment-avatar">${comment.avatar}</div>
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
                    <button class="btn" onclick="submitComment(${story.id})"><i class="fas fa-paper-plane"></i> 发表评论</button>
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
    
    const story = mockStories.find(s => s.id === storyId);
    if (story) {
        story.isLiked = !story.isLiked;
        story.likes += story.isLiked ? 1 : -1;
        
        // 更新用户的点赞列表
        if (!user.likes) {
            user.likes = [];
        }
        
        if (story.isLiked) {
            // 添加点赞
            if (!user.likes.includes(storyId)) {
                user.likes.push(storyId);
            }
        } else {
            // 取消点赞
            user.likes = user.likes.filter(id => id !== storyId);
        }
        
        storage.setItem('user', user);
        loadStories();
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

function submitComment(storyId) {
    const commentInput = document.getElementById(`comment-input-${storyId}`);
    const commentContent = commentInput.value.trim();
    
    if (!commentContent) {
        alert('请输入评论内容');
        return;
    }
    
    const user = storage.getItem('user');
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
            content: commentContent
        };
        
        story.commentList.push(newComment);
        story.comments += 1;
        
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
    
    const dynamics = mockDynamics.filter(d => d.topicId === topicId);
    
    dynamicsList.innerHTML = '';
    
    if (dynamics.length === 0) {
        dynamicsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无动态，快来发布第一条吧！</p>';
        return;
    }
    
    dynamics.forEach(dynamic => {
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
                <span class="dynamic-action-btn" onclick="likeDynamic(${dynamic.id})">
                    <span>👍</span>
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
    
    const topic = mockTopics.find(t => t.id === currentTopicId);
    if (topic) topic.dynamics++;
    
    document.getElementById('dynamic-content').value = '';
    loadTopicDynamics(currentTopicId);
    loadTopics();
}

function likeDynamic(dynamicId) {
    const dynamic = mockDynamics.find(d => d.id === dynamicId);
    if (dynamic) {
        dynamic.likes++;
        loadTopicDynamics(currentTopicId);
    }
}

// 评论动态
function commentDynamic(dynamicId) {
    const dynamicElement = document.querySelector(`.dynamic-item[data-id="${dynamicId}"]`);
    if (!dynamicElement) return;
    
    // 检查是否已经有评论区
    let commentSection = dynamicElement.querySelector('.comment-section');
    
    if (!commentSection) {
        // 创建评论区
        commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.innerHTML = `
            <h4>评论</h4>
            <div class="comments-list" id="comments-${dynamicId}">
                <!-- 评论将动态生成 -->
            </div>
            <div class="comment-form">
                <textarea placeholder="写下你的评论..." class="comment-input"></textarea>
                <button class="btn btn-sm" onclick="submitComment(${dynamicId})">发表评论</button>
            </div>
        `;
        dynamicElement.appendChild(commentSection);
    }
    
    // 加载评论
    loadComments(dynamicId);
}

// 加载评论
function loadComments(dynamicId) {
    const commentsList = document.getElementById(`comments-${dynamicId}`);
    if (!commentsList) return;
    
    // 从全局评论数据中获取该动态的评论
    const comments = mockComments.filter(c => c.dynamicId === dynamicId);
    
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #999; padding: 10px;">暂无评论，快来发表第一条评论吧！</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-user">${comment.author}</div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-time">${comment.time}</div>
        `;
        commentsList.appendChild(commentItem);
    });
}

// 提交评论
function submitComment(dynamicId) {
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
        author: user.username
    };
    
    // 将评论添加到全局评论数据中
    mockComments.push(newComment);
    
    // 将评论添加到用户的comments数组中
    if (!user.comments) {
        user.comments = [];
    }
    user.comments.push(newComment);
    storage.setItem('user', user);
    
    // 更新评论区显示
    const commentsList = document.getElementById(`comments-${dynamicId}`);
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
        <div class="comment-user">${user.username}</div>
        <div class="comment-content">${commentText}</div>
        <div class="comment-time">刚刚</div>
    `;
    commentsList.appendChild(commentItem);
    
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
    
    contactsList.innerHTML = '<h3>联系人</h3>';
    
    mockContacts.forEach(contact => {
        const contactEl = document.createElement('div');
        contactEl.className = 'contact-item' + (contact.id === currentContactId ? ' active' : '');
        contactEl.onclick = () => selectContact(contact.id, contact.name);
        contactEl.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-last-message">${contact.lastMessage}</div>
            </div>
            <div class="contact-time">${contact.time}</div>
        `;
        contactsList.appendChild(contactEl);
    });
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
    
    const messages = mockMessages[contactId] || [];
    
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = 'message ' + msg.type;
        msgEl.innerHTML = `
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
    
    if (!mockMessages[currentContactId]) {
        mockMessages[currentContactId] = [];
    }
    
    const newMessage = {
        id: mockMessages[currentContactId].length + 1,
        sender: '我',
        content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
    };
    
    mockMessages[currentContactId].push(newMessage);
    
    const contact = mockContacts.find(c => c.id === currentContactId);
    if (contact) {
        contact.lastMessage = content;
        contact.time = '刚刚';
    }
    
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
