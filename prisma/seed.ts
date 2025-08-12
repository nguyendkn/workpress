import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { user_login: "admin" },
    update: {},
    create: {
      user_login: "admin",
      user_pass: "$P$BdlLcXuQteEAx0J6tMW5l0nX4.L2Ky/", // password: admin (hashed)
      user_nicename: "admin",
      user_email: "admin@wordpress.local",
      user_url: "",
      display_name: "Administrator",
      user_status: 0,
      spam: false,
      deleted: false,
    },
  });

  // Create default user meta
  await prisma.userMeta.createMany({
    data: [
      {
        user_id: adminUser.id,
        meta_key: "wp_capabilities",
        meta_value: 'a:1:{s:13:"administrator";b:1;}',
      },
      {
        user_id: adminUser.id,
        meta_key: "wp_user_level",
        meta_value: "10",
      },
      {
        user_id: adminUser.id,
        meta_key: "first_name",
        meta_value: "Admin",
      },
      {
        user_id: adminUser.id,
        meta_key: "last_name",
        meta_value: "User",
      },
    ],
    skipDuplicates: true,
  });

  // Create default options
  await prisma.option.createMany({
    data: [
      {
        option_name: "siteurl",
        option_value: "http://localhost:3000",
        autoload: "yes",
      },
      {
        option_name: "home",
        option_value: "http://localhost:3000",
        autoload: "yes",
      },
      {
        option_name: "blogname",
        option_value: "WordPress Site",
        autoload: "yes",
      },
      {
        option_name: "blogdescription",
        option_value: "Just another WordPress site",
        autoload: "yes",
      },
      { option_name: "users_can_register", option_value: "0", autoload: "yes" },
      {
        option_name: "admin_email",
        option_value: "admin@wordpress.local",
        autoload: "yes",
      },
      { option_name: "start_of_week", option_value: "1", autoload: "yes" },
      { option_name: "use_balanceTags", option_value: "0", autoload: "yes" },
      { option_name: "use_smilies", option_value: "1", autoload: "yes" },
      { option_name: "require_name_email", option_value: "1", autoload: "yes" },
      { option_name: "comments_notify", option_value: "1", autoload: "yes" },
      { option_name: "posts_per_rss", option_value: "10", autoload: "yes" },
      { option_name: "rss_use_excerpt", option_value: "0", autoload: "yes" },
      {
        option_name: "mailserver_url",
        option_value: "mail.example.com",
        autoload: "yes",
      },
      {
        option_name: "mailserver_login",
        option_value: "login@example.com",
        autoload: "yes",
      },
      {
        option_name: "mailserver_pass",
        option_value: "password",
        autoload: "yes",
      },
      { option_name: "mailserver_port", option_value: "110", autoload: "yes" },
      { option_name: "default_category", option_value: "1", autoload: "yes" },
      {
        option_name: "default_comment_status",
        option_value: "open",
        autoload: "yes",
      },
      {
        option_name: "default_ping_status",
        option_value: "open",
        autoload: "yes",
      },
      {
        option_name: "default_pingback_flag",
        option_value: "1",
        autoload: "yes",
      },
      { option_name: "posts_per_page", option_value: "10", autoload: "yes" },
      { option_name: "date_format", option_value: "F j, Y", autoload: "yes" },
      { option_name: "time_format", option_value: "g:i a", autoload: "yes" },
      {
        option_name: "links_updated_date_format",
        option_value: "F j, Y g:i a",
        autoload: "yes",
      },
      { option_name: "comment_moderation", option_value: "0", autoload: "yes" },
      { option_name: "moderation_notify", option_value: "1", autoload: "yes" },
      {
        option_name: "permalink_structure",
        option_value: "/%year%/%monthnum%/%day%/%postname%/",
        autoload: "yes",
      },
      { option_name: "rewrite_rules", option_value: "", autoload: "yes" },
      { option_name: "hack_file", option_value: "0", autoload: "yes" },
      { option_name: "blog_charset", option_value: "UTF-8", autoload: "yes" },
      { option_name: "moderation_keys", option_value: "", autoload: "no" },
      { option_name: "active_plugins", option_value: "a:0:{}", autoload: "yes" },
      { option_name: "category_base", option_value: "", autoload: "yes" },
      {
        option_name: "ping_sites",
        option_value: "http://rpc.pingomatic.com/",
        autoload: "yes",
      },
      { option_name: "comment_max_links", option_value: "2", autoload: "yes" },
      { option_name: "gmt_offset", option_value: "0", autoload: "yes" },
      {
        option_name: "default_email_category",
        option_value: "1",
        autoload: "yes",
      },
      { option_name: "recently_edited", option_value: "", autoload: "no" },
      {
        option_name: "template",
        option_value: "twentytwentyfive",
        autoload: "yes",
      },
      {
        option_name: "stylesheet",
        option_value: "twentytwentyfive",
        autoload: "yes",
      },
      { option_name: "comment_registration", option_value: "0", autoload: "yes" },
      { option_name: "html_type", option_value: "text/html", autoload: "yes" },
      { option_name: "use_trackback", option_value: "0", autoload: "yes" },
      {
        option_name: "default_role",
        option_value: "subscriber",
        autoload: "yes",
      },
      { option_name: "db_version", option_value: "57155", autoload: "yes" },
      {
        option_name: "uploads_use_yearmonth_folders",
        option_value: "1",
        autoload: "yes",
      },
      { option_name: "upload_path", option_value: "", autoload: "yes" },
      { option_name: "blog_public", option_value: "1", autoload: "yes" },
      {
        option_name: "default_link_category",
        option_value: "2",
        autoload: "yes",
      },
      { option_name: "show_on_front", option_value: "posts", autoload: "yes" },
      { option_name: "tag_base", option_value: "", autoload: "yes" },
      { option_name: "show_avatars", option_value: "1", autoload: "yes" },
      { option_name: "avatar_rating", option_value: "G", autoload: "yes" },
      { option_name: "upload_url_path", option_value: "", autoload: "yes" },
      { option_name: "thumbnail_size_w", option_value: "150", autoload: "yes" },
      { option_name: "thumbnail_size_h", option_value: "150", autoload: "yes" },
      { option_name: "thumbnail_crop", option_value: "1", autoload: "yes" },
      { option_name: "medium_size_w", option_value: "300", autoload: "yes" },
      { option_name: "medium_size_h", option_value: "300", autoload: "yes" },
      { option_name: "avatar_default", option_value: "mystery", autoload: "yes" },
      { option_name: "large_size_w", option_value: "1024", autoload: "yes" },
      { option_name: "large_size_h", option_value: "1024", autoload: "yes" },
      {
        option_name: "image_default_link_type",
        option_value: "none",
        autoload: "yes",
      },
      { option_name: "image_default_size", option_value: "", autoload: "yes" },
      { option_name: "image_default_align", option_value: "", autoload: "yes" },
      {
        option_name: "close_comments_for_old_posts",
        option_value: "0",
        autoload: "yes",
      },
      {
        option_name: "close_comments_days_old",
        option_value: "14",
        autoload: "yes",
      },
      { option_name: "thread_comments", option_value: "1", autoload: "yes" },
      {
        option_name: "thread_comments_depth",
        option_value: "5",
        autoload: "yes",
      },
      { option_name: "page_comments", option_value: "0", autoload: "yes" },
      { option_name: "comments_per_page", option_value: "50", autoload: "yes" },
      {
        option_name: "default_comments_page",
        option_value: "newest",
        autoload: "yes",
      },
      { option_name: "comment_order", option_value: "asc", autoload: "yes" },
      { option_name: "sticky_posts", option_value: "a:0:{}", autoload: "yes" },
      {
        option_name: "widget_categories",
        option_value: "a:0:{}",
        autoload: "yes",
      },
      { option_name: "widget_text", option_value: "a:0:{}", autoload: "yes" },
      { option_name: "widget_rss", option_value: "a:0:{}", autoload: "yes" },
      {
        option_name: "uninstall_plugins",
        option_value: "a:0:{}",
        autoload: "no",
      },
      { option_name: "timezone_string", option_value: "", autoload: "yes" },
      { option_name: "page_for_posts", option_value: "0", autoload: "yes" },
      { option_name: "page_on_front", option_value: "0", autoload: "yes" },
      { option_name: "default_post_format", option_value: "0", autoload: "yes" },
      { option_name: "link_manager_enabled", option_value: "0", autoload: "yes" },
      {
        option_name: "finished_splitting_shared_terms",
        option_value: "1",
        autoload: "yes",
      },
      { option_name: "site_icon", option_value: "0", autoload: "yes" },
      {
        option_name: "medium_large_size_w",
        option_value: "768",
        autoload: "yes",
      },
      { option_name: "medium_large_size_h", option_value: "0", autoload: "yes" },
      {
        option_name: "wp_page_for_privacy_policy",
        option_value: "3",
        autoload: "yes",
      },
      {
        option_name: "show_comments_cookies_opt_in",
        option_value: "1",
        autoload: "yes",
      },
      {
        option_name: "admin_email_lifespan",
        option_value: "1735689600",
        autoload: "yes",
      },
      { option_name: "disallowed_keys", option_value: "", autoload: "no" },
      {
        option_name: "comment_previously_approved",
        option_value: "1",
        autoload: "yes",
      },
      {
        option_name: "auto_plugin_theme_update_emails",
        option_value: "a:0:{}",
        autoload: "no",
      },
      {
        option_name: "auto_update_core_dev",
        option_value: "enabled",
        autoload: "yes",
      },
      {
        option_name: "auto_update_core_minor",
        option_value: "enabled",
        autoload: "yes",
      },
      {
        option_name: "auto_update_core_major",
        option_value: "enabled",
        autoload: "yes",
      },
    ],
    skipDuplicates: true,
  });

  // Create default categories
  const uncategorizedTerm = await prisma.term.upsert({
    where: { term_id: 1 },
    update: {},
    create: {
      term_id: 1,
      name: "Uncategorized",
      slug: "uncategorized",
      term_group: 0,
    },
  });

  await prisma.termTaxonomy.upsert({
    where: { term_taxonomy_id: 1 },
    update: {},
    create: {
      term_taxonomy_id: 1,
      term_id: uncategorizedTerm.term_id,
      taxonomy: "category",
      description: "",
      parent: 0,
      count: 1,
    },
  });

  // Create sample post
  const samplePost = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      post_author: adminUser.id,
      post_title: "Hello World!",
      post_content:
        "Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
      post_excerpt: "",
      post_status: "publish",
      comment_status: "open",
      ping_status: "open",
      post_password: "",
      post_name: "hello-world",
      to_ping: "",
      pinged: "",
      post_content_filtered: "",
      post_parent: 0,
      guid: "http://localhost:3000/?p=1",
      menu_order: 0,
      post_type: "post",
      post_mime_type: "",
      comment_count: 1,
    },
  });

  // Link post to category
  await prisma.termRelationship.upsert({
    where: {
      object_id_term_taxonomy_id: {
        object_id: samplePost.id,
        term_taxonomy_id: 1,
      },
    },
    update: {},
    create: {
      object_id: samplePost.id,
      term_taxonomy_id: 1,
      term_order: 0,
    },
  });

  // Create sample comment
  await prisma.comment.upsert({
    where: { comment_id: 1 },
    update: {},
    create: {
      comment_id: 1,
      comment_post_id: samplePost.id,
      comment_author: "A WordPress Commenter",
      comment_author_email: "author@wordpress.example",
      comment_author_url: "https://wordpress.org/",
      comment_author_ip: "127.0.0.1",
      comment_content:
        'Hi, this is a comment.\nTo get started with moderating, editing, and deleting comments, please visit the Comments screen in the dashboard.\nCommenter avatars come from <a href="https://gravatar.com">Gravatar</a>.',
      comment_karma: 0,
      comment_approved: "1",
      comment_agent: "",
      comment_type: "comment",
      comment_parent: 0,
      user_id: 0,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`👤 Admin user created: ${adminUser.user_login}`);
  console.log(`📝 Sample post created: ${samplePost.post_title}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
