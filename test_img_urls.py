import urllib.request
import json
import re
import os
import time

FORM_ID = '1FAIpQLSdBngsBRSbz3ji3vDI6_Rt_e5b75uyR8fn7dIIiGxbPYCEhkg'

# Load the dump
with open('questions_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

items = data[1][1]

# Extract blob IDs per question (in order)
blob_ids = []
for item in items:
    if item[3] == 2:
        str_repr = str(item)
        match = re.search(r's-blob-v1-IMAGE-([\w_\-]+)', str_repr)
        blob_ids.append(match.group(1) if match else None)

print(f'Total questions: {len(blob_ids)}')
print(f'With blob IDs: {sum(1 for x in blob_ids if x)}')

# Possible URL patterns for Google Forms images:
# Pattern 1: https://docs.google.com/forms/d/e/{FORM_ID}/getimage?id={BLOB_ID}
# Pattern 2: https://lh4.googleusercontent.com/{BLOB_ID}
# Pattern 3: forms content server

test_blob = blob_ids[0]
test_urls = [
    f'https://docs.google.com/forms/d/e/{FORM_ID}/getimage?id={test_blob}',
    f'https://docs.google.com/forms/d/e/{FORM_ID}/getimage?id=s-blob-v1-IMAGE-{test_blob}',
    f'https://lh4.googleusercontent.com/{test_blob}',
    f'https://lh3.googleusercontent.com/{test_blob}',
    f'https://lh5.googleusercontent.com/{test_blob}',
    f'https://lh6.googleusercontent.com/{test_blob}',
    f'https://docs.google.com/forms/d/e/{FORM_ID}/thumbnail?id={test_blob}',
]

for url in test_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        ct = res.headers.get_content_type()
        print(f'SUCCESS: {url}')
        print(f'  Content-Type: {ct}')
        break
    except Exception as e:
        print(f'FAIL: {url}')
        print(f'  {e}')
