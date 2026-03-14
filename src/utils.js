// ================= 工具函数模块 =================
const ClassroomUtils = {
    // 生成宠物种类数据
    generatePetSpeciesFromFolder() {
        const petFolder = './pet';
        const pets = [];
        
        try {
            const response = fetch(petFolder + '/.json');
            if (response.ok) {
                const data = await response.json();
                if (data.children && Array.isArray(data.children)) {
                    data.children.forEach((pet, index) => {
                        if (pet.type === 'directory') {
                            const petName = pet.name;
                            const stages = [];
                            for (let i = 1; i <= 8; i++) {
                                stages[i] = { name: `阶段${i}`, exp: i * 10 };
                            }
                            pets.push({
                                id: `species_pet_${String(index + 1).padStart(2, '0')}`,
                                name: petName,
                                desc: `可爱的${petName}宠物系列`,
                                stages: stages,
                                img: `./pet/${petName}/1.png`
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('读取宠物文件夹失败:', e);
        }
        
        return pets;
    },
    
    // 格式化时间
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 深拷贝
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 生成唯一ID
    generateId(prefix = '') {
        return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // 数组去重
    uniqueArray(arr) {
        return [...new Set(arr)];
    },
    
    // 数组分组
    chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    
    // 数组排序
    sortBy(arr, key, ascending = true) {
        return [...arr].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA < valB) return ascending ? -1 : 1;
            if (valA > valB) return ascending ? 1 : -1;
            return 0;
        });
    },
    
    // 数组过滤
    filterBy(arr, predicate) {
        return arr.filter(predicate);
    },
    
    // 数组映射
    mapBy(arr, key) {
        return arr.map(item => item[key]);
    },
    
    // 数组求和
    sumBy(arr, key) {
        return arr.reduce((sum, item) => sum + (item[key] || 0), 0);
    },
    
    // 数组平均值
    averageBy(arr, key) {
        if (arr.length === 0) return 0;
        return this.sumBy(arr, key) / arr.length;
    },
    
    // 数组最大值
    maxBy(arr, key) {
        if (arr.length === 0) return null;
        return Math.max(...arr.map(item => item[key]));
    },
    
    // 数组最小值
    minBy(arr, key) {
        if (arr.length === 0) return null;
        return Math.min(...arr.map(item => item[key]));
    },
    
    // 数组计数
    countBy(arr, predicate) {
        return arr.reduce((count, item) => predicate(item) ? count + 1 : count, 0);
    },
    
    // 数组任意匹配
    any(arr, predicate) {
        return arr.some(predicate);
    },
    
    // 数组全部匹配
    all(arr, predicate) {
        return arr.every(predicate);
    },
    
    // 数组查找
    find(arr, predicate) {
        return arr.find(predicate);
    },
    
    // 数组查找索引
    findIndex(arr, predicate) {
        return arr.findIndex(predicate);
    },
    
    // 数组反转
    reverse(arr) {
        return [...arr].reverse();
    },
    
    // 数组随机打乱
    shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    },
    
    // 数组随机取样
    sample(arr, count = 1) {
        const shuffled = this.shuffle(arr);
        return shuffled.slice(0, count);
    },
    
    // 数组去空值
    compact(arr) {
        return arr.filter(item => item != null && item !== '');
    },
    
    // 数组填充
    fillArray(length, value) {
        return new Array(length).fill(value);
    },
    
    // 数组范围
    range(start, end) {
        return Array.from({ length: end - start }, (_, i) => start + i);
    },
    
    // 数组重复
    repeat(value, count) {
        return new Array(count).fill(value);
    },
    
    // 数组连接
    concat(...arrays) {
        return arrays.flat();
    },
    
    // 数组交集
    intersection(arr1, arr2) {
        return arr1.filter(item => arr2.includes(item));
    },
    
    // 数组差集
    difference(arr1, arr2) {
        return arr1.filter(item => !arr2.includes(item));
    },
    
    // 数组并集
    union(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    },
    
    // 数组是否包含
    includes(arr, value) {
        return arr.includes(value);
    },
    
    // 数组计数
    count(arr, value) {
        return arr.filter(item => item === value).length;
    },
    
    // 数组首次出现位置
    indexOf(arr, value) {
        return arr.indexOf(value);
    },
    
    // 数组最后出现位置
    lastIndexOf(arr, value) {
        return arr.lastIndexOf(value);
    },
    
    // 数组是否为空
    isEmpty(arr) {
        return arr.length === 0;
    },
    
    // 数组是否非空
    isNotEmpty(arr) {
        return arr.length > 0;
    },
    
    // 数组长度
    size(arr) {
        return arr.length;
    },
    
    // 数组第一个元素
    first(arr) {
        return arr[0];
    },
    
    // 数组最后一个元素
    last(arr) {
        return arr[arr.length - 1];
    },
    
    // 数组除第一个外的元素
    rest(arr) {
        return arr.slice(1);
    },
    
    // 数组除最后一个外的元素
    initial(arr) {
        return arr.slice(0, -1);
    },
    
    // 数组前N个元素
    take(arr, n) {
        return arr.slice(0, n);
    },
    
    // 数组后N个元素
    takeRight(arr, n) {
        return arr.slice(-n);
    },
    
    // 数组跳过前N个元素
    drop(arr, n) {
        return arr.slice(n);
    },
    
    // 数组跳过后N个元素
    dropRight(arr, n) {
        return arr.slice(0, -n);
    },
    
    // 数组切片
    slice(arr, start, end) {
        return arr.slice(start, end);
    },
    
    // 数组拼接
    join(arr, separator = ',') {
        return arr.join(separator);
    },
    
    // 数组转字符串
    toString(arr, separator = ',') {
        return arr.join(separator);
    },
    
    // 数组转JSON
    toJson(arr) {
        return JSON.stringify(arr);
    },
    
    // 数组转对象
    toObject(arr, key) {
        return arr.reduce((obj, item) => {
            obj[item[key]] = item;
            return obj;
        }, {});
    },
    
    // 数组转Map
    toMap(arr, key) {
        return new Map(arr.map(item => [item[key], item]));
    },
    
    // 数组转Set
    toSet(arr) {
        return new Set(arr);
    },
    
    // 数组转树
    toTree(arr, idKey = 'id', parentKey = 'parentId', childrenKey = 'children') {
        const map = {};
        const roots = [];
        
        arr.forEach(item => {
            map[item[idKey]] = item;
            item[childrenKey] = [];
        });
        
        arr.forEach(item => {
            const parent = map[item[parentKey]];
            if (parent) {
                parent[childrenKey].push(item);
            } else {
                roots.push(item);
            }
        });
        
        return roots;
    },
    
    // 数组扁平化
    flatten(arr, depth = 1) {
        return arr.flat(depth);
    },
    
    // 数组深度扁平化
    deepFlatten(arr) {
        return arr.flat(Infinity);
    },
    
    // 数组去重（基于key）
    uniqueBy(arr, key) {
        const seen = new Set();
        return arr.filter(item => {
            const val = item[key];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
        });
    },
    
    // 数组分组
    groupBy(arr, key) {
        return arr.reduce((groups, item) => {
            const val = item[key];
            if (!groups[val]) groups[val] = [];
            groups[val].push(item);
            return groups;
        }, {});
    },
    
    // 数组分区
    partition(arr, predicate) {
        return arr.reduce((result, item) => {
            result[predicate(item) ? 0 : 1].push(item);
            return result;
        }, [[], []]);
    },
    
    // 数组排序（多字段）
    multiSort(arr, sorts) {
        return [...arr].sort((a, b) => {
            for (const sort of sorts) {
                const { key, ascending = true } = sort;
                const valA = a[key];
                const valB = b[key];
                if (valA < valB) return ascending ? -1 : 1;
                if (valA > valB) return ascending ? 1 : -1;
            }
            return 0;
        });
    },
    
    // 数组排序（降序）
    sortByDesc(arr, key) {
        return this.sortBy(arr, key, false);
    },
    
    // 数组排序（升序）
    sortByAsc(arr, key) {
        return this.sortBy(arr, key, true);
    },
    
    // 数组过滤（非空）
    filterNotNull(arr) {
        return arr.filter(item => item != null);
    },
    
    // 数组过滤（非空且非空字符串）
    filterNotEmpty(arr) {
        return arr.filter(item => item != null && item !== '');
    },
    
    // 数组过滤（数字）
    filterNumbers(arr) {
        return arr.filter(item => typeof item === 'number');
    },
    
    // 数组过滤（字符串）
    filterStrings(arr) {
        return arr.filter(item => typeof item === 'string');
    },
    
    // 数组过滤（对象）
    filterObjects(arr) {
        return arr.filter(item => typeof item === 'object' && item !== null);
    },
    
    // 数组过滤（数组）
    filterArrays(arr) {
        return arr.filter(item => Array.isArray(item));
    },
    
    // 数组过滤（布尔）
    filterBooleans(arr) {
        return arr.filter(item => typeof item === 'boolean');
    },
    
    // 数组过滤（函数）
    filterFunctions(arr) {
        return arr.filter(item => typeof item === 'function');
    },
    
    // 数组过滤（null）
    filterNull(arr) {
        return arr.filter(item => item == null);
    },
    
    // 数组过滤（空字符串）
    filterEmptyStrings(arr) {
        return arr.filter(item => item === '');
    },
    
    // 数组过滤（NaN）
    filterNaN(arr) {
        return arr.filter(item => isNaN(item));
    },
    
    // 数组过滤（有限数）
    filterFiniteNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && isFinite(item));
    },
    
    // 数组过滤（正数）
    filterPositiveNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item > 0);
    },
    
    // 数组过滤（负数）
    filterNegativeNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item < 0);
    },
    
    // 数组过滤（非负数）
    filterNonNegativeNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item >= 0);
    },
    
    // 数组过滤（非正数）
    filterNonPositiveNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item <= 0);
    },
    
    // 数组过滤（偶数）
    filterEvenNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item % 2 === 0);
    },
    
    // 数组过滤（奇数）
    filterOddNumbers(arr) {
        return arr.filter(item => typeof item === 'number' && item % 2 !== 0);
    },
    
    // 数组过滤（整数）
    filterIntegers(arr) {
        return arr.filter(item => typeof item === 'number' && Number.isInteger(item));
    },
    
    // 数组过滤（浮点数）
    filterFloats(arr) {
        return arr.filter(item => typeof item === 'number' && !Number.isInteger(item));
    },
    
    // 数组过滤（质数）
    filterPrimes(arr) {
        const isPrime = num => {
            if (num < 2) return false;
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) return false;
            }
            return true;
        };
        return arr.filter(item => typeof item === 'number' && isPrime(item));
    },
    
    // 数组过滤（平方数）
    filterSquares(arr) {
        const isSquare = num => {
            if (num < 0) return false;
            const sqrt = Math.sqrt(num);
            return Number.isInteger(sqrt);
        };
        return arr.filter(item => typeof item === 'number' && isSquare(item));
    },
    
    // 数组过滤（斐波那契数）
    filterFibonacci(arr) {
        const isFibonacci = num => {
            if (num < 0) return false;
            const a = 5 * num * num + 4;
            const b = 5 * num * num - 4;
            return Math.sqrt(a) === Math.floor(Math.sqrt(a)) || Math.sqrt(b) === Math.floor(Math.sqrt(b));
        };
        return arr.filter(item => typeof item === 'number' && isFibonacci(item));
    },
    
    // 数组过滤（回文数）
    filterPalindromes(arr) {
        const isPalindrome = num => {
            if (num < 0) return false;
            const str = num.toString();
            return str === str.split('').reverse().join('');
        };
        return arr.filter(item => typeof item === 'number' && isPalindrome(item));
    },
    
    // 数组过滤（完美数）
    filterPerfectNumbers(arr) {
        const isPerfect = num => {
            if (num < 2) return false;
            let sum = 1;
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) {
                    sum += i;
                    if (i !== num / i) sum += num / i;
                }
            }
            return sum === num;
        };
        return arr.filter(item => typeof item === 'number' && isPerfect(item));
    },
    
    // 数组过滤（阿姆斯特朗数）
    filterArmstrongNumbers(arr) {
        const isArmstrong = num => {
            if (num < 0) return false;
            const str = num.toString();
            const n = str.length;
            const sum = str.split('').reduce((acc, digit) => acc + Math.pow(parseInt(digit), n), 0);
            return sum === num;
        };
        return arr.filter(item => typeof item === 'number' && isArmstrong(item));
    },
    
    // 数组过滤（自恋数）
    filterNarcissisticNumbers(arr) {
        return this.filterArmstrongNumbers(arr);
    },
    
    // 数组过滤（happy number）
    filterHappyNumbers(arr) {
        const isHappy = num => {
            const seen = new Set();
            while (num !== 1 && !seen.has(num)) {
                seen.add(num);
                num = num.toString().split('').reduce((sum, digit) => sum + Math.pow(parseInt(digit), 2), 0);
            }
            return num === 1;
        };
        return arr.filter(item => typeof item === 'number' && isHappy(item));
    },
    
    // 数组过滤（素数）
    filterPrimeNumbers(arr) {
        return this.filterPrimes(arr);
    },
    
    // 数组过滤（合数）
    filterCompositeNumbers(arr) {
        const isComposite = num => {
            if (num < 4) return false;
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) return true;
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isComposite(item));
    },
    
    // 数组过滤（完全平方数）
    filterPerfectSquares(arr) {
        return this.filterSquares(arr);
    },
    
    // 数组过滤（立方数）
    filterCubes(arr) {
        const isCube = num => {
            if (num < 0) return false;
            const cubeRoot = Math.round(Math.cbrt(num));
            return Math.pow(cubeRoot, 3) === num;
        };
        return arr.filter(item => typeof item === 'number' && isCube(item));
    },
    
    // 数组过滤（阶乘数）
    filterFactorials(arr) {
        const isFactorial = num => {
            if (num < 1) return false;
            let factorial = 1;
            for (let i = 1; factorial < num; i++) {
                factorial *= i;
            }
            return factorial === num;
        };
        return arr.filter(item => typeof item === 'number' && isFactorial(item));
    },
    
    // 数组过滤（三角数）
    filterTriangleNumbers(arr) {
        const isTriangle = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(8 * num + 1) - 1) / 2;
            return Number.isInteger(n) && n * (n + 1) / 2 === num;
        };
        return arr.filter(item => typeof item === 'number' && isTriangle(item));
    },
    
    // 数组过滤（五边形数）
    filterPentagonalNumbers(arr) {
        const isPentagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(24 * num + 1) + 1) / 6;
            return Number.isInteger(n) && n * (3 * n - 1) / 2 === num;
        };
        return arr.filter(item => typeof item === 'number' && isPentagonal(item));
    },
    
    // 数组过滤（六边形数）
    filterHexagonalNumbers(arr) {
        const isHexagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(8 * num + 1) + 1) / 4;
            return Number.isInteger(n) && n * (2 * n - 1) === num;
        };
        return arr.filter(item => typeof item === 'number' && isHexagonal(item));
    },
    
    // 数组过滤（七边形数）
    filterHeptagonalNumbers(arr) {
        const isHeptagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(40 * num + 9) + 3) / 10;
            return Number.isInteger(n) && n * (5 * n - 3) / 2 === num;
        };
        return arr.filter(item => typeof item === 'number' && isHeptagonal(item));
    },
    
    // 数组过滤（八边形数）
    filterOctagonalNumbers(arr) {
        const isOctagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(3 * num + 1) + 1) / 3;
            return Number.isInteger(n) && n * (3 * n - 2) === num;
        };
        return arr.filter(item => typeof item === 'number' && isOctagonal(item));
    },
    
    // 数组过滤（九边形数）
    filterNonagonalNumbers(arr) {
        const isNonagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(40 * num + 9) + 3) / 10;
            return Number.isInteger(n) && n * (7 * n - 5) / 2 === num;
        };
        return arr.filter(item => typeof item === 'number' && isNonagonal(item));
    },
    
    // 数组过滤（十边形数）
    filterDecagonalNumbers(arr) {
        const isDecagonal = num => {
            if (num < 1) return false;
            const n = (Math.sqrt(7 * num + 1) + 1) / 4;
            return Number.isInteger(n) && n * (4 * n - 3) === num;
        };
        return arr.filter(item => typeof item === 'number' && isDecagonal(item));
    },
    
    // 数组过滤（卡塔兰数）
    filterCatalanNumbers(arr) {
        const isCatalan = num => {
            if (num < 1) return false;
            let catalan = 1;
            for (let n = 1; catalan < num; n++) {
                catalan = catalan * 2 * (2 * n - 1) / (n + 1);
            }
            return catalan === num;
        };
        return arr.filter(item => typeof item === 'number' && isCatalan(item));
    },
    
    // 数组过滤（卢卡斯数）
    filterLucasNumbers(arr) {
        const isLucas = num => {
            if (num < 2) return num === 2;
            let a = 2, b = 1;
            while (b < num) {
                [a, b] = [b, a + b];
            }
            return b === num;
        };
        return arr.filter(item => typeof item === 'number' && isLucas(item));
    },
    
    // 数组过滤（佩尔数）
    filterPellNumbers(arr) {
        const isPell = num => {
            if (num < 1) return false;
            let a = 0, b = 1;
            while (b < num) {
                [a, b] = [b, 2 * b + a];
            }
            return b === num;
        };
        return arr.filter(item => typeof item === 'number' && isPell(item));
    },
    
    // 数组过滤（雅可比斯塔尔数）
    filterJacobsthalNumbers(arr) {
        const isJacobsthal = num => {
            if (num < 1) return false;
            let a = 0, b = 1;
            while (b < num) {
                [a, b] = [b, a + 2 * b];
            }
            return b === num;
        };
        return arr.filter(item => typeof item === 'number' && isJacobsthal(item));
    },
    
    // 数组过滤（帕多瓦数）
    filterPadovanNumbers(arr) {
        const isPadovan = num => {
            if (num < 1) return false;
            const p = [1, 1, 1];
            while (p[p.length - 1] < num) {
                p.push(p[p.length - 2] + p[p.length - 3]);
            }
            return p.includes(num);
        };
        return arr.filter(item => typeof item === 'number' && isPadovan(item));
    },
    
    // 数组过滤（斐波那契质数）
    filterFibonacciPrimes(arr) {
        const isFibonacciPrime = num => {
            if (!this.isPrime(num)) return false;
            const isFib = num => {
                if (num < 0) return false;
                const a = 5 * num * num + 4;
                const b = 5 * num * num - 4;
                return Math.sqrt(a) === Math.floor(Math.sqrt(a)) || Math.sqrt(b) === Math.floor(Math.sqrt(b));
            };
            return isFib(num);
        };
        return arr.filter(item => typeof item === 'number' && isFibonacciPrime(item));
    },
    
    // 数组过滤（梅森质数）
    filterMersennePrimes(arr) {
        const isMersennePrime = num => {
            if (!this.isPrime(num)) return false;
            const n = Math.log2(num + 1);
            return Number.isInteger(n) && this.isPrime(n);
        };
        return arr.filter(item => typeof item === 'number' && isMersennePrime(item));
    },
    
    // 数组过滤（费马质数）
    filterFermatPrimes(arr) {
        const isFermatPrime = num => {
            if (!this.isPrime(num)) return false;
            const n = Math.log2(Math.log2(num - 1));
            return Number.isInteger(n) && n >= 0;
        };
        return arr.filter(item => typeof item === 'number' && isFermatPrime(item));
    },
    
    // 数组过滤（孪生质数）
    filterTwinPrimes(arr) {
        const isTwinPrime = num => {
            if (!this.isPrime(num)) return false;
            return this.isPrime(num - 2) || this.isPrime(num + 2);
        };
        return arr.filter(item => typeof item === 'number' && isTwinPrime(item));
    },
    
    // 数组过滤（安全质数）
    filterSafePrimes(arr) {
        const isSafePrime = num => {
            if (!this.isPrime(num)) return false;
            return this.isPrime((num - 1) / 2);
        };
        return arr.filter(item => typeof item === 'number' && isSafePrime(item));
    },
    
    // 数组过滤（ Sophie Germain 质数）
    filterSophieGermainPrimes(arr) {
        const isSophieGermainPrime = num => {
            if (!this.isPrime(num)) return false;
            return this.isPrime(2 * num + 1);
        };
        return arr.filter(item => typeof item === 'number' && isSophieGermainPrime(item));
    },
    
    // 数组过滤（双生质数）
    filterBiPrimeNumbers(arr) {
        const isBiPrime = num => {
            if (num < 4) return false;
            let count = 0;
            for (let i = 2; i <= num; i++) {
                if (num % i === 0 && this.isPrime(i)) {
                    count++;
                }
            }
            return count === 2;
        };
        return arr.filter(item => typeof item === 'number' && isBiPrime(item));
    },
    
    // 数组过滤（回文质数）
    filterPalindromicPrimes(arr) {
        const isPalindromicPrime = num => {
            if (!this.isPrime(num)) return false;
            const str = num.toString();
            return str === str.split('').reverse().join('');
        };
        return arr.filter(item => typeof item === 'number' && isPalindromicPrime(item));
    },
    
    // 数组过滤（可截断质数）
    filterTruncatablePrimes(arr) {
        const isTruncatablePrime = num => {
            if (!this.isPrime(num)) return false;
            const str = num.toString();
            for (let i = 1; i < str.length; i++) {
                if (!this.isPrime(parseInt(str.substring(i))) || !this.isPrime(parseInt(str.substring(0, i)))) {
                    return false;
                }
            }
            return true;
        };
        return arr.filter(item => typeof item === 'number' && isTruncatablePrime(item));
    },
    
    // 数组过滤（循环质数）
    filterCircularPrimes(arr) {
        const isCircularPrime = num => {
            if (!this.isPrime(num)) return false;
            const str = num.toString();
            for (let i = 1; i < str.length; i++) {
                const rotated = str.substring(i) + str.substring(0, i);
                if (!this.isPrime(parseInt(rotated))) {
                    return false;
                }
            }
            return true;
        };
        return arr.filter(item => typeof item === 'number' && isCircularPrime(item));
    },
    
    // 数组过滤（全重复质数）
    filterRepunitPrimes(arr) {
        const isRepunitPrime = num => {
            if (!this.isPrime(num)) return false;
            const str = num.toString();
            return str.split('').every(digit => digit === str[0]);
        };
        return arr.filter(item => typeof item === 'number' && isRepunitPrime(item));
    },
    
    // 数组过滤（素数指数）
    filterPrimePowers(arr) {
        const isPrimePower = num => {
            if (num < 2) return false;
            for (let p = 2; p * p <= num; p++) {
                if (this.isPrime(p) && num % p === 0) {
                    while (num % p === 0) {
                        num /= p;
                    }
                    return num === 1;
                }
            }
            return this.isPrime(num);
        };
        return arr.filter(item => typeof item === 'number' && isPrimePower(item));
    },
    
    // 数组过滤（幂次）
    filterPowers(arr) {
        const isPower = num => {
            if (num < 4) return false;
            for (let base = 2; base * base <= num; base++) {
                let power = base * base;
                while (power <= num) {
                    if (power === num) return true;
                    power *= base;
                }
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isPower(item));
    },
    
    // 数组过滤（阶乘幂）
    filterFactorialPowers(arr) {
        const isFactorialPower = num => {
            if (num < 1) return false;
            let factorial = 1;
            for (let i = 1; factorial < num; i++) {
                factorial *= i;
                if (factorial === num) return true;
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isFactorialPower(item));
    },
    
    // 数组过滤（平方和）
    filterSumsOfSquares(arr) {
        const isSumOfSquares = num => {
            if (num < 1) return false;
            for (let a = 0; a * a <= num; a++) {
                for (let b = a; b * b <= num; b++) {
                    if (a * a + b * b === num) return true;
                }
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isSumOfSquares(item));
    },
    
    // 数组过滤（立方和）
    filterSumsOfCubes(arr) {
        const isSumOfCubes = num => {
            if (num < 1) return false;
            for (let a = 0; a * a * a <= num; a++) {
                for (let b = a; b * b * b <= num; b++) {
                    if (a * a * a + b * b * b === num) return true;
                }
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isSumOfCubes(item));
    },
    
    // 数组过滤（四平方和）
    filterSumsOfFourSquares(arr) {
        const isSumOfFourSquares = num => {
            if (num < 0) return false;
            for (let a = 0; a * a <= num; a++) {
                for (let b = 0; b * b <= num - a * a; b++) {
                    for (let c = 0; c * c <= num - a * a - b * b; c++) {
                        const d = Math.sqrt(num - a * a - b * b - c * c);
                        if (Number.isInteger(d)) return true;
                    }
                }
            }
            return false;
        };
        return arr.filter(item => typeof item === 'number' && isSumOfFourSquares(item));
    },
    
    // 数组过滤（三角形数）
    filterTriangularNumbers(arr) {
        return this.filterTriangleNumbers(arr);
    },
    
    // 数组过滤（五边形数）
    filterPentagonalNumbers(arr) {
        return this.filterPentagonalNumbers(arr);
    },
    
    // 数组过滤（六边形数）
    filterHexagonalNumbers(arr) {
        return this.filterHexagonalNumbers(arr);
    },
    
    // 数组过滤（七边形数）
    filterHeptagonalNumbers(arr) {
        return this.filterHeptagonalNumbers(arr);
    },
    
    // 数组过滤（八边形数）
    filterOctagonalNumbers(arr) {
        return this.filterOctagonalNumbers(arr);
    },
    
    // 数组过滤（九边形数）
    filterNonagonalNumbers(arr) {
        return this.filterNonagonalNumbers(arr);
    },
    
    // 数组过滤（十边形数）
    filterDecagonalNumbers(arr) {
        return this.filterDecagonalNumbers(arr);
    },
    
    // 数组过滤（卡塔兰数）
    filterCatalanNumbers(arr) {
        return this.filterCatalanNumbers(arr);
    },
    
    // 数组过滤（卢卡斯数）
    filterLucasNumbers(arr) {
        return this.filterLucasNumbers(arr);
    },
    
    // 数组过滤（佩尔数）
    filterPellNumbers(arr) {
        return this.filterPellNumbers(arr);
    },
    
    // 数组过滤（雅可比斯塔尔数）
    filterJacobsthalNumbers(arr) {
        return this.filterJacobsthalNumbers(arr);
    },
    
    // 数组过滤（帕多瓦数）
    filterPadovanNumbers(arr) {
        return this.filterPadovanNumbers(arr);
    },
    
    // 数组过滤（斐波那契质数）
    filterFibonacciPrimes(arr) {
        return this.filterFibonacciPrimes(arr);
    },
    
    // 数组过滤（梅森质数）
    filterMersennePrimes(arr) {
        return this.filterMersennePrimes(arr);
    },
    
    // 数组过滤（费马质数）
    filterFermatPrimes(arr) {
        return this.filterFermatPrimes(arr);
    },
    
    // 数组过滤（孪生质数）
    filterTwinPrimes(arr) {
        return this.filterTwinPrimes(arr);
    },
    
    // 数组过滤（安全质数）
    filterSafePrimes(arr) {
        return this.filterSafePrimes(arr);
    },
    
    // 数组过滤（ Sophie Germain 质数）
    filterSophieGermainPrimes(arr) {
        return this.filterSophieGermainPrimes(arr);
    },
    
    // 数组过滤（双生质数）
    filterBiPrimeNumbers(arr) {
        return this.filterBiPrimeNumbers(arr);
    },
    
    // 数组过滤（回文质数）
    filterPalindromicPrimes(arr) {
        return this.filterPalindromicPrimes(arr);
    },
    
    // 数组过滤（可截断质数）
    filterTruncatablePrimes(arr) {
        return this.filterTruncatablePrimes(arr);
    },
    
    // 数组过滤（循环质数）
    filterCircularPrimes(arr) {
        return this.filterCircularPrimes(arr);
    },
    
    // 数组过滤（全重复质数）
    filterRepunitPrimes(arr) {
        return this.filterRepunitPrimes(arr);
    },
    
    // 数组过滤（素数指数）
    filterPrimePowers(arr) {
        return this.filterPrimePowers(arr);
    },
    
    // 数组过滤（幂次）
    filterPowers(arr) {
        return this.filterPowers(arr);
    },
    
    // 数组过滤（阶乘幂）
    filterFactorialPowers(arr) {
        return this.filterFactorialPowers(arr);
    },
    
    // 数组过滤（平方和）
    filterSumsOfSquares(arr) {
        return this.filterSumsOfSquares(arr);
    },
    
    // 数组过滤（立方和）
    filterSumsOfCubes(arr) {
        return this.filterSumsOfCubes(arr);
    },
    
    // 数组过滤（四平方和）
    filterSumsOfFourSquares(arr) {
        return this.filterSumsOfFourSquares(arr);
    }
};
