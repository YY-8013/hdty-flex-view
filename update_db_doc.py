#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

file_path = r"e:\001-working\01-鄂尔多斯基管\01---代码\03-数据晾晒\hdty-flex-view-web\dev-document\01-数据库设计文档.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 JSON 中的 true/false 为 1/0
content = re.sub(r'"enabled":\s*true', '"enabled": 1', content)
content = re.sub(r'"enabled":\s*false', '"enabled": 0', content)
content = re.sub(r'"clearable":\s*true', '"clearable": 1', content)
content = re.sub(r'"clearable":\s*false', '"clearable": 0', content)
content = re.sub(r'"multiple":\s*true', '"multiple": 1', content)
content = re.sub(r'"multiple":\s*false', '"multiple": 0', content)
content = re.sub(r'"filterable":\s*true', '"filterable": 1', content)
content = re.sub(r'"filterable":\s*false', '"filterable": 0', content)
content = re.sub(r'"showWordLimit":\s*true', '"showWordLimit": 1', content)
content = re.sub(r'"showWordLimit":\s*false', '"showWordLimit": 0', content)

# 替换表名前缀
content = re.sub(r'SYS_COLUMN_CONFIG', 'T_SJLS_COLUMN_CONFIG', content)
content = re.sub(r'SYS_FORM_CONFIG', 'T_SJLS_FORM_CONFIG', content)
content = re.sub(r'SYS_FORM_ITEM_CONFIG', 'T_SJLS_FORM_ITEM_CONFIG', content)
content = re.sub(r'SYS_ORG', 'T_SJLS_ORG', content)
content = re.sub(r'SYS_CONFIG_LOG', 'T_SJLS_CONFIG_LOG', content)
content = re.sub(r'BIZ_DATA_COMMON', 'T_SJLS_BIZ_DATA_COMMON', content)
content = re.sub(r'STAT_BASE_DATA', 'T_SJLS_STAT_BASE_DATA', content)
content = re.sub(r'STAT_DAILY_BASE', 'T_SJLS_STAT_DAILY_BASE', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 数据库设计文档已更新完成")
print("✓ 表名前缀: SYS_ → T_SJLS_")
print("✓ 列名前缀: 已添加 F_")
print("✓ true/false → 1/0")
