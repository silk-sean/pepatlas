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
-- Top-level categories
INSERT INTO "ForumCategory" (id, slug, name, description, "sortOrder", "parentId") VALUES
  ('cat-beginner', 'beginner-questions', 'Beginner Questions', 'New to peptides? Start here.', 0, NULL),
  ('cat-protocols', 'protocol-discussions', 'Protocol Discussions', 'Share and discuss protocols.', 1, NULL),
  ('cat-compounds', 'compound-discussions', 'Compound Discussions', 'Peptide-specific threads.', 2, NULL),
  ('cat-logs', 'personal-logs', 'Personal Logs & Journals', 'Track your journey.', 3, NULL),
  ('cat-bloodwork', 'bloodwork-metrics', 'Bloodwork & Metrics', 'Lab results and biomarkers.', 4, NULL),
  ('cat-optimization', 'optimization', 'Optimization Strategies', 'Advanced wellness strategies.', 5, NULL),
  ('cat-general', 'general', 'General Discussion', 'Off-topic and community chat.', 6, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "sortOrder" = EXCLUDED."sortOrder";

-- Sub-forums under "Compound Discussions"
INSERT INTO "ForumCategory" (id, slug, name, description, "sortOrder", "parentId") VALUES
  ('sub-bpc157', 'bpc-157', 'BPC-157', 'Body Protection Compound — healing, gut, recovery.', 0, 'cat-compounds'),
  ('sub-tb500', 'tb-500', 'TB-500', 'Thymosin Beta-4 — tissue repair, recovery.', 1, 'cat-compounds'),
  ('sub-ghkcu', 'ghk-cu', 'GHK-Cu', 'Copper peptide — skin, hair, wound healing.', 2, 'cat-compounds'),
  ('sub-semaglutide', 'semaglutide', 'Semaglutide', 'GLP-1 — metabolic, weight.', 3, 'cat-compounds'),
  ('sub-tirzepatide', 'tirzepatide', 'Tirzepatide', 'GLP-1/GIP — metabolic, weight.', 4, 'cat-compounds'),
  ('sub-retatrutide', 'retatrutide', 'Retatrutide', 'Triple agonist — next-gen metabolic.', 5, 'cat-compounds'),
  ('sub-ghs', 'gh-secretagogues', 'GH Secretagogues', 'CJC-1295, Ipamorelin, Sermorelin, Tesamorelin, MK-677.', 6, 'cat-compounds'),
  ('sub-nootropics', 'nootropics', 'Nootropic Peptides', 'Semax, Selank, Dihexa, Cerebrolysin.', 7, 'cat-compounds'),
  ('sub-longevity', 'longevity-peptides', 'Longevity & Khavinson', 'Epithalon, Pinealon, FOXO4-DRI, Rapamycin.', 8, 'cat-compounds'),
  ('sub-other', 'other-compounds', 'Other Compounds', 'Everything else — PT-141, DSIP, MOTS-c, etc.', 9, 'cat-compounds')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "sortOrder" = EXCLUDED."sortOrder",
  "parentId" = EXCLUDED."parentId";
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
