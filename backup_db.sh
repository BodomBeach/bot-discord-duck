#!/bin/bash

# this script makes a rolling backup of the sqlite database, keeping the last 5 versions.

PROJECT_DIR="$(dirname "$(realpath "$0")")"  # Get the directory where the script is located
SOURCE_DB="$PROJECT_DIR/db/db.sqlite"  # Path to the SQLite database
BACKUP_DIR="$PROJECT_DIR/backups"  # Backup directory inside the project folder
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")  # Timestamp for backup filename
BACKUP_FILE="$BACKUP_DIR/db_$TIMESTAMP.sqlite"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"
cp "$SOURCE_DB" "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

cd "$BACKUP_DIR" || exit 1
BACKUP_COUNT=$(ls -t | wc -l)

if [ "$BACKUP_COUNT" -gt 5 ]; then
  # Remove older backups, keeping the 5 newest
  ls -t | tail -n +6 | xargs rm -f
  echo "Old backups removed, keeping the last 5 backups."
fi