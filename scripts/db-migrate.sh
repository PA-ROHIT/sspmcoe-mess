#!/bin/bash
set -e

echo "Running database migrations..."
npx prisma migrate deploy
echo "Seeding database..."
npx prisma db seed
