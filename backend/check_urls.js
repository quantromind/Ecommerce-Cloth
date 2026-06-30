const https = require('https');

const urls = [
    "https://images.unsplash.com/photo-1576566588028-41fa9b381a41?q=80&w=800&auto=format&fit=crop", // denim jacket
    "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop", // windbreaker
    "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=800&auto=format&fit=crop", // cargo pants
    "https://images.unsplash.com/photo-1564585222527-c2777a566167?q=80&w=800&auto=format&fit=crop", // kurta
    "https://images.unsplash.com/photo-1512436991641-b8a1c4af7fa4?q=80&w=800&auto=format&fit=crop", // cardigan
    "https://images.unsplash.com/photo-1593030736021-9556ee094a91?q=80&w=800&auto=format&fit=crop"  // sherwani
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${res.statusCode} - ${url}`);
    }).on('error', (e) => {
        console.error(e);
    });
});
