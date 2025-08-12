# WordPress 2025 với Prisma ORM

Một dự án WordPress hiện đại được xây dựng với Next.js và Prisma ORM, được tối ưu hóa cho hiệu suất cao và khả năng mở rộng.

## ✨ Tính năng chính

- 🚀 **Hiệu suất cao**: Database schema được tối ưu với indexes và relationships phù hợp
- 🔒 **Type Safety**: Sử dụng TypeScript và Prisma để đảm bảo type safety
- 📊 **Scalable**: Hỗ trợ WordPress Multisite và large datasets
- 🛠️ **Modern Stack**: Next.js 15, React 19, Prisma ORM, TypeScript
- 🎨 **Responsive**: Tailwind CSS với design system hiện đại
- 🔧 **Developer Experience**: Hot reload, TypeScript, ESLint, Prettier

## 🏗️ Kiến trúc

### Database Schema
- **WordPress Compatible**: Tương thích với cấu trúc database WordPress standard
- **Optimized Indexes**: Indexes được thiết kế cho các truy vấn phổ biến
- **Flexible Metadata**: Hệ thống metadata linh hoạt cho tất cả entities
- **Multisite Support**: Hỗ trợ WordPress Multisite Network

### Technology Stack
- **Frontend**: Next.js 15 với App Router
- **Backend**: Prisma ORM với PostgreSQL/MySQL
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Database**: PostgreSQL (recommended) hoặc MySQL

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Thiết lập database
```bash
# Với Docker (PostgreSQL)
docker run --name wordpress-postgres \
  -e POSTGRES_DB=wordpress_2025 \
  -e POSTGRES_USER=wordpress \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Cấu hình environment
```bash
# Copy và chỉnh sửa file .env
cp .env .env.local

# Chỉnh sửa DATABASE_URL trong .env.local
DATABASE_URL="postgresql://wordpress:password@localhost:5432/wordpress"
```

### 4. Khởi tạo database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed với data mẫu
npm run db:seed
```

### 5. Chạy ứng dụng
```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📚 Documentation

- [Database Schema](./docs/DATABASE_SCHEMA.md) - Chi tiết về cấu trúc database
- [Setup Guide](./docs/SETUP_GUIDE.md) - Hướng dẫn cài đặt chi tiết

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Chạy development server
npm run build           # Build production
npm run start           # Chạy production server
npm run lint            # Lint code

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Create và run migrations
npm run db:seed         # Seed database với data mẫu
npm run db:studio       # Mở Prisma Studio
npm run db:reset        # Reset database
```

## 🏗️ Project Structure

```
workpress/
├── app/                    # Next.js App Router
│   ├── generated/         # Generated Prisma client
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── docs/                  # Documentation
│   ├── DATABASE_SCHEMA.md
│   └── SETUP_GUIDE.md
├── lib/                   # Utility libraries
│   └── prisma.ts         # Prisma client và utilities
├── prisma/               # Prisma configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Database seeding
├── public/               # Static assets
└── README.md
```

## 🔧 Database Schema Highlights

### Core Tables
- `wp_users` - User management với multisite support
- `wp_posts` - Content storage với hierarchical structure
- `wp_comments` - Comment system với threading
- `wp_options` - Configuration và settings

### Metadata Tables
- `wp_postmeta` - Post metadata
- `wp_usermeta` - User metadata
- `wp_commentmeta` - Comment metadata
- `wp_termmeta` - Term metadata

### Taxonomy System
- `wp_terms` - Taxonomy terms
- `wp_term_taxonomy` - Taxonomy definitions
- `wp_term_relationships` - Object-term relationships

### Performance Optimizations
- Strategic indexing cho common queries
- Composite indexes cho complex queries
- Cached count tables
- Proper foreign key relationships

## 🚀 Performance Features

### Database Optimizations
- **Composite Indexes**: `type_status_date` cho post queries
- **Metadata Indexes**: `meta_key_value` cho metadata lookups
- **Cached Counts**: Separate tables cho post/term counts
- **Connection Pooling**: Optimized database connections

### Application Optimizations
- **Type Safety**: Compile-time error checking
- **Query Optimization**: Select only needed fields
- **Relationship Loading**: Efficient includes và joins
- **Caching Strategy**: Built-in caching mechanisms

## 🔒 Security Features

- **SQL Injection Protection**: Built-in với Prisma
- **Type Validation**: Runtime type checking
- **Input Sanitization**: Automatic input cleaning
- **Access Control**: Role-based permissions
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [WordPress](https://wordpress.org/) - Inspiration và compatibility
- [Prisma](https://prisma.io/) - Modern database toolkit
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
