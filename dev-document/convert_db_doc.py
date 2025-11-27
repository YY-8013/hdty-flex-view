#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
数据库设计文档转换脚本
将所有 SYS_ 开头的表名改为 T_SJLS_ 开头
将所有列名添加 F_ 前缀
"""

import re

def convert_database_doc(input_file, output_file=None):
    """
    转换数据库设计文档
    """
    if output_file is None:
        output_file = input_file
    
    # 读取文件
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 替换所有 SYS_ 开头的表名为 T_SJLS_
    content = re.sub(r'\bSYS_([A-Z_]+)\b', r'T_SJLS_\1', content)
    
    # 2. 为所有列名添加 F_ 前缀 (在SQL语句和COMMENT中)
    # 定义需要添加前缀的列名模式
    
    # 处理 CREATE TABLE 语句中的列定义
    def add_f_prefix_to_columns(match):
        table_def = match.group(1)
        # 为每一行的列名添加 F_ 前缀
        lines = table_def.split('\n')
        new_lines = []
        for line in lines:
            # 匹配列定义行 (以空格+列名开头)
            col_match = re.match(r'(\s+)([A-Z][A-Z0-9_]*)\s+', line)
            if col_match and not line.strip().startswith('CONSTRAINT') and not line.strip().startswith('--'):
                indent = col_match.group(1)
                col_name = col_match.group(2)
                # 如果列名还没有F_前缀,则添加
                if not col_name.startswith('F_'):
                    line = line.replace(indent + col_name, indent + 'F_' + col_name, 1)
            new_lines.append(line)
        return 'CREATE TABLE ' + '\n'.join(new_lines)
    
    # 替换 CREATE TABLE 语句
    content = re.sub(r'CREATE TABLE ([^;]+;)', add_f_prefix_to_columns, content, flags=re.DOTALL | re.MULTILINE)
    
    # 处理 FOREIGN KEY 约束中的列名
    content = re.sub(r'FOREIGN KEY \(([A-Z_]+)\) REFERENCES', lambda m: f'FOREIGN KEY (F_{m.group(1)}) REFERENCES' if not m.group(1).startswith('F_') else m.group(0), content)
    content = re.sub(r'REFERENCES [A-Z_]+\(([A-Z_]+)\)', lambda m: f'REFERENCES {m.group(0).split("(")[0]}(F_{m.group(1)})' if not m.group(1).startswith('F_') else m.group(0), content)
    
    # 处理 CREATE INDEX 语句
    content = re.sub(r'ON ([A-Z_]+)\(([A-Z_]+)\)', lambda m: f'ON {m.group(1)}(F_{m.group(2)})' if not m.group(2).startswith('F_') else m.group(0), content)
    
    # 处理 COMMENT ON COLUMN 语句
    content = re.sub(r'COMMENT ON COLUMN ([A-Z_]+)\.([A-Z_]+) IS', lambda m: f'COMMENT ON COLUMN {m.group(1)}.F_{m.group(2)} IS' if not m.group(2).startswith('F_') else m.group(0), content)
    
    # 处理 INSERT INTO 语句中的列名
    def fix_insert_columns(match):
        table_name = match.group(1)
        columns = match.group(2)
        # 分割列名并添加前缀
        col_list = [col.strip() for col in columns.split(',')]
        new_col_list = []
        for col in col_list:
            if not col.startswith('F_') and col.isupper():
                new_col_list.append('F_' + col)
            else:
                new_col_list.append(col)
        return f'INSERT INTO {table_name} ({", ".join(new_col_list)}'
    
    content = re.sub(r'INSERT INTO ([A-Z_]+) \(([^)]+)\)', fix_insert_columns, content)
    
    # 处理 SELECT, WHERE 等语句中的列名引用
    # 这部分比较复杂,需要小心处理,避免误替换
    
    # 处理字段映射表格中的列名
    content = re.sub(r'\| (TABLE_KEY|IS_FIXED|KEY_TYPE) \|', r'| F_\1 |', content)
    
    # 保存结果
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'转换完成! 输出文件: {output_file}')
    return content

if __name__ == '__main__':
    input_file = '01-数据库设计文档.md'
    convert_database_doc(input_file)
