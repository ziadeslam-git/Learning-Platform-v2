import urllib.request
import re
from html.parser import HTMLParser

url = 'https://docs.google.com/forms/d/e/1FAIpQLSdBngsBRSbz3ji3vDI6_Rt_e5b75uyR8fn7dIIiGxbPYCEhkg/viewform'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

urls = re.findall(r'(https://[^\"\'\s,]*googleusercontent\.com/[^\"\'\s,]*)', html)
print(f"Total Google user content URLs: {len(set(urls))}")

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            d = dict(attrs)
            if 'src' in d and 'googleusercontent.com' in d['src']:
                self.images.append(d['src'])

parser = MyHTMLParser()
parser.feed(html)
print(f"Found {len(parser.images)} img tags with googleusercontent.com")

with open('images.txt', 'w', encoding='utf-8') as f:
    for img in parser.images:
        f.write(img + '\n')
