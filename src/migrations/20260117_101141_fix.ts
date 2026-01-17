import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. 创建 enum（忽略如果已存在）
  try {
    await db.execute(sql`CREATE TYPE "enum_posts_original_language" AS ENUM('en', 'zh')`)
  } catch (e) {
    console.log('enum already exists, skipping')
  }
  
  // 2. 创建新表
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts_summary_zh_keywords" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar NOT NULL
    )
  `)
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "posts_summary_en_keywords" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "keyword" varchar NOT NULL
    )
  `)
  
  // 3. 添加新字段
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "title_en" varchar`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source_url" varchar`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source_name" varchar`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source_author" varchar`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "original_language" "enum_posts_original_language" DEFAULT 'en'`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "summary_zh_content" varchar`)
  await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "summary_en_content" varchar`)
  
  // 4. 更新现有数据
  await db.execute(sql`UPDATE "posts" SET "title_en" = "title" WHERE "title_en" IS NULL`)
  await db.execute(sql`UPDATE "posts" SET "source_url" = 'https://example.com' WHERE "source_url" IS NULL`)
  await db.execute(sql`UPDATE "posts" SET "source_name" = 'Unknown' WHERE "source_name" IS NULL`)
  await db.execute(sql`UPDATE "posts" SET "summary_zh_content" = '待补充' WHERE "summary_zh_content" IS NULL`)
  await db.execute(sql`UPDATE "posts" SET "summary_en_content" = 'To be added' WHERE "summary_en_content" IS NULL`)
  
  // 5. 设置 NOT NULL
  await db.execute(sql`ALTER TABLE "posts" ALTER COLUMN "title_en" SET NOT NULL`)
  await db.execute(sql`ALTER TABLE "posts" ALTER COLUMN "source_url" SET NOT NULL`)
  await db.execute(sql`ALTER TABLE "posts" ALTER COLUMN "source_name" SET NOT NULL`)
  await db.execute(sql`ALTER TABLE "posts" ALTER COLUMN "summary_zh_content" SET NOT NULL`)
  await db.execute(sql`ALTER TABLE "posts" ALTER COLUMN "summary_en_content" SET NOT NULL`)
  
  // 6. 添加外键
  try {
    await db.execute(sql`
      ALTER TABLE "posts_summary_zh_keywords" 
      ADD CONSTRAINT "posts_summary_zh_keywords_parent_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON DELETE CASCADE
    `)
  } catch (e) {
    console.log('FK already exists')
  }
  
  try {
    await db.execute(sql`
      ALTER TABLE "posts_summary_en_keywords" 
      ADD CONSTRAINT "posts_summary_en_keywords_parent_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "posts"("id") ON DELETE CASCADE
    `)
  } catch (e) {
    console.log('FK already exists')
  }
  
  // 7. 创建索引
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_summary_zh_keywords_order_idx" ON "posts_summary_zh_keywords"("_order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_summary_zh_keywords_parent_id_idx" ON "posts_summary_zh_keywords"("_parent_id")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_summary_en_keywords_order_idx" ON "posts_summary_en_keywords"("_order")`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "posts_summary_en_keywords_parent_id_idx" ON "posts_summary_en_keywords"("_parent_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "posts_summary_zh_keywords" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "posts_summary_en_keywords" CASCADE`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "title_en"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "source_url"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "source_name"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "source_author"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "original_language"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "summary_zh_content"`)
  await db.execute(sql`ALTER TABLE "posts" DROP COLUMN IF EXISTS "summary_en_content"`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_posts_original_language"`)
}
