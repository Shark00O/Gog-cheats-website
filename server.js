const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Ensure directories exist
fs.ensureDirSync('uploads/games');
fs.ensureDirSync('uploads/images');
fs.ensureDirSync('data');

// Games data file
const GAMES_DATA_FILE = 'data/games.json';

// Initialize games data file if it doesn't exist
if (!fs.existsSync(GAMES_DATA_FILE)) {
    fs.writeJsonSync(GAMES_DATA_FILE, []);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'gameFile') {
            cb(null, 'uploads/games/');
        } else if (file.fieldname === 'screenshot' || file.fieldname === 'logo') {
            cb(null, 'uploads/images/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'gameFile') {
            // Allow common game file formats
            const allowedTypes = ['.zip', '.rar', '.7z', '.exe', '.dmg', '.apk'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowedTypes.includes(ext)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid game file format'));
            }
        } else if (file.fieldname === 'screenshot' || file.fieldname === 'logo') {
            // Allow image formats
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'));
            }
        } else {
            cb(new Error('Unexpected field'));
        }
    }
});

// API Routes

// Get all games
app.get('/api/games', (req, res) => {
    try {
        const games = fs.readJsonSync(GAMES_DATA_FILE);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Get single game
app.get('/api/games/:id', (req, res) => {
    try {
        const games = fs.readJsonSync(GAMES_DATA_FILE);
        const game = games.find(g => g.id === req.params.id);
        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

// Upload new game
app.post('/api/games', upload.fields([
    { name: 'gameFile', maxCount: 1 },
    { name: 'screenshot', maxCount: 5 },
    { name: 'logo', maxCount: 1 }
]), (req, res) => {
    try {
        const { title, description, genre, developer, version, platform } = req.body;
        
        if (!title || !description || !developer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const gameId = uuidv4();
        const gameFile = req.files['gameFile'] ? req.files['gameFile'][0] : null;
        const screenshots = req.files['screenshot'] || [];
        const logo = req.files['logo'] ? req.files['logo'][0] : null;

        const newGame = {
            id: gameId,
            title,
            description,
            genre: genre || 'Other',
            developer,
            version: version || '1.0',
            platform: platform || 'PC',
            uploadDate: new Date().toISOString(),
            downloads: 0,
            rating: 0,
            reviews: [],
            files: {
                game: gameFile ? `/uploads/games/${gameFile.filename}` : null,
                logo: logo ? `/uploads/images/${logo.filename}` : null,
                screenshots: screenshots.map(s => `/uploads/images/${s.filename}`)
            }
        };

        const games = fs.readJsonSync(GAMES_DATA_FILE);
        games.push(newGame);
        fs.writeJsonSync(GAMES_DATA_FILE, games);

        res.json({ success: true, game: newGame });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload game' });
    }
});

// Download game
app.get('/api/games/:id/download', (req, res) => {
    try {
        const games = fs.readJsonSync(GAMES_DATA_FILE);
        const game = games.find(g => g.id === req.params.id);
        
        if (!game || !game.files.game) {
            return res.status(404).json({ error: 'Game file not found' });
        }

        // Increment download count
        game.downloads += 1;
        fs.writeJsonSync(GAMES_DATA_FILE, games);

        const filePath = path.join(__dirname, game.files.game);
        res.download(filePath, `${game.title}.${path.extname(filePath)}`);
    } catch (error) {
        res.status(500).json({ error: 'Failed to download game' });
    }
});

// Search games
app.get('/api/search', (req, res) => {
    try {
        const { q, genre, platform } = req.query;
        let games = fs.readJsonSync(GAMES_DATA_FILE);

        if (q) {
            const query = q.toLowerCase();
            games = games.filter(game => 
                game.title.toLowerCase().includes(query) ||
                game.description.toLowerCase().includes(query) ||
                game.developer.toLowerCase().includes(query)
            );
        }

        if (genre && genre !== 'all') {
            games = games.filter(game => game.genre.toLowerCase() === genre.toLowerCase());
        }

        if (platform && platform !== 'all') {
            games = games.filter(game => game.platform.toLowerCase() === platform.toLowerCase());
        }

        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`GameVault server running on http://localhost:${PORT}`);
});