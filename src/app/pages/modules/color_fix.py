import os

target_dir = r"d:\BSDI\BSDI-V3\BSDI-Modified-demo\src\app\pages\modules"
old_color = "#ED1C24"
new_color = "#EF4444"

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if old_color in content:
                new_content = content.replace(old_color, new_color)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated: {path}")
