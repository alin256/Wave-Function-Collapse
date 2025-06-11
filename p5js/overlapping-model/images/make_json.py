import os
import json

# Load existing data if present
if os.path.exists('default.json'):
    with open('default.json', 'r') as f:
        default_data = json.load(f)
else:
    default_data = {}

# Add new entries
for filename in os.listdir('.'):
    if filename.endswith('.png') and os.path.isfile(filename):
        file_id = filename[:-4]
        if file_id not in default_data:
            default_data[file_id] = {
                "filename": filename,
                "tilesize": 3
            }

# TODO add boundary conditions and symetries

# Save updated data
with open('setups.json', 'w') as f:
    json.dump(default_data, f, indent=2)


