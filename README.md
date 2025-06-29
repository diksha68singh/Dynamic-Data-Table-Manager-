# Dynamic-Data-Table-Manager-
# Dynamic Data Table Manager

A comprehensive data table management application built with Next.js, Redux Toolkit, and Material UI (MUI). This project demonstrates advanced state management, dynamic UI components, and real-world features like import/export, searching, sorting, and inline editing.

## 🚀 Features

### Core Features
- **Dynamic Table View**: Display data with sortable columns (Name, Email, Age, Role)
- **Global Search**: Search across all fields with real-time filtering
- **Client-side Pagination**: Configurable rows per page (5, 10, 25, 50)
- **Column Management**: Show/hide columns dynamically via modal
- **CSV Import/Export**: Upload CSV files with validation and export current view
- **State Persistence**: Column visibility and theme preferences persist across sessions

### Bonus Features
- **Inline Editing**: Double-click to edit cells with validation
- **Row Actions**: Edit and delete rows with confirmation dialogs
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Works on all screen sizes
- **Real-time Validation**: Email and number field validation
- **Bulk Operations**: Save/cancel all editing rows at once

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Material UI (MUI) v5
- **CSV Processing**: PapaParse
- **Styling**: Emotion (CSS-in-JS)

## 📁 Project Structure

```
├── components/
│   ├── DataTable.tsx           # Main table component
│   ├── EditableTableCell.tsx   # Inline editing cell component
│   ├── ImportCSVModal.tsx      # CSV import modal
│   ├── ManageColumnsModal.tsx  # Column management modal
│   ├── SearchBar.tsx           # Global search component
│   ├── ThemeProvider.tsx       # Theme context provider
│   └── Toolbar.tsx             # Action toolbar
├── hooks/
│   └── redux.ts               # Typed Redux hooks
├── pages/
│   ├── _app.tsx               # App wrapper with providers
│   └── index.tsx              # Main page
├── store/
│   ├── index.ts               # Redux store configuration
│   └── tableSlice.ts          # Table state slice
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── csvUtils.ts            # CSV import/export utilities
│   └── tableUtils.ts          # Table data processing utilities
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or create the project:**
```bash
mkdir dynamic-table-manager
cd dynamic-table-manager
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 💻 Usage

### Basic Operations
- **Search**: Use the search bar to filter data across all columns
- **Sort**: Click column headers to sort (ascending/descending)
- **Paginate**: Use pagination controls at the bottom

### Column Management
- Click the column icon in the toolbar
- Toggle column visibility with checkboxes
- Add new columns with custom names and types

### Import/Export
- **Import**: Click upload icon → select CSV file → review errors → confirm
- **Export**: Click download icon to export visible columns as CSV

### Inline Editing
- Double-click any cell to start editing
- Use Enter to save, Escape to cancel
- Edit multiple rows then use "Save All" or "Cancel All"

### Row Management
- Click edit icon to start editing a row
- Click delete icon to remove a row (with confirmation)
- Use "Add Row" button to create new entries

## 🔧 Configuration

### CSV Format
Expected CSV columns:
- `name` (required): Text
- `email` (required): Valid email format
- `age`: Number
- `role`: Text
- `department`: Text (optional)
- `location`: Text (optional)

### Validation Rules
- **Name & Email**: Required fields
- **Email**: Must be valid email format
- **Age**: Must be a number
- **Custom columns**: Based on selected type

## 🎨 Customization

### Adding New Column Types
Edit `types/index.ts` to add new column types:
```typescript
type: 'text' | 'number' | 'email' | 'date' | 'select'
```

### Styling
The app uses Material UI theming. Customize in `components/ThemeProvider.tsx`:
```typescript
const muiTheme = createTheme({
  palette: {
    primary: { main: '#your-color' },
    // ... other theme options
  }
});
```

### State Persistence
Column visibility and theme preferences are persisted. To add more:
```typescript
// In store/index.ts
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['columns', 'theme', 'yourNewState']
};
```

## 🧪 Testing

The application includes built-in validation and error handling:
- CSV import validation with detailed error messages
- Form validation for inline editing
- Type checking with TypeScript
- State management testing via Redux DevTools

## 📝 Development Notes

### Key Design Decisions
- **Redux Toolkit**: Simplified state management with excellent TypeScript support
- **Material UI**: Comprehensive component library with theming
- **Client-side Processing**: All operations happen in browser for better UX
- **Modular Architecture**: Separated concerns for maintainability

### Performance Considerations
- **Pagination**: Limits rendered rows for large datasets
- **Memoization**: Components optimized to prevent unnecessary re-renders
- **Efficient Filtering**: Client-side search with debouncing
- **Lazy Loading**: Modals and heavy components load on demand

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Large CSV files (>10MB) may cause browser slowdown
- Mobile inline editing could be improved
- Drag-and-drop column reordering not yet implemented

## 🎯 Future Enhancements

- [ ] Drag-and-drop column reordering
- [ ] Advanced filtering options
- [ ] Data export to multiple formats (JSON, XML)
- [ ] Server-side data processing
- [ ] Real-time collaboration features
- [ ] Charts and data visualization
- [ ] Advanced validation rules
- [ ] Undo/redo functionality
