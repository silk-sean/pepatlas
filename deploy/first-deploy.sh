#!/bin/bash
# Full first deployment: builds + starts services, issues Let's Encrypt cert,
# then swaps to SSL-enabled nginx.
#
# Prerequisite: DNS for pepatlas.com + www.pepatlas.com must already point
# at this droplet (check with: dig +short pepatlas.com)
set -euo pipefail

cd /opt/pepatlas

echo "=== 1/5: Building + starting app + postgres ==="
# Start with HTTP-only nginx so certbot can complete the challenge
cp deploy/nginx-http.conf deploy/nginx-active.conf
# Temporarily point docker-compose.yml nginx at the HTTP config
sed -i.bak 's|./deploy/nginx.conf|./deploy/nginx-active.conf|' docker-compose.yml

docker compose up -d --build app postgres

echo "=== 2/5: Waiting for postgres ==="
until docker compose exec -T postgres pg_isready -U pepatlas >/dev/null 2>&1; do
  sleep 1
done

echo "=== 3/5: Pushing Prisma schema + seeding categories ==="
# Run prisma db push from the app container — pass --url explicitly since
# prisma.config.ts may not pick up env vars from npx's inner shell
docker compose exec -T app sh -c 'npx prisma db push --url "$DATABASE_URL"'
# Seed categories via raw SQL (tsx isn't in the production image)
docker compose exec -T postgres psql -U pepatlas -d pepatlas <<'SQL'
INSERT INTO "ForumCategory" (id, slug, name, description, "sortOrder") VALUES
  ('cat-beginner', 'beginner-questions', 'Beginner Questions', 'New to peptides? Start here.', 0),
  ('cat-protocols', 'protocol-discussions', 'Protocol Discussions', 'Share and discuss protocols.', 1),
  ('cat-logs', 'personal-logs', 'Personal Logs & Journals', 'Track your journey.', 2),
  ('cat-bloodwork', 'bloodwork-metrics', 'Bloodwork & Metrics', 'Lab results and biomarkers.', 3),
  ('cat-optimization', 'optimization', 'Optimization Strategies', 'Advanced wellness strategies.', 4),
  ('cat-general', 'general', 'General Discussion', 'Off-topic and community chat.', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "sortOrder" = EXCLUDED."sortOrder";
SQL

echo "=== 4/5: Starting HTTP-only nginx and issuing SSL cert ==="
docker compose up -d nginx
sleep 3

docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  --email silk.sean@gmail.com \
  --agree-tos --no-eff-email \
  -d pepatlas.com -d www.pepatlas.com

echo "=== 5/5: Swapping to SSL-enabled nginx ==="
mv docker-compose.yml.bak docker-compose.yml
docker compose up -d nginx
docker compose up -d certbot

# Daily pg_dump at 3am local
cat > /etc/cron.d/pepatlas-backup <<'EOF'
0 3 * * * root cd /opt/pepatlas && docker compose exec -T postgres pg_dump -U pepatlas pepatlas | gzip > /opt/pepatlas/backups/pepatlas-$(date +\%F).sql.gz && find /opt/pepatlas/backups -name "pepatlas-*.sql.gz" -mtime +14 -delete
EOF
chmod 644 /etc/cron.d/pepatlas-backup

echo ""
echo "=== Deploy complete ==="
echo "Site: https://pepatlas.com"
echo "Backups: /opt/pepatlas/backups (daily @ 3am, 14-day retention)"
