// 工具函数集合

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证密码强度
export function isValidPassword(password: string): boolean {
  // 至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// 格式化货币
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// 格式化百分比
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// 格式化日期
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// 格式化日期时间
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 生成随机ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 计算百分比变化
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// 验证股票代码格式
export function isValidStockSymbol(symbol: string): boolean {
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol);
}

// 验证价格格式
export function isValidPrice(price: number): boolean {
  return price > 0 && price <= 1000000; // 假设最大价格为100万
}

// 验证股票数量
export function isValidShares(shares: number): boolean {
  return Number.isInteger(shares) && shares > 0 && shares <= 1000000; // 假设最大数量为100万
}

// 深度克隆对象
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

// 分页工具
export function paginate<T>(array: T[], page: number, limit: number): {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  
  return {
    data,
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
  };
}

// 排序工具
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// 过滤工具
export function filterBy<T>(array: T[], filters: Partial<T>): T[] {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key as keyof T];
      const itemValue = item[key as keyof T];
      
      if (filterValue === undefined || filterValue === null) {
        return true;
      }
      
      if (typeof filterValue === 'string') {
        return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      
      return itemValue === filterValue;
    });
  });
} 