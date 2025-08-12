# WordPress 2025 Database Schema với Prisma ORM

## Tổng quan

Schema database này được thiết kế tối ưu cho WordPress 2025 sử dụng Prisma ORM, tập trung vào hiệu suất cao, khả năng mở rộng và tính bảo mật.

## Đặc điểm chính

### 🚀 Tối ưu hóa hiệu suất
- **Indexes được tối ưu**: Tất cả các truy vấn phổ biến đều có indexes phù hợp
- **Composite indexes**: Tối ưu cho các truy vấn phức tạp
- **Cached counts**: Bảng đếm riêng biệt để tránh COUNT(*) chậm
- **Proper relationships**: Foreign keys và cascade deletes

### 🔒 Bảo mật
- **Type safety**: Sử dụng TypeScript và Prisma để đảm bảo type safety
- **Enums**: Giới hạn giá trị có thể có cho các trường quan trọng
- **Validation**: Built-in validation thông qua Prisma schema

### 📈 Khả năng mở rộng
- **Multisite support**: Hỗ trợ WordPress Multisite
- **Flexible metadata**: Hệ thống metadata linh hoạt cho tất cả entities
- **Modern data types**: Sử dụng các kiểu dữ liệu hiện đại

## Cấu trúc bảng

### Core Tables (Bảng chính)

#### `wp_users`
Lưu trữ thông tin người dùng
- **Indexes**: `user_login`, `user_nicename`, `user_email`
- **Features**: Multisite support (spam, deleted fields)

#### `wp_posts`
Lưu trữ tất cả nội dung (posts, pages, attachments, etc.)
- **Indexes**: Composite index `type_status_date` cho hiệu suất tối ưu
- **Features**: Hierarchical structure, flexible post types

#### `wp_comments`
Hệ thống bình luận với cấu trúc phân cấp
- **Indexes**: Tối ưu cho việc hiển thị và moderation
- **Features**: Threaded comments, spam protection

### Metadata Tables (Bảng metadata)

#### `wp_postmeta`, `wp_usermeta`, `wp_commentmeta`, `wp_termmeta`
Hệ thống metadata linh hoạt cho tất cả entities
- **Indexes**: `meta_key`, `meta_key_value` composite
- **Features**: Unlimited custom fields

### Taxonomy System (Hệ thống phân loại)

#### `wp_terms`, `wp_term_taxonomy`, `wp_term_relationships`
Hệ thống taxonomy linh hoạt (categories, tags, custom taxonomies)
- **Features**: Hierarchical taxonomies, unlimited taxonomy types
- **Optimization**: Cached term counts

### Configuration (Cấu hình)

#### `wp_options`
Lưu trữ cấu hình và settings
- **Indexes**: `autoload` index cho performance
- **Features**: Autoload optimization

### Multisite Tables (Bảng multisite)

#### `wp_site`, `wp_blogs`, `wp_sitemeta`
Hỗ trợ WordPress Multisite Network
- **Features**: Multiple sites management, network-wide settings

## Performance Optimizations (Tối ưu hóa hiệu suất)

### 1. Strategic Indexing
```sql
-- Composite index cho truy vấn phổ biến nhất
@@index([postType, postStatus, postDate, id], name: "type_status_date")

-- Index cho metadata lookups
@@index([metaKey, metaValue(length: 191)], name: "meta_key_value")
```

### 2. Cached Counts
```typescript
// Bảng đếm riêng biệt thay vì COUNT(*) queries
model PostCount {
  postType   String
  postStatus String
  count      BigInt
  lastUpdated DateTime
}
```

### 3. Proper Data Types
- `BigInt` cho IDs để hỗ trợ large datasets
- `Text` vs `VarChar` phù hợp với content length
- `DateTime` với timezone support

## Migration Strategy (Chiến lược migration)

### Từ WordPress hiện có
1. **Export data** từ WordPress hiện tại
2. **Transform data** để phù hợp với schema mới
3. **Import data** sử dụng Prisma seed scripts
4. **Verify integrity** và test performance

### Backward Compatibility
- Giữ nguyên tên bảng và cột WordPress standard
- Mapping functions cho compatibility với WordPress APIs
- Gradual migration path

## Best Practices (Thực hành tốt nhất)

### 1. Query Optimization
```typescript
// Sử dụng select để chỉ lấy fields cần thiết
const posts = await prisma.post.findMany({
  select: {
    id: true,
    postTitle: true,
    postDate: true,
  },
  where: {
    postStatus: 'publish',
    postType: 'post',
  },
  orderBy: {
    postDate: 'desc',
  },
})
```

### 2. Relationship Loading
```typescript
// Sử dụng include thay vì separate queries
const postWithMeta = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    postMeta: true,
    author: {
      select: {
        displayName: true,
        userEmail: true,
      },
    },
    comments: {
      where: {
        commentApproved: '1',
      },
    },
  },
})
```

### 3. Batch Operations
```typescript
// Sử dụng createMany cho bulk inserts
await prisma.postMeta.createMany({
  data: metaData,
  skipDuplicates: true,
})
```

## Environment Setup (Thiết lập môi trường)

### Development
```bash
# Cài đặt dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed
```

### Production
```bash
# Deploy migrations
npm run db:migrate:deploy

# Generate optimized client
npm run db:generate
```

## Monitoring và Maintenance

### Performance Monitoring
- Monitor slow queries
- Track index usage
- Monitor connection pool
- Cache hit rates

### Regular Maintenance
- Update statistics
- Rebuild indexes if needed
- Clean up orphaned metadata
- Archive old data

## Security Considerations

### Data Protection
- Encrypted connections
- Proper user permissions
- Regular backups
- SQL injection prevention (built-in với Prisma)

### Access Control
- Role-based access
- API rate limiting
- Input validation
- Output sanitization

## Troubleshooting

### Common Issues
1. **Slow queries**: Check indexes và query patterns
2. **Connection issues**: Verify connection string và pool settings
3. **Migration errors**: Check schema conflicts
4. **Type errors**: Regenerate Prisma client

### Debug Tools
- Prisma Studio for data visualization
- Query logging
- Performance profiling
- Database monitoring tools
