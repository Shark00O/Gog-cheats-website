# GameVault - Indie Game Showcase Platform

GameVault is a modern, user-friendly platform for indie game developers to showcase and distribute their games. Built with Node.js, Express, and vanilla JavaScript, it provides an elegant solution for game discovery and distribution.

## 🎮 Features

- **Modern UI/UX**: Beautiful, responsive design with a gaming-inspired dark theme
- **Easy Game Upload**: Simple drag-and-drop interface for uploading games
- **Advanced Search**: Filter games by genre, platform, and search terms
- **File Management**: Support for multiple file types (.zip, .rar, .7z, .exe, .dmg, .apk)
- **Image Gallery**: Upload logos and screenshots for games
- **Download Tracking**: Automatic download counting
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Dynamic content loading without page refreshes

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit: `http://localhost:3000`

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## 📁 Project Structure

```
gamevault-showcase/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styling
│   └── script.js          # Frontend JavaScript
├── uploads/               # File uploads directory
│   ├── games/            # Game files
│   └── images/           # Screenshots and logos
├── data/                 # Data storage
│   └── games.json        # Games database (JSON)
├── server.js             # Backend server
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎯 How to Use

### For Gamers

1. **Browse Games**: Visit the homepage to see featured games
2. **Search & Filter**: Use the search bar and filters to find specific games
3. **Game Details**: Click on any game card to see detailed information
4. **Download**: Click the download button to get the game file

### For Developers

1. **Upload Your Game**: Navigate to the "Upload Game" section
2. **Fill Details**: Provide game title, description, developer name, etc.
3. **Add Files**: Upload your game file, logo, and screenshots
4. **Submit**: Click upload and your game will be added to the showcase

## 📋 Supported File Types

### Game Files
- `.zip` - Compressed archive
- `.rar` - WinRAR archive
- `.7z` - 7-Zip archive
- `.exe` - Windows executable
- `.dmg` - macOS disk image
- `.apk` - Android package

### Images
- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.gif` - GIF images
- `.webp` - WebP images

## 🔧 API Endpoints

The platform provides a RESTful API:

- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game
- `POST /api/games` - Upload new game
- `GET /api/games/:id/download` - Download game file
- `GET /api/search` - Search games with filters

## 🎨 Customization

### Styling
Edit `public/style.css` to customize the appearance:
- Color scheme variables
- Layout dimensions
- Animations and effects

### Functionality
Modify `public/script.js` for frontend behavior:
- Add new features
- Modify search logic
- Customize UI interactions

### Backend
Update `server.js` for server-side changes:
- Add new API endpoints
- Modify file handling
- Database integration

## 🔒 Security Features

- File type validation
- File size limits (500MB max)
- Input sanitization
- XSS protection
- Safe file handling

## 📱 Responsive Design

GameVault is fully responsive and works on:
- Desktop computers (1920px+)
- Laptops (1024px+)
- Tablets (768px+)
- Mobile phones (320px+)

## 🌟 Technologies Used

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Google Fonts

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- fs-extra (file system)
- UUID (unique identifiers)

## 📈 Future Enhancements

Potential improvements for future versions:
- User authentication system
- Game rating and review system
- Developer profiles
- Real database integration (MongoDB/PostgreSQL)
- Advanced analytics
- Social features (comments, sharing)
- Game categories and tags
- Wishlist functionality

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚡ Performance

- Optimized file handling
- Efficient search algorithms
- Lazy loading for images
- Minimal dependencies
- Fast startup time

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in server.js or kill the process using port 3000
2. **File upload fails**: Check file size (max 500MB) and file type
3. **Images not loading**: Ensure image files are in supported formats
4. **Slow performance**: Check available disk space and memory

### Support

For issues and questions:
- Check the console for error messages
- Verify all dependencies are installed
- Ensure you have write permissions in the project directory

---

**GameVault** - Supporting indie developers worldwide! 🎮✨