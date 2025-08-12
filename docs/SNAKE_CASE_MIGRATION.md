# Snake_Case Migration Guide

## Tổng quan

Đã thực hiện migration toàn bộ schema database từ camelCase sang snake_case convention để tuân theo chuẩn naming convention phổ biến trong database design.

## Những thay đổi chính

### 1. Field Names (Tên trường)

#### User Model
- `userLogin` → `user_login`
- `userPass` → `user_pass`
- `userNicename` → `user_nicename`
- `userEmail` → `user_email`
- `userUrl` → `user_url`
- `userRegistered` → `user_registered`
- `userActivationKey` → `user_activation_key`
- `userStatus` → `user_status`
- `displayName` → `display_name`

#### Post Model
- `postAuthor` → `post_author`
- `postDate` → `post_date`
- `postDateGmt` → `post_date_gmt`
- `postContent` → `post_content`
- `postTitle` → `post_title`
- `postExcerpt` → `post_excerpt`
- `postStatus` → `post_status`
- `commentStatus` → `comment_status`
- `pingStatus` → `ping_status`
- `postPassword` → `post_password`
- `postName` → `post_name`
- `toPing` → `to_ping`
- `postModified` → `post_modified`
- `postModifiedGmt` → `post_modified_gmt`
- `postContentFiltered` → `post_content_filtered`
- `postParent` → `post_parent`
- `menuOrder` → `menu_order`
- `postType` → `post_type`
- `postMimeType` → `post_mime_type`
- `commentCount` → `comment_count`

#### Comment Model
- `commentId` → `comment_id`
- `commentPostId` → `comment_post_id`
- `commentAuthor` → `comment_author`
- `commentAuthorEmail` → `comment_author_email`
- `commentAuthorUrl` → `comment_author_url`
- `commentAuthorIp` → `comment_author_ip`
- `commentDate` → `comment_date`
- `commentDateGmt` → `comment_date_gmt`
- `commentContent` → `comment_content`
- `commentKarma` → `comment_karma`
- `commentApproved` → `comment_approved`
- `commentAgent` → `comment_agent`
- `commentType` → `comment_type`
- `commentParent` → `comment_parent`
- `userId` → `user_id`

#### Metadata Models
- `metaId` → `meta_id`
- `userId` → `user_id`
- `postId` → `post_id`
- `commentId` → `comment_id`
- `termId` → `term_id`
- `metaKey` → `meta_key`
- `metaValue` → `meta_value`

#### Term Models
- `termId` → `term_id`
- `termGroup` → `term_group`
- `termTaxonomyId` → `term_taxonomy_id`
- `objectId` → `object_id`
- `termOrder` → `term_order`

#### Option Model
- `optionId` → `option_id`
- `optionName` → `option_name`
- `optionValue` → `option_value`

#### Multisite Models
- `blogId` → `blog_id`
- `siteId` → `site_id`
- `lastUpdated` → `last_updated`
- `langId` → `lang_id`

#### Link Model
- `linkId` → `link_id`
- `linkUrl` → `link_url`
- `linkName` → `link_name`
- `linkImage` → `link_image`
- `linkTarget` → `link_target`
- `linkDescription` → `link_description`
- `linkVisible` → `link_visible`
- `linkOwner` → `link_owner`
- `linkRating` → `link_rating`
- `linkUpdated` → `link_updated`
- `linkRel` → `link_rel`
- `linkNotes` → `link_notes`
- `linkRss` → `link_rss`

#### Performance Tables
- `postType` → `post_type`
- `postStatus` → `post_status`
- `lastUpdated` → `last_updated`

### 2. Relationship Names (Tên quan hệ)

- `postMeta` → `post_meta`
- `userMeta` → `user_meta`
- `commentMeta` → `comment_meta`
- `termMeta` → `term_meta`
- `termTaxonomy` → `term_taxonomy`
- `termRelationships` → `term_relationships`
- `parentTerm` → `parent_term`

### 3. Những gì được giữ nguyên

- **Model names**: User, Post, Comment, Term, etc.
- **Table names**: wp_users, wp_posts, wp_comments, etc.
- **Index names**: user_login_key, post_author, etc.
- **Constraint names**: userId_metaKey, term_id_taxonomy, etc.
- **Enum values**: publish, draft, pending, etc.

## Files đã được cập nhật

### 1. `prisma/schema.prisma`
- Tất cả field names đã được chuyển sang snake_case
- Tất cả relationship names đã được cập nhật
- Foreign key references đã được cập nhật

### 2. `lib/prisma.ts`
- Tất cả method parameters đã được cập nhật
- Query conditions đã được cập nhật
- Select fields đã được cập nhật
- Include relationships đã được cập nhật

### 3. `prisma/seed.ts`
- Tất cả data creation đã được cập nhật
- Field assignments đã được cập nhật
- Relationship references đã được cập nhật

## Lợi ích của việc migration

### 1. **Consistency**
- Tuân theo chuẩn naming convention phổ biến trong database
- Nhất quán với WordPress database schema gốc
- Dễ đọc và hiểu hơn

### 2. **Maintainability**
- Dễ maintain và debug
- Tương thích tốt hơn với các tools database
- Chuẩn hóa theo best practices

### 3. **Developer Experience**
- Autocomplete tốt hơn
- Ít confusion giữa field names và property names
- Easier mapping với existing WordPress data

## Cách sử dụng sau migration

### Query Examples

```typescript
// Trước migration
const posts = await prisma.post.findMany({
  where: {
    postStatus: 'publish',
    postType: 'post'
  },
  include: {
    author: {
      select: {
        displayName: true,
        userEmail: true
      }
    },
    postMeta: true
  }
})

// Sau migration
const posts = await prisma.post.findMany({
  where: {
    post_status: 'publish',
    post_type: 'post'
  },
  include: {
    author: {
      select: {
        display_name: true,
        user_email: true
      }
    },
    post_meta: true
  }
})
```

### Helper Functions

```typescript
// Trước migration
await wp.getUserMeta(userId, metaKey)
await wp.setPostMeta(postId, metaKey, metaValue)

// Sau migration
await wp.getUserMeta(user_id, meta_key)
await wp.setPostMeta(post_id, meta_key, meta_value)
```

## Testing

Sau khi migration, đã test:

1. ✅ Prisma client generation thành công
2. ✅ Schema validation passed
3. ✅ TypeScript compilation không có lỗi
4. ✅ ESLint checks passed
5. ✅ Application khởi động thành công

## Next Steps

1. **Database Migration**: Nếu có database hiện tại, cần tạo migration script
2. **Update Documentation**: Cập nhật tất cả documentation với field names mới
3. **Team Communication**: Thông báo cho team về những thay đổi này
4. **Testing**: Thực hiện comprehensive testing với data thực

## Rollback Plan

Nếu cần rollback, có thể:

1. Revert các changes trong git
2. Regenerate Prisma client
3. Update any existing data mappings

Tuy nhiên, migration này được recommend để maintain consistency và follow best practices.
