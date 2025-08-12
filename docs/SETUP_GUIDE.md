# WordPress 2025 Setup Guide với Prisma

## Yêu cầu hệ thống

### Software Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Database**: PostgreSQL >= 13 hoặc MySQL >= 8.0
- **TypeScript**: >= 5.0.0

### Recommended Tools
- **Docker**: Để chạy database local
- **Prisma Studio**: Database GUI
- **VS Code**: Với Prisma extension

## Cài đặt từ đầu

### 1. Clone và cài đặt dependencies
```bash
git clone <repository-url>
cd workpress
npm install
```

### 2. Thiết lập Database

#### Option A: PostgreSQL với Docker
```bash
# Tạo PostgreSQL container
docker run --name wordpress-postgres \
  -e POSTGRES_DB=wordpress_2025 \
  -e POSTGRES_USER=wordpress \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Kiểm tra container đang chạy
docker ps
```

#### Option B: MySQL với Docker
```bash
# Tạo MySQL container
docker run --name wordpress-mysql \
  -e MYSQL_DATABASE=wordpress_2025 \
  -e MYSQL_USER=wordpress \
  -e MYSQL_PASSWORD=password \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -p 3306:3306 \
  -d mysql:8.0

# Kiểm tra container đang chạy
docker ps
```

#### Option C: Local Database
Cài đặt PostgreSQL hoặc MySQL trên máy local và tạo database `wordpress_2025`.

### 3. Cấu hình Environment Variables

Tạo file `.env.local` từ `.env`:
```bash
cp .env .env.local
```

Chỉnh sửa `.env.local`:
```env
# PostgreSQL
DATABASE_URL="postgresql://wordpress:password@localhost:5432/wordpress_2025"

# Hoặc MySQL
# DATABASE_URL="mysql://wordpress:password@localhost:3306/wordpress_2025"

# WordPress Configuration
WORDPRESS_DB_HOST=localhost
WORDPRESS_DB_NAME=wordpress_2025
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=password

# Application
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Khởi tạo Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Hoặc tạo migration (production)
npm run db:migrate

# Seed database với data mẫu
npm run db:seed
```

### 5. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Truy cập http://localhost:3000 để xem ứng dụng.

## Migration từ WordPress hiện có

### 1. Export Data từ WordPress cũ

#### Export Database
```bash
# MySQL dump
mysqldump -u username -p wordpress_old > wordpress_backup.sql

# Hoặc sử dụng phpMyAdmin, Adminer, etc.
```

#### Export Files
```bash
# Backup wp-content
tar -czf wp-content-backup.tar.gz /path/to/wordpress/wp-content/
```

### 2. Transform Data

Tạo script migration tùy chỉnh:
```typescript
// scripts/migrate-from-wordpress.ts
import { PrismaClient } from '../app/generated/prisma'
import mysql from 'mysql2/promise'

const prisma = new PrismaClient()

async function migrateFromWordPress() {
  // Kết nối đến WordPress database cũ
  const oldDb = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'old_wordpress'
  })

  // Migrate users
  const [users] = await oldDb.execute('SELECT * FROM wp_users')
  for (const user of users as any[]) {
    await prisma.user.create({
      data: {
        id: user.ID,
        userLogin: user.user_login,
        userPass: user.user_pass,
        userNicename: user.user_nicename,
        userEmail: user.user_email,
        userUrl: user.user_url,
        userRegistered: user.user_registered,
        userActivationKey: user.user_activation_key,
        userStatus: user.user_status,
        displayName: user.display_name,
      }
    })
  }

  // Migrate posts, comments, etc.
  // ... thêm logic migration khác
}
```

### 3. Verify Migration

```bash
# Chạy migration script
tsx scripts/migrate-from-wordpress.ts

# Kiểm tra data
npm run db:studio
```

## Development Workflow

### 1. Schema Changes

Khi thay đổi schema:
```bash
# Chỉnh sửa prisma/schema.prisma
# Sau đó:

# Development
npm run db:push

# Production
npm run db:migrate
```

### 2. Database Operations

```bash
# Xem database trong browser
npm run db:studio

# Reset database (xóa tất cả data)
npm run db:reset

# Format schema file
npm run db:format

# Generate client sau khi thay đổi schema
npm run db:generate
```

### 3. Seeding Data

Chỉnh sửa `prisma/seed.ts` để thêm data mẫu:
```typescript
// Thêm data mẫu mới
const newPost = await prisma.post.create({
  data: {
    postTitle: 'New Sample Post',
    postContent: 'Content here...',
    postAuthor: adminUser.id,
    postStatus: 'publish',
    postType: 'post',
  }
})
```

Chạy seed:
```bash
npm run db:seed
```

## Production Deployment

### 1. Environment Setup

```env
# Production .env
DATABASE_URL="postgresql://user:pass@prod-host:5432/wordpress_prod"
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. Database Migration

```bash
# Deploy migrations
npm run db:migrate:deploy

# Generate production client
npm run db:generate
```

### 3. Performance Optimization

#### Connection Pooling
```typescript
// lib/prisma.ts
import { PrismaClient } from '../app/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### Query Optimization
```typescript
// Sử dụng select thay vì lấy tất cả fields
const posts = await prisma.post.findMany({
  select: {
    id: true,
    postTitle: true,
    postDate: true,
  },
  take: 10,
})

// Sử dụng cursor-based pagination
const posts = await prisma.post.findMany({
  take: 10,
  cursor: {
    id: lastPostId,
  },
  orderBy: {
    id: 'asc',
  },
})
```

## Troubleshooting

### Common Issues

#### 1. Connection Errors
```bash
# Kiểm tra database đang chạy
docker ps

# Test connection
npm run db:studio
```

#### 2. Migration Errors
```bash
# Reset và migrate lại
npm run db:reset
npm run db:migrate
```

#### 3. Type Errors
```bash
# Regenerate Prisma client
npm run db:generate

# Restart TypeScript server trong VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 4. Performance Issues
- Kiểm tra indexes trong schema
- Monitor slow queries
- Sử dụng connection pooling
- Optimize query patterns

### Debug Tools

```bash
# Enable query logging
DATABASE_URL="postgresql://user:pass@host:5432/db?log=query"

# Prisma debug
DEBUG="prisma:query" npm run dev
```

## Best Practices

### 1. Schema Design
- Luôn sử dụng indexes cho foreign keys
- Tránh N+1 queries với proper includes
- Sử dụng enums cho fixed values
- Validate data ở application level

### 2. Performance
- Sử dụng select để giới hạn fields
- Implement pagination
- Cache frequently accessed data
- Monitor query performance

### 3. Security
- Validate tất cả inputs
- Sử dụng parameterized queries (built-in với Prisma)
- Implement proper authentication
- Regular security updates

### 4. Maintenance
- Regular backups
- Monitor database size
- Clean up orphaned data
- Update dependencies regularly
