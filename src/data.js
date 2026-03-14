// ================= 数据管理模块 =================
const ClassroomData = {
    // 默认数据模板
    DEFAULT_STAGES_TEMPLATE: {
        1: { name: '蛋', exp: 0 },
        2: { name: '幼年期', exp: 10 },
        3: { name: '成长期', exp: 30 },
        4: { name: '成熟期', exp: 60 },
        5: { name: '完全体', exp: 100 },
        6: { name: '究极体', exp: 200 },
        7: { name: '传说体', exp: 300 },
        8: { name: '神话体', exp: 500 }
    },
    
    // 创建默认数据
    createDefaultData() {
        const baseSpecies = { id: 'species_default_01', name: '基础精灵系', desc: '默认的魔法宠物分支', stages: JSON.parse(JSON.stringify(this.DEFAULT_STAGES_TEMPLATE)) };
        const folderSpecies = ClassroomUtils.generatePetSpeciesFromFolder();
        return {
            classes: [{ id: 'class_default', name: '默认班级', students: [], groups: [] }],
            currentClassId: 'class_default',
            petSpecies: [baseSpecies, ...folderSpecies],
            rules: {
                add: [
                    { id: 'a1', name: '积极发言', score: 2, dim: 'wisdom' },
                    { id: 'a2', name: '完成作业', score: 3, dim: 'discipline' },
                    { id: 'a3', name: '帮助同学', score: 2, dim: 'kindness' },
                    { id: 'a4', name: '课堂表现优秀', score: 4, dim: 'energy' },
                    { id: 'a5', name: '常规表扬', score: 1, dim: 'general' },
                    { id: 'a6', name: '考试成绩优异', score: 5, dim: 'wisdom' },
                    { id: 'a7', name: '遵守纪律', score: 2, dim: 'discipline' },
                    { id: 'a8', name: '积极参与活动', score: 3, dim: 'energy' }
                ],
                deduct: [
                    { id: 'd1', name: '迟到早退', score: -2, dim: 'discipline' },
                    { id: 'd2', name: '未交作业', score: -3, dim: 'discipline' },
                    { id: 'd3', name: '课堂违纪', score: -3, dim: 'energy' },
                    { id: 'd4', name: '与同学争吵', score: -2, dim: 'kindness' },
                    { id: 'd5', name: '不认真听讲', score: -2, dim: 'wisdom' }
                ]
            },
            store: [
                { id: 's1', name: '免写作业券', cost: 50 },
                { id: 's2', name: '课堂小奖励', cost: 20 },
                { id: 's3', name: '优先选择权', cost: 30 },
                { id: 's4', name: '学习小助手', cost: 40 },
                { id: 's5', name: '课间休息特权', cost: 25 },
                { id: 's6', name: '作业延期券', cost: 35 }
            ],
            thresholds: { stage2: 11, stage3: 31, stage4: 51, stage5: 101, stage6: 201, stage7: 301, stage8: 401 },
            homeworks: {}
        };
    },
    
    // 验证数据
    validateData(data) {
        if (!data) return { valid: false, error: '数据为空' };
        
        if (!data.classes || !Array.isArray(data.classes)) {
            return { valid: false, error: '班级数据格式错误' };
        }
        
        for (let i = 0; i < data.classes.length; i++) {
            const cls = data.classes[i];
            if (!cls.id || !cls.name) {
                return { valid: false, error: `班级 ${i + 1} 缺少必要字段` };
            }
            
            if (cls.students && Array.isArray(cls.students)) {
                for (let j = 0; j < cls.students.length; j++) {
                    const student = cls.students[j];
                    if (!student.id || !student.name) {
                        return { valid: false, error: `班级 ${cls.name} 的学生 ${j + 1} 缺少必要字段` };
                    }
                    
                    if (typeof student.exp !== 'number') student.exp = 0;
                    if (typeof student.avail !== 'number') student.avail = 0;
                    
                    if (!student.dimensions) {
                        student.dimensions = { kindness: 0, discipline: 0, energy: 0, wisdom: 0 };
                    }
                }
            }
        }
        
        if (!data.petSpecies || !Array.isArray(data.petSpecies)) {
            return { valid: false, error: '宠物种类数据格式错误' };
        }
        
        return { valid: true };
    },
    
    // 修复数据
    repairData(data) {
        if (!data) return null;
        
        if (!data.classes) data.classes = [];
        if (!data.currentClassId && data.classes.length > 0) {
            data.currentClassId = data.classes[0].id;
        }
        if (!data.petSpecies) data.petSpecies = [];
        if (!data.rules) data.rules = { add: [], deduct: [] };
        if (!data.store) data.store = [];
        if (!data.thresholds) data.thresholds = {};
        if (!data.homeworks) data.homeworks = {};
        
        data.classes.forEach(cls => {
            if (!cls.students) cls.students = [];
            if (!cls.groups) cls.groups = [];
            
            cls.students.forEach(student => {
                if (typeof student.exp !== 'number') student.exp = 0;
                if (typeof student.avail !== 'number') student.avail = 0;
                if (!student.dimensions) {
                    student.dimensions = { kindness: 0, discipline: 0, energy: 0, wisdom: 0 };
                }
                if (!student.history) student.history = [];
            });
        });
        
        return data;
    }
};
