-- Full-text search indexes for forum content.
-- Applied manually via `docker compose exec -T postgres psql -U pepatlas -d pepatlas -f -`.

CREATE INDEX IF NOT EXISTS thread_fts_idx
  ON "Thread"
  USING GIN (
    to_tsvector(
      'english',
      COALESCE("title", '') || ' ' || COALESCE("body", '')
    )
  );

CREATE INDEX IF NOT EXISTS reply_fts_idx
  ON "Reply"
  USING GIN (
    to_tsvector('english', COALESCE("body", ''))
  );
