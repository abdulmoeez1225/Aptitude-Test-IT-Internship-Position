# BMW IT Internship Test - Electric Cars DataGrid

A full-stack application built for BMW's IT Internship position, featuring a generic DataGrid component using AG Grid (React) with Express.js backend and MySQL database.

## 🚀 Features

### Frontend (React + Vite)
- **Generic DataGrid Component** using AG Grid
- **Search functionality** with backend API integration
- **Advanced filtering** with multiple operators (contains, equals, starts with, ends with, is empty, greater than, less than)
- **Actions column** with View and Delete buttons
- **Detail page** with comprehensive car information
- **Modern UI** using Material-UI (MUI)
- **Responsive design** for all screen sizes
- **BMW branding** with custom theme

### Backend (Express.js)
- **RESTful API** for car data management
- **Search API** with multi-field search
- **Filtering API** with dynamic query building
- **Pagination** support
- **MySQL database** integration
- **CORS enabled** for frontend communication
- **Error handling** and validation

### Database (MySQL)
- **Electric cars dataset** with comprehensive vehicle information
- **Optimized queries** for search and filtering
- **Data import script** from CSV

## 🛠️ Technology Stack

### Frontend
- React 18 with Vite
- AG Grid Community
- Material-UI (MUI)
- React Router DOM
- Axios for API calls

### Backend
- Node.js with Express.js
- MySQL2 for database connection
- CORS for cross-origin requests
- CSV parser for data import

### Database
- MySQL 8.0+

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bmw-aptitude-test
```

### 2. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE bmw_electric_cars;
USE bmw_electric_cars;
```

#### Run the Setup Script
```bash
mysql -u root -p < database/setup.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Create `config.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bmw_electric_cars
DB_PORT=3306
PORT=5000
```

#### Import Data
```bash
cd ../database
node importData.js
```

#### Start Backend Server
```bash
cd ../backend
npm run dev
```

The backend will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 API Endpoints

### Cars API (`/api/cars`)

#### GET `/api/cars`
Get all cars with optional search and filtering
- **Query Parameters:**
  - `search`: Search term for brand, model, body style, or segment
  - `filter`: JSON string with filter criteria
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `sortBy`: Column to sort by
  - `sortOrder`: ASC or DESC

#### GET `/api/cars/:id`
Get car details by ID

#### DELETE `/api/cars/:id`
Delete car by ID

#### GET `/api/cars/filters/options`
Get unique values for filter options

### Health Check
#### GET `/health`
API health status

## 🔍 Search & Filtering

### Search
- Searches across Brand, Model, BodyStyle, and Segment fields
- Case-insensitive partial matching

### Filtering
Supported operators:
- **contains**: Partial text match
- **equals**: Exact match
- **starts_with**: Text starts with value
- **ends_with**: Text ends with value
- **is_empty**: Field is null or empty
- **greater_than**: Numeric comparison
- **less_than**: Numeric comparison

### Example Filter
```json
{
  "Brand": {
    "operator": "equals",
    "value": "BMW"
  },
  "PriceEuro": {
    "operator": "greater_than",
    "value": "50000"
  }
}
```

## 🎨 UI Features

### DataGrid Features
- **Sortable columns** with multi-column sorting
- **Resizable columns** for better data viewing
- **Floating filters** for quick column filtering
- **Pagination** with configurable page size
- **Row selection** with single/multiple selection
- **Export functionality** (can be extended)

### Detail Page Features
- **Comprehensive car information** organized in cards
- **Performance metrics** with proper formatting
- **Price formatting** in EUR currency
- **Date formatting** for release dates
- **Status indicators** for rapid charging availability

### Responsive Design
- **Mobile-friendly** layout
- **Tablet optimization** for medium screens
- **Desktop experience** with full feature set

## 🏗️ Project Structure

```
bmw-aptitude-test/
├── backend/
│   ├── routes/
│   │   └── cars.js          # API routes
│   ├── database.js          # Database connection
│   ├── server.js            # Express server
│   ├── config.env           # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DataGrid.jsx    # Main grid component
│   │   │   ├── CarDetail.jsx   # Detail page
│   │   │   └── Header.jsx      # App header
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx
│   └── package.json
├── database/
│   ├── setup.sql              # Database schema
│   └── importData.js          # Data import script
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)

## 📊 Performance Features

- **Server-side pagination** for large datasets
- **Optimized database queries** with proper indexing
- **Lazy loading** for grid data
- **Caching** for filter options
- **Compressed responses** for faster loading

## 🔧 Customization

### Adding New Columns
1. Update database schema in `database/setup.sql`
2. Add column definition in `frontend/src/components/DataGrid.jsx`
3. Update API routes if needed

### Adding New Filter Types
1. Add operator in backend `routes/cars.js`
2. Update frontend filter dialog
3. Test with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is created for BMW IT Internship position.

## 👨‍💻 Author

Created for BMW IT Internship Application

---

**Note:** This application demonstrates full-stack development skills with modern technologies, following BMW's requirements for the IT Internship position.
