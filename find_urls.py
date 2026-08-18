import urllib.request
import re
import json

url = 'https://docs.google.com/forms/d/e/1FAIpQLSdBngsBRSbz3ji3vDI6_Rt_e5b75uyR8fn7dIIiGxbPYCEhkg/viewform'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Extract FB_PUBLIC_LOAD_DATA_
match = re.search(r'var FB_PUBLIC_LOAD_DATA_ = (.*?);', html)
if match:
    data_str = match.group(1)
    data = json.loads(data_str)

    items = data[1][1]
    for item in items:
        if item[3] == 2:
            q_text = item[1].strip()
            # check for images
            img_url = None
            if len(item) > 9 and item[9]:
                # In FB_PUBLIC_LOAD_DATA_, images are sometimes just IDs. But wait, in the dump, did we see the full URL somewhere else?
                pass
                
# Actually, the full image URLs might be inside FB_PUBLIC_LOAD_DATA_ but buried. Or in the HTML itself.
urls = re.findall(r'https://[^\"\'\s,]*googleusercontent\.com/[^\"\'\s,]*', html)
print(f"Total Google user content URLs: {len(set(urls))}")
import sys
sys.exit(0)
