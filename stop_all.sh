#!/bin/bash

# 查找与next-server相关的进程（排除grep自身）
echo "正在查找 next-server 进程..."
pids=$(ps -aux | grep 'next-server' | grep -v 'grep' | awk '{print $2}')

if [ -z "$pids" ]; then
    echo "未找到 next-server 进程"
    exit 0
fi

echo "找到以下 next-server 进程ID:"
echo "$pids"

# 循环终止所有相关进程
for pid in $pids; do
    echo "正在终止进程 $pid ..."
    kill -9 $pid 2>/dev/null
    
    # 验证进程是否终止
    if ps -p $pid >/dev/null; then
        echo "错误: 进程 $pid 终止失败"
    else
        echo "成功终止进程 $pid"
    fi
done

echo "操作完成"