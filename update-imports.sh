#!/bin/bash

# Core UI components
find . -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
  # Update core component imports
  sed -i 's|@/components/ui/button|@/components/shared/ui/core/button|g' "$file"
  sed -i 's|@/components/ui/input|@/components/shared/ui/core/input|g' "$file"
  sed -i 's|@/components/ui/textarea|@/components/shared/ui/core/textarea|g' "$file"
  sed -i 's|@/components/ui/select|@/components/shared/ui/core/select|g' "$file"
  sed -i 's|@/components/ui/form|@/components/shared/ui/core/form|g' "$file"
  sed -i 's|@/components/ui/label|@/components/shared/ui/core/label|g' "$file"

  # Update feedback component imports
  sed -i 's|@/components/ui/alert|@/components/shared/ui/feedback/alert|g' "$file"
  sed -i 's|@/components/ui/toast|@/components/shared/ui/feedback/toast|g' "$file"
  sed -i 's|@/components/ui/loading|@/components/shared/ui/feedback/loading|g' "$file"
  sed -i 's|@/components/ui/progress|@/components/shared/ui/feedback/progress|g' "$file"
  sed -i 's|@/components/ui/skeleton|@/components/shared/ui/feedback/skeleton|g' "$file"
  sed -i 's|@/components/ui/use-toast|@/components/shared/ui/feedback/use-toast|g' "$file"

  # Update navigation component imports
  sed -i 's|@/components/ui/FloatingNavbar|@/components/shared/ui/navigation/FloatingNavbar|g' "$file"
  sed -i 's|@/components/ui/NavItems|@/components/shared/ui/navigation/NavItems|g' "$file"
  sed -i 's|@/components/ui/tabs|@/components/shared/ui/navigation/tabs|g' "$file"
  sed -i 's|@/components/ui/dropdown-menu|@/components/shared/ui/navigation/dropdown-menu|g' "$file"

  # Update data display component imports
  sed -i 's|@/components/ui/card|@/components/shared/ui/data-display/card|g' "$file"
  sed -i 's|@/components/ui/table|@/components/shared/ui/data-display/table|g' "$file"
  sed -i 's|@/components/ui/badge|@/components/shared/ui/data-display/badge|g' "$file"
  sed -i 's|@/components/ui/avatar|@/components/shared/ui/data-display/avatar|g' "$file"
  sed -i 's|@/components/ui/verified-badge|@/components/shared/ui/data-display/verified-badge|g' "$file"
  sed -i 's|@/components/ui/empty-state|@/components/shared/ui/data-display/empty-state|g' "$file"
done
