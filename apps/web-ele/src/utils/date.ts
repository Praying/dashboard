import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param date 日期字符串、Date对象或时间戳
 * @param format 格式化模式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | null | number | string | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!date) return '-';

  return dayjs(date).format(format);
}

/**
 * 格式化相对时间
 * @param date 日期字符串、Date对象或时间戳
 * @returns 相对时间字符串，如 '2小时前'
 */
export function formatRelativeTime(
  date: Date | null | number | string | undefined,
): string {
  if (!date) return '-';

  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'second');

  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86_400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2_592_000) return `${Math.floor(diff / 86_400)}天前`;
  if (diff < 31_536_000) return `${Math.floor(diff / 2_592_000)}个月前`;

  return `${Math.floor(diff / 31_536_000)}年前`;
}

/**
 * 获取日期范围
 * @param range 范围类型，支持 'today' | 'yesterday' | 'week' | 'month' | 'year'
 * @returns 包含开始和结束日期的对象
 */
export function getDateRange(
  range: 'month' | 'today' | 'week' | 'year' | 'yesterday',
): { end: string; start: string } {
  const now = dayjs();
  let start: dayjs.Dayjs;

  switch (range) {
    case 'month': {
      start = now.startOf('month');
      break;
    }
    case 'today': {
      start = now.startOf('day');
      break;
    }
    case 'week': {
      start = now.startOf('week');
      break;
    }
    case 'year': {
      start = now.startOf('year');
      break;
    }
    case 'yesterday': {
      start = now.subtract(1, 'day').startOf('day');
      return {
        start: start.format('YYYY-MM-DD HH:mm:ss'),
        end: now.subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    default: {
      start = now.startOf('day');
    }
  }

  return {
    start: start.format('YYYY-MM-DD HH:mm:ss'),
    end: now.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };
}
