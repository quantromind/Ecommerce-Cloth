const fs = require('fs');
const https = require('https');
const path = require('path');

const validImages = [
    "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602810319428-019690571b5b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=800&auto=format&fit=crop", // cargo pants
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop"  // windbreaker
];

const seedFile = path.join(__dirname, 'seed_demo_products.js');
let content = fs.readFileSync(seedFile, 'utf8');

const urlRegex = /"(https:\/\/images\.unsplash\.com\/photo-[^"]+)"/g;
let urls = [];
let match;
while ((match = urlRegex.exec(content)) !== null) {
    urls.push(match[1]);
}

urls = [...new Set(urls)];

let i = 0;

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => {
            resolve(false);
        });
    });
}

async function fixSeed() {
    for (let url of urls) {
        const isOk = await checkUrl(url);
        if (!isOk) {
            console.log(`Fixing broken URL: ${url}`);
            const valid = validImages[i % validImages.length];
            content = content.split(url).join(valid);
            i++;
        }
    }
    
    fs.writeFileSync(seedFile, content, 'utf8');
    console.log('Seed file fixed. Ready to run seed_demo_products.js');
}

fixSeed();
