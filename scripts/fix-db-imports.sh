#!/bin/bash

# Update all database imports to use the consolidated path
find . -type f -name "*.ts" -exec sed -i 's|@/lib/database|@/lib/db/mongodb|g' {} +
find . -type f -name "*.ts" -exec sed -i 's|@/lib/mongodb|@/lib/db/mongodb|g' {} +
