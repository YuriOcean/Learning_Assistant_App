一、项目概述 
本项目旨在开发一个学习助手类微信小程序，主要功能包括课程表展示（支持从学校
网站爬取和自定义导入）、待办事项管理、用户个人信息管理以及微信登录等功能。 
二、项目组成员及分工 
1. 项目经理 - 负责整体项目进度管理 - 协调各部门工作 - 每周进度汇报 - 需求文档维护 
2. 程序部（后端） - 后端开发（3人） - 杨雨晨：负责用户认证系统（微信登录、JWT无感刷新） - 伍紫涵：负责课程表爬取和数据接口 - 杨恩睿：负责待办事项和日程管理接口  
3. 程序部（前端-小程序） - 前端开发（2人） - 周唯：负责课程表模块和基础框架 - 于琦珑：负责待办事项模块和用户信息模块 
4. UI 部 - UI 设计（1人） - 于翔：负责整体UI设计和风格确定 
负责具体页面设计和交互原型 
5. Web 部（3人） 
刘翼晨、王华卿、孟开颜 - 如果项目需要配套Web端 - 负责Web端适配和功能实现 
三、项目时间计划 
第1周：项目准备阶段 
项目经理创建GitHub仓库 
初始化项目结构 
设置分支策略（main/dev/feature分支） 
配置.gitignore 
添加README.md和CONTRIBUTING.md 
项目经理细化需求文档 
将需求分解为具体功能点 
明确优先级 
前后端接口讨论 
制定API规范 
确定数据格式 
使用APIfox创建接口文档 
UI 部开始设计初稿 
确定整体风格和配色 
设计主要页面框架 
第2-3周：基础开发阶段 
后端： 
搭建基础框架 
实现微信登录接口 
JWT 认证系统开发 
前端： 
搭建小程序基础框架 
封装uni.request 组件 
配置路由和导航 - [x] UI 部： - 完成所有页面设计稿 - 提供设计规范文档 - 切图并交付前端 
第4-5周：核心功能开发 
后端： 
完成课程表爬取功能 
实现待办事项CRUD接口 
开发用户信息管理接口 
前端： 
实现课程表展示模块 
开发待办事项界面 
完成用户信息页面 
实现基础手势操作 
第6周：联调测试阶段 
- [x] 前后端联调 
测试所有接口 
修复发现的问题 
UI 验收 
检查UI实现效果 
调整细节差异 
测试 
单元测试 
集成测试 
用户体验测试 
第7周：部署上线阶段 
后端部署 
配置生产环境 
关闭DEBUG模式 
处理跨域和CSRF问题 
小程序提交审核 
准备推广材料（如需推广） 
四、GitHub仓库管理规范 
1. **分支策略**： - `main`：稳定版本，仅用于发布 - `dev`：开发分支，集成各feature分支 - `feature/xxx`：功能开发分支 
2. **提交规范**： - 前缀说明： - feat: 新功能 - fix: bug 修复 - docs: 文档变更 - style: 代码格式 - refactor: 代码重构 - test: 测试相关 - chore: 构建或辅助工具变更 
3. **Pull Request**： - 所有代码必须通过PR合并 - 至少需要1人review - 通过CI测试后才能合并 
五、接口管理 
1. 使用APIfox 管理所有API接口 
2. 接口文档包含： - 请求方法 - URL - 请求参数 - 响应格式 - 错误码 - 示例 
七、风险管理 
1. **进度延迟**： - 提前识别关键路径 - 预留缓冲时间 - 必要时调整功能优先级 
六、交付 
1. 可运行的小程序 
2. 完整的源代码 
3. 接口文档 
4. 用户手册 
5. 项目总结报告 
