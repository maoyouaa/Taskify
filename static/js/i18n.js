(() => {
  const STORAGE_KEY = "taskify.language";
  const translations = {
    en: {
      "document.home": "Taskify",
      "document.signup": "Sign up",
      "document.dashboard": "Dashboard",
      "lang.en": "EN",
      "lang.zh": "中文",
      "nav.features": "Features",
      "nav.templates": "Templates",
      "nav.forTeams": "For Teams",
      "nav.resources": "Resources",
      "nav.pricing": "Pricing",
      "nav.signUp": "Sign Up",
      "nav.logIn": "Log In",
      "hero.heading": "One app to replace them all",
      "hero.email": "Enter your email address",
      "hero.cta": "Get Started",
      "feature.title": "Delightfully simple and deceptively powerful task management",
      "feature.copy": "Plan work, study, and life in one place without the usual clutter.",
      "feature.card1.title": "With you everywhere",
      "feature.card1.text": "Use Taskify on any device so your task list stays close at hand.",
      "feature.card1.cta": "Download apps",
      "feature.card2.title": "Shape a workflow that fits",
      "feature.card2.text": "Customize tasks with filters, labels, priorities, and simple views.",
      "feature.card2.cta": "See all features",
      "feature.card3.title": "Build better habits",
      "feature.card3.text": "Use lightweight planning to stay productive without losing focus.",
      "feature.card3.cta": "Take the quiz",
      "feature.card4.title": "Start from a template",
      "feature.card4.text": "Jump into proven task layouts for team work, study, and personal goals.",
      "feature.card4.cta": "Start with templates",
      "feature.card5.title": "Connect your other tools",
      "feature.card5.text": "Keep Taskify close to your calendar and the apps your team already uses.",
      "feature.card5.cta": "Install integrations",
      "achievements.title": "A task manager you can trust for life",
      "achievements.copy": "Taskify keeps projects organized with a calmer, clearer workflow for every team.",
      "achievements.stat1": "App downloads",
      "achievements.stat2": "Tasks completed",
      "achievements.stat3": "Colleges",
      "achievements.stat4": "Pro users",
      "footer.tagline": "Join millions of people who organize work and life with Taskify.",
      "footer.features": "FEATURES",
      "footer.resources": "RESOURCES",
      "footer.company": "COMPANY",
      "footer.howItWorks": "How It Works",
      "footer.forTeams": "For Teams",
      "footer.pricing": "Pricing",
      "footer.templates": "Templates",
      "footer.downloadApps": "Download Apps",
      "footer.helpCenter": "Help Center",
      "footer.productivityMethods": "Productivity Methods",
      "footer.referFriend": "Refer a friend",
      "footer.integrations": "Integrations",
      "footer.channelPartners": "Channel Partners",
      "footer.developerApi": "Developer API",
      "footer.status": "Status",
      "footer.about": "About Us",
      "footer.hiring": "We are hiring!",
      "footer.blog": "Blog",
      "footer.press": "Press",
      "footer.security": "Security",
      "footer.privacy": "Privacy",
      "footer.terms": "Terms",
      "signup.title": "Sign up",
      "signup.username": "User name",
      "signup.email": "Email",
      "signup.password": "Password",
      "signup.placeholder.username": "User name",
      "signup.placeholder.email": "Email",
      "signup.placeholder.password": "Password",
      "signup.submit": "Sign up",
      "login.title": "Login",
      "login.email": "Email",
      "login.password": "Password",
      "login.placeholder.email": "Enter your email",
      "login.placeholder.password": "Enter password",
      "login.submit": "Login",
      "dashboard.search": "Search",
      "dashboard.overview": "Overview",
      "dashboard.stats": "Stats",
      "dashboard.sidebarProjects": "Projects",
      "dashboard.chat": "Chat",
      "dashboard.calendar": "Calendar",
      "dashboard.settings": "Settings",
      "dashboard.profile": "Profile",
      "dashboard.logout": "Log Out",
      "dashboard.user": "Lord Voldemort",
      "dashboard.kicker": "Task board",
      "dashboard.projects": "Projects",
      "dashboard.copy": "Clear actions and instant feedback for every task update.",
      "dashboard.workspaceReady": "Workspace ready. Task actions update the board instantly.",
      "dashboard.totalTasks": "Total tasks",
      "dashboard.inProgress": "In progress",
      "dashboard.completed": "Completed",
      "dashboard.composer": "Task composer",
      "dashboard.formTitle": "Add or update a task",
      "dashboard.formCopy": "Use the form to create a task, then move it forward with visible action buttons.",
      "dashboard.taskTitle": "Task title",
      "dashboard.taskTitlePlaceholder": "Prepare release notes",
      "dashboard.details": "Details",
      "dashboard.detailsPlaceholder": "Add a short note about what needs to happen next.",
      "dashboard.status": "Status",
      "dashboard.priority": "Priority",
      "dashboard.ownerField": "Owner",
      "dashboard.ownerPlaceholder": "Member C",
      "dashboard.dueDate": "Due date",
      "dashboard.saveTask": "Save task",
      "dashboard.updateTask": "Update task",
      "dashboard.clearForm": "Clear form",
      "dashboard.todo": "To do",
      "dashboard.doing": "In progress",
      "dashboard.done": "Completed",
      "dashboard.priority.high": "High",
      "dashboard.priority.medium": "Medium",
      "dashboard.priority.low": "Low",
      "dashboard.noDetails": "No details added yet.",
      "dashboard.owner": "Owner",
      "dashboard.due": "Due",
      "dashboard.edit": "Edit",
      "dashboard.start": "Start",
      "dashboard.complete": "Complete",
      "dashboard.reset": "Reset",
      "dashboard.delete": "Delete",
      "dashboard.taskLoaded": "Task loaded for editing.",
      "dashboard.taskSaved": "Task saved successfully.",
      "dashboard.taskUpdated": "Task updated successfully.",
      "dashboard.taskDeleted": "Task deleted successfully.",
      "dashboard.taskMovedDoing": "Task moved to In progress.",
      "dashboard.taskMovedDone": "Task marked as completed.",
      "dashboard.taskMovedTodo": "Task returned to To do.",
      "dashboard.formInvalid": "Please complete the required task fields before saving.",
      "dashboard.formCleared": "Form cleared.",
      "dashboard.emptyState": "No tasks in this stage yet."
    },
    zh: {
      "document.home": "Taskify",
      "document.signup": "注册",
      "document.dashboard": "仪表盘",
      "lang.en": "EN",
      "lang.zh": "中文",
      "nav.features": "功能",
      "nav.templates": "模板",
      "nav.forTeams": "团队方案",
      "nav.resources": "资源",
      "nav.pricing": "价格",
      "nav.signUp": "注册",
      "nav.logIn": "登录",
      "hero.heading": "一个应用替代所有任务工具",
      "hero.email": "输入你的邮箱地址",
      "hero.cta": "立即开始",
      "feature.title": "简单顺手，却足够强大的任务管理",
      "feature.copy": "把工作、学习和生活安排到一个地方，不再被杂乱流程拖慢节奏。",
      "feature.card1.title": "随时随地跟着你",
      "feature.card1.text": "在任意设备上使用 Taskify，让待办始终触手可及。",
      "feature.card1.cta": "下载应用",
      "feature.card2.title": "打造适合你的流程",
      "feature.card2.text": "通过筛选、标签、优先级和简洁视图来定制任务管理。",
      "feature.card2.cta": "查看全部功能",
      "feature.card3.title": "建立更稳的习惯",
      "feature.card3.text": "用轻量规划保持专注，让效率提升更自然。",
      "feature.card3.cta": "开始测试",
      "feature.card4.title": "从模板快速起步",
      "feature.card4.text": "直接套用适合团队协作、学习计划和个人目标的任务布局。",
      "feature.card4.cta": "使用模板",
      "feature.card5.title": "连接常用工具",
      "feature.card5.text": "把 Taskify 与日历和团队常用应用联动起来。",
      "feature.card5.cta": "安装集成",
      "achievements.title": "值得长期依赖的任务管理器",
      "achievements.copy": "Taskify 用更清晰、更稳定的流程帮助团队整理项目。",
      "achievements.stat1": "应用下载量",
      "achievements.stat2": "完成任务数",
      "achievements.stat3": "合作院校",
      "achievements.stat4": "专业版用户",
      "footer.tagline": "加入数百万用户，一起用 Taskify 管理工作与生活。",
      "footer.features": "功能",
      "footer.resources": "资源",
      "footer.company": "公司",
      "footer.howItWorks": "工作原理",
      "footer.forTeams": "团队方案",
      "footer.pricing": "价格",
      "footer.templates": "模板",
      "footer.downloadApps": "下载应用",
      "footer.helpCenter": "帮助中心",
      "footer.productivityMethods": "效率方法",
      "footer.referFriend": "邀请好友",
      "footer.integrations": "集成",
      "footer.channelPartners": "渠道合作",
      "footer.developerApi": "开发者 API",
      "footer.status": "系统状态",
      "footer.about": "关于我们",
      "footer.hiring": "加入我们",
      "footer.blog": "博客",
      "footer.press": "媒体",
      "footer.security": "安全",
      "footer.privacy": "隐私",
      "footer.terms": "条款",
      "signup.title": "注册",
      "signup.username": "用户名",
      "signup.email": "邮箱",
      "signup.password": "密码",
      "signup.placeholder.username": "用户名",
      "signup.placeholder.email": "邮箱",
      "signup.placeholder.password": "密码",
      "signup.submit": "注册",
      "login.title": "登录",
      "login.email": "邮箱",
      "login.password": "密码",
      "login.placeholder.email": "输入你的邮箱",
      "login.placeholder.password": "输入密码",
      "login.submit": "登录",
      "dashboard.search": "搜索",
      "dashboard.overview": "概览",
      "dashboard.stats": "统计",
      "dashboard.sidebarProjects": "项目",
      "dashboard.chat": "聊天",
      "dashboard.calendar": "日历",
      "dashboard.settings": "设置",
      "dashboard.profile": "个人资料",
      "dashboard.logout": "退出登录",
      "dashboard.user": "伏地魔大人",
      "dashboard.kicker": "任务看板",
      "dashboard.projects": "项目",
      "dashboard.copy": "每次任务更新都能获得清晰反馈与即时状态变化。",
      "dashboard.workspaceReady": "工作区已就绪，任务操作会即时更新看板。",
      "dashboard.totalTasks": "任务总数",
      "dashboard.inProgress": "进行中",
      "dashboard.completed": "已完成",
      "dashboard.composer": "任务编辑器",
      "dashboard.formTitle": "新增或更新任务",
      "dashboard.formCopy": "先用表单创建任务，再通过可见操作按钮推进任务状态。",
      "dashboard.taskTitle": "任务标题",
      "dashboard.taskTitlePlaceholder": "准备版本发布说明",
      "dashboard.details": "详情",
      "dashboard.detailsPlaceholder": "补充接下来需要完成的简短说明。",
      "dashboard.status": "状态",
      "dashboard.priority": "优先级",
      "dashboard.ownerField": "负责人",
      "dashboard.ownerPlaceholder": "成员 C",
      "dashboard.dueDate": "截止日期",
      "dashboard.saveTask": "保存任务",
      "dashboard.updateTask": "更新任务",
      "dashboard.clearForm": "清空表单",
      "dashboard.todo": "待处理",
      "dashboard.doing": "进行中",
      "dashboard.done": "已完成",
      "dashboard.priority.high": "高",
      "dashboard.priority.medium": "中",
      "dashboard.priority.low": "低",
      "dashboard.noDetails": "暂未添加任务详情。",
      "dashboard.owner": "负责人",
      "dashboard.due": "截止",
      "dashboard.edit": "编辑",
      "dashboard.start": "开始",
      "dashboard.complete": "完成",
      "dashboard.reset": "重置",
      "dashboard.delete": "删除",
      "dashboard.taskLoaded": "任务已载入，可继续编辑。",
      "dashboard.taskSaved": "任务保存成功。",
      "dashboard.taskUpdated": "任务更新成功。",
      "dashboard.taskDeleted": "任务删除成功。",
      "dashboard.taskMovedDoing": "任务已移动到进行中。",
      "dashboard.taskMovedDone": "任务已标记为完成。",
      "dashboard.taskMovedTodo": "任务已返回待处理。",
      "dashboard.formInvalid": "请先完成必填任务字段再保存。",
      "dashboard.formCleared": "表单已清空。",
      "dashboard.emptyState": "这个阶段还没有任务。"
    }
  };

  let currentLanguage = localStorage.getItem(STORAGE_KEY) || "en";

  function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
  }

  function updateToggleButtons() {
    document.querySelectorAll("[data-lang-value]").forEach((button) => {
      const isActive = button.getAttribute("data-lang-value") === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
    });

    document.querySelectorAll("[data-i18n-value]").forEach((node) => {
      node.value = t(node.getAttribute("data-i18n-value"));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria-label")));
    });

    const titleNode = document.querySelector("[data-i18n-document-title]");
    if (titleNode) {
      document.title = t(titleNode.getAttribute("data-i18n-document-title"));
    }

    updateToggleButtons();
  }

  function setLanguage(language) {
    currentLanguage = language === "zh" ? "zh" : "en";
    localStorage.setItem(STORAGE_KEY, currentLanguage);
    applyTranslations();
    window.dispatchEvent(new CustomEvent("taskify:languagechange", { detail: { language: currentLanguage } }));
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang-value]");
    if (!button) {
      return;
    }

    setLanguage(button.getAttribute("data-lang-value"));
  });

  window.TaskifyI18n = {
    applyTranslations,
    getLanguage: () => currentLanguage,
    setLanguage,
    t,
  };

  applyTranslations();
})();
