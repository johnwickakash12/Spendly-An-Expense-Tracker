# 💸 Spendly - Smart Expense Tracker

A modern, feature-rich expense tracking web application built with vanilla JavaScript. Track your income and expenses, visualize spending patterns, and get AI-powered insights—all while keeping your data private with local storage.



## 🌟 Features

### Core Functionality
- **💰 Income & Expense Tracking** - Add, view, and delete transactions with detailed categorization
- **📊 Interactive Visualizations** - Animated bar charts and donut charts built from scratch (no libraries!)
- **🎯 Budget Management** - Set category-based budgets and track spending against limits
- **✨ AI Insights** - Get personalized spending analysis and recommendations
- **💾 Local Storage** - All data persists in browser storage—completely private and offline-capable

### User Experience
- **🎨 Modern Dark Theme** - Professionally designed UI with smooth animations and micro-interactions
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Zero Dependencies** - Pure vanilla JavaScript—no frameworks, no build tools
- **🚀 Lightning Fast** - Single-page app with instant updates and smooth 60fps animations




## 📁 Project Structure

```
spendly/
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── app.js              # Core application logic
├── README.md           # This file
├── LICENSE             # MIT License

```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - ES6+ features, Local Storage API
- **SVG** - Custom donut charts
- **Google Fonts** - Syne (display) & DM Sans (body)

## 💻 Development

No build process required! Just edit the files and refresh your browser.

### File Breakdown

**`index.html`** (178 lines)
- Semantic HTML structure
- Sidebar navigation
- Dashboard layout
- Transaction modal

**`style.css`** (313 lines)
- CSS custom properties for theming
- Responsive grid layouts
- Smooth animations and transitions
- Dark theme with accent colors

**`app.js`** (347 lines)
- State management
- CRUD operations
- Chart rendering (bar & donut)
- Budget calculations
- AI insight generation
- Local storage persistence

## 🎯 Key Features Explained

### 1. Data Visualization
- **Bar Chart**: Shows last 7 days of spending with animated bars
- **Donut Chart**: Category breakdown with color-coded segments
- **Budget Meters**: Progress bars showing spending vs. limits

### 2. Smart Insights
The app analyzes your spending patterns and generates contextual advice:
- Identifies top spending categories
- Calculates daily averages and projections
- Warns about budget imbalances
- Suggests areas for potential savings

### 3. Local Storage
All data is stored in `localStorage` under the key `spendly_tx`:
```javascript
// Transaction structure
{
  id: "abc123",
  type: "expense",
  desc: "Coffee Shop",
  amount: 5.50,
  cat: "Food",
  date: "2025-02-18"
}
```

## 🎨 Customization

### Change Color Theme
Edit CSS custom properties in `style.css`:
```css
:root {
  --bg: #0a0a0f;          /* Background */
  --accent: #00e5b0;      /* Primary accent */
  --accent2: #7b61ff;     /* Secondary accent */
  --danger: #ff4d6d;      /* Expenses */
  --text: #f0f0f5;        /* Text color */
}
```

### Modify Budget Limits
Edit the `BUDGETS` object in `app.js`:
```javascript
const BUDGETS = { 
  Food: 600, 
  Transport: 200, 
  Shopping: 300, 
  Bills: 400, 
  Entertainment: 150 
};
```

### Add Categories
Update the `CATS` object in `app.js` and the `<select>` in `index.html`:
```javascript
const CATS = {
  Food: { color: '#ff6b6b', emoji: '🍔' },
  YourCategory: { color: '#yourcolor', emoji: '🎉' }
};
```

## 📊 Features Showcase

| Feature | Status | Description |
|---------|--------|-------------|
| Add Transactions | ✅ | Income and expense tracking with categories |
| Delete Transactions | ✅ | Remove individual entries |
| Weekly Bar Chart | ✅ | Visualize 7-day spending trends |
| Category Donut Chart | ✅ | See spending breakdown by category |
| Budget Tracking | ✅ | Monitor spending against set limits |
| AI Insights | ✅ | Get personalized spending analysis |
| Local Storage | ✅ | Data persists across sessions |
| Responsive Design | ✅ | Works on all device sizes |
| Dark Mode | ✅ | Easy on the eyes |
| Animations | ✅ | Smooth, 60fps transitions |

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub
2. Go to repository **Settings** → **Pages**
3. Select branch: `main` and folder: `/` (root)
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/spendly`

### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant live URL

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions
- [ ] Export data as CSV/JSON
- [ ] Import transactions from files
- [ ] Multiple currency support
- [ ] Recurring transactions
- [ ] Search and filter
- [ ] Date range selector
- [ ] Dark/light theme toggle
- [ ] Monthly/yearly views
- [ ] Charts library integration
- [ ] PWA support with offline mode

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fonts**: [Google Fonts](https://fonts.google.com/) - Syne & DM Sans
- **Design Inspiration**: Modern fintech apps and expense trackers
- **Icons**: Emoji for simplicity and universal recognition

⭐ **If you found this project helpful, consider giving it a star!**

Built with ❤️ using vanilla JavaScript
